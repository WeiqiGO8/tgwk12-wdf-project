const codeProjects = require("./../data/code-projects.js");

function initTableCodeProjects(db) {
	//create table codeProjects
	db.run(
		`CREATE TABLE IF NOT EXISTS codeProjects (
			cid INTEGER PRIMARY KEY AUTOINCREMENT,
			ctype TEXT,
			cname TEXT,
			cdesc TEXT,
			cyear TEXT,
			curl TEXT,
			calturl TEXT,
			uid INTEGER,
			fid INTEGER,
			FOREIGN KEY (uid) REFERENCES users(uid),
			FOREIGN KEY (fid) REFERENCES workfor(fid))`,
		(error) => {
			if (error) {
				console.log(error);
			} else {
				console.log("---> table codeProjects created!");
				//insert
				codeProjects.forEach((oneCodeProject) => {
					db.run(
						`INSERT INTO codeProjects (cid, ctype, cname, cdesc, cyear, curl,	calturl, uid,	fid) 
							VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,

						[
							oneCodeProject.cid,
							oneCodeProject.uid,
							oneCodeProject.fid,
							oneCodeProject.ctype,
							oneCodeProject.cname,
							oneCodeProject.cdesc,
							oneCodeProject.cyear,
							oneCodeProject.curl,
							oneCodeProject.calturl,
						],
						(error) => {
							if (error) {
								console.log(error);
							} else {
								console.log("---> line added into codeProjects table ");
							}
						}
					);
				});
			}
		}
	);
}

module.exports = { initTableCodeProjects };
