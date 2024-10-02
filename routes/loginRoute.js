function loginRoute(app) {
	app.get("/login", (req, res) => {
		res.render("login");
	});
}

module.exports = { loginRoute };
