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
app.engine("handlebars", engine()); //initialize the engine to be handlebars
app.set("view engine", "handlebars"); //set handlebars as the view engine
app.set("views", "./views"); // define the views directory to be ./views

// define the different "/"_|routes|
// default "/" route
app.get("/", (req, res) => {
	console.log("Sending the default route");
	res.render("home.handlebars");
	// res.send("Hello 'World'!");
});

// route to /CV
app.get("/about", (req, res) => {
	console.log("Sending the route cv!");
	res.render("mycv.handlebars");
	// res.sendFile(__dirname + "/views/mycv-02.html");
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

app.listen(port, () => {
	console.log("server up and running, listening to port " + `${port}` + "...");
});
