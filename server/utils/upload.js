const crypto = require('crypto');
const busboy = require('busboy');

const getFileSizeHash = async (req) => {
	try {
		const busb = busboy({ headers: req.headers });
		const hash = crypto.createHash('sha1');
		let fileSize = 0;
		let fileName;
		let sha1;
		let fileCount = 0;
		let digested = false;

		return new Promise((resolve, reject) => {
			busb.on('file', (name, file) => {
			fileCount++;
			if (fileCount > 1) {
				req.unpipe(busb);
				console.error(`Error: Can't upload more than 1 file :: ${__filename}`)
				reject(new Error(`Can't upload more than 1 file`));
			} else {
				fileName = name || 'no-name-file';
				file.on('data', (data) => {
					fileSize += data.length;
					hash.update(data);
				})
				.on('close', () => {
					if (!digested) {
					sha1 = hash.digest('hex');
					digested = true;
					}
				});
			}
			});

			busb.on('close', () => {
				resolve({ fileSize, fileName, sha1 });
			});

			busb.on('error', () => {
				req.unpipe(busb);
				console.error(`Error: Processing file failed :: ${__filename}`)
				reject(new Error(`Processing file failed::`));
			});

			req.pipe(busb);
		});

	} catch (error) {
		console.error(`Error: Invalid file input :: ${__filename}`)
		throw new Error(`Error: Invalid file input`);
	}
};

module.exports = { getFileSizeHash };