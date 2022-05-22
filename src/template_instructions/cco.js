const Dedent = require("dedent");

module.exports = function(Doc) {
	Doc
		.font("typewriter")
		.fontSize(12)
		.text(`As a Company Commanding Officer, your role is to act as the first entrypoint and commander for men in the 101st Airborne.`, {align: "left", indent: 30})

		.moveDown().text("Don't be too harsh on your men, guide them with authority instead. Contact your superiors for any further details. Good luck.", {align: "left", indent: 30})
	
};
