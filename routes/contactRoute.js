function contactRoute(app) {
	app.get("/contact", (req, res) => {
		res.render("contact");
	});
}

module.exports = { contactRoute };
