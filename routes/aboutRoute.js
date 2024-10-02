function aboutRoute(app) {
	app.get("/about", (req, res) => {
		res.render("about");
	});
}

module.exports = { aboutRoute };
