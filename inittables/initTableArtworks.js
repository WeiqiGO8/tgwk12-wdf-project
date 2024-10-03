const artworks = require("./../data/artworks.js");

function initTableArtworks(db) {
	// Create table artworks
	db.run(
		`CREATE TABLE IF NOT EXISTS artworks (
			aid INTEGER PRIMARY KEY AUTOINCREMENT,
			atype TEXT NOT NULL,
			aname TEXT NOT NULL,
			adesc TEXT,
			ayear TEXT,
			aurl TEXT,
			alturl TEXT,
			uid INTEGER,
			fid INTEGER,
			FOREIGN KEY (uid) REFERENCES users(uid),
			FOREIGN KEY (fid) REFERENCES workfor(fid))`,
		(error) => {
			if (error) {
				console.log("error when creating artworks table: ", error); //error: display error in the terminal
			} else {
				console.log("---> table artworks created!"); //no error, the table has been created
				//insert photographs
				artworks.forEach((oneartwork) => {
					db.run(
						`INSERT INTO artworks (aid,	atype, aname,	adesc, ayear, aurl,	alturl, uid, fid) 
							VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						[
							oneartwork.aid,
							oneartwork.atype,
							oneartwork.aname,
							oneartwork.adesc,
							oneartwork.ayear,
							oneartwork.aurl,
							oneartwork.alturl,
							oneartwork.uid,
							oneartwork.fid,
						],
						(error) => {
							if (error) {
								console.log("Error: ", error);
							} else {
								console.log("---> line added into artworks table!");
							}
						}
					);
				});
			}
		}
	);
}

module.exports = { initTableArtworks };
