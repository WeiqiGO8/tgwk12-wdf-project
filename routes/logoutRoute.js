function logoutRoute(app) {
	app.get("/logout", (req, res) => {
		res.render("logout");
	});
}

module.exports = { logoutRoute };
