let nodemailer = require("nodemailer");

module.exports = {
    sendMail: (to, subject, text) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "babatope.olajide@gmail.com",
              pass: "wtdyucsmshylaahb"
            }
        });
        // SEND EMAIL - // ensure this is based on the real case number ie. use ${user.email}
        let mailOptions = {
            from: "info@manifest.ng",
            to: to, // get the email from case model
            subject: `${subject}\n`,
            text: `Hi there,\n this email was automatically sent by Case Management\n ${text}`
        };
        transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            throw error;
        } else {
            console.log("Email successfully sent!");
        }
        });
    }
}