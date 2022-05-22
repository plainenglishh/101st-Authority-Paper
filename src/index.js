#!/usr/bin/env node

const PDFDocument = require("pdfkit");
const FS = require("fs");
const Path = require("path");
const Inquirer = require("inquirer");
const Yargs = require("yargs");

const Title = (Text) => {console.log(`\n${Text}\n${"=".repeat(Text.length)}`)};

const Options = Yargs
	.option("to", {alias: "output", describe: "Output file location", type: "string", demandOption: true, default: __dirname + ".pdf" })
	.option("headless", {alias: "dev", describe: "Automatically fills in data", type: "boolean", demandOption: false })

	.option("subjectname", {describe: "[Headless] Name of Subject", type: "string", default: "101stAirborneRanking", demandOption: false })
	.option("subjectregiment", {describe: "[Headless] Regiment of Subject (Follow GUI options)", default: "506th Infantry Regiment", type: "string", demandOption: false })
	.option("subjectrank", {describe: "[Headless] Rank of Subject (Abbreviation, Follow GUI options.)", default: "PFC", type: "string", demandOption: false })
	.option("subjectunit", {describe: "[Headless] Unit of Subject (Abbreviation, Follow GUI options.)", default: "907th Infantry Battalion", type: "string", demandOption: false })
	.option("subjectposition", {describe: "[Headless] Position of Subject (Abbreviation, Follow GUI options.)", default: "Battalion Commanding Officer", type: "string", demandOption: false })
	.option("template", {describe: "[Headless] Template (Abbreviation, Follow GUI options.)", default: "bco", type: "string", demandOption: false })

	.option("signatorname", {describe: "[Headless] Name of Signator", type: "string", default: "plainenglish", demandOption: false })
	.option("signatorrank", {describe: "[Headless] Rank of Signator (Abbreviation, Follow GUI options.)", type: "string", default: "MSGT", demandOption: false })
	.option("signatorunit", {describe: "[Headless] Unit of Signator (Abbreviation, Follow GUI options.)", type: "string", default: "506th HQ", demandOption: false })
	.option("signatorposition", {describe: "[Headless] Position of Signator (Abbreviation, Follow GUI options.)", type: "string", default: "RSEA", demandOption: false })

	.argv;

//console.log(Options);

//// Details ////

const REGIMENT_CHOICES = ["506th Infantry Regiment", "502nd Airborne Regiment"];
const RANK_CHOICES = ["PVT", "PFC", "CPL", "SGT", "SSGT", "FSGT", "MSGT", "2Lt", "Lt", "Capt", "Maj", "Lt Col", "Col", "Brig Gen", "Maj Gen", "Lt Gen", "Gen"];
const UNIT_CHOICES = ["907th Infantry Battalion", "332nd Infantry Battalion", "Able Company", "Baker Company", "Easy Company", "Fox Company", "468th Parachute Battalion", "377th Parachute Battalion", "Bandit Company", "Ape Company", "Paladin Company", "Juliett Company"];

const FONT = Path.join(__dirname, "fonts", "CutiveMono-Regular.ttf");
const HANDWRITTEN_FONT = Path.join(__dirname, "fonts", "Caveat-Regular.ttf");
const HEADER_FONT = Path.join(__dirname, "fonts", "Courier New Bold.ttf");
const FONT_SIZE = 10;
const MARGINS = {X: 5 * FONT_SIZE, Y: 5 * FONT_SIZE};
let DEV_MODE = Options.dev;

(async () => {
	let Subject = {};
	let Signator = {};

	let CurrentDate = new Date();

	process.title = "Authority Paper Generator";
	//console.clear();
	if (!DEV_MODE) {
		Title("SUBJECT INFORMATION");
		Subject = await Inquirer.prompt([
			{
				name: "Name",
				message: "Name: "
			},
			{
				type: "list",
				name: "Regiment",
				message: "Regiment: ",
				choices: REGIMENT_CHOICES
			},
			{
				type: "list",
				name: "Rank",
				message: "Rank: ",
				choices: RANK_CHOICES
			},
			{
				type: "list",
				name: "Unit",
				message: "Unit: ",
				choices: UNIT_CHOICES
			},
			{
				type: "list",
				name: "Position",
				message: "Position: ",
				choices: ["Commanding Officer", "Executive Commanding Officer", "Senior Enlisted Advisor"]
			},
			{
				type: "list",
				name: "Template",
				message: "Template Body: ",
				choices: ["BCO", "BSEA", "CCO", "CSEA"]
			}
		]);

		Title("SIGNATOR INFORMATION:");
		Signator = await Inquirer.prompt([
			{
				name: "Name",
				message: "Name: "
			},
			{
				type: "list",
				name: "Rank",
				message: "Rank: ",
				choices: RANK_CHOICES
			},
			{
				type: "list",
				name: "Unit",
				message: "Unit: ",
				choices: ["506th HQ", "502nd HQ", "101st HQ"]
			},
			{
				type: "list",
				name: "Position",
				message: "Position: ",
				choices: ["RCO", "RSEA"]
			}
		]);
	} else {
		Subject = {Name: Options.subjectname, Regiment: Options.subjectregiment, Rank: Options.subjectrank, Unit: Options.subjectunit, Position: Options.subjectposition, Template: Options.template};
		Signator = {Name: Options.signatorname, Rank: Options.signatorrank, Unit: Options.signatorunit, Position: Options.signatorposition};
	}

	const Doc = new PDFDocument({size: "A4"});
	const Stream = FS.createWriteStream("AuthorityPaper.pdf");
	Doc.pipe(Stream);
	Doc.registerFont("typewriter", FONT);
	Doc.registerFont("handwriting", HANDWRITTEN_FONT);
	//Doc.rect(0, 0, Doc.page.width, Doc.page.height).fill("#fffcf8");

	// Header //

	// Title and Grant //
	Doc
		.font("typewriter")
		.fontSize(12)
		.text(`${CurrentDate.getDate()}/${CurrentDate.getMonth()+1}/${CurrentDate.getFullYear()}`, {
			align: "right",
		}).moveDown(2)
		.text(`AUTHORITY PAPER: ${Subject.Name.toUpperCase()}`, {
			align: "center",
			underline: true
		}).moveDown()
		.fontSize(12)
		.font("typewriter").text(`This hereby certifies `, {
			continued: true,
			indent: 30
		})
		.font("handwriting").text(`${Subject.Rank} ${Subject.Name}`, {
			continued: true
		})
		.font("typewriter").text(` as  `, {
			continued: true
		})
		.font("handwriting").text(Subject.Position, {
			continued: true
		})
		.font("typewriter").text(`  of `, {
			continued: true
		})
		.font("handwriting").text(Subject.Unit, {
			continued: true
		})
		.font("typewriter").text(` in the 101st Airborne Division.`)

	Doc.moveDown(2);
	Doc.text("----------------------------------------------------", {align: "center"});
	Doc.moveDown(2);

	require(`./template_instructions/${Subject.Template}.js`)(Doc);

	Doc.moveDown(2);
	Doc.text("----------------------------------------------------", {align: "center"});
	Doc.moveDown(2);
	// Signature //

	Doc
		.fontSize(12)
		.font("typewriter").text("Signed,", {
			align: "right",
			continued: true
		})
		.moveDown().font("handwriting").text(Signator.Name, {
			continued: true
		})
		.moveDown().font("typewriter").text(Signator.Name, {
			continued: true
		})
		.moveDown().font("typewriter").text(`${Signator.Rank} 101AD, US ARMY`, {
			continued: true
		})
		.moveDown().font("typewriter").text(`${Signator.Position} ${Signator.Unit}`)

	Doc
		.moveDown(2)
		.fontSize(6)
		.text("Generated 506th Authority Paper // (C) plainenglish 2022", {align: "center"})
		.text("Printed " + 	CurrentDate.toString(), {align: "center"})

	console.log(`\nSaved to: ${process.cwd()}\\${Stream.path}.`)

	Doc.end();
})();
