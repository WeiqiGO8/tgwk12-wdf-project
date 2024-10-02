function rawArtworksRoute(app, db) {
	app.get("/rawartworks", (req, res) => {
		db.all(`SELECT * FROM artworks`, (error, theArtworks) => {
			if (error) {
				console.log(error);
			} else {
				res.send(theArtworks);
			}
		});
	});
}

module.exports = { rawArtworksRoute };
