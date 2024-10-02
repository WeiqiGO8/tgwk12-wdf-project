function logoutAccount(app, db, bcrypt) {
	app.post("/logout", (req, res) => {
		req.session.destroy((error) => {
			if (error) {
				console.log("Error while destroying session", error);
				res.status(500).send("Error while destroying session");
			} else {
				console.log("logged out");
				res.redirect("/");
			}
		});
	});
}

module.exports = { logoutAccount };
