function codeProjectDetailPageRoute(app, db) {
	app.get("/codeprojects/:cid", (req, res) => {
		const cid = req.params.cid;
		db.get(
			`SELECT * FROM codeProjects INNER JOIN workfor ON codeProjects.fid = workfor.fid WHERE cid = ?`,
			[cid],
			(error, row) => {
				console.log(row);
				res.render("single-code-project", { codeProject: row });
			}
		);
	});
}

module.exports = { codeProjectDetailPageRoute };
