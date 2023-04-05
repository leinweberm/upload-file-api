const express = require('express');
const helmet = require('helmet');

const { pgPool } = require('./utils/pgdb');
const { getFileSizeHash} = require('./utils/upload');
const file = require('./models/file');

const app = express();

try {
	pgPool.connect((err) => {
		if (err) {
		console.error('Error connecting to Postgres database', err.stack);
		} else {
		console.log('Connected to Postgres database');
		}
	});
} catch (error) {
	console.error(error);
}

app.use(helmet());
app.use(express.json());

app.post('/upload', async (req, res) => {
	try {
		const { fileSize, fileName, sha1 } = await getFileSizeHash(req);
		await file.saveFile(fileName, fileSize, sha1);
		return res.status(201).json({ status: 'ok', message: 'file processed', fileSize, fileName, sha1 });

	} catch (error) {
		return res.status(400).json({ status: 'error', message: error.message });
	}
});

app.get('/get-files', async (_, res) => {
	try {
		const result = await file.getFiles();
		return res.status(200).json({ status: 'ok', data: result});
	} catch (error) {
		return res.status(400).json({ status: 'error', message: error.message });
	}
});

app.listen(3000, () => {
	console.log('Server started on port 3000');
});

module.exports = { pgPool };