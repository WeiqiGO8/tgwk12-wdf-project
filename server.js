// LOAD PACKAGES ----------------------------------------
const express = require("express");
const sqlite3 = require("sqlite3");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");
const session = require("express-session");

// IMPORT INITIAL TABLES ---------------------------------
const { initTableAccounts } = require("./inittables/initTableAccounts.js");
const { initTableArtworks } = require("./inittables/initTableArtworks.js");
const {
	initTableCodeProjects,
} = require("./inittables/initTablecodeProjects.js");
const { initTableWorkFor } = require("./inittables/initTableWorkFor.js");

// IMPORT ROUTES ------------------------------------------
//header nav
const { defaultRoute } = require("./routes/defaultRoute.js");
const { projectsRoute } = require("./routes/projectsRoute.js");
const { aboutRoute } = require("./routes/aboutRoute.js");
const { contactRoute } = require("./routes/contactRoute.js");

// artworks
const { artworksRoute } = require("./routes/artworksRoute.js");
const {
	artworkDetailPageRoute,
} = require("./routes/artworkDetailPageRoute.js");

// code projects
const { codeProjectsRoute } = require("./routes/codeProjectsRoute.js");
const {
	codeProjectDetailPageRoute,
} = require("./routes/codeProjectDetailPageRoute.js");

// secret page / singed in users visible routes
const { userAccountRoute } = require("./routes/userAccountRoute.js");
const { usersTableRoute } = require("./routes/usersTableRoute.js");

// account
const { loginRoute } = require("./routes/loginRoute.js");
const { logoutRoute } = require("./routes/logoutRoute.js");
const { registerRoute } = require("./routes/registerRoute.js");
const {
	registerAccount,
} = require("./routes/accountHandling/registerAccount.js");
const { workForRoute } = require("./routes/workForRoute.js");
const { loginAccount } = require("./routes/accountHandling/loginAccount.js");
const { logoutAccount } = require("./routes/accountHandling/logoutAccount.js");
// DEFINE ADMIN_USERNAME && ADMIN_PASSWORD ----------------------
const ADMIN_USERNAME = `Admin`;
const ADMIN_PASSWORD = `1234`;
// const ADMIN_PASSWORD = ``;

// DEFINE PORTS
const port = 8080; //default port

// CREATE A WEB APPLICATION ----------------------------------
const app = express();

// DATABASE ---------------------------------------------------
// create database file
const dbFile = "my-project-data.sqlite3.db";
const db = new sqlite3.Database(dbFile);

app.use(express.urlencoded({ extended: false }));

// DEFINE THE PUBLIC DIRECTORY AS "STATIC" --------------------
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars"); //set handlebars as the view engine
app.set("views", "./views"); // define the views directory to be ./views

// MIDDLEWARES --------------------------------------------------
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

// ROUTES --------------------------------
//header nav routes:
defaultRoute(app); //home
projectsRoute(app);
aboutRoute(app);
contactRoute(app);

// artworks
artworksRoute(app, db);
artworkDetailPageRoute(app, db);

// codeProjects
codeProjectsRoute(app, db);
codeProjectDetailPageRoute(app, db);

// workfor
workForRoute(app, db);

// singed in users visible routes
usersTableRoute(app, db);
userAccountRoute(app);

// account
loginRoute(app);
registerRoute(app);
logoutRoute(app);

// ACCOUNT HANDLING -------------------------------------------------------------------
registerAccount(app, db);
loginAccount(app, db);
logoutAccount(app, db);

// APP LISTEN ON PORT... -------------------------------------------------------------
app.listen(port, () => {
	initTableAccounts(db);
	initTableWorkFor(db);
	initTableArtworks(db);
	initTableCodeProjects(db);

	console.log("listening to port " + `${port}` + "...");
});

module.exports = { ADMIN_USERNAME, ADMIN_PASSWORD };
