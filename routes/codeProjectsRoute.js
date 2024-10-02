const {
	rawCodeProjectsRoute,
} = require("./rawDataRoutes/rawCodeProjectsRoute.js");

function codeProjectsRoute(app, db) {
	app.get("/codeprojects", (req, res) => {
		db.all(`SELECT * FROM codeProjects`, (error, rawcode) => {
			console.log({ error, rawcode });
			if (error) {
				console.log(error);
			} else {
				const modelCodeProjects = { codeProjects: rawcode };
				res.render("code-projects", modelCodeProjects);
			}
		});
	});
}

module.exports = { codeProjectsRoute };
