// /projects __artworks route
function projectsRoute(app) {
	app.get("/projects", (req, res) => {
		res.render("projects");
	});
}

module.exports = { projectsRoute };
