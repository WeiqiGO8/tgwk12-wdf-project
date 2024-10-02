// register route
function registerRoute(app) {
	app.get("/register", (req, res) => {
		res.render("register");
	});
}

module.exports = { registerRoute };
