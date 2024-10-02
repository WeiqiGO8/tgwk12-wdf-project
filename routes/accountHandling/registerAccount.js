const { registerRoute } = require("./../registerRoute");

function registerAccount(app, db, bcrypt) {
	// Register form
	app.post("/register", async (req, res) => {
		const { username, password } = req.body;

		//Add validation here

		const hashedPassword = await bcrypt.hash(password, 14); //hash the password with a salt
		console.log(hashedPassword);

		//store the user in the database
		db.run(
			`INSERT INTO users (username,password) VALUES(?, ?)`,
			[username, hashedPassword],
			(error) => {
				if (error) {
					res.status(500).send(`Server error ${error.message}`);
				} else {
					res.redirect("/login"); //redirect to the login page after registration
				}
			}
		);
	});
}

module.exports = { registerAccount };
