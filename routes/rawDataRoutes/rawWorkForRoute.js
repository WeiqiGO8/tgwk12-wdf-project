function rawWorkForRoute(app, db) {
	app.get("/rawworkfor", (req, res) => {
		db.all(`SELECT * FROM workfor`, (error, worksFor) => {
			if (error) {
				console.log(error);
			} else {
				res.send(worksFor);
			}
		});
	});
}

module.exports = { rawWorkForRoute };
