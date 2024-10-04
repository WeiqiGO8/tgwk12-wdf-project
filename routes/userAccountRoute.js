const { rawusersRoute } = require("./rawDataRoutes/rawUsersRoute.js");

function userAccountRoute(app, db) {
	// app.get("/user-account", (req, res) => {
	// 	res.render("user-account");
	// });

	app.get("/userAccount", (req, res) => {
		if (req.session.user) {
			db.all("SELECT * FROM users", (error, rawusers) => {
				if (error) {
					console.log(error);
				} else {
					console.log(rawusers);
					const modelUsers = { usersTable: rawusers };
					res.render("user-account", modelUsers);
				}
			});
		} else {
			res.redirect("/login");
		}
	});
}

module.exports = { userAccountRoute };
