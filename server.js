// load the packages
const express = require("express"); // load express
const sqlite3 = require("sqlite3"); // load sqlite3
const { engine } = require("express-handlebars"); // load express handlebars

//Load external .js files
const workfor = require("./data/workfor.js");
const artworks = require("./data/artworks.js");

//define the ports
const port = 8080; //default port

//create a web application
const app = express();

//define the public directory as "static"
app.use(express.static("public"));

// create database file
const dbFile = "my-project-data.sqlite3.db";
db = new sqlite3.Database(dbFile);

// Handlebars
app.engine(
	"handlebars",
	engine({
		helpers: {
			eq(a, b) {
				return a == b;
			},
		},
	})
); //initialize the engine to be handlebars

app.set("view engine", "handlebars"); //set handlebars as the view engine
app.set("views", "./views"); // define the views directory to be ./views

// define the different /route
// Raw data
// /raw - workfor
app.get("/rawworkfor", (req, res) => {
	db.all("SELECT * FROM workfor", (error, worksFor) => {
		if (error) {
			console.log(error);
		} else {
			console.log("sending back the raw list of works for workfor...");
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
			console.log(theArtworks);
			res.send(theArtworks);
		}
	});
});

// /default route
app.get("/", (req, res) => {
	console.log("Sending the default route");
	res.render("home.handlebars");
});

// /projects route
// /list artworks route
app.get("/projects", (req, res) => {
	db.all("SELECT * FROM artworks", (error, rawartworks) => {
		if (error) {
			console.log(error);
		} else {
			const modelArtworks = { artworks: rawartworks };
			console.log(modelArtworks);
			res.render("artworks.handlebars", modelArtworks);
		}
	});
});

// /about route
app.get("/about", (req, res) => {
	console.log("Sending the route cv!");
	res.render("mycv.handlebars");
});

// /contact route
app.get("/contact", (req, res) => {
	console.log("Sending the contact page route");
	res.render("contact.handlebars");
});

// /list worksfor route
app.get("/listworkfor", (req, res) => {
	db.all("SELECT * FROM workfor", (error, rawworkfor) => {
		if (error) {
			console.log(error);
		} else {
			const modelWorkFor = { workfor: rawworkfor };
			res.render("workfor.handlebars", modelWorkFor);
		}
	});
});

// initiate tables
function initTableWorkFor(mydb) {
	//create table workfor at startup
	db.run(
		"CREATE TABLE workfor (fid INTEGER PRIMARY KEY AUTOINCREMENT, ftype TEXT NOT NULL, fname TEXT NOT NULL, fdesc TEXT NOT NULL, ffor TEXT NOT NULL)",
		(error) => {
			if (error) {
				console.log("ERROR: ", error);
			} else {
				console.log("---> table workfor created!");
				//insert workfor
				workfor.forEach((oneFor) => {
					db.run(
						"INSERT INTO workfor (fid, ftype, fname, fdesc, ffor) VALUES (?, ?, ?, ?, ?)",
						[oneFor.fid, oneFor.ftype, oneFor.fname, oneFor.fdesc, oneFor.ffor],
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

function initTableArtworks(mydb) {
	artworks;
	// Create table artworks
	db.run(
		"CREATE TABLE artworks (aid INTEGER PRIMARY KEY AUTOINCREMENT, atype TEXT NOT NULL, aname TEXT NOT NULL, adesc TEXT NOT NULL, ayear INT, aurl TEXT NOT NULL, alturl TEXT NOT NULL, afor TEXT NOT NULL)",
		(error) => {
			if (error) {
				console.log("ERROR: ", error); //error: display error in the terminal
			} else {
				console.log("---> table artworks created!"); //no error, the table has been created
				//insert photographs
				artworks.forEach((oneartwork) => {
					db.run(
						"INSERT INTO artworks (aid, atype, aname, adesc, ayear, aurl, alturl, afor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
						[
							oneartwork.aid,
							oneartwork.atype,
							oneartwork.aname,
							oneartwork.adesc,
							oneartwork.ayear,
							oneartwork.aurl,
							oneartwork.alturl,
							oneartwork.afor,
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
	// initTableWorkFor(db);
	// initTableArtworks(db);
	console.log("server up and running, listening to port " + `${port}` + "...");
});
