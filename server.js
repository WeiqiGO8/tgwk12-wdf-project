// LOAD PACKAGES ----------------------------------------
const express = require("express");
const sqlite3 = require("sqlite3");
// const exphbs = require("express-handlebars");
const { engine } = require("express-handlebars");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const connectSqlite3 = require("connect-sqlite3");

// IMPORT INITIAL TABLES ---------------------------------
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

// code projects
const { codeProjectsRoute } = require("./routes/codeProjectsRoute.js");
const { workForRoute } = require("./routes/workForRoute.js");

// secret page / singed in users visible routes
const { userAccountRoute } = require("./routes/userAccountRoute.js");
const { usersTableRoute } = require("./routes/usersTableRoute.js");

// account routes
const { loginRoute } = require("./routes/loginRoute.js");
const { logoutRoute } = require("./routes/logoutRoute.js");
const { registerRoute } = require("./routes/registerRoute.js");

// DEFINE ADMIN_USERNAME && ADMIN_PASSWORD && ADMIN_ROLE ----------------------
const ADMIN_USERNAME = `Admin`;
const ADMIN_PASSWORD = `1234`;
const ADMIN_ROLE = `ADMIN`;

// DEFINE PORTS
const port = 8080; //default port

// CREATE A WEB APPLICATION ----------------------------------
const app = express();

// DATABASE ---------------------------------------------------
// create database file
const dbFile = "my-project-data.sqlite3.db";
const db = new sqlite3.Database(dbFile);

// DEFINE THE PUBLIC DIRECTORY AS "STATIC" --------------------
app.use(express.static("public"));
const SQLiteStore = connectSqlite3(session);

// Handlebars
// app.engine("handlebars", exphbs.engine());
app.engine(
	"handlebars",
	engine({
		helpers: {
			eq(a, b) {
				return a === b;
			},
		},
	})
);

app.set("view engine", "handlebars"); //set handlebars as the view engine
app.set("views", "./views"); // define the views directory to be ./views

// MIDDLEWARES --------------------------------------------------
// setup the session middleware
app.use(
	session({
		//setup the session middleware
		store: new SQLiteStore({ db: "session-db.db" }),
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES --------------------------------
//header nav routes:
defaultRoute(app); //home
projectsRoute(app);
aboutRoute(app);
contactRoute(app);

artworksRoute(app, db);
codeProjectsRoute(app, db);

// workfor table (not visible in header nav)
workForRoute(app, db);

// secret page/only singed in users can see visible routes
usersTableRoute(app, db);
userAccountRoute(app, db);

loginRoute(app);
registerRoute(app);
logoutRoute(app);

// ACCOUNT HANDLING -------------------------------------------------------------------
// salting the hash password
const saltRounds = 14;

// create user table
// initiate tables
// START -----------------------------------------------------------------------------------------------------
function initTableAccounts(db) {
	db.serialize(() => {
		db.run(
			`CREATE TABLE IF NOT EXISTS users (
			uid INTEGER PRIMARY KEY AUTOINCREMENT, 
			username TEXT NOT NULL UNIQUE, 
			password TEXT NOT NULL,
			role TEXT NOT NULL)`
		);
		db.get(`SELECT COUNT (*) as count FROM users`, async (error, row) => {
			if (error) {
				console.log(`error checking users: ${error.message}`);
				return;
			} else if (row.count === 0) {
				//if no users exist, create a admin user
				ADMIN_USERNAME;
				ADMIN_PASSWORD;
				ADMIN_ROLE;

				const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds); //hash the password with a salt

				db.run(
					`INSERT INTO users (
						username,
						password,
						role) 
					VALUES(?, ?, ?)`,
					[ADMIN_USERNAME, hashedPassword, ADMIN_ROLE],
					(error) => {
						if (error) {
							console.log(`error creating admin user: ${error.message}`);
						} else {
							console.log("admin user created successfully");
						}
					}
				);
			} else {
				console.log("Admin user exists");
			}
		});
	});
}

// Register form
app.post("/register", async (req, res) => {
	const { username, password, role } = req.body;

	//Add validation here

	const hashedPassword = await bcrypt.hash(password, saltRounds); //hash the password with a salt
	console.log(hashedPassword);

	const userRole = role ? role : "user";

	//store the user in the database
	db.run(
		`INSERT INTO users (
		username,
		password,
		role)
		VALUES(?, ?, ?)`,
		[username, hashedPassword, userRole],
		(error) => {
			if (error) {
				const model = {
					error: "Username taken",
					message: "",
				};

				res.status(500).render("register", model);
			} else {
				res.redirect("/login"); //redirect to the login page after registration
			}
		}
	);
});
// END -----------------------------------------------------------------

// LOGIN FORM ----------------------------------------------------------
// START --------------------------------------------------------------
app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	// verification steps
	//find user in the database (admin user || regular user)
	db.get(
		`SELECT * FROM users WHERE username = ?`,
		[username],
		async (error, user) => {
			if (error) {
				const model = { error: `server error: ${error.message}`, message: "" };
				return res.status(500).render("login", model);
			} else if (!user) {
				const model = { error: "user not found", message: "" };
				return res.status(401).render("login", model);
			} else {
				const isMatch = await bcrypt.compare(password, user.password);

				if (isMatch) {
					//if the password matches
					req.session.user = user; //store the user in the session
					req.session.isAdmin = user.role === "ADMIN"; // Check if the user is admin
					req.session.isLoggedIn = true;
					return res.redirect("/"); //Redirect to the default route (home page)
				} else {
					return res.status(401).send("wrong password");
				}
			}
		}
	);
});
// END ---------------------------------------------------------------------------
// Logout
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

// APP LISTEN ON PORT... -------------------------------------------------------------
app.listen(port, () => {
	initTableAccounts(db);
	initTableWorkFor(db);
	initTableArtworks(db);
	initTableCodeProjects(db);

	console.log("listening to port " + `${port}` + "...");
});
