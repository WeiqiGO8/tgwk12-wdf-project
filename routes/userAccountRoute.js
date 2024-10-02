function userAccountRoute(app) {
	app.get("/userAccount", (req, res) => {
		res.render("userAccount");
	});
}

module.exports = { userAccountRoute };
