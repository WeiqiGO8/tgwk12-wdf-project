// load the express package in the express variable
const express = require("express");
const sqlite3 = require("sqlite3");
const { engine } = require("express-handlebars"); // load the handlebars package for express

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

// define the different "/"_ /route
// default "/" route
app.get("/", (req, res) => {
	console.log("Sending the default route");
	res.render("home.handlebars");
	// res.send("Hello 'World'!");
});

// route to projects page
app.get("/projects", (req, res) => {
	console.log("Sending the projects route!");
	res.render("projects.handlebars", { projects });
});

// route to /CV changed to /about
app.get("/about", (req, res) => {
	console.log("Sending the route cv!");
	res.render("mycv.handlebars");
	// res.sendFile(__dirname + "/views/mycv-02.html");
});

app.get("/contact", (req, res) => {
	console.log("Sending the contact page route");
	res.render("contact.handlebars");
});

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

// Create table person at startup
// creates table projects at startup

// db.run(
// 	`CREATE TABLE Person (pid INTEGER PRIMARY KEY, fname TEXT NOT NULL, lname
// 	TEXT NOT NULL, age INTEGER, email TEXT)`,
// 	(error) => {
// 		if (error) {
// 			// tests error: display error
// 			console.log("---> ERROR: ", error);
// 		} else {
// 			// tests error: no error, the table has been created
// 			console.log("---> Table created!");
// 			db.run(
// 				`INSERT INTO Person (fname, lname, age, email) VALUES ('John',
// 			'Smith', 25, 'john.smith@example.com'), ('Jane', 'Doe', 30, 'jane.doe@mail.com'),
// 			('Alex', 'Johnson', 40, 'alex.johnson@company.com'), ('Emily', 'Brown', 35,
// 			'emily.brown@business.org'), ('Michael', 'Davis', 50, 'michael.davis@email.net'),
// 			('Sarah', 'Miller', 28, 'sarah.miller@example.com'), ('David', 'Garcia', 45,
// 			'david.garcia@mail.com'), ('Laura', 'Rodriguez', 32,
// 			'laura.rodriguez@company.com'), ('Chris', 'Wilson', 27,
// 			'chris.wilson@business.org'), ('Anna', 'Martinez', 22, 'anna.martinez@email.net'),
// 			('James', 'Taylor', 53, 'james.taylor@example.com'), ('Patricia', 'Anderson', 44,
// 			'patricia.anderson@mail.com'), ('Robert', 'Thomas', 38,
// 			'robert.thomas@company.com'), ('Linda', 'Hernandez', 55,
// 			'linda.hernandez@business.org'), ('William', 'Moore', 26,
// 			'william.moore@email.net'), ('Barbara', 'Jackson', 37,
// 			'barbara.jackson@example.com'), ('Richard', 'White', 49, 'richard.white@mail.com'),
// 			('Susan', 'Lee', 24, 'susan.lee@company.com'), ('Joseph', 'Clark', 41,
// 			'joseph.clark@business.org'), ('Jessica', 'Walker', 29,
// 			'jessica.walker@email.net');`,
// 				function (err) {
// 					if (err) {
// 						console.log(err.message);
// 					} else {
// 						console.log("---> Rows inserted in the table Person.");
// 					}
// 				}
// 			);
// 		}
// 	}
// );

// MODEL
const projects = [
	{
		id: "1",
		name: "Counting people with a camera",
		type: "Research",
		desc: "The purpose of this project is to count people passing through a corridor and to know how many are in the room at a certain time.",
		year: 2022,
		dev: "Python and OpenCV (Computer vision) library",
		url: "/img/counting.png",
	},

	{
		id: "2",
		name: "Visualisation of 3D medical images",
		type: "Research",
		desc: "The project makes a 3D model of the analysis of the body of a person and displays the detected health problems. It is useful for doctors to view in 3D their patients and the evolution of a disease.",
		year: 2012,
		url: "/img/medical.png",
	},

	{
		id: "3",
		name: "Multiple questions system",
		type: "Teaching",
		desc: "During the lockdowns in France, this project was useful to test the  students online with a Quizz system.",
		year: 2021,
		url: "/img/qcm07.png",
	},

	{
		id: "4",
		name: "Image comparison with the Local Dissmilarity Map",
		desc: "The project is about finding and quantifying the differences between two images of the same size. The applications were numerous: satellite maging, medical imaging,...",
		year: 2020,
		type: "Research",
		url: "/img/diaw02.png",
	},
	{
		id: "5",
		name: "Management system for students' internships",
		desc: "This project was about the creation of a database to manage the students' internships.",
		year: 2012,
		type: "Teaching",
		url: "/img/management.png",
	},

	{
		id: "6",
		name: "Magnetic Resonance Spectroscopy",
		desc: "Analysis of signals and images from Magnetic Resonance Spectroscopy and Imaging.",
		year: 2013,
		type: "Research",
		url: "/img/yu00.png",
	},

	{
		id: "7",
		name: "Signal Analysis for Detection of Epileptic Deseases",
		desc: "This project was about the detection of epileptic problems in signals",
		year: 2019,
		type: "research",
		url: "/img/youssef00.png",
	},
];

app.listen(port, () => {
	console.log("server up and running, listening to port " + `${port}` + "...");
});
