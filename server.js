// load the packages
const express = require("express");
const sqlite3 = require("sqlite3");
const exphbs = require("express-handlebars");
const bcrypt = require("bcryptjs");
const session = require("express-session");

//Load external .js files
const workfor = require("./data/workfor.js");
const artworks = require("./data/artworks.js");

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

// app.engine(
// 	"handlebars",
// 	engine({
// 		helpers: {
// 			eq(a, b) {
// 				return a == b;
// 			},
// 		},
// 	})
// ); //initialize the engine to be handlebars

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

// Middlewares ----------check for reduncendy or which to use----------------------------
// Session middleware for user/account
app.use((req, res, next) => {
	// Checks if the user is logged in
	if (req.session.user) {
		console.log(req.session.user);
		//pass the user data to the template
		res.locals.user = { username: req.session.user.username };
	}
	next(); // continue to the next middleware or route
});

// define the different /route
// Raw data
// /raw - workfor
app.get("/rawworkfor", (req, res) => {
	db.all("SELECT * FROM workfor", (error, worksFor) => {
		if (error) {
			console.log(error);
		} else {
			res.send(worksFor);
		}
	});
});

// /raw - artworks
app.get("/rawartworks", (req, res) => {
	db.all("SELECT * FROM artworks", (error, theArtworks) => {
		if (error) {
			console.log(error);
		} else {
			res.send(theArtworks);
		}
	});
});

// /default route
app.get("/", (req, res) => {
	res.render("home");
});

// /projects route
// /list artworks route
app.get("/projects", (req, res) => {
	db.all("SELECT * FROM artworks", (error, rawartworks) => {
		if (error) {
			console.log(error);
		} else {
			const modelArtworks = { artworks: rawartworks };
			res.render("artworks", modelArtworks);
		}
	});
});

// /route detail page
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
				const result = await bcrypt.compare(password, user.password);

				if (result) {
					req.session.user = user; //store the user in the session
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

// initiate tables
function initAccountsTable(db) {
	db.serialize(() => {
		db.run(
			"CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL)"
		);
	});
}

function initTableWorkFor(db) {
	//create table workfor at startup
	db.run(
		"CREATE TABLE IF NOT EXISTS workfor (fid INTEGER PRIMARY KEY AUTOINCREMENT, fname TEXT NOT NULL, fdesc TEXT)",
		(error) => {
			if (error) {
				console.log("ERROR: ", error);
			} else {
				console.log("---> table workfor created!");
				//insert workfor
				workfor.forEach((oneFor) => {
					db.run(
						"INSERT INTO workfor (fid, fname, fdesc) VALUES (?, ?, ?)",
						[oneFor.fid, oneFor.fname, oneFor.fdesc],
						(error) => {
							if (error) {
								console.log("ERROR: ", error);
							} else {
								console.log("Line added into the workfor table!");
							}
						}
					);
				});
			}
		}
	);
}

function initTableArtworks(db) {
	artworks;
	// Create table artworks
	db.run(
		"CREATE TABLE IF NOT EXISTS artworks (aid INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, fid INTEGER, atype TEXT NOT NULL, aname TEXT NOT NULL, adesc TEXT NOT NULL, ayear INT, aurl TEXT NOT NULL, alturl TEXT NOT NULL, FOREIGN KEY (uid) REFERENCES users(uid), FOREIGN KEY (fid) REFERENCES workfor(fid))",
		(error) => {
			if (error) {
				console.log("ERROR: ", error); //error: display error in the terminal
			} else {
				console.log("---> table artworks created!"); //no error, the table has been created
				//insert photographs
				artworks.forEach((oneartwork) => {
					db.run(
						"INSERT INTO artworks (aid, uid, fid, atype, aname, adesc, ayear, aurl, alturl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
						[
							oneartwork.aid,
							oneartwork.uid,
							oneartwork.fid,
							oneartwork.atype,
							oneartwork.aname,
							oneartwork.adesc,
							oneartwork.ayear,
							oneartwork.aurl,
							oneartwork.alturl,
						],
						(error) => {
							if (error) {
								console.log("Error: ", error);
							} else {
								console.log("line added into the artworks table!");
							}
						}
					);
				});
			}
		}
	);
}

app.listen(port, () => {
	initAccountsTable(db);
	initTableWorkFor(db);
	initTableArtworks(db);

	console.log("server up and running, listening to port " + `${port}` + "...");
});
