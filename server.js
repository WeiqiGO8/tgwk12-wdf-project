// load the packages
const express = require("express");
const sqlite3 = require("sqlite3");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const { initTableAccounts } = require("./inittables/initTableAccounts.js");
const { initTableArtworks } = require("./inittables/initTableArtworks.js");
const {
	initTableCodeProjects,
} = require("./inittables/initTablecodeProjects.js");
const { initTableWorkFor } = require("./inittables/initTableWorkFor.js");
const artworks = require("./data/artworks.js");

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
		resave: true, // save the session on every request
		saveUninitialized: true, //save the session even if it's empty
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
	// Checks if the user is logged in
	if (req.session.user) {
		console.log(req.session.user);
		//pass the user data to the template
		res.locals.user = { username: req.session.user.username };
	}
	next(); // continue to the next middleware or route
});

// define /route --------------------------------
// Raw data
app.get("/rawusers", (req, res) => {
	db.all("SELECT * FROM users", (error, users) => {
		if (error) {
			console.log(error);
		} else {
			res.send(users);
		}
	});
});

// /rawworkfor
app.get("/rawworkfor", (req, res) => {
	db.all("SELECT * FROM workfor", (error, worksFor) => {
		if (error) {
			console.log(error);
		} else {
			res.send(worksFor);
		}
	});
});

// /rawartworks
app.get("/rawartworks", (req, res) => {
	db.all("SELECT * FROM artworks", (error, theArtworks) => {
		if (error) {
			console.log(error);
		} else {
			res.send(theArtworks);
		}
	});
});

//  /rawcodeprojects
app.get("/rawcodeprojects", (req, res) => {
	db.all("SELECT * FROM codeProjects", (error, theCodeProjects) => {
		if (error) {
			console.log(error);
		} else {
			res.send(theCodeProjects);
		}
	});
});

// /default route
app.get("/", (req, res) => {
	res.render("home");
});

// /projects __artworks route
app.get("/projects", (req, res) => {
	res.render("projects");
});

// /artworks
app.get("/artworks", (req, res) => {
	db.all("SELECT * FROM artworks", (error, rawartworks) => {
		if (error) {
			console.log(error);
		} else {
			const modelArtworks = { artworks: rawartworks };
			res.render("artworks", modelArtworks);
		}
	});
});

// /projects __artworks detail page route
app.get("/artworks/:aid", (req, res) => {
	const aid = req.params.aid;
	db.get(
		"SELECT * FROM artworks INNER JOIN workfor ON artworks.fid = workfor.fid WHERE aid = ?",
		[aid],
		(error, row) => {
			console.log(row);
			res.render("single-artwork", { artwork: row });
		}
	);
});

//  codeprojects route
app.get("/codeprojects", (req, res) => {
	db.all("SELECT * FROM codeProjects", (error, rawcode) => {
		console.log({ error, rawcode });
		if (error) {
			console.log(error);
		} else {
			const modelCodeProjects = { codeProjects: rawcode };
			res.render("code-projects", modelCodeProjects);
		}
	});
});

app.get("/codeprojects/:cid", (req, res) => {
	const cid = req.params.cid;
	db.get(
		"SELECT * FROM codeProjects INNER JOIN workfor ON codeProjects.fid = workfor.fid WHERE cid = ?",
		[cid],
		(error, row) => {
			console.log(row);
			res.render("single-code-project", { codeProject: row });
		}
	);
});

// /about route
app.get("/about", (req, res) => {
	res.render("about");
});

// /contact route
app.get("/contact", (req, res) => {
	res.render("contact");
});

// register route
app.get("/register", (req, res) => {
	res.render("register");
});

// Login route
app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/logout", (req, res) => {
	res.render("logout");
});

app.get("/usersTable", (req, res) => {
	if (req.session.user) {
		db.all("SELECT * FROM users", (error, rawusers) => {
			if (error) {
				console.log(error);
			} else {
				console.log(rawusers);
				const modelUsers = { usersTable: rawusers };
				res.render("usersTable", modelUsers);
			}
		});
	} else {
		res.redirect("/login");
	}
});

// /list worksfor route
app.get("/listworkfor", (req, res) => {
	db.all("SELECT * FROM workfor", (error, rawworkfor) => {
		if (error) {
			console.log(error);
		} else {
			const modelWorkFor = { workfor: rawworkfor };
			res.render("workfor", modelWorkFor);
		}
	});
});

// Register form
app.post("/register", async (req, res) => {
	const { username, password } = req.body;

	//Add validation here

	const hashedPassword = await bcrypt.hash(password, 14); //hash the password with a salt
	console.log(hashedPassword);

	//store the user in the database
	db.run(
		"INSERT INTO users (username,password) VALUES(?, ?)",
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
		"SELECT * FROM users WHERE username = ?",
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

app.post("/logout", (req, res) => {
	req.session.destroy(); //destroy the session
	res.redirect("/"); // redirect to the home page
});

app.listen(port, () => {
	initTableAccounts(db);
	initTableWorkFor(db);
	initTableArtworks(db);
	initTableCodeProjects(db);

	console.log("server up and running, listening to port " + `${port}` + "...");
});
