const artworks = require("./../data/artworks.js");

function initTableArtworks(db) {
	// Create table artworks
	db.run(
		`CREATE TABLE IF NOT EXISTS artworks (aid INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER, fid INTEGER, atype TEXT NOT NULL, aname TEXT NOT NULL, adesc TEXT, ayear TEXT, aurl TEXT, alturl TEXT, FOREIGN KEY (uid) REFERENCES users(uid), FOREIGN KEY (fid) REFERENCES workfor(fid))`,
		(error) => {
			if (error) {
				console.log("ERROR: ", error); //error: display error in the terminal
			} else {
				console.log("---> table artworks created!"); //no error, the table has been created
				//insert photographs
				artworks.forEach((oneartwork) => {
					db.run(
						`INSERT INTO artworks (aid, uid, fid, atype, aname, adesc, ayear, aurl, alturl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

module.exports = { initTableArtworks };
