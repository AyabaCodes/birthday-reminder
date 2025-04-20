const nodemailer = require("nodemailer");
const config = require("../config");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendBirthdayEmail(to, username, retries = 3) {
    const mailOptions = {
      from: `"Birthday Team" <${config.email.user}>`,
      to,
      subject: "Happy Birthday! 🎉",
      html: `
<div style="text-align: center; padding: 20px; background-color: #f0f8ff;">
<h1 style="color: #ff69b4;">Happy Birthday, ${username}! 🎂</h1>
<p>Wishing you an amazing day filled with joy and happiness!</p>
<p>Best regards,<br/>The Altschool Africa Birthday Team</p> 
</div>
`,
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.transporter.sendMail(mailOptions);
        return { success: true };
      } catch (error) {
        if (attempt === retries) {
          return { success: false, error };
        }
        await new Promise((resolve) => setTimeout(resolve, 5000 * attempt));
      }
    }
  }
}

module.exports = new EmailService();
