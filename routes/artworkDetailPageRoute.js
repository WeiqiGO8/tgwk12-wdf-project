function artworkDetailPageRoute(app, db) {
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

module.exports = { artworkDetailPageRoute };
