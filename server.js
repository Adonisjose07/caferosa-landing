const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const OWNER_EMAIL = process.env.OWNER_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL || OWNER_EMAIL;

if (!SENDGRID_API_KEY) {
  console.error('ERROR: SENDGRID_API_KEY no está definido en .env');
}
if (!OWNER_EMAIL) {
  console.error('ERROR: OWNER_EMAIL no está definido en .env');
}

sgMail.setApiKey(SENDGRID_API_KEY || '');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos (tu index.html y assets) desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));

app.post('/subscribe', async (req, res) => {
  const email = (req.body && req.body.email) ? String(req.body.email).trim() : '';
  if (!email) return res.status(400).json({ error: 'Email requerido' });

  if (!SENDGRID_API_KEY || !OWNER_EMAIL) {
    return res.status(500).json({ error: 'Server not configured with SendGrid API or owner email' });
  }

  const msg = {
    to: OWNER_EMAIL,
    from: SENDER_EMAIL,
    subject: 'Nueva suscripción desde la web',
    text: `Nuevo suscriptor: ${email}`,
    html: `<p>Nuevo suscriptor: <strong>${email}</strong></p>`
  };

  try {
    await sgMail.send(msg);
    return res.json({ ok: true });
  } catch (err) {
    console.error('SendGrid error:', err && err.response ? err.response.body : err);
    return res.status(500).json({ error: 'sendgrid_error' });
  }
});

// Fallback: devolver index.html para rutas que no sean API (útil para SPA)
app.get('*', (req, res) => {
  if (req.method === 'GET' && req.headers.accept && req.headers.accept.indexOf('text/html') !== -1) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  return res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
