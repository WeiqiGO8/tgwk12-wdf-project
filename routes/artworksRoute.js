const { rawArtworksRoute } = require("./rawDataRoutes/rawArtworksRoute.js");

function artworksRoute(app, db) {
	app.get("/artworks", (req, res) => {
		db.all(`SELECT * FROM artworks`, (error, rawartworks) => {
			if (error) {
				console.log(error);
			} else {
				const modelArtworks = { artworks: rawartworks };
				res.render("artworks", modelArtworks);
				// console.log(rawartworks);
			}
		});
	});

	app.get("/artworks/:aid", (req, res) => {
		const aid = req.params.aid;
		db.get(
			`SELECT * FROM artworks INNER JOIN workfor ON artworks.fid = workfor.fid WHERE aid = ?`,
			[aid],
			(error, row) => {
				console.log(row);
				res.render("single-artwork", { artwork: row });
			}
		);
	});
}

module.exports = { artworksRoute };
