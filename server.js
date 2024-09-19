// load the packages
const express = require("express"); // load express
const sqlite3 = require("sqlite3"); // load sqlite3
const { engine } = require("express-handlebars"); // load express handlebars

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
// /default route
app.get("/", (req, res) => {
	console.log("Sending the default route");
	res.render("home.handlebars");
});

// /projects route
app.get("/projects", (req, res) => {
	console.log("Sending the projects route!");
	res.render("projects.handlebars", { projects });
});

// /about route
app.get("/about", (req, res) => {
	console.log("Sending the route cv!");
	res.render("mycv.handlebars");
	// res.sendFile(__dirname + "/views/mycv-02.html");
});

// /contact route
app.get("/contact", (req, res) => {
	console.log("Sending the contact page route");
	res.render("contact.handlebars");
});

// /raw - photographs
app.get("/rawphotographs", (req, res) => {
	db.all("SELECT * FROM photographs", (error, thePhotographs) => {
		if (error) {
			console.log(error);
		} else {
			console.log("sending back the raw list of photographs...");
			res.send(thePhotographs);
		}
	});
});

// /list photographs
app.get("/listphotographs", (req, res) => {
	db.all("SELECT * FROM photographs", (error, rawphotographs) => {
		if (error) {
			console.log(error);
		} else {
			//html
			// console.log()
			// res.send()
		}
	});
});

// /rawworkfor
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

// /list worksfor
app.get("/listworkfor", (req, res) => {
	db.all("SELECT * FROM workfor", (error, rawworkfor) => {
		if (error) {
			console.log(error);
		} else {
			//html
			// console.log()
			// res.send()
		}
	});
});

// TEMPORARY CODE
// route to Raw data - Person table
app.get("/rawpersons", (req, res) => {
	db.all("SELECT * FROM Person", (error, thePersons) => {
		if (error) {
			console.log(error);
		} else {
			console.log("sending back the list of persons...");
			res.send(thePersons);
		}
	});
});

// TEMPORARY CODE
// route to listpersons
app.get("/listpersons", (req, res) => {
	db.all("SELECT * FROM Person", (err, rawPersons) => {
		if (err) {
			console.log("ERROR: " + err);
		} else {
			let listPersonsHTML = "<ul>";
			rawPersons.forEach((onePerson) => {
				listPersonsHTML += "<li>";
				listPersonsHTML += `${onePerson.fname}`;
				listPersonsHTML += `${onePerson.lname}`;
				listPersonsHTML += `${onePerson.age}`;
				listPersonsHTML += `${onePerson.email}`;
				listPersonsHTML += "</li>";
			});
			listPersonsHTML += "</ul>";
			console.log(listPersonsHTML);
			res.send(listPersonsHTML);
		}
	});
});

// JSON data

// workfor
function initTableWorkFor(mydb) {
	const workfor = [
		{
			fid: 1,
			ftype: "Personal project",
			fname: "Personal projects",
			fdesc: "Jönköping University - School of Engineering",
			ffor: "personal",
		},

		{
			fid: 2,
			ftype: "High School project",
			fname: "NTI-Gymnasiet Johanneberg",
			fdesc: "Swedish high school",
			ffor: "High School",
		},

		{
			fid: 3,
			ftype: "Higher Education project",
			fname: "JU - JTH",
			fdesc: "Jönköping University - School of Engineering",
			ffor: "University",
		},
	];

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

function initTablePhotographs(mydb) {
	// photographs
	const photographs = [
		{
			pid: 1,
			ptype: "photograph",
			pname: "A flower",
			pdesc: "a flower image",
			pyear: 2022,
			purl: "/img/flower.jpg",
			pfor: "personal",
		},

		{
			pid: "2",
			ptype: "photograph",
			pname: "forest image",
			pdesc: "a forest image",
			pyear: 2023,
			purl: "/img/forest.jpg",
			pfor: "personal",
		},

		{
			pid: "3",
			ptype: "photograph",
			pname: "holiday img",
			pdesc: "holiday image.",
			pyear: 2021,
			purl: "/img/holiday.jpg",
			pfor: "personal",
		},

		{
			pid: "4",
			ptype: "photograph",
			pname: "rauk",
			pdesc: "rauk",
			pyear: 2020,
			purl: "/img/rauk.jpg",
			pfor: "personal",
		},

		{
			pid: "5",
			ptype: "photograph",
			pname: "rauk",
			pdesc: "-",
			pyear: 2012,
			purl: "/img/rauk-2.jpg",
			pfor: "personal",
		},

		{
			pid: "6",
			ptype: "photograph",
			pname: "sky",
			pdesc: "-",
			pyear: 2013,
			purl: "/img/sky-img.jpg",
			pfor: "personal",
		},

		{
			pid: "7",
			ptype: "photograph",
			pname: "sky",
			pdesc: "-",
			pyear: 2019,
			purl: "/img/sky-2.jpg",
			pfor: "personal",
		},

		{
			pid: "8",
			ptype: "photograph",
			pname: "sky",
			pdesc: "-",
			pyear: 2019,
			purl: "/img/sky-3.jpg",
			pfor: "personal",
		},

		{
			pid: "9",
			ptype: "photograph",
			pname: "sky",
			pdesc: "-",
			pyear: 2019,
			purl: "/img/sky-3.jpg",
			pfor: "personal",
		},

		{
			pid: "10",
			ptype: "photograph",
			pname: "sky",
			pdesc: "-",
			pyear: 2019,
			purl: "/img/sky-4.jpg",
			pfor: "personal",
		},

		{
			pid: "11",
			ptype: "photograph",
			pname: "sky",
			pdesc: "-",
			pyear: 2019,
			purl: "/img/sky-5.jpg",
			pfor: "personal",
		},
	];

	// Create table photographs
	db.run(
		"CREATE TABLE photographs (pid INTEGER PRIMARY KEY AUTOINCREMENT, ptype TEXT NOT NULL, pname TEXT NOT NULL, pdesc TEXT NOT NULL, pyear INT, purl TEXT NOT NULL, pfor TEXT NOT NULL)",
		(error) => {
			if (error) {
				console.log("ERROR: ", error); //error: display error in the terminal
			} else {
				console.log("---> table photographs created!"); //no error, the table has been created
				//insert photographs
				photographs.forEach((onePhoto) => {
					db.run(
						"INSERT INTO photographs (pid, ptype, pname, pdesc, pyear, purl, pfor) VALUES (?, ?, ?, ?, ?, ?, ?)",
						[
							onePhoto.pid,
							onePhoto.ptype,
							onePhoto.pname,
							onePhoto.pdesc,
							onePhoto.pyear,
							onePhoto.purl,
							onePhoto.pfor,
						],
						(error) => {
							if (error) {
								console.log("Error: ", error);
							} else {
								console.log("line added into the skills tabel!");
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
	// initTablePhotographs(db);
	console.log("server up and running, listening to port " + `${port}` + "...");
});
