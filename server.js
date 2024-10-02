// load the packages
const express = require("express");
const sqlite3 = require("sqlite3");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");
const session = require("express-session");

// import init tables
const { initTableAccounts } = require("./inittables/initTableAccounts.js");
const { initTableArtworks } = require("./inittables/initTableArtworks.js");
const {
	initTableCodeProjects,
} = require("./inittables/initTablecodeProjects.js");
const { initTableWorkFor } = require("./inittables/initTableWorkFor.js");

// import routes
//header nav
const { defaultRoute } = require("./routes/defaultRoute.js");
const { projectsRoute } = require("./routes/projectsRoute.js");
// artworks
const { artworksRoute } = require("./routes/artworksRoute.js");
const {
	artworkDetailPageRoute,
} = require("./routes/artworkDetailPageRoute.js");

// code projects
const { codeProjectsRoute } = require("./routes/codeProjectsRoute.js");

const { aboutRoute } = require("./routes/aboutRoute.js");
const { contactRoute } = require("./routes/contactRoute.js");

// secret page
const { userAccountRoute } = require("./routes/userAccountRoute.js");

// account
const { loginRoute } = require("./routes/loginRoute.js");
const { logoutRoute } = require("./routes/logoutRoute.js");
const { registerRoute } = require("./routes/registerRoute.js");
const codeProjects = require("./data/code-projects.js");
const {
	codeProjectDetailPageRoute,
} = require("./routes/codeProjectDetailPageRoute.js");
const { workForRoute } = require("./routes/workForRoute.js");
const { usersTableRoute } = require("./routes/usersTableRoute.js");

// Define ADMIN_USERNAME && ADMIN_PASSWORD
const ADMIN_USERNAME = `Admin`;
const ADMIN_PASSWORD = `1234`;
// const ADMIN_PASSWORD = ``;

//define the ports
const port = 8080; //default port

//create a web application
const app = express();

// DATABASE
// create database file
const dbFile = "my-project-data.sqlite3.db";
const db = new sqlite3.Database(dbFile);

app.use(express.urlencoded({ extended: false }));

//define the public directory as "static"
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs.engine());

app.set("view engine", "handlebars"); //set handlebars as the view engine
app.set("views", "./views"); // define the views directory to be ./views

// setup the session middleware
app.use(
	session({
		//setup the session middleware
		secret: "sessionsecret", // secret key for signing the session ID
		resave: false, // save the session on every request
		saveUninitialized: false, //save the session even if it's empty
		// cookie: {
		// 	sameSite: "strict",
		// 	httpOnly: true,
		// 	secure: true,
		// },
	})
);

// Middlewares --------------------------------------------------
// Session middleware for user/account
app.use((req, res, next) => {
	// log the request method (GET or POST) and URL(/ or /login))
	console.log(req.method, req.url);
	next();
});

app.use((req, res, next) => {
	console.log("session passed to response locals...");
	res.locals.session = req.session;
	next();
});

app.use((req, res, next) => {
	// Checks if the user is logged in
	if (req.session.user) {
		console.log(req.session.user);
		//pass the user data to the template
		res.locals.user = { username: req.session.user.username };
	}
	next(); // continue to the next middleware or route
});

// define /route --------------------------------
//header nav routes:
defaultRoute(app); //home
projectsRoute(app);
aboutRoute(app);
contactRoute(app);

// account
loginRoute(app);
registerRoute(app);

// logout route
logoutRoute(app);

userAccountRoute(app);

// artworks
artworksRoute(app, db);
artworkDetailPageRoute(app, db);

// codeProjects
codeProjectsRoute(app, db);
codeProjectDetailPageRoute(app, db);

// workfor
workForRoute(app, db);

// users
usersTableRoute(app, db);

// Account handling
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

// logout and destroy session
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

app.listen(port, () => {
	initTableAccounts(db);
	initTableWorkFor(db);
	initTableArtworks(db);
	initTableCodeProjects(db);

	console.log("listening to port " + `${port}` + "...");
});
