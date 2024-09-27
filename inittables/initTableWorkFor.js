const workfor = require("./../data/workfor.js");

function initTableWorkFor(db) {
	//create table workfor at startup
	db.run(
		`CREATE TABLE IF NOT EXISTS workfor (fid INTEGER PRIMARY KEY AUTOINCREMENT, fname TEXT NOT NULL, fdesc TEXT)`,
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

module.exports = { initTableWorkFor };
