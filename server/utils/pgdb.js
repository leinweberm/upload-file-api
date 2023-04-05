const { Pool } = require('pg');

const pgPool = new Pool({
	user: 'pgadmin',
	password: 'extremelySecretDatabasePassword',
	database: 'pgadmin',
	host: '0.0.0.0',
	port: 5432,
});

const pgQuery = (query, values) => {
	const valRegex = /\$\w+/;
	let queryString = query.replace(/\s+/g, ' ');
	let index = 0;
	let regexMatch = queryString.match(valRegex);

	while (regexMatch && values?.[index]) {
		const findText = `${regexMatch[0]}`;
		queryString = queryString.replace(findText, JSON.stringify(values[index]))
		regexMatch = queryString.match(valRegex);
		index++;
	}

	return queryString;
};

module.exports = { pgPool, pgQuery };