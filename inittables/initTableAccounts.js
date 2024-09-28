// initiate tables
function initTableAccounts(db) {
	db.serialize(() => {
		db.run(
			`CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)`
		);
	});
}

module.exports = { initTableAccounts };
