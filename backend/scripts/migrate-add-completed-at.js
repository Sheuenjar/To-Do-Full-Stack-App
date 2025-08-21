const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Choose env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const pool = new Pool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT || 5432),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

async function migrate() {
	try {
		console.log('Running migration: add completed_at column if not exists...');
		await pool.query("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ DEFAULT NULL;");

		console.log('Checking if tasks table has rows...');
		const res = await pool.query('SELECT COUNT(*)::int AS cnt FROM tasks');
		const count = res.rows[0].cnt;

		if (count === 0) {
			console.log('Table empty — inserting example rows...');
			await pool.query("INSERT INTO tasks (title, description, priority) VALUES ('Example 1','Example task 1','high'),('Example 2','Example task 2','low');");
		} else {
			console.log('Table not empty — skipping seed inserts.');
		}

		console.log('Migration completed.');
	} catch (err) {
		console.error('Migration failed:', err);
		process.exitCode = 1;
	} finally {
		await pool.end();
	}
}

migrate();
