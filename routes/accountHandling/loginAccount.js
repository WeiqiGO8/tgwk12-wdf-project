const { ADMIN_USERNAME, ADMIN_PASSWORD } = require("./../../server.js");

async function loginAccount(app, db, bcrypt) {
	//Login form
	app.post("/login", async (req, res) => {
		const { username, password } = req.body;

		//Find the user in the database
		db.get(
			`SELECT * FROM users WHERE username = ?`,
			[username],
			async (error, user) => {
				if (error) {
					res.status(500).send(`Server error ${error.message}`);
				} else if (!user) {
					res.status(401).send("user not found");
				} else {
					const isMatch = await bcrypt.compare(password, user.password);

					if (isMatch) {
						//if the password matches
						req.session.user = user; //store the user in the session
						req.session.isAdmin = user.username === ADMIN_USERNAME;
						res.redirect("/"); //Redirect to the default route (home page)
					} else {
						res.status(401).send("wrong password");
					}
				}
			}
		);
	});
}

module.exports = { loginAccount };
