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
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzZXuSM4K79NVAAgsxtq9Z3G5qr7Tsma1zDss8t53xwDhQ3Dohj6JG5YuayepI44A6Sng/exec';
    
    // Parse body regardless of whether it's JSON or urlencoded string/object
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        // Assume urlencoded string
        const parsed = new URLSearchParams(payload);
        payload = Object.fromEntries(parsed.entries());
      }
    }

    const { name, email, phone, referralCode, ref, source } = payload || {};

    const formData = new URLSearchParams();
    formData.append('name', name || '');
    formData.append('email', email || '');
    formData.append('phone', phone || '');
    formData.append('referralCode', referralCode || ref || '');
    formData.append('source', source || 'Website 4.0');

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success !== false) {
      res.status(200).json({ success: true, data });
    } else {
      res.status(response.status >= 400 ? response.status : 400).json({ 
        success: false, 
        error: data.error || 'Failed to record waitlist submission.' 
      });
    }
  } catch (error) {
    console.error('Waitlist API Handler Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
