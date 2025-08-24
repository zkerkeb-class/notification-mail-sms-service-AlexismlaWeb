require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sgMail = require("@sendgrid/mail");

const app = express();

// Security middlewares
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8081'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post("/api/mail/send", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  // Mode test : simuler l'envoi d'email
  if (process.env.NODE_ENV === 'test' || !process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'your-sendgrid-api-key') {
    console.log(`📧 [MODE TEST] Email simulé vers ${to}:`);
    console.log(`   Sujet: ${subject}`);
    console.log(`   Contenu: ${text}`);
    return res.status(200).json({ 
      message: "Email simulé (mode test)", 
      debug: { to, subject, text } 
    });
  }

  try {
    console.log(`📧 Tentative d'envoi d'email vers ${to} depuis ${process.env.FROM_EMAIL}`);
    console.log(`   Sujet: ${subject}`);
    console.log(`   Contenu: ${text}`);
    
    await sgMail.send({
      to,
      from: process.env.FROM_EMAIL || "alexismelia@hotmail.fr",
      subject,
      text,
      html,
    });
    
    console.log(`✅ Email envoyé avec succès vers ${to}`);
    res.status(200).json({ message: "Mail envoyé" });
  } catch (err) {
    console.error("❌ Erreur mail:", err.response?.body || err.message);
    res.status(500).json({ error: "Erreur d'envoi du mail" });
  }
});

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`📧 Mail service running on port ${PORT}`);
});
