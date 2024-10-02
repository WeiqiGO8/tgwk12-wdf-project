const { rawArtworksRoute } = require("./rawArtworksRoute.js");

function artworksRoute(app, db) {
	app.get("/artworks", (req, res) => {
		db.all(`SELECT * FROM artworks`, (error, rawartworks) => {
			if (error) {
				console.log(error);
			} else {
				const modelArtworks = { artworks: rawartworks };
				res.render("artworks", modelArtworks);
			}
		});
	});
}

module.exports = { artworksRoute };
