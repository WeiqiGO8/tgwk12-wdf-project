function rawUsersRoute(app, db) {
	app.get("/rawusers", (req, res) => {
		db.all("SELECT * FROM users", (error, users) => {
			if (error) {
				console.log(error);
			} else {
				res.send(users);
			}
		});
	});
}

module.exports = { rawUsersRoute };
