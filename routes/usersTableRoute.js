const { rawusersRoute } = require("./rawDataRoutes/rawUsersRoute.js");

function usersTableRoute(app, db) {
	app.get("/usersTable", (req, res) => {
		if (req.session.user) {
			db.all("SELECT * FROM users", (error, rawusers) => {
				if (error) {
					console.log(error);
				} else {
					console.log(rawusers);
					const modelUsers = { usersTable: rawusers };
					res.render("users-table", modelUsers);
				}
			});
		} else {
			res.redirect("/login");
		}
	});
}

module.exports = { usersTableRoute };
