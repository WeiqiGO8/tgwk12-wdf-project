const { rawWorkForRoute } = require("./rawDataRoutes/rawWorkForRoute.js");

function workForRoute(app, db) {
	app.get("/listworkfor", (req, res) => {
		db.all(`SELECT * FROM workfor`, (error, rawworkfor) => {
			if (error) {
				console.log(error);
			} else {
				const modelWorkFor = { workfor: rawworkfor };
				res.render("workfor", modelWorkFor);
			}
		});
	});
}

module.exports = { workForRoute };
