export default async function sendMail(to, subject, html) {
	let nodemailer = require("nodemailer");
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.MAIL_USERNAME,
			pass: process.env.MAIL_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail(
		{
			from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address
			to: to.join(", "), // list of receivers
			subject: subject, // Subject line
			html: html, // html body
		},
		function (error, info) {
			if (error) {
				throw new Error(error);
			} else {
				console.log("Email Sent");
				return true;
			}
		}
	);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	//console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
