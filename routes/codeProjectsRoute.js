// const {
// 	rawCodeProjectsRoute,
// } = require("./rawDataRoutes/rawCodeProjectsRoute.js");

function codeProjectsRoute(app, db) {
	// render /codeprojects route page
	app.get("/codeprojects", (req, res) => {
		db.all(`SELECT * FROM codeProjects`, (error, rawcode) => {
			console.log({ error, rawcode });
			if (error) {
				console.log(error);
			} else {
				const modelCodeProjects = { codeProjects: rawcode };
				res.render("code-projects", modelCodeProjects);
				// console.log(rawcode);
			}
		});
	});

	// render /codeprojects/new route page
	app.get("/codeprojects/new", (req, res) => {
		res.render("code-project-new");
	});

	// send /codeprojects/new route page
	// CREATE NEW ROW IN TABLE ------------------------------------------------
	app.post("/codeprojects/new", (req, res) => {
		const { ctype, cname, cdesc, cyear, curl, calturl, uid, fid } = req.body;
		console.log("request body", req.body);

		db.run(
			`INSERT INTO codeProjects (ctype, cname, cdesc, cyear, curl,	calturl, uid,	fid) 
				VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
			[ctype, cname, cdesc, cyear, curl, calturl, uid, fid],
			(error) => {
				if (error) {
					console.log("error: ", error);
					res.redirect("/codeprojects");
				} else {
					console.log("---> line added into codeProjects table");
					res.redirect("/codeprojects");
				}
			}
		);
	});

	// START -------------------------------------------------------------------------
	//(chatgpt, 2024)
	// https://chatgpt.com/share/66ff0b9c-1bec-800d-ab64-7d584a417302
	// render /codeprojects/modify/cid route page
	app.get("/codeprojects/modify/:cid", (req, res) => {
		const [cid] = req.params.cid;
		db.get(`SELECT * FROM codeProjects WHERE cid = ?`, [cid], (error, row) => {
			if (error) {
				console.log("error fetching project for modification: ", error);
				res.redirect("/codeprojects");
			} else {
				res.render("code-project-new", { codeProject: row });
			}
		});
	});
	// END -------------------------------------------------------------------------

	// send /codeprojects/modify/cid route page
	app.post("/codeprojects/modify/:cid", (req, res) => {
		console.log("modify route hit wiht cid", req.params.cid);
		const { ctype, cname, cdesc, cyear, curl, calturl, uid, fid } = req.body;
		const { cid } = req.params;
		db.get(
			`UPDATE codeProjects 
			SET
			ctype = ?,
			cname = ?,
			cdesc = ?,
			cyear = ?,
			curl = ?,
			calturl = ?,
			uid = ?,
			fid = ?
			WHERE cid = ?
			`,
			[ctype, cname, cdesc, cyear, curl, calturl, uid, fid, cid],
			(error) => {
				if (error) {
					console.log("error: ", error);
					res.redirect("/codeprojects");
				} else {
					res.redirect("/codeprojects");
				}
			}
		);
	});

	// render /codeprojects/cid detail page route
	app.get("/codeprojects/:cid", (req, res) => {
		const cid = req.params.cid;
		console.log(
			"Project route parameter codeprojects/:cid: " +
				JSON.stringify(req.params.cid)
		);
		db.get(
			`SELECT * FROM codeProjects INNER JOIN workfor ON codeProjects.fid = workfor.fid WHERE cid = ?`,
			[cid],
			(error, row) => {
				console.log(row);
				res.render("single-code-project", { codeProject: row });
			}
		);
	});

	// render /codeprojects/delete route page
	// delete one specific code project
	app.get("/codeprojects/delete/:cid", (req, res) => {
		console.log(
			"Project route parameter cid:" + JSON.stringify(req.params.cid)
		);

		//delete in the table the project with the given id
		db.run(
			`DELETE FROM codeProjects WHERE cid = ?`,
			[req.params.cid],
			(error, codeProject) => {
				if (error) {
					console.log("error when trying to delete: ", error);
				} else {
					console.log("the code project" + req.params.cid + "has been deleted");
					res.redirect("/codeprojects");
				}
			}
		);
	});
}

module.exports = { codeProjectsRoute };
