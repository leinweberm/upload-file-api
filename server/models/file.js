const { pgPool, pgQuery } = require('../utils/pgdb');

const file = {
	saveFile: async function(name, size, sha1) {
		try {
			if (!name || !size || !sha1) {
				throw new Error(`Missing parameters :: ${__filename}`);
			}
	
			const query = `
				INSERT INTO uploads.files(file_name, file_size, sha1)
				VALUES($1, $2, $3)
				RETURNING *
			`;
			const queryParams = [name, size, sha1];
			console.debug('[file] saveFile query:', pgQuery(query, queryParams));
			const result = await pgPool.query(query, queryParams);
	
			if (!result || !result.rows) {
				throw new Error(`Saving file info failed :: ${__filename}`);
			}
			return result && result.rows;

		} catch (error) {
			console.error(error);
			const errorMessage = error.message.split('::');
			throw new Error(errorMessage[0]);
		}
	},

	getFiles: async function() {
		try {
			const query = `
				SELECT *
				FROM uploads.files
			`;
			console.debug('[file] getFiles query:', pgQuery(query));
			const result = await pgPool.query(query);

			if (!result || !result.rows) {
				throw new Error(`Getting files failed :: ${__filename}`);
			}
			return result && result.rows;

		} catch (error) {
			console.error(error);
			const errorMessage = error.message.split('::');
			throw new Error(errorMessage[0]);
		}
	},
};

module.exports = file;