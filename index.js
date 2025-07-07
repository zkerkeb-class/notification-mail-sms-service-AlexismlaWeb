require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/api/mail/send", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  try {
    await sgMail.send({
      to,
      from: "alexismelia@hotmail.fr", // Remplace par ton sender validé SendGrid !
      subject,
      text,
      html,
    });
    res.status(200).json({ message: "Mail envoyé" });
  } catch (err) {
    console.error("Erreur mail:", err.response?.body || err.message);
    res.status(500).json({ error: "Erreur d'envoi du mail" });
  }
});

app.get("/api/mail/health", (req, res) => {
  res.json({ status: "ok", service: "mail", date: new Date().toISOString() });
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`📧 Mail service running on port ${PORT}`);
});
