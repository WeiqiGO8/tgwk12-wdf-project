function defaultRoute(app) {
	app.get("/", (req, res) => {
		console.log(req.session);
		res.render("home");
	});
}
module.exports = { defaultRoute };
