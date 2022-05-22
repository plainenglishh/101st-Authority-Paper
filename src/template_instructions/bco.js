const Dedent = require("dedent");

module.exports = function(Doc) {
	Doc
		.font("typewriter")
		.fontSize(12)
		.text(`As a Battalion Commanding Officer, your duty isn't to directly command the men of your Battalion.`, {align: "left", indent: 30})

		.moveDown().text("You should instead lead them through your company staff. You are responsible for your Battalion's smooth operation, you do this by ensuring everyone does their jobs correctly. Intervene in company decisions where necessary but do not do this liberally. Good luck in your role, you'll do fine!", {align: "left", indent: 30})
	
};
