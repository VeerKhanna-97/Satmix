// ============================================================
// FILE: api/auth.js
// PURPOSE: Serverless Cloud Authentication & Multi-Device Session Persistence
//          Allows users who signed up on one device (e.g. laptop)
//          to seamlessly log into their account on another device (e.g. mobile)
//          using their registered email or 10-digit phone number.
// ============================================================

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzZXuSM4K79NVAAgsxtq9Z3G5qr7Tsma1zDss8t53xwDhQ3Dohj6JG5YuayepI44A6Sng/exec';

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        const parsed = new URLSearchParams(payload);
        payload = Object.fromEntries(parsed.entries());
      }
    }

    if (req.method === 'GET') {
      payload = { ...req.query, ...payload };
    }

    const { action = 'lookup', identifier = '', user = null, userState = null } = payload || {};
    const cleanId = (identifier || user?.email || user?.phone || '').trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\D/g, '').slice(-10);

    // 1. SIGNUP ACTION: Register user in central cloud roster
    if (action === 'signup' && user) {
      const formData = new URLSearchParams();
      formData.append('action', 'auth_signup');
      formData.append('name', user.name || '');
      formData.append('email', (user.email || '').toLowerCase().trim());
      formData.append('phone', user.phone || '');
      formData.append('passwordHash', user.password || '');
      formData.append('userId', user.id || '');
      formData.append('source', 'Satmix WebApp Auth Central');
      if (userState) {
        formData.append('userState', typeof userState === 'string' ? userState : JSON.stringify(userState));
      }

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        const data = await response.json().catch(() => ({}));
        return res.status(200).json({ success: true, cloudSynced: true, data });
      } catch (err) {
        console.warn('Central signup sync note:', err.message);
        return res.status(200).json({ success: true, cloudSynced: false, note: 'Local registration saved.' });
      }
    }

    // 2. LOGIN / LOOKUP ACTION: Check if user exists centrally by email or 10-digit phone
    if (action === 'login' || action === 'lookup') {
      if (!cleanId && !cleanPhone) {
        return res.status(400).json({ success: false, error: 'Identifier (email or phone) is required.' });
      }

      const formData = new URLSearchParams();
      formData.append('action', 'auth_lookup');
      formData.append('identifier', cleanId);
      formData.append('phone', cleanPhone);

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        const data = await response.json().catch(() => ({}));

        if (data && data.user) {
          return res.status(200).json({
            success: true,
            found: true,
            user: data.user,
            userState: data.userState || null,
          });
        }
      } catch (err) {
        console.warn('Central auth lookup warning:', err.message);
      }

      return res.status(200).json({
        success: true,
        found: false,
        message: 'No cloud account match returned.',
      });
    }

    // 3. SYNC ACTION: Update user state across devices
    if (action === 'sync' && (cleanId || user?.id)) {
      const formData = new URLSearchParams();
      formData.append('action', 'auth_sync');
      formData.append('userId', user?.id || '');
      formData.append('identifier', cleanId);
      if (userState) {
        formData.append('userState', typeof userState === 'string' ? userState : JSON.stringify(userState));
      }

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
      } catch {
        // Non-blocking sync
      }

      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ success: true, status: 'ok' });
  } catch (error) {
    console.error('Auth API Handler Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
