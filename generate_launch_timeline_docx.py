import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    """Sets cell internal padding in dxa (1 pt = 20 dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_table_borders(table, color="D1D5DB"):
    """Applies subtle clean borders to a table."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_satmix_timeline_doc(filepath):
    doc = Document()
    
    # Page Setup: Standard A4 / Letter, 0.8 inch margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
        
    # Styles Definition
    NAVY = RGBColor(30, 27, 75)       # #1E1B4B
    PURPLE = RGBColor(67, 56, 202)    # #4338CA
    CHARCOAL = RGBColor(31, 41, 55)   # #1F2937
    GRAY = RGBColor(107, 114, 128)    # #6B7280
    DARK_RED = RGBColor(153, 27, 27)  # #991B1B
    WHITE = RGBColor(255, 255, 255)
    
    # Document Header
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(4)
    run_title = title_p.add_run("SATMIX MOBILE APP DEVELOPMENT & STORE LAUNCH")
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(22)
    run_title.font.bold = True
    run_title.font.color.rgb = NAVY

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(12)
    run_sub = sub_p.add_run("Conservative Production Engineering Roadmap, Delay Vectors & Multi-Store Release Blueprint")
    run_sub.font.name = "Calibri"
    run_sub.font.size = Pt(11.5)
    run_sub.font.color.rgb = PURPLE
    run_sub.font.bold = True

    # Metadata Box Table
    meta_table = doc.add_table(rows=2, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    meta_data = [
        [("Target Product:", "Satmix Mobile App v1.0 (iOS & Android / React Native Expo EAS)"),
         ("Conservative Horizon:", "14 Weeks (3.5 Months) — Includes External Banking, VAPT & Store Buffers")],
        [("Prepared By:", "Veer Khanna (Co-Founder & CTO)"),
         ("Executive Review:", "Shashank Jajodia (CFO), Sheiden Borges (CEO)")]
    ]
    
    for r_idx, row in enumerate(meta_table.rows):
        for c_idx, cell in enumerate(row.cells):
            cell.width = Inches(3.4)
            set_cell_background(cell, "EEF2FF")
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            label, val = meta_data[r_idx][c_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            r1 = p.add_run(f"{label} ")
            r1.font.name = "Calibri"
            r1.font.size = Pt(9.5)
            r1.font.bold = True
            r1.font.color.rgb = NAVY
            r2 = p.add_run(val)
            r2.font.name = "Calibri"
            r2.font.size = Pt(9.5)
            r2.font.color.rgb = CHARCOAL

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # SECTION 1: EXECUTIVE SUMMARY & TIMELINE COMPARISON
    # -------------------------------------------------------------
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(14)
    h1.paragraph_format.space_after = Pt(4)
    r_h1 = h1.add_run("1. Executive Summary & Timeline Estimation Logic")
    r_h1.font.name = "Calibri"
    r_h1.font.size = Pt(13)
    r_h1.font.bold = True
    r_h1.font.color.rgb = NAVY

    p_exec = doc.add_paragraph()
    p_exec.paragraph_format.space_after = Pt(8)
    p_exec.paragraph_format.line_spacing = 1.15
    r = p_exec.add_run(
        "For a regulated Indian fintech platform handling automated daily recurring UPI e-mandates, DigiLocker e-KYC, and non-custodial crypto basket accumulation, "
        "software engineering accounts for only ~55% of the total go-to-market timeline. The remaining 45% is governed by external banking approvals, CERT-In VAPT security remediation, "
        "and Apple/Google regulatory store reviews. To protect financial runway and avoid premature launch commitments, this document establishes a conservative 14-week baseline (~3.5 months)."
    )
    r.font.name = "Calibri"
    r.font.size = Pt(10)
    r.font.color.rgb = CHARCOAL

    # Velocity vs Conservative Table (7 rows x 3 cols)
    t_comp = doc.add_table(rows=7, cols=3)
    t_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_comp)
    
    headers_comp = ["Timeline Phase / Milestone", "Aggressive Velocity", "Conservative Baseline (With Buffers)"]
    for c_idx, text in enumerate(headers_comp):
        cell = t_comp.cell(0, c_idx)
        set_cell_background(cell, "1E1B4B")
        set_cell_margins(cell, top=90, bottom=90, left=100, right=100)
        p = cell.paragraphs[0]
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = WHITE
        
    comp_rows = [
        ("Phase 1: Architecture, Design Tokens & Biometric Auth", "Weeks 1 – 2 (10 Days)", "Weeks 1 – 2 (14 Days)"),
        ("Phase 2: Dashboard, Dynamic Baskets & Compounding Simulator", "Weeks 3 – 4 (12 Days)", "Weeks 3 – 4 (14 Days)"),
        ("Phase 3: Fintech Rails, UPI Autopay & DigiLocker e-KYC", "Weeks 5 – 6 (12 Days)", "Weeks 5 – 7 (21 Days) [+1 Wk Bank UAT Buffer]"),
        ("Phase 4: Gamification, Retention & CERT-In VAPT Audit", "Weeks 7 – 8 (12 Days)", "Weeks 8 – 10 (21 Days) [+1.5 Wk Audit & Fixes]"),
        ("Phase 5: Google 14-Day Closed Testing & Apple TestFlight", "Week 9 (7 Days)", "Weeks 11 – 12 (14 Days) [Strict 14-Day Rule]"),
        ("Phase 6: Store Submissions, Guideline 3.1.5 & Public Go-Live", "Week 10 (7 Days)", "Weeks 13 – 14 (14 Days) [+1 Wk Apple Query Buffer]")
    ]
    
    col_widths = [Inches(3.1), Inches(1.8), Inches(2.3)]
    for r_idx, row_data in enumerate(comp_rows, 1):
        bg = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = t_comp.cell(r_idx, c_idx)
            cell.width = col_widths[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            r.font.color.rgb = CHARCOAL
            if c_idx == 0:
                r.font.bold = True

    # -------------------------------------------------------------
    # SECTION 2: DETAILED PHASE-BY-PHASE SPRINT BREAKDOWN
    # -------------------------------------------------------------
    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(16)
    h2.paragraph_format.space_after = Pt(4)
    r_h2 = h2.add_run("2. Detailed Phase-by-Phase Engineering Sprints")
    r_h2.font.name = "Calibri"
    r_h2.font.size = Pt(13)
    r_h2.font.bold = True
    r_h2.font.color.rgb = NAVY

    phases = [
        {
            "num": "PHASE 1",
            "title": "Mobile Foundation, Design Tokens & Biometric Auth Shell",
            "duration": "Weeks 1 – 2 (Days 1 – 14)",
            "goal": "Build a production-hardened React Native Expo EAS application shell with biometric authentication and dynamic risk assessment onboarding.",
            "deliverables": [
                "Expo EAS Configuration: Managed workflow with custom native config plugins for biometric authentication, secure hardware storage, and push notifications.",
                "Design Token Architecture: Native implementation of Satmix Dark (#08090F) and Light (#F4F6FB) color systems, typography scale, and 4pt layout grids.",
                "Authentication Engine: Indian 10-digit mobile input with MSG91 SMS OTP verification and automated OTP autofill.",
                "Security PIN & Biometrics: Custom 4-digit PIN lockpad with haptic feedback hooks (expo-haptics) and FaceID / TouchID / Fingerprint unlock (expo-local-authentication).",
                "Dynamic Risk Assessment Quiz: 4-question risk profiling engine scoring users into 'Safe & Stable' (Low Risk) or 'Growth Strategy' (High Risk) portfolios in under 30 seconds."
            ],
            "exit": "Executable iOS & Android builds running smoothly on physical devices with complete onboarding, PIN authentication, and session persistence."
        },
        {
            "num": "PHASE 2",
            "title": "Core Investor Dashboard, Dynamic Baskets & Compounding Simulator",
            "duration": "Weeks 3 – 4 (Days 15 – 28)",
            "goal": "Deliver all primary investor views, interactive charts, and dynamic financial calculations calibrated to CFO-approved basket allocations.",
            "deliverables": [
                "Live Portfolio Screen: High-performance portfolio balance display, P&L badge (+₹X / +Y%), active strategy card, and time-filter tabs (1W, 1M, 3M, 1Y, ALL).",
                "60 FPS Native Charting: Canvas/SVG vector charts built with react-native-svg & Skia for smooth gesture scrubbing and dual trajectory comparisons.",
                "Baskets & Strategy Engine: Dynamic allocation visualization for Low Risk (60% BTC, 30% ETH, 10% USDC) and High Risk (35% SOL, 25% AVAX, 25% DeFi, 15% BTC).",
                "Interactive Micro-Savings Slider: Custom gesture-based slider (₹10 to ₹500/day) with instant daily, monthly, and multi-year compounding projections (1Y, 3Y, 5Y).",
                "Live Crypto Price Feed: Resilient CoinGecko Pro API integration with background caching, offline data fallbacks, and live price tickers."
            ],
            "exit": "All core financial simulation and browsing screens fully interactive, styled to pixel-perfection, and synchronized with mathematical models."
        },
        {
            "num": "PHASE 3",
            "title": "Fintech Rails: UPI Autopay e-Mandates, DigiLocker e-KYC & Bank Rails",
            "duration": "Weeks 5 – 7 (Days 29 – 49) [Includes 1-Week Gateway UAT Buffer]",
            "goal": "Integrate production payment SDKs, automate daily UPI debit mandates, and complete user identity verification infrastructure.",
            "deliverables": [
                "DigiLocker & Aadhaar e-KYC: Seamless SDK integration (Hyperverge/IDfy) for Aadhaar XML verification, PAN real-time validation, and anti-fraud liveness match.",
                "UPI Autopay & E-Mandate Engine: Production integration with Cashfree/Razorpay AutoPay SDK with deep-linking across GPay, PhonePe, Paytm, BHIM, and Cred.",
                "Daily Execution & Retry Daemon: Backend webhook listeners for mandate success/failure and automated smart retries for failed recurring debits.",
                "Mandate Management UI: User controls to pause daily investments, change daily deposit amounts, or switch active portfolio strategies.",
                "Bank Account Linking & Payouts: Penny-drop bank verification for instant IMPS/NEFT fiat withdrawal processing."
            ],
            "exit": "End-to-end sandbox and live UAT testing of real ₹10 UPI Autopay mandate registrations and successful KYC document verification."
        },
        {
            "num": "PHASE 4",
            "title": "Gamification, Profile, Settings & CERT-In VAPT Security Clearance",
            "duration": "Weeks 8 – 10 (Days 50 – 70) [Includes 2-Week VAPT Remediation Buffer]",
            "goal": "Complete user retention loops, tax reporting, and undergo third-party security audits required for fintech and FIU compliance.",
            "deliverables": [
                "Streak & Gamification Engine: Daily savings habit counter (Gold Zap), XP tier progression (Lv.1 to Lv.4 Accumulator), and celebration confetti bursts.",
                "Tax & Statement Reporting: Generation and export of official FY P&L tax statements in formatted PDF and CSV formats.",
                "Push Notifications & Reminders: Firebase Cloud Messaging (FCM) integration for daily deposit confirmations, streak alerts, and market updates.",
                "CERT-In Certified VAPT Audit: Comprehensive Dynamic (DAST) and Static (SAST) application penetration testing on both iOS and Android release builds.",
                "Security Hardening & Remediation: Implement certificate pinning, API rate-limiting, encrypted token rotation, and SQL injection sanitization."
            ],
            "exit": "Official CERT-In VAPT Security Clearance Certificate issued; zero High or Critical vulnerabilities."
        },
        {
            "num": "PHASE 5",
            "title": "Google Play 14-Day Closed Testing & Apple TestFlight Community Beta",
            "duration": "Weeks 11 – 12 (Days 71 – 84)",
            "goal": "Fulfill Google Play Console's mandatory 20-tester 14-day testing requirement and conduct a closed external beta with 100 early adopters.",
            "deliverables": [
                "Google Play 14-Day Closed Cohort: Maintain 20+ active opted-in testers across Android 10 through Android 15 devices for 14 continuous days.",
                "Apple TestFlight External Beta: Distribute build to 100 community beta testers via TestFlight public link and gather crash telemetry via Sentry.",
                "Performance & Memory Optimization: Profiling app cold-start times (<1.8s target), memory leak fixes, and network error handling under low-bandwidth connections.",
                "Store Listing Assets & Metadata: Production 6.7\" and 6.5\" App Store screenshots, Google Play feature graphics (1024x500), localized descriptions, and FIU compliance URLs."
            ],
            "exit": "Completion of Google Play's 14-day closed testing prerequisite; zero unhandled crash reports across beta cohort."
        },
        {
            "num": "PHASE 6",
            "title": "App Store & Google Play Review, Staging Cutover & Public Launch",
            "duration": "Weeks 13 – 14 (Days 85 – 98) [Includes 1-Week Review Query Buffer]",
            "goal": "Clear Apple Guideline 3.1.5 financial review, pass Google Play production checks, and execute public release.",
            "deliverables": [
                "Apple Financial Services Review: Submission under App Store Review Guideline 3.1.5 (Cryptocurrency / Fintech), providing FIU-IND registration documentation and test credentials.",
                "Google Play Production Track Approval: Final submission of signed production Android App Bundle (.aab) with Target SDK 35 compliance.",
                "Production Gateway Cutover: Switch all payment gateways, KYC APIs, and exchange liquidity rails from sandbox/UAT to live production credentials.",
                "Launch Day Monitoring: Real-time Datadog/Sentry error alerting, Cloudflare DDoS monitoring, and founder on-call support."
            ],
            "exit": "Satmix Mobile App approved and publicly downloadable on the Apple App Store and Google Play Store."
        }
    ]

    for p_data in phases:
        p_hdr = doc.add_paragraph()
        p_hdr.paragraph_format.space_before = Pt(10)
        p_hdr.paragraph_format.space_after = Pt(2)
        
        r_num = p_hdr.add_run(f"{p_data['num']}: {p_data['title']} ")
        r_num.font.name = "Calibri"
        r_num.font.size = Pt(11)
        r_num.font.bold = True
        r_num.font.color.rgb = PURPLE
        
        r_dur = p_hdr.add_run(f"({p_data['duration']})")
        r_dur.font.name = "Calibri"
        r_dur.font.size = Pt(9.5)
        r_dur.font.italic = True
        r_dur.font.color.rgb = GRAY
        
        p_goal = doc.add_paragraph()
        p_goal.paragraph_format.space_after = Pt(3)
        r_g = p_goal.add_run(f"Core Objective: {p_data['goal']}")
        r_g.font.name = "Calibri"
        r_g.font.size = Pt(9.5)
        r_g.font.italic = True
        r_g.font.color.rgb = CHARCOAL

        for item in p_data['deliverables']:
            p_item = doc.add_paragraph(style='List Bullet')
            p_item.paragraph_format.space_after = Pt(2)
            p_item.paragraph_format.line_spacing = 1.15
            
            if ":" in item:
                title_part, rest = item.split(":", 1)
                r_bt = p_item.add_run(f"{title_part}:")
                r_bt.font.name = "Calibri"
                r_bt.font.size = Pt(9)
                r_bt.font.bold = True
                r_bt.font.color.rgb = NAVY
                
                r_rst = p_item.add_run(rest)
                r_rst.font.name = "Calibri"
                r_rst.font.size = Pt(9)
                r_rst.font.color.rgb = CHARCOAL
            else:
                r_txt = p_item.add_run(item)
                r_txt.font.name = "Calibri"
                r_txt.font.size = Pt(9)
                r_txt.font.color.rgb = CHARCOAL

        p_exit = doc.add_paragraph()
        p_exit.paragraph_format.space_before = Pt(2)
        p_exit.paragraph_format.space_after = Pt(6)
        r_e_lbl = p_exit.add_run("Exit Milestone: ")
        r_e_lbl.font.name = "Calibri"
        r_e_lbl.font.size = Pt(9)
        r_e_lbl.font.bold = True
        r_e_lbl.font.color.rgb = NAVY
        r_e_val = p_exit.add_run(p_data['exit'])
        r_e_val.font.name = "Calibri"
        r_e_val.font.size = Pt(9)
        r_e_val.font.color.rgb = CHARCOAL

    # -------------------------------------------------------------
    # SECTION 3: COMPREHENSIVE DELAY VECTORS & RISK ANALYSIS (NEW)
    # -------------------------------------------------------------
    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(16)
    h3.paragraph_format.space_after = Pt(4)
    r_h3 = h3.add_run("3. Exhaustive Delay Vectors, Potential Impact & Mitigation Protocols")
    r_h3.font.name = "Calibri"
    r_h3.font.size = Pt(13)
    r_h3.font.bold = True
    r_h3.font.color.rgb = NAVY

    p_delay_intro = doc.add_paragraph()
    p_delay_intro.paragraph_format.space_after = Pt(6)
    r_di = p_delay_intro.add_run(
        "To provide institutional rigor for the CFO and executive team, the following matrix identifies the 6 specific friction points "
        "that could introduce latency, the potential time slip if unmanaged, and the concrete technical/operational mitigation protocols Satmix has established."
    )
    r_di.font.name = "Calibri"
    r_di.font.size = Pt(10)
    r_di.font.color.rgb = CHARCOAL

    # Detailed Delays Table (7 rows x 5 cols)
    t_delays = doc.add_table(rows=7, cols=5)
    t_delays.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_delays)
    
    headers_delays = ["Delay Vector", "Root Cause / Trigger", "Potential Delay Impact", "Probability", "CTO Mitigation Protocol"]
    for c_idx, text in enumerate(headers_delays):
        cell = t_delays.cell(0, c_idx)
        set_cell_background(cell, "1E1B4B")
        set_cell_margins(cell, top=90, bottom=90, left=80, right=80)
        p = cell.paragraphs[0]
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = WHITE

    delay_rows = [
        ("1. UPI Autopay / Bank Underwriting Delay", 
         "Payment aggregator risk teams require extended compliance reviews for digital asset merchant category codes (MCCs).",
         "+1 to +3 Weeks", 
         "Medium", 
         "Dual-Gateway Strategy: Initiate parallel merchant applications with Cashfree, Decentro, and Razorpay in Week 2 rather than relying on a single provider."),
        
        ("2. Apple Guideline 3.1.5 Crypto Queries", 
         "Apple Review Team issues temporary rejection demanding legal opinion letters, FIU proof, or non-custodial custody clarification.",
         "+1 to +2 Weeks", 
         "High (First Review)", 
         "Pre-Packaged Compliance Kit: Upload FIU-IND certificate, video walkthrough of mandate creation, and demo credentials with test funds in initial review submission."),
        
        ("3. CERT-In VAPT Audit Remediation Loop", 
         "Third-party penetration testing flags medium/high severity vulnerabilities in third-party npm packages, requiring code fixes & re-audit.",
         "+1 to +2 Weeks", 
         "Medium-High", 
         "Pre-Audit SAST Scans: Run automated Snyk and SonarQube static scans in Sprint 4 to eliminate vulnerabilities before submitting to external auditor."),
        
        ("4. Google Play 14-Day Tester Inactivity", 
         "If opted-in testers fail to open the app or drop below 20 active devices, Google Play algorithms reset the mandatory 14-day countdown.",
         "+1 to +2 Weeks", 
         "Low-Medium", 
         "75% Tester Buffer: Seed a dedicated cohort of 35+ verified testers (vs. 20 minimum) from Satmix WhatsApp community with daily push check-ins."),
        
        ("5. Apple Org & D-U-N-S Verification", 
         "Dun & Bradstreet legal entity mismatch or delay in Apple Developer Organization account approval.",
         "+1 to +2 Weeks", 
         "Low (If Done Early)", 
         "Immediate Week 1 Execution: Complete D-U-N-S matching and Apple Developer Organization verification immediately before writing Phase 1 code."),
        
        ("6. Native SDK / Expo OS Compatibility", 
         "New iOS/Android OS patch introduces breaking changes in native camera/biometric/payment intent modules.",
         "+3 to +5 Days", 
         "Low", 
         "Expo Config Plugins & Isolated Test Harness: Isolate third-party native SDKs behind TypeScript abstraction layers to swap modules without core refactoring.")
    ]

    col_w_del = [Inches(1.5), Inches(1.8), Inches(1.1), Inches(0.9), Inches(1.9)]
    for r_idx, row_data in enumerate(delay_rows, 1):
        bg = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = t_delays.cell(r_idx, c_idx)
            cell.width = col_w_del[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = CHARCOAL
            if c_idx == 0:
                r.font.bold = True
            if c_idx == 2:
                r.font.bold = True
                r.font.color.rgb = DARK_RED

    # -------------------------------------------------------------
    # SECTION 4: SCENARIO ANALYSIS & RUNWAY IMPLICATIONS
    # -------------------------------------------------------------
    h4 = doc.add_paragraph()
    h4.paragraph_format.space_before = Pt(16)
    h4.paragraph_format.space_after = Pt(4)
    r_h4 = h4.add_run("4. Scenario Analysis: Best-Case vs. Conservative vs. Delayed")
    r_h4.font.name = "Calibri"
    r_h4.font.size = Pt(13)
    r_h4.font.bold = True
    r_h4.font.color.rgb = NAVY

    p_scen = doc.add_paragraph()
    p_scen.paragraph_format.space_after = Pt(6)
    r_sc = p_scen.add_run(
        "To ensure complete alignment between engineering execution and CFO cash flow forecasting, the following table models the three release scenarios:"
    )
    r_sc.font.name = "Calibri"
    r_sc.font.size = Pt(10)
    r_sc.font.color.rgb = CHARCOAL

    t_scen = doc.add_table(rows=4, cols=4)
    t_scen.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_scen)
    
    headers_scen = ["Release Scenario", "Total Duration", "Primary Assumptions", "CFO Runway Requirement"]
    for c_idx, text in enumerate(headers_scen):
        cell = t_scen.cell(0, c_idx)
        set_cell_background(cell, "1E1B4B")
        set_cell_margins(cell, top=90, bottom=90, left=90, right=90)
        p = cell.paragraphs[0]
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = WHITE

    scen_data = [
        ("Best-Case Velocity", 
         "10 Weeks (2.5 Months)", 
         "Instant UPI gateway approval, zero VAPT remediation re-tests, single-attempt Apple/Google store approvals.", 
         "₹18.50 Lakhs (Lean Launch)"),
        
        ("Conservative Baseline (Recommended)", 
         "14 Weeks (3.5 Months)", 
         "Includes 1-week bank UAT buffer, 2-week VAPT audit & fix cycle, full 14-day Google Play cohort, and 1 Apple query cycle.", 
         "₹23.87 Lakhs (Phase 1 Baseline Budget)"),
        
        ("Worst-Case Delayed Horizon", 
         "17 – 18 Weeks (4.5 Months)", 
         "Dual gateway underwriting delay (+3 wks) combined with Apple Guideline 3.1.5 secondary appeal cycle (+1 wk).", 
         "₹31.50 Lakhs (Covered by 10% Contingency + M5 Hiring Deferral)")
    ]

    col_w_scen = [Inches(1.8), Inches(1.5), Inches(2.4), Inches(1.5)]
    for r_idx, row_data in enumerate(scen_data, 1):
        bg = "F9FAFB" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = t_scen.cell(r_idx, c_idx)
            cell.width = col_w_scen[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
            p = cell.paragraphs[0]
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = CHARCOAL
            if c_idx == 0:
                r.font.bold = True
            if c_idx == 1 and r_idx == 2:
                r.font.bold = True
                r.font.color.rgb = PURPLE

    # -------------------------------------------------------------
    # SECTION 5: DEFINITION OF DONE & LAUNCH GATE CHECKLIST
    # -------------------------------------------------------------
    h5 = doc.add_paragraph()
    h5.paragraph_format.space_before = Pt(16)
    h5.paragraph_format.space_after = Pt(4)
    r_h5 = h5.add_run("5. Technical Definition of Done & Launch Gate Checklist")
    r_h5.font.name = "Calibri"
    r_h5.font.size = Pt(13)
    r_h5.font.bold = True
    r_h5.font.color.rgb = NAVY

    checklist_items = [
        "Visual & Interaction Polish: Flawless typography hierarchy, zero visual clipping on dynamic island/notch screens, and 60fps smooth charting gestures.",
        "Penny-Accurate Compounding Math: Exact synchronization between CFO's dynamic asset allocation models and mobile compounding projection curves.",
        "End-to-End UPI Autopay Reliability: 100% success rate on test e-mandate registration, pause, resume, and automated debit execution.",
        "Verified e-KYC Compliance: Aadhaar XML and PAN real-time verification working with instant automated status updates.",
        "CERT-In Security Certification: Zero high/critical vulnerabilities on both Android APK/AAB and iOS IPA builds.",
        "Store Compliance Clearance: Full approval under Apple App Store Guideline 3.1.5 and Google Play Financial Services declarations."
    ]

    for item in checklist_items:
        p_c = doc.add_paragraph(style='List Bullet')
        p_c.paragraph_format.space_after = Pt(2)
        p_c.paragraph_format.line_spacing = 1.15
        title_c, rest_c = item.split(":", 1)
        r1 = p_c.add_run(f"{title_c}:")
        r1.font.name = "Calibri"
        r1.font.size = Pt(9)
        r1.font.bold = True
        r1.font.color.rgb = NAVY
        r2 = p_c.add_run(rest_c)
        r2.font.name = "Calibri"
        r2.font.size = Pt(9)
        r2.font.color.rgb = CHARCOAL

    doc.save(filepath)
    print(f"Successfully generated updated Word Document with Delay Vectors: {filepath}")

if __name__ == "__main__":
    out_docx = r"c:\Veer\Satmix\Website 4.0\Satmix_Mobile_App_Launch_Timeline_Conservative.docx"
    build_satmix_timeline_doc(out_docx)
