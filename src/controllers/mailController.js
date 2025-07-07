const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendMail = async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.FROM_MAIL,
      to,
      subject,
      html,
    });
    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Erreur envoi email :", err);
    res.status(500).json({ error: "Erreur envoi email", detail: err.message });
  }
};
