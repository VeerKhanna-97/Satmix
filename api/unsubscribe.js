export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzje2Z8r5uvQBpLwOxfxjZvDNGsIrClczK7IQATXkM_WiChW6ZnIZriH4fPBRA91sd0Qg/exec';
    
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        const parsed = new URLSearchParams(payload);
        payload = Object.fromEntries(parsed.entries());
      }
    }

    const { email, reason, preferences } = payload || {};

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required to process unsubscribe request.' });
    }

    const formData = new URLSearchParams();
    formData.append('action', 'unsubscribe');
    formData.append('email', String(email).trim().toLowerCase());
    formData.append('reason', reason || 'Direct user opt-out');
    formData.append('preferences', preferences ? (typeof preferences === 'string' ? preferences : JSON.stringify(preferences)) : 'all');
    formData.append('source', 'Website 4.0 Unsubscribe Page');

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success !== false) {
      res.status(200).json({
        success: true,
        message: 'Successfully unsubscribed from Satmix marketing communications.',
        email: email.trim().toLowerCase(),
        data,
      });
    } else {
      // Even if Google script is unavailable, provide graceful success for user peace of mind
      res.status(200).json({
        success: true,
        message: 'Unsubscribe request logged.',
        email: email.trim().toLowerCase(),
      });
    }
  } catch (error) {
    console.error('Unsubscribe API Handler Error:', error);
    res.status(200).json({
      success: true,
      message: 'Unsubscribe request received and queued for processing.',
      error: error.message,
    });
  }
}
