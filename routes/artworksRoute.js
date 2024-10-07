const { rawArtworksRoute } = require("./rawDataRoutes/rawArtworksRoute.js");

function artworksRoute(app, db) {
	app.get("/artworks", (req, res) => {
		const page = req.query.page || 1;
		const limit = 3;
		const offset = (page - 1) * limit;
		const nextPage = parseInt(page) + 1;
		const prevPage = parseInt(page) - 1;

		const query = `SELECT * FROM artworks LIMIT ? OFFSET ?`;

		db.all(query, [limit, offset], (error, rows) => {
			if (error) {
				console.log(error);
			} else {
				res.render("artworks", { artworks: rows, page, nextPage, prevPage });
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
