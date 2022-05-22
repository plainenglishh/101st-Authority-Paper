const Dedent = require("dedent");

module.exports = function(Doc) {
	Doc
		.font("typewriter")
		.fontSize(12)
		.text(`As a Battalion Senior Enlisted Advisor, you are the adjutant to your BCO. Help them to the best of your ability.`, {align: "left", indent: 30})

		.moveDown().text("You derive your job from the BCO and you hold a similar position, you do what they delegate to you. Ask them for your job. Good luck!", {align: "left", indent: 30})
	
};
