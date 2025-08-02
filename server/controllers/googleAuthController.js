// controllers/googleAuthController.js
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(req, res) {
  const { token } = req.body; // Token sent from the client

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Your Google Client ID
    });
    const payload = ticket.getPayload();  // Payload contains user data
    res.status(200).json({ message: 'Google authentication successful', user: payload });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
}

module.exports = { verifyGoogleToken };
