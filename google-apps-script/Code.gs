/**
 * ==============================================================================
 * SATMIX — GOOGLE APPS SCRIPT AFFILIATE & WAITLIST ENGINE (EXISTING SHEET MIGRATION)
 * ==============================================================================
 * Author: Satmix Engineering Team (Veer Khanna)
 * Version: 4.2.0 (Non-Destructive for Existing Sheets)
 * Target Sheet: https://docs.google.com/spreadsheets/d/1Z-SrSXW2Er72lJ0F428Z_QoG05lmCODD7n49I605Lfk
 * 
 * Existing Data Compatibility:
 *   - Preserves all 100+ existing records (Timestamp, Name, Email, Phone in Cols A-D).
 *   - Non-destructively extends Cols E-J (Referral Code, Attributed Person, Category, Status, Source, Notes).
 *   - Auto-backfills existing legacy rows as "Organic / Legacy".
 *   - Appends 3 helper tabs: Affiliate_Creator_Roster, Leaderboard_Dashboard, Fraud_Audit_Log.
 * ==============================================================================
 */

const CONFIG = {
  WEBSITE_BASE_URL: 'https://satmix.in',
  GOOGLE_FORM_BASE_URL: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform',
  GOOGLE_FORM_REF_ENTRY_ID: 'entry.123456789',
  
  SHEET_NAMES: {
    SUBMISSIONS: 'Waitlist_Submissions',
    ROSTER: 'Affiliate_Creator_Roster',
    LEADERBOARD: 'Leaderboard_Dashboard',
    AUDIT: 'Fraud_Audit_Log'
  },
  
  CATEGORIES: {
    AFFILIATE: 'Affiliate / Intern',
    CREATOR: 'Content Creator',
    AMBASSADOR: 'Campus Ambassador',
    FOUNDER: 'Founding Team',
    PARTNER: 'Strategic Partner'
  },

  STATUS: {
    VALID: 'Valid',
    ORGANIC: 'Organic',
    DUPLICATE: 'Duplicate',
    INVALID_CODE: 'Invalid_Code'
  }
};

/**
 * ==============================================================================
 * 1. HTTP POST HANDLER (Webhooks from Website 3.0 / 4.0)
 * ==============================================================================
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return createJsonResponse({ success: false, error: 'Server busy processing waitlist.' }, 429);
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const submissionsSheet = getSubmissionsSheet(ss);
    const rosterSheet = getRosterSheet(ss);

    // 1. Bulletproof payload extraction supporting JSON, urlencoded, and query parameters
    const payload = extractRequestPayload(e);

    const rawName = payload.name || payload.fullName || payload.w_name || '';
    const rawEmail = payload.email || payload.w_email || '';
    const rawPhone = payload.phone || payload.w_phone || payload.mobile || '';
    const rawRef = payload.referralCode || payload.referral_code || payload.refCode || payload.ref || payload.code || payload.creator || payload.affiliate || payload.utm_source || '';
    const source = payload.source || 'Website Waitlist';

    const name = String(rawName).trim();
    const email = String(rawEmail).trim().toLowerCase();
    const phone = String(rawPhone).trim().replace(/[^\d+]/g, '');
    const refCode = String(rawRef).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    if (!name || !email) {
      return createJsonResponse({ success: false, error: 'Missing required fields: name and email are mandatory.' }, 400);
    }

    const affiliateMap = getAffiliateMap(rosterSheet);

    let attributedPerson = 'Organic';
    let category = 'Organic';
    let status = CONFIG.STATUS.ORGANIC;

    if (refCode) {
      if (affiliateMap[refCode]) {
        attributedPerson = affiliateMap[refCode].name;
        category = affiliateMap[refCode].category;
        status = CONFIG.STATUS.VALID;
      } else {
        attributedPerson = 'Unregistered Code (' + refCode + ')';
        category = 'Unknown';
        status = CONFIG.STATUS.INVALID_CODE;
      }
    }

    // Check duplicate email or phone in existing records
    const isDuplicate = checkDuplicate(submissionsSheet, email, phone);

    if (isDuplicate) {
      status = CONFIG.STATUS.DUPLICATE;
      logAudit(ss, {
        timestamp: new Date(),
        name: name,
        email: email,
        phone: phone,
        refCode: refCode,
        attributedTo: attributedPerson,
        reason: 'Duplicate Email or Phone number detected.'
      });
    }

    const timestamp = new Date();
    submissionsSheet.appendRow([
      timestamp,          // Col A: Timestamp
      name,               // Col B: Name
      email,              // Col C: Email
      phone,              // Col D: Phone
      refCode,            // Col E: Referral Code
      attributedPerson,   // Col F: Attributed Person
      category,           // Col G: Category
      status,             // Col H: Status
      source,             // Col I: Source
      isDuplicate ? 'Duplicate submission logged' : 'Verified signup' // Col J: Notes
    ]);

    const lastRow = submissionsSheet.getLastRow();
    submissionsSheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');

    return createJsonResponse({
      success: true,
      message: 'Waitlist submission successfully recorded.',
      data: { name, email, referralCode: refCode, attributedPerson, category, status, isDuplicate }
    }, 200);

  } catch (error) {
    console.error('doPost Error:', error);
    return createJsonResponse({ success: false, error: error.message || 'Internal server error.' }, 500);
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * ==============================================================================
 * 2. HTTP GET HANDLER (Health Check & Live Public/Internal Leaderboard API)
 * ==============================================================================
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const action = e && e.parameter ? e.parameter.action : 'health';

    if (action === 'leaderboard') {
      const leaderboardData = getLiveLeaderboardData(ss);
      return createJsonResponse({ success: true, generatedAt: new Date().toISOString(), leaderboard: leaderboardData });
    }

    return createJsonResponse({
      status: 'healthy',
      service: 'Satmix Waitlist Referral & Creator Attribution Engine',
      version: '4.2.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.message }, 500);
  }
}

function createJsonResponse(data, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Robust extractor for all incoming request formats:
 * JSON body, application/x-www-form-urlencoded body, and URL query params
 */
function extractRequestPayload(e) {
  const payload = {};
  if (!e) return payload;

  // 1. Check URL parameters
  if (e.parameter) {
    for (const k in e.parameter) {
      payload[k] = e.parameter[k];
    }
  }

  // 2. Check postData
  if (e.postData && e.postData.contents) {
    const raw = e.postData.contents;
    try {
      const json = JSON.parse(raw);
      for (const k in json) {
        payload[k] = json[k];
      }
    } catch (err) {
      // Parse as urlencoded query string (name=foo&email=bar...)
      const pairs = String(raw).split('&');
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=');
        if (pair.length >= 2) {
          const k = decodeURIComponent(pair[0].replace(/\+/g, ' '));
          const v = decodeURIComponent(pair.slice(1).join('=').replace(/\+/g, ' '));
          payload[k] = v;
        }
      }
    }
  }

  return payload;
}

/**
 * Test Runner: Simulates an attribution submission directly in Apps Script
 */
function testReferralAttribution() {
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'Veer Test Referral',
        email: 'veer.referral.test.' + Math.floor(Math.random() * 1000) + '@satmix.in',
        phone: '9999900001',
        referralCode: 'VEER',
        source: 'Apps Script Test Suite'
      })
    }
  };
  const response = doPost(mockEvent);
  Logger.log('Test Response: ' + response.getContent());
}

/**
 * Helper to identify the main submissions sheet
 */
function getSubmissionsSheet(ss) {
  return ss.getSheetByName(CONFIG.SHEET_NAMES.SUBMISSIONS) || ss.getSheets()[0];
}

function getRosterSheet(ss) {
  return ss.getSheetByName(CONFIG.SHEET_NAMES.ROSTER);
}

function getAffiliateMap(rosterSheet) {
  const map = {};
  if (!rosterSheet || rosterSheet.getLastRow() <= 1) return map;

  const data = rosterSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const code = String(row[0] || '').trim().toUpperCase();
    const name = String(row[1] || '').trim();
    const category = String(row[2] || CONFIG.CATEGORIES.AFFILIATE).trim();
    const handle = String(row[3] || '').trim();
    const email = String(row[4] || '').trim();
    const active = String(row[6] || 'Active').trim().toLowerCase();

    if (code && (active === 'active' || active === 'true' || active === 'yes')) {
      map[code] = { name: name || code, category, handle, email };
    }
  }
  return map;
}

function checkDuplicate(submissionsSheet, email, phone) {
  if (!submissionsSheet || submissionsSheet.getLastRow() <= 1) return false;

  const data = submissionsSheet.getRange(2, 3, submissionsSheet.getLastRow() - 1, 2).getValues();
  const lowerEmail = email.toLowerCase();
  const cleanPhone = phone ? phone.replace(/[^\d]/g, '') : '';

  for (let i = 0; i < data.length; i++) {
    const existingEmail = String(data[i][0] || '').trim().toLowerCase();
    const existingPhone = String(data[i][1] || '').trim().replace(/[^\d]/g, '');

    if (existingEmail && existingEmail === lowerEmail) return true;
    if (cleanPhone && cleanPhone.length >= 10 && existingPhone && existingPhone === cleanPhone) return true;
  }
  return false;
}

function logAudit(ss, record) {
  try {
    const auditSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.AUDIT);
    if (!auditSheet) return;
    auditSheet.appendRow([record.timestamp, record.name, record.email, record.phone, record.refCode, record.attributedTo, record.reason]);
  } catch (e) {}
}

function getLiveLeaderboardData(ss) {
  const submissionsSheet = getSubmissionsSheet(ss);
  const rosterSheet = getRosterSheet(ss);
  const affiliateMap = getAffiliateMap(rosterSheet);
  const counts = {};

  for (const code in affiliateMap) {
    counts[code] = { code, name: affiliateMap[code].name, category: affiliateMap[code].category, handle: affiliateMap[code].handle, validSignups: 0, duplicateSignups: 0, totalSignups: 0 };
  }

  if (submissionsSheet && submissionsSheet.getLastRow() > 1) {
    const data = submissionsSheet.getRange(2, 1, submissionsSheet.getLastRow() - 1, 8).getValues();
    for (let i = 0; i < data.length; i++) {
      const refCode = String(data[i][4] || '').toUpperCase();
      const status = String(data[i][7] || '');
      if (counts[refCode]) {
        counts[refCode].totalSignups++;
        if (status === CONFIG.STATUS.VALID) counts[refCode].validSignups++;
        else if (status === CONFIG.STATUS.DUPLICATE) counts[refCode].duplicateSignups++;
      }
    }
  }

  const list = Object.values(counts);
  list.sort((a, b) => b.validSignups - a.validSignups);
  return list;
}

/**
 * Custom UI Menu in Google Sheets
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚡ Satmix Tools')
    .addItem('➕ Add New Creator / Affiliate', 'menuAddNewAffiliate')
    .addItem('🔗 Refresh All Referral Links', 'menuRefreshAllLinks')
    .addSeparator()
    .addItem('🛠️ Upgrade Existing Sheet Structure', 'upgradeExistingSheet')
    .addToUi();
}

function menuAddNewAffiliate() {
  const ui = SpreadsheetApp.getUi();
  const codeResp = ui.prompt('Step 1/4: Referral Code', 'Enter unique referral code (e.g. ADITI, ARYA, AMAN):', ui.ButtonSet.OK_CANCEL);
  if (codeResp.getSelectedButton() !== ui.Button.OK) return;
  const code = codeResp.getResponseText().trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (!code) { ui.alert('Referral code cannot be empty.'); return; }

  const nameResp = ui.prompt('Step 2/4: Full Name', 'Enter full name:', ui.ButtonSet.OK_CANCEL);
  if (nameResp.getSelectedButton() !== ui.Button.OK) return;
  const name = nameResp.getResponseText().trim();

  const catResp = ui.prompt('Step 3/4: Category', 'Enter category (1 = Creator, 2 = Affiliate/Intern, 3 = Ambassador):', ui.ButtonSet.OK_CANCEL);
  if (catResp.getSelectedButton() !== ui.Button.OK) return;
  const catInput = catResp.getResponseText().trim();
  let category = CONFIG.CATEGORIES.CREATOR;
  if (catInput === '2' || catInput.toLowerCase().includes('affiliate') || catInput.toLowerCase().includes('intern')) category = CONFIG.CATEGORIES.AFFILIATE;
  else if (catInput === '3' || catInput.toLowerCase().includes('ambassador')) category = CONFIG.CATEGORIES.AMBASSADOR;

  const handleResp = ui.prompt('Step 4/4: Social Handle', 'Enter handle or notes (e.g. @aditi_fin):', ui.ButtonSet.OK_CANCEL);
  const handle = handleResp.getSelectedButton() === ui.Button.OK ? handleResp.getResponseText().trim() : '';

  addAffiliateToRoster(code, name, category, handle, '', '');
  ui.alert(`🎉 Success! Added ${name} (${code}). Link: ${CONFIG.WEBSITE_BASE_URL}/?ref=${code}`);
}

function addAffiliateToRoster(code, name, category, handle, email, phone) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rosterSheet = getRosterSheet(ss);
  if (!rosterSheet) return;

  const subSheet = getSubmissionsSheet(ss);
  const subSheetName = subSheet.getName();

  const nextRow = rosterSheet.getLastRow() + 1;
  const webUrl = `${CONFIG.WEBSITE_BASE_URL}/?ref=${code}`;
  const waitlistUrl = `${CONFIG.WEBSITE_BASE_URL}/waitlist?ref=${code}`;
  const formUrl = `${CONFIG.GOOGLE_FORM_BASE_URL}?usp=pp_url&${CONFIG.GOOGLE_FORM_REF_ENTRY_ID}=${code}`;
  
  const validFormula = `=COUNTIFS('${subSheetName}'!E:E, A${nextRow}, '${subSheetName}'!H:H, "${CONFIG.STATUS.VALID}")`;
  const attemptsFormula = `=COUNTIF('${subSheetName}'!E:E, A${nextRow})`;
  const convFormula = `=IFERROR(K${nextRow}/L${nextRow}, 0)`;

  rosterSheet.getRange(nextRow, 1, 1, 13).setValues([[code, name, category || CONFIG.CATEGORIES.CREATOR, handle || '', email || '', phone || '', 'Active', webUrl, waitlistUrl, formUrl, validFormula, attemptsFormula, convFormula]]);
  rosterSheet.getRange(nextRow, 13).setNumberFormat('0.0%');
}

function onEdit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();
    const sheetName = sheet.getName();
    if (sheetName !== CONFIG.SHEET_NAMES.ROSTER) return;

    const row = range.getRow();
    const col = range.getColumn();

    if (col === 1 && row > 1) {
      const code = String(range.getValue()).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      range.setValue(code);

      if (code) {
        const ss = sheet.getParent();
        const subSheet = getSubmissionsSheet(ss);
        const subSheetName = subSheet.getName();

        const webUrl = `${CONFIG.WEBSITE_BASE_URL}/?ref=${code}`;
        const waitlistUrl = `${CONFIG.WEBSITE_BASE_URL}/waitlist?ref=${code}`;
        const formUrl = `${CONFIG.GOOGLE_FORM_BASE_URL}?usp=pp_url&${CONFIG.GOOGLE_FORM_REF_ENTRY_ID}=${code}`;
        
        if (!sheet.getRange(row, 7).getValue()) sheet.getRange(row, 7).setValue('Active');
        sheet.getRange(row, 8).setValue(webUrl);
        sheet.getRange(row, 9).setValue(waitlistUrl);
        sheet.getRange(row, 10).setValue(formUrl);
        sheet.getRange(row, 11).setFormula(`=COUNTIFS('${subSheetName}'!E:E, A${row}, '${subSheetName}'!H:H, "${CONFIG.STATUS.VALID}")`);
        sheet.getRange(row, 12).setFormula(`=COUNTIF('${subSheetName}'!E:E, A${row})`);
        sheet.getRange(row, 13).setFormula(`=IFERROR(K${row}/L${row}, 0)`);
        sheet.getRange(row, 13).setNumberFormat('0.0%');
      }
    }
  } catch (err) {}
}

function menuRefreshAllLinks() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rosterSheet = getRosterSheet(ss);
  const subSheet = getSubmissionsSheet(ss);
  if (!rosterSheet || rosterSheet.getLastRow() <= 1) return;

  const subSheetName = subSheet.getName();
  const data = rosterSheet.getRange(2, 1, rosterSheet.getLastRow() - 1, 1).getValues();

  for (let i = 0; i < data.length; i++) {
    const row = i + 2;
    const code = String(data[i][0]).trim().toUpperCase();
    if (code) {
      rosterSheet.getRange(row, 8).setValue(`${CONFIG.WEBSITE_BASE_URL}/?ref=${code}`);
      rosterSheet.getRange(row, 9).setValue(`${CONFIG.WEBSITE_BASE_URL}/waitlist?ref=${code}`);
      rosterSheet.getRange(row, 10).setValue(`${CONFIG.GOOGLE_FORM_BASE_URL}?usp=pp_url&${CONFIG.GOOGLE_FORM_REF_ENTRY_ID}=${code}`);
      rosterSheet.getRange(row, 11).setFormula(`=COUNTIFS('${subSheetName}'!E:E, A${row}, '${subSheetName}'!H:H, "${CONFIG.STATUS.VALID}")`);
      rosterSheet.getRange(row, 12).setFormula(`=COUNTIF('${subSheetName}'!E:E, A${row})`);
      rosterSheet.getRange(row, 13).setFormula(`=IFERROR(K${row}/L${row}, 0)`);
      rosterSheet.getRange(row, 13).setNumberFormat('0.0%');
    }
  }
  SpreadsheetApp.getUi().alert('✅ All referral and waitlist links refreshed successfully!');
}

/**
 * ==============================================================================
 * NON-DESTRUCTIVE UPGRADE ENGINE FOR EXISTING SATMIX SHEET
 * ==============================================================================
 * Run this function once on your existing Google Sheet:
 * 1. Preserves all 100+ existing rows in your current waitlist sheet.
 * 2. Adds headers E1:J1 (Referral Code, Attributed Person, Category, Status, Source, Notes).
 * 3. Sets existing past rows (Rows 2 to N) to "Organic" / "Legacy Signup".
 * 4. Adds Affiliate_Creator_Roster, Leaderboard_Dashboard, and Fraud_Audit_Log tabs.
 */
function upgradeExistingSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Identify Existing Responses Sheet (Sheet 1)
  let subSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SUBMISSIONS);
  if (!subSheet) {
    subSheet = ss.getSheets()[0];
    try {
      subSheet.setName(CONFIG.SHEET_NAMES.SUBMISSIONS);
    } catch (e) {}
  }

  const subSheetName = subSheet.getName();
  const lastRow = subSheet.getLastRow();

  // Set standard headers in Row 1 without touching data in Rows 2+
  const subHeaders = [
    'Timestamp',
    'Full Name',
    'Email Address',
    'Phone Number',
    'Referral Code',
    'Attributed Person',
    'Category',
    'Status',
    'Source / Device',
    'Notes'
  ];
  subSheet.getRange(1, 1, 1, subHeaders.length).setValues([subHeaders]);
  formatHeaderRow(subSheet, subHeaders.length, '#0F1018', '#FFFFFF');
  subSheet.setFrozenRows(1);
  subSheet.setColumnWidth(1, 170); subSheet.setColumnWidth(2, 160); subSheet.setColumnWidth(3, 220); subSheet.setColumnWidth(4, 140); subSheet.setColumnWidth(5, 120); subSheet.setColumnWidth(6, 170); subSheet.setColumnWidth(7, 150); subSheet.setColumnWidth(8, 110); subSheet.setColumnWidth(9, 150); subSheet.setColumnWidth(10, 200);

  // Backfill existing past rows (Rows 2 to lastRow) with Organic/Legacy status if blank
  if (lastRow > 1) {
    const existingCols = subSheet.getRange(2, 5, lastRow - 1, 6).getValues();
    let updated = false;
    for (let r = 0; r < existingCols.length; r++) {
      if (!existingCols[r][1]) { // If Attributed Person is empty
        existingCols[r][0] = existingCols[r][0] || ''; // Ref Code
        existingCols[r][1] = 'Organic';                 // Attributed Person
        existingCols[r][2] = 'Organic';                 // Category
        existingCols[r][3] = CONFIG.STATUS.ORGANIC;     // Status
        existingCols[r][4] = existingCols[r][4] || 'Legacy Waitlist'; // Source
        existingCols[r][5] = 'Existing Signup prior to Referral Engine'; // Notes
        updated = true;
      }
    }
    if (updated) {
      subSheet.getRange(2, 5, lastRow - 1, 6).setValues(existingCols);
    }
  }

  // 2. Affiliate_Creator_Roster Tab
  let rosterSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.ROSTER);
  if (!rosterSheet) {
    rosterSheet = ss.insertSheet(CONFIG.SHEET_NAMES.ROSTER);
  }
  rosterSheet.clear();
  const rosterHeaders = ['Referral Code', 'Full Name', 'Category / Role', 'Platform / Handle', 'Email Address', 'Phone / WhatsApp', 'Active Status', 'Primary Website Link', 'Direct Waitlist Link', 'Google Form Link', 'Total Valid Signups', 'Total Attempts', 'Conversion %'];
  rosterSheet.getRange(1, 1, 1, rosterHeaders.length).setValues([rosterHeaders]);
  formatHeaderRow(rosterSheet, rosterHeaders.length, '#5D17EB', '#FFFFFF');
  rosterSheet.setFrozenRows(1);

  // Founding Team Seed
  const initialAffiliates = [
    ['VEER', 'Veer Khanna', CONFIG.CATEGORIES.FOUNDER, '@veerkhanna', 'veer@satmix.in', '+91 99999 00001', 'Active'],
    ['SHEIDEN', 'Sheiden Borges', CONFIG.CATEGORIES.FOUNDER, '@sheiden', 'sheiden@satmix.in', '+91 99999 00002', 'Active'],
    ['SHASHANK', 'Shashank Jajodia', CONFIG.CATEGORIES.FOUNDER, '@shashank', 'shashank@satmix.in', '+91 99999 00003', 'Active']
  ];

  for (let i = 0; i < initialAffiliates.length; i++) {
    const rowIdx = i + 2;
    const item = initialAffiliates[i];
    const code = item[0];
    const webUrl = `${CONFIG.WEBSITE_BASE_URL}/?ref=${code}`;
    const waitlistUrl = `${CONFIG.WEBSITE_BASE_URL}/waitlist?ref=${code}`;
    const formUrl = `${CONFIG.GOOGLE_FORM_BASE_URL}?usp=pp_url&${CONFIG.GOOGLE_FORM_REF_ENTRY_ID}=${code}`;
    const validCountFormula = `=COUNTIFS('${subSheetName}'!E:E, A${rowIdx}, '${subSheetName}'!H:H, "${CONFIG.STATUS.VALID}")`;
    const attemptsFormula = `=COUNTIF('${subSheetName}'!E:E, A${rowIdx})`;
    const convFormula = `=IFERROR(K${rowIdx}/L${rowIdx}, 0)`;

    rosterSheet.getRange(rowIdx, 1, 1, 13).setValues([[item[0], item[1], item[2], item[3], item[4], item[5], item[6], webUrl, waitlistUrl, formUrl, validCountFormula, attemptsFormula, convFormula]]);
    rosterSheet.getRange(rowIdx, 13).setNumberFormat('0.0%');
  }

  rosterSheet.setColumnWidth(1, 130); rosterSheet.setColumnWidth(2, 160); rosterSheet.setColumnWidth(3, 170); rosterSheet.setColumnWidth(4, 160); rosterSheet.setColumnWidth(5, 200); rosterSheet.setColumnWidth(6, 140); rosterSheet.setColumnWidth(7, 100); rosterSheet.setColumnWidth(8, 230); rosterSheet.setColumnWidth(9, 230); rosterSheet.setColumnWidth(10, 220); rosterSheet.setColumnWidth(11, 140); rosterSheet.setColumnWidth(12, 130); rosterSheet.setColumnWidth(13, 120);

  // 3. Leaderboard_Dashboard Tab
  let dashSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LEADERBOARD);
  if (!dashSheet) {
    dashSheet = ss.insertSheet(CONFIG.SHEET_NAMES.LEADERBOARD);
  }
  dashSheet.clear();
  dashSheet.getRange('A1:G1').merge();
  dashSheet.getRange('A1').setValue('🚀 SATMIX AFFILIATE & CREATOR ATTRIBUTION DASHBOARD').setBackground('#0F1018').setFontColor('#00F5A0').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center');
  dashSheet.setRowHeight(1, 40);

  dashSheet.getRange('A3').setValue('Total Submissions'); dashSheet.getRange('A4').setValue(`=COUNTA('${subSheetName}'!A2:A)`); styleKpiCard(dashSheet, 'A3', 'A4', '#13151F', '#FFFFFF');
  dashSheet.getRange('B3').setValue('Valid Referrals'); dashSheet.getRange('B4').setValue(`=COUNTIF('${subSheetName}'!H2:H, "${CONFIG.STATUS.VALID}")`); styleKpiCard(dashSheet, 'B3', 'B4', '#13151F', '#00F5A0');
  dashSheet.getRange('C3').setValue('Organic Signups'); dashSheet.getRange('C4').setValue(`=COUNTIF('${subSheetName}'!H2:H, "${CONFIG.STATUS.ORGANIC}")`); styleKpiCard(dashSheet, 'C3', 'C4', '#13151F', '#6EE7FF');
  dashSheet.getRange('D3').setValue('Duplicates Flagged'); dashSheet.getRange('D4').setValue(`=COUNTIF('${subSheetName}'!H2:H, "${CONFIG.STATUS.DUPLICATE}")`); styleKpiCard(dashSheet, 'D3', 'D4', '#13151F', '#FF6B6B');
  dashSheet.getRange('E3').setValue('Top Performer'); dashSheet.getRange('E4').setValue(`=IFERROR(INDEX(B8:B, 1), "N/A")`); styleKpiCard(dashSheet, 'E3', 'E4', '#5D17EB', '#FFFFFF');
  dashSheet.getRange('F3').setValue('Active Affiliates'); dashSheet.getRange('F4').setValue(`=COUNTIF('${CONFIG.SHEET_NAMES.ROSTER}'!G2:G, "Active")`); styleKpiCard(dashSheet, 'F3', 'F4', '#13151F', '#FFD166');
  dashSheet.getRange('G3').setValue('Total Creators'); dashSheet.getRange('G4').setValue(`=COUNTIFS('${CONFIG.SHEET_NAMES.ROSTER}'!C2:C, "*Creator*", '${CONFIG.SHEET_NAMES.ROSTER}'!G2:G, "Active")`); styleKpiCard(dashSheet, 'G3', 'G4', '#13151F', '#A78BFA');

  const leaderHeaders = ['Rank', 'Name', 'Code', 'Category', 'Valid Referrals', 'Total Clicks', 'Conversion %'];
  dashSheet.getRange(7, 1, 1, leaderHeaders.length).setValues([leaderHeaders]);
  formatHeaderRow(dashSheet, leaderHeaders.length, '#181B27', '#FFFFFF', 7);

  dashSheet.getRange('A8').setFormula(`=IF(COUNTA(B8:B)=0, "", SEQUENCE(COUNTA(B8:B)))`);
  dashSheet.getRange('B8').setFormula(`=IFERROR(SORT('${CONFIG.SHEET_NAMES.ROSTER}'!B2:B, '${CONFIG.SHEET_NAMES.ROSTER}'!K2:K, FALSE), "")`);
  dashSheet.getRange('C8').setFormula(`=IFERROR(ARRAYFORMULA(IF(B8:B="", "", VLOOKUP(B8:B, {'${CONFIG.SHEET_NAMES.ROSTER}'!B2:B, '${CONFIG.SHEET_NAMES.ROSTER}'!A2:A}, 2, FALSE))), "")`);
  dashSheet.getRange('D8').setFormula(`=IFERROR(ARRAYFORMULA(IF(B8:B="", "", VLOOKUP(B8:B, {'${CONFIG.SHEET_NAMES.ROSTER}'!B2:B, '${CONFIG.SHEET_NAMES.ROSTER}'!C2:C}, 2, FALSE))), "")`);
  dashSheet.getRange('E8').setFormula(`=IFERROR(ARRAYFORMULA(IF(C8:C="", "", COUNTIFS('${subSheetName}'!E:E, C8:C, '${subSheetName}'!H:H, "${CONFIG.STATUS.VALID}"))), "")`);
  dashSheet.getRange('F8').setFormula(`=IFERROR(ARRAYFORMULA(IF(C8:C="", "", COUNTIF('${subSheetName}'!E:E, C8:C))), "")`);
  dashSheet.getRange('G8').setFormula(`=IFERROR(ARRAYFORMULA(IF(F8:F="", "", IFERROR(E8:E/F8:F, 0))), "")`);
  dashSheet.getRange('G8:G50').setNumberFormat('0.0%');
  dashSheet.setColumnWidth(1, 70); dashSheet.setColumnWidth(2, 170); dashSheet.setColumnWidth(3, 120); dashSheet.setColumnWidth(4, 160); dashSheet.setColumnWidth(5, 150); dashSheet.setColumnWidth(6, 130); dashSheet.setColumnWidth(7, 130);

  // 4. Fraud_Audit_Log Tab
  let auditSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.AUDIT);
  if (!auditSheet) {
    auditSheet = ss.insertSheet(CONFIG.SHEET_NAMES.AUDIT);
  }
  auditSheet.clear();
  const auditHeaders = ['Flagged Timestamp', 'Submitted Name', 'Email', 'Phone', 'Referral Code', 'Attributed Person', 'Flag Reason'];
  auditSheet.getRange(1, 1, 1, auditHeaders.length).setValues([auditHeaders]);
  formatHeaderRow(auditSheet, auditHeaders.length, '#FF6B6B', '#FFFFFF');
  auditSheet.setFrozenRows(1);
  auditSheet.setColumnWidth(1, 170); auditSheet.setColumnWidth(2, 160); auditSheet.setColumnWidth(3, 220); auditSheet.setColumnWidth(4, 140); auditSheet.setColumnWidth(5, 130); auditSheet.setColumnWidth(6, 170); auditSheet.setColumnWidth(7, 280);

  ss.setActiveSheet(dashSheet);
  SpreadsheetApp.getUi().alert(`🎉 Existing Satmix Sheet upgraded successfully!\n\n• Preserved all ${lastRow - 1} existing waitlist signups.\n• Extended Columns E–J for referral tracking.\n• Added Affiliate Roster, Dashboard & Audit tabs.`);
}

function formatHeaderRow(sheet, numCols, bgColor, fontColor, rowNum = 1) {
  const range = sheet.getRange(rowNum, 1, 1, numCols);
  range.setBackground(bgColor).setFontColor(fontColor).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(rowNum, 36);
}

function styleKpiCard(sheet, labelCell, valueCell, bgColor, fontColor) {
  sheet.getRange(labelCell).setBackground(bgColor).setFontColor('#94A3B8').setFontSize(9).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange(valueCell).setBackground(bgColor).setFontColor(fontColor).setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center');
}
