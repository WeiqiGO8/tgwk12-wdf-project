function rawCodeProjectsRoute(app, db) {
	app.get("/rawcodeprojects", (req, res) => {
		db.all(`SELECT * FROM codeProjects`, (error, theCodeProjects) => {
			if (error) {
				console.log(error);
			} else {
				res.send(theCodeProjects);
			}
		});
	});
}

module.exports = { rawCodeProjectsRoute };
