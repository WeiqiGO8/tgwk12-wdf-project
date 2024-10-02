function defaultRoute(app, model) {
	app.get("/", (req, res) => {
		console.log(req.session);
		console.log("---> home model: " + JSON.stringify(model));
		res.render("home", model);
	});
}
module.exports = { defaultRoute };
