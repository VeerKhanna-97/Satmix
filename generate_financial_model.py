import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_satmix_financial_model(filepath):
    wb = openpyxl.Workbook()
    
    # Define Palette (Satmix Brand Aligned)
    NAVY_HEADER = PatternFill(start_color="1E1B4B", end_color="1E1B4B", fill_type="solid") # Deep Indigo/Navy
    PURPLE_HEADER = PatternFill(start_color="4338CA", end_color="4338CA", fill_type="solid") # Royal Indigo
    SUBHEADER_FILL = PatternFill(start_color="EEF2FF", end_color="EEF2FF", fill_type="solid") # Soft Ice Blue
    HIGHLIGHT_FILL = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # Light Amber for Assumptions
    TOTAL_FILL = PatternFill(start_color="E0E7FF", end_color="E0E7FF", fill_type="solid") # Indigo Tint
    ACCENT_GREEN = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid") # Light Green for savings/credits
    
    FONT_TITLE = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
    FONT_HEADER = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    FONT_SUBHEADER = Font(name="Calibri", size=11, bold=True, color="1E1B4B")
    FONT_BOLD = Font(name="Calibri", size=11, bold=True, color="000000")
    FONT_REGULAR = Font(name="Calibri", size=11, color="000000")
    FONT_MUTED = Font(name="Calibri", size=10, italic=True, color="4B5563")
    FONT_INPUT = Font(name="Calibri", size=11, color="1D4ED8") # Blue for inputs
    
    BORDER_THIN = Border(
        left=Side(style='thin', color='D1D5DB'),
        right=Side(style='thin', color='D1D5DB'),
        top=Side(style='thin', color='D1D5DB'),
        bottom=Side(style='thin', color='D1D5DB')
    )
    BORDER_DOUBLE_BOTTOM = Border(
        left=Side(style='thin', color='D1D5DB'),
        right=Side(style='thin', color='D1D5DB'),
        top=Side(style='thin', color='D1D5DB'),
        bottom=Side(style='double', color='1E1B4B')
    )
    
    ALIGN_LEFT = Alignment(horizontal="left", vertical="center")
    ALIGN_RIGHT = Alignment(horizontal="right", vertical="center")
    ALIGN_CENTER = Alignment(horizontal="center", vertical="center")
    
    NUM_FORMAT_INR = "₹ #,##0;[Red](₹ #,##0);\"-\""
    NUM_FORMAT_LAKH = "₹ 0.00 \"L\""
    NUM_FORMAT_PERCENT = "0.0%"
    NUM_FORMAT_INT = "#,##0"

    # -------------------------------------------------------------
    # SHEET 1: Executive Summary & 12M Cash Flow
    # -------------------------------------------------------------
    ws_sum = wb.active
    ws_sum.title = "Executive Summary"
    ws_sum.views.sheetView[0].showGridLines = True
    
    # Title Block
    ws_sum.merge_cells("A1:N1")
    ws_sum["A1"] = "SATMIX DIGITAL INFRASTRUCTURE & APP DEVELOPMENT BUDGET"
    ws_sum["A1"].font = FONT_TITLE
    ws_sum["A1"].fill = NAVY_HEADER
    ws_sum["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_sum.row_dimensions[1].height = 40
    
    ws_sum["A2"] = "Master 12-Month Financial Model & Cash Flow Projection | Prepared for CFO (Shashank Jajodia) by CTO (Veer Khanna)"
    ws_sum["A2"].font = FONT_MUTED
    ws_sum.row_dimensions[2].height = 20
    
    # Key Summary Cards
    cards = [
        ("Total 12-Month Outlay", "=N17", "All Capex + Opex + Buffer", "B4:C5"),
        ("Phase 1: Launch (M1-M4)", "=SUM(B17:E17)", "Lean MVP & VAPT 1", "E4:F5"),
        ("Phase 2: Scale (M5-M12)", "=SUM(F17:M17)", "Team Expansion & Scale", "H4:I5"),
        ("Peak Monthly Burn", "=MAX(B17:M17)", "Month 7 (VAPT 2 + Full Team)", "K4:L5")
    ]
    for title, formula, sub, cell_range in cards:
        start_col, start_row = cell_range.split(":")[0][0], int(cell_range.split(":")[0][1:])
        end_col, end_row = cell_range.split(":")[1][0], int(cell_range.split(":")[1][1:])
        ws_sum.merge_cells(cell_range)
        top_left = ws_sum[f"{start_col}{start_row}"]
        top_left.value = title
        top_left.font = Font(name="Calibri", size=9, bold=True, color="6B7280")
        top_left.alignment = Alignment(horizontal="center", vertical="top")
        top_left.fill = SUBHEADER_FILL
        
        val_cell = ws_sum.cell(row=start_row+1, column=ord(start_col)-ord('A')+1)
        # We'll set the value in the next row below or merged
    
    # Let's cleanly layout Summary Cards at rows 4 to 6
    summary_card_defs = [
        ("TOTAL 12M BUDGET", "=N18", "A4:C5", TOTAL_FILL),
        ("PHASE 1 RUNWAY (M1-M4)", "=SUM(B18:E18)", "D4:F5", SUBHEADER_FILL),
        ("PHASE 2 RUNWAY (M5-M12)", "=SUM(F18:M18)", "G4:I5", SUBHEADER_FILL),
        ("WITH CLOUD CREDITS (EST.)", "=N18-N20", "J4:L5", ACCENT_GREEN),
    ]
    for title, formula, crange, fill in summary_card_defs:
        r1, r2 = int(crange.split(":")[0][1:]), int(crange.split(":")[1][1:])
        c1, c2 = crange.split(":")[0][0], crange.split(":")[1][0]
        ws_sum.merge_cells(f"{c1}{r1}:{c2}{r1}")
        ws_sum.merge_cells(f"{c1}{r2}:{c2}{r2}")
        ws_sum[f"{c1}{r1}"] = title
        ws_sum[f"{c1}{r1}"].font = Font(name="Calibri", size=9, bold=True, color="4B5563")
        ws_sum[f"{c1}{r1}"].alignment = ALIGN_CENTER
        ws_sum[f"{c1}{r1}"].fill = fill
        
        ws_sum[f"{c1}{r2}"] = formula
        ws_sum[f"{c1}{r2}"].font = Font(name="Calibri", size=14, bold=True, color="1E1B4B")
        ws_sum[f"{c1}{r2}"].alignment = ALIGN_CENTER
        ws_sum[f"{c1}{r2}"].fill = fill
        ws_sum[f"{c1}{r2}"].number_format = NUM_FORMAT_INR

    # Master Table Headers (Row 8)
    headers_sum = ["Cost Category / Department", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12", "12-Month Total"]
    ws_sum.row_dimensions[8].height = 28
    for col_idx, text in enumerate(headers_sum, 1):
        cell = ws_sum.cell(row=8, column=col_idx, value=text)
        cell.font = FONT_HEADER
        cell.fill = PURPLE_HEADER
        cell.alignment = ALIGN_LEFT if col_idx == 1 else ALIGN_RIGHT
        cell.border = BORDER_THIN

    # Data Rows linking to other sheets
    sum_rows = [
        (9, "1. Human Capital & Engineering Team", "='Team Expansion'!B20", "='Team Expansion'!C20", "='Team Expansion'!D20", "='Team Expansion'!E20", "='Team Expansion'!F20", "='Team Expansion'!G20", "='Team Expansion'!H20", "='Team Expansion'!I20", "='Team Expansion'!J20", "='Team Expansion'!K20", "='Team Expansion'!L20", "='Team Expansion'!M20"),
        (10, "2. Cloud Infrastructure & DevOps", "='Cloud & Infra'!B12", "='Cloud & Infra'!C12", "='Cloud & Infra'!D12", "='Cloud & Infra'!E12", "='Cloud & Infra'!F12", "='Cloud & Infra'!G12", "='Cloud & Infra'!H12", "='Cloud & Infra'!I12", "='Cloud & Infra'!J12", "='Cloud & Infra'!K12", "='Cloud & Infra'!L12", "='Cloud & Infra'!M12"),
        (11, "3. Fintech APIs, KYC & Payment Rails", "='Fintech APIs & Rails'!B14", "='Fintech APIs & Rails'!C14", "='Fintech APIs & Rails'!D14", "='Fintech APIs & Rails'!E14", "='Fintech APIs & Rails'!F14", "='Fintech APIs & Rails'!G14", "='Fintech APIs & Rails'!H14", "='Fintech APIs & Rails'!I14", "='Fintech APIs & Rails'!J14", "='Fintech APIs & Rails'!K14", "='Fintech APIs & Rails'!L14", "='Fintech APIs & Rails'!M14"),
        (12, "4. Security Audits, VAPT & FIU Tooling", "='Security & Compliance'!B12", "='Security & Compliance'!C12", "='Security & Compliance'!D12", "='Security & Compliance'!E12", "='Security & Compliance'!F12", "='Security & Compliance'!G12", "='Security & Compliance'!H12", "='Security & Compliance'!I12", "='Security & Compliance'!J12", "='Security & Compliance'!K12", "='Security & Compliance'!L12", "='Security & Compliance'!M12"),
        (13, "5. Developer Accounts & Software Licences", "='Tooling & Licences'!B14", "='Tooling & Licences'!C14", "='Tooling & Licences'!D14", "='Tooling & Licences'!E14", "='Tooling & Licences'!F14", "='Tooling & Licences'!G14", "='Tooling & Licences'!H14", "='Tooling & Licences'!I14", "='Tooling & Licences'!J14", "='Tooling & Licences'!K14", "='Tooling & Licences'!L14", "='Tooling & Licences'!M14"),
    ]
    
    for r_idx, title, *formulas in sum_rows:
        ws_sum.row_dimensions[r_idx].height = 22
        cell_a = ws_sum.cell(row=r_idx, column=1, value=title)
        cell_a.font = FONT_BOLD
        cell_a.border = BORDER_THIN
        cell_a.alignment = ALIGN_LEFT
        
        for c_offset, f_val in enumerate(formulas, 2):
            c_cell = ws_sum.cell(row=r_idx, column=c_offset, value=f_val)
            c_cell.font = FONT_REGULAR
            c_cell.number_format = NUM_FORMAT_INR
            c_cell.alignment = ALIGN_RIGHT
            c_cell.border = BORDER_THIN
            
        # Total Col
        tot_cell = ws_sum.cell(row=r_idx, column=14, value=f"=SUM(B{r_idx}:M{r_idx})")
        tot_cell.font = FONT_BOLD
        tot_cell.number_format = NUM_FORMAT_INR
        tot_cell.alignment = ALIGN_RIGHT
        tot_cell.border = BORDER_THIN
        tot_cell.fill = SUBHEADER_FILL

    # Subtotal Base
    ws_sum.row_dimensions[14].height = 24
    c = ws_sum.cell(row=14, column=1, value="Operational Subtotal (Base)")
    c.font = FONT_BOLD
    c.fill = SUBHEADER_FILL
    c.border = BORDER_THIN
    for c_idx in range(2, 14):
        col_letter = get_column_letter(c_idx)
        cell = ws_sum.cell(row=14, column=c_idx, value=f"=SUM({col_letter}9:{col_letter}13)")
        cell.font = FONT_BOLD
        cell.number_format = NUM_FORMAT_INR
        cell.alignment = ALIGN_RIGHT
        cell.border = BORDER_THIN
        cell.fill = SUBHEADER_FILL
    tot_sub = ws_sum.cell(row=14, column=14, value="=SUM(N9:N13)")
    tot_sub.font = FONT_BOLD
    tot_sub.number_format = NUM_FORMAT_INR
    tot_sub.alignment = ALIGN_RIGHT
    tot_sub.border = BORDER_THIN
    tot_sub.fill = SUBHEADER_FILL

    # Contingency Buffer Row
    ws_sum.row_dimensions[15].height = 22
    ws_sum.cell(row=15, column=1, value="6. Contingency & Scale Buffer (10%)").font = FONT_BOLD
    ws_sum.cell(row=15, column=1).border = BORDER_THIN
    for c_idx in range(2, 14):
        col_letter = get_column_letter(c_idx)
        cell = ws_sum.cell(row=15, column=c_idx, value=f"={col_letter}14*0.10")
        cell.font = FONT_MUTED
        cell.number_format = NUM_FORMAT_INR
        cell.alignment = ALIGN_RIGHT
        cell.border = BORDER_THIN
    tot_buff = ws_sum.cell(row=15, column=14, value="=SUM(B15:M15)")
    tot_buff.font = FONT_BOLD
    tot_buff.number_format = NUM_FORMAT_INR
    tot_buff.alignment = ALIGN_RIGHT
    tot_buff.border = BORDER_THIN
    tot_buff.fill = SUBHEADER_FILL

    # Gross Total Row
    ws_sum.row_dimensions[16].height = 26
    c_tot = ws_sum.cell(row=16, column=1, value="GROSS MONTHLY CASH BURN")
    c_tot.font = Font(name="Calibri", size=11, bold=True, color="1E1B4B")
    c_tot.fill = TOTAL_FILL
    c_tot.border = BORDER_THIN
    for c_idx in range(2, 14):
        col_letter = get_column_letter(c_idx)
        cell = ws_sum.cell(row=16, column=c_idx, value=f"={col_letter}14+{col_letter}15")
        cell.font = Font(name="Calibri", size=11, bold=True, color="1E1B4B")
        cell.number_format = NUM_FORMAT_INR
        cell.alignment = ALIGN_RIGHT
        cell.border = BORDER_THIN
        cell.fill = TOTAL_FILL
    master_tot = ws_sum.cell(row=16, column=14, value="=N14+N15")
    master_tot.font = Font(name="Calibri", size=12, bold=True, color="1E1B4B")
    master_tot.number_format = NUM_FORMAT_INR
    master_tot.alignment = ALIGN_RIGHT
    master_tot.border = BORDER_DOUBLE_BOTTOM
    master_tot.fill = TOTAL_FILL

    # Cumulative Cash Outlay Row
    ws_sum.row_dimensions[17].height = 22
    ws_sum.cell(row=17, column=1, value="Cumulative Cash Outlay").font = FONT_MUTED
    ws_sum.cell(row=17, column=1).border = BORDER_THIN
    ws_sum.cell(row=17, column=2, value="=B16").font = FONT_MUTED
    ws_sum.cell(row=17, column=2).number_format = NUM_FORMAT_INR
    ws_sum.cell(row=17, column=2).border = BORDER_THIN
    for c_idx in range(3, 14):
        col_curr = get_column_letter(c_idx)
        col_prev = get_column_letter(c_idx-1)
        cell = ws_sum.cell(row=17, column=c_idx, value=f"={col_prev}17+{col_curr}16")
        cell.font = FONT_MUTED
        cell.number_format = NUM_FORMAT_INR
        cell.alignment = ALIGN_RIGHT
        cell.border = BORDER_THIN
    ws_sum.cell(row=17, column=14, value="=N16").font = FONT_BOLD
    ws_sum.cell(row=17, column=14).number_format = NUM_FORMAT_INR
    ws_sum.cell(row=17, column=14).alignment = ALIGN_RIGHT
    ws_sum.cell(row=17, column=14).border = BORDER_THIN

    # Net Burn Row (Blank spacing and then Credits Offset)
    ws_sum.row_dimensions[19].height = 22
    ws_sum.cell(row=19, column=1, value="Less: AWS Activate / Cloud Startup Credits (Est.)").font = Font(name="Calibri", size=10, italic=True, color="047857")
    ws_sum.cell(row=19, column=1).border = BORDER_THIN
    ws_sum.cell(row=19, column=1).fill = ACCENT_GREEN
    # We offset months 1 to 8 cloud costs
    for c_idx in range(2, 14):
        col_letter = get_column_letter(c_idx)
        val = f"=IF({c_idx}<=9, 'Cloud & Infra'!{col_letter}12, 0)"
        cell = ws_sum.cell(row=19, column=c_idx, value=val)
        cell.font = Font(name="Calibri", size=10, color="047857")
        cell.number_format = NUM_FORMAT_INR
        cell.alignment = ALIGN_RIGHT
        cell.border = BORDER_THIN
        cell.fill = ACCENT_GREEN
    tot_credits = ws_sum.cell(row=19, column=14, value="=SUM(B19:M19)")
    tot_credits.font = Font(name="Calibri", size=10, bold=True, color="047857")
    tot_credits.number_format = NUM_FORMAT_INR
    tot_credits.alignment = ALIGN_RIGHT
    tot_credits.border = BORDER_THIN
    tot_credits.fill = ACCENT_GREEN

    # Net Outflow with Credits
    ws_sum.row_dimensions[20].height = 24
    ws_sum.cell(row=20, column=1, value="NET CASH BURN (AFTER CREDITS)").font = FONT_BOLD
    ws_sum.cell(row=20, column=1).border = BORDER_DOUBLE_BOTTOM
    ws_sum.cell(row=20, column=1).fill = TOTAL_FILL
    for c_idx in range(2, 14):
        col_letter = get_column_letter(c_idx)
        cell = ws_sum.cell(row=20, column=c_idx, value=f"={col_letter}16-{col_letter}19")
        cell.font = FONT_BOLD
        cell.number_format = NUM_FORMAT_INR
        cell.alignment = ALIGN_RIGHT
        cell.border = BORDER_DOUBLE_BOTTOM
        cell.fill = TOTAL_FILL
    net_tot = ws_sum.cell(row=20, column=14, value="=N16-N19")
    net_tot.font = Font(name="Calibri", size=12, bold=True, color="1E1B4B")
    net_tot.number_format = NUM_FORMAT_INR
    net_tot.alignment = ALIGN_RIGHT
    net_tot.border = BORDER_DOUBLE_BOTTOM
    net_tot.fill = TOTAL_FILL

    # -------------------------------------------------------------
    # SHEET 2: Team Expansion & Payroll Matrix
    # -------------------------------------------------------------
    ws_team = wb.create_sheet(title="Team Expansion")
    ws_team.views.sheetView[0].showGridLines = True
    
    ws_team.merge_cells("A1:R1")
    ws_team["A1"] = "HUMAN CAPITAL & ENGINEERING TEAM EXPANSION MATRIX"
    ws_team["A1"].font = FONT_TITLE
    ws_team["A1"].fill = NAVY_HEADER
    ws_team["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_team.row_dimensions[1].height = 36
    
    ws_team["A2"] = "Headcount Ramp, CTC Benchmarks (INR) & Month-by-Month Payroll Distribution"
    ws_team["A2"].font = FONT_MUTED
    
    headers_team = [
        "Engineering / Product Role", "Role Type", "Seniority", "Start Month", 
        "Monthly Base (₹)", "Annual CTC (₹ Lakhs)", 
        "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12", "12M Total"
    ]
    ws_team.row_dimensions[4].height = 28
    for col_idx, text in enumerate(headers_team, 1):
        cell = ws_team.cell(row=4, column=col_idx, value=text)
        cell.font = FONT_HEADER
        cell.fill = PURPLE_HEADER
        cell.alignment = ALIGN_LEFT if col_idx <= 3 else ALIGN_RIGHT
        cell.border = BORDER_THIN

    team_data = [
        # (Role, Type, Seniority, StartMo, MonthlyBase, CTC_Lakhs)
        ("Senior Full-Stack & React Native Lead", "FTE", "Senior (5+ Yrs)", 1, 120000, 14.40),
        ("Backend & Distributed Systems Engineer", "Contract -> FTE", "Senior (4+ Yrs)", 1, 60000, 7.20),
        ("UI/UX & Product Design Specialist", "Contractor", "Mid-Senior", 1, 40000, 4.80),
        ("QA Engineer & Automation Tester", "Contractor", "Mid (2+ Yrs)", 1, 25000, 3.00),
        ("Lead Mobile Native Engineer (iOS/Android)", "FTE (Expansion)", "Staff/Lead", 5, 130000, 15.60),
        ("Senior Backend & Infrastructure Engineer", "FTE (Expansion)", "Senior (4+ Yrs)", 5, 130000, 15.60),
        ("Full-time Product Designer (UI/UX)", "FTE (Expansion)", "Mid (3+ Yrs)", 5, 70000, 8.40),
        ("Cloud Security & DevOps Specialist", "Retainer", "Expert/Consultant", 5, 50000, 6.00),
        ("QA Automation Engineer (Full-time)", "FTE (Expansion)", "Mid (3+ Yrs)", 6, 60000, 7.20),
        ("Customer Tech Ops & Integration Associate", "FTE (Expansion)", "Junior-Mid", 6, 35000, 4.20),
    ]

    for idx, (role, rtype, seniority, start_mo, monthly_base, ctc) in enumerate(team_data, 5):
        ws_team.row_dimensions[idx].height = 20
        ws_team.cell(row=idx, column=1, value=role).font = FONT_REGULAR
        ws_team.cell(row=idx, column=2, value=rtype).font = FONT_REGULAR
        ws_team.cell(row=idx, column=3, value=seniority).font = FONT_REGULAR
        ws_team.cell(row=idx, column=4, value=f"M{start_mo}").font = FONT_REGULAR
        
        # Monthly base
        cell_base = ws_team.cell(row=idx, column=5, value=monthly_base)
        cell_base.font = FONT_INPUT
        cell_base.number_format = NUM_FORMAT_INR
        
        # Annual CTC Lakhs
        cell_ctc = ws_team.cell(row=idx, column=6, value=f"=E{idx}*12/100000")
        cell_ctc.font = FONT_REGULAR
        cell_ctc.number_format = "₹ 0.00 \"L\""

        for col_i in range(1, 7):
            ws_team.cell(row=idx, column=col_i).border = BORDER_THIN
            if col_i in [4, 5, 6]:
                ws_team.cell(row=idx, column=col_i).alignment = ALIGN_RIGHT

        # Months 1 to 12 formulas: =IF(month_num >= start_mo, base, 0)
        for m_idx in range(1, 13):
            col_target = 6 + m_idx
            cell_m = ws_team.cell(row=idx, column=col_target, value=f"=IF({m_idx}>={start_mo}, $E{idx}, 0)")
            cell_m.font = FONT_REGULAR
            cell_m.number_format = NUM_FORMAT_INR
            cell_m.alignment = ALIGN_RIGHT
            cell_m.border = BORDER_THIN

        # Row Total
        cell_tot = ws_team.cell(row=idx, column=19, value=f"=SUM(G{idx}:R{idx})")
        cell_tot.font = FONT_BOLD
        cell_tot.number_format = NUM_FORMAT_INR
        cell_tot.alignment = ALIGN_RIGHT
        cell_tot.border = BORDER_THIN
        cell_tot.fill = SUBHEADER_FILL

    # Headcount Summary Row
    ws_team.row_dimensions[16].height = 22
    ws_team.cell(row=16, column=1, value="Active Headcount (FTE + Retainers)").font = FONT_BOLD
    ws_team.cell(row=16, column=1).border = BORDER_THIN
    for col_i in range(2, 7):
        ws_team.cell(row=16, column=col_i).border = BORDER_THIN
    for m_idx in range(1, 13):
        col_letter = get_column_letter(6 + m_idx)
        cell_hc = ws_team.cell(row=16, column=6 + m_idx, value=f"=COUNTIF({col_letter}5:{col_letter}14, \">0\")")
        cell_hc.font = FONT_BOLD
        cell_hc.alignment = ALIGN_RIGHT
        cell_hc.border = BORDER_THIN
        cell_hc.fill = SUBHEADER_FILL
    ws_team.cell(row=16, column=19, value="=MAX(G16:R16)").font = FONT_BOLD
    ws_team.cell(row=16, column=19).alignment = ALIGN_RIGHT
    ws_team.cell(row=16, column=19).border = BORDER_THIN
    ws_team.cell(row=16, column=19).fill = SUBHEADER_FILL

    # Total Team Payroll Row
    ws_team.row_dimensions[20].height = 26
    c_tpay = ws_team.cell(row=20, column=1, value="TOTAL MONTHLY ENGINEERING & PRODUCT PAYROLL")
    c_tpay.font = FONT_BOLD
    c_tpay.fill = TOTAL_FILL
    c_tpay.border = BORDER_DOUBLE_BOTTOM
    for c_i in range(2, 7):
        ws_team.cell(row=20, column=c_i).border = BORDER_DOUBLE_BOTTOM
        ws_team.cell(row=20, column=c_i).fill = TOTAL_FILL
    for m_idx in range(1, 13):
        col_letter = get_column_letter(6 + m_idx)
        cell_tot_p = ws_team.cell(row=20, column=6 + m_idx, value=f"=SUM({col_letter}5:{col_letter}14)")
        cell_tot_p.font = FONT_BOLD
        cell_tot_p.number_format = NUM_FORMAT_INR
        cell_tot_p.alignment = ALIGN_RIGHT
        cell_tot_p.border = BORDER_DOUBLE_BOTTOM
        cell_tot_p.fill = TOTAL_FILL
    team_grand_tot = ws_team.cell(row=20, column=19, value="=SUM(S5:S14)")
    team_grand_tot.font = Font(name="Calibri", size=12, bold=True, color="1E1B4B")
    team_grand_tot.number_format = NUM_FORMAT_INR
    team_grand_tot.alignment = ALIGN_RIGHT
    team_grand_tot.border = BORDER_DOUBLE_BOTTOM
    team_grand_tot.fill = TOTAL_FILL

    # -------------------------------------------------------------
    # SHEET 3: Cloud & Infrastructure
    # -------------------------------------------------------------
    ws_cloud = wb.create_sheet(title="Cloud & Infra")
    ws_cloud.views.sheetView[0].showGridLines = True
    
    ws_cloud.merge_cells("A1:N1")
    ws_cloud["A1"] = "CLOUD INFRASTRUCTURE, DATABASE & HOSTING BUDGET"
    ws_cloud["A1"].font = FONT_TITLE
    ws_cloud["A1"].fill = NAVY_HEADER
    ws_cloud["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_cloud.row_dimensions[1].height = 36
    
    ws_cloud["A2"] = "AWS Architecture, Database Instances, Global Edge Hosting & Observability"
    ws_cloud["A2"].font = FONT_MUTED
    
    headers_cloud = ["Infrastructure Component", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12", "12M Total"]
    ws_cloud.row_dimensions[4].height = 28
    for col_idx, text in enumerate(headers_cloud, 1):
        cell = ws_cloud.cell(row=4, column=col_idx, value=text)
        cell.font = FONT_HEADER
        cell.fill = PURPLE_HEADER
        cell.alignment = ALIGN_LEFT if col_idx == 1 else ALIGN_RIGHT
        cell.border = BORDER_THIN

    cloud_items = [
        ("Application Edge Hosting & CDN (Vercel / AWS Amplify)", [3500, 3500, 4500, 5000, 8500, 10000, 12500, 12500, 14000, 15000, 15000, 15000]),
        ("Compute & Microservices (AWS ECS Fargate / EC2)", [12000, 12000, 15000, 18000, 25000, 30000, 35000, 35000, 38000, 40000, 42000, 45000]),
        ("Database & High Availability (Supabase / RDS Postgres + Redis)", [10000, 10000, 12000, 14000, 18000, 22000, 25000, 25000, 28000, 30000, 30000, 32000]),
        ("Storage & Encrypted KYC S3 Buckets (AWS S3 + CloudFront)", [2500, 2500, 3000, 3500, 4500, 5500, 6500, 6500, 7500, 8000, 8500, 9000]),
        ("Logging, APM & Observability (Datadog / Sentry / BetterStack)", [6500, 6500, 8000, 9500, 12000, 15000, 18000, 18000, 20000, 20000, 22000, 22000]),
        ("CI/CD Pipeline & Automated Build Runners", [2000, 2000, 2500, 2500, 3500, 4000, 4500, 4500, 5000, 5000, 5000, 5000]),
        ("Disaster Recovery & Redundant Backups", [1500, 1500, 2000, 2000, 2500, 3000, 3500, 3500, 4000, 4000, 4000, 4000])
    ]

    for idx, (comp, monthly_vals) in enumerate(cloud_items, 5):
        ws_cloud.row_dimensions[idx].height = 20
        ws_cloud.cell(row=idx, column=1, value=comp).font = FONT_REGULAR
        ws_cloud.cell(row=idx, column=1).border = BORDER_THIN
        
        for m_i, val in enumerate(monthly_vals, 2):
            cell_v = ws_cloud.cell(row=idx, column=m_i, value=val)
            cell_v.font = FONT_INPUT
            cell_v.number_format = NUM_FORMAT_INR
            cell_v.alignment = ALIGN_RIGHT
            cell_v.border = BORDER_THIN
            
        cell_t = ws_cloud.cell(row=idx, column=14, value=f"=SUM(B{idx}:M{idx})")
        cell_t.font = FONT_BOLD
        cell_t.number_format = NUM_FORMAT_INR
        cell_t.alignment = ALIGN_RIGHT
        cell_t.border = BORDER_THIN
        cell_t.fill = SUBHEADER_FILL

    # Total Cloud
    ws_cloud.row_dimensions[12].height = 26
    c_csum = ws_cloud.cell(row=12, column=1, value="TOTAL CLOUD INFRASTRUCTURE & HOSTING")
    c_csum.font = FONT_BOLD
    c_csum.fill = TOTAL_FILL
    c_csum.border = BORDER_DOUBLE_BOTTOM
    for c_i in range(2, 14):
        col_letter = get_column_letter(c_i)
        cell_c = ws_cloud.cell(row=12, column=c_i, value=f"=SUM({col_letter}5:{col_letter}11)")
        cell_c.font = FONT_BOLD
        cell_c.number_format = NUM_FORMAT_INR
        cell_c.alignment = ALIGN_RIGHT
        cell_c.border = BORDER_DOUBLE_BOTTOM
        cell_c.fill = TOTAL_FILL
    cloud_grand = ws_cloud.cell(row=12, column=14, value="=SUM(N5:N11)")
    cloud_grand.font = Font(name="Calibri", size=12, bold=True, color="1E1B4B")
    cloud_grand.number_format = NUM_FORMAT_INR
    cloud_grand.alignment = ALIGN_RIGHT
    cloud_grand.border = BORDER_DOUBLE_BOTTOM
    cloud_grand.fill = TOTAL_FILL

    # -------------------------------------------------------------
    # SHEET 4: Fintech APIs, KYC & Payment Rails
    # -------------------------------------------------------------
    ws_rails = wb.create_sheet(title="Fintech APIs & Rails")
    ws_rails.views.sheetView[0].showGridLines = True
    
    ws_rails.merge_cells("A1:N1")
    ws_rails["A1"] = "FINTECH RAILS, KYC VERIFICATION & PAYMENT GATEWAYS"
    ws_rails["A1"].font = FONT_TITLE
    ws_rails["A1"].fill = NAVY_HEADER
    ws_rails["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_rails.row_dimensions[1].height = 36
    
    ws_rails["A2"] = "UPI Autopay Mandates, Aadhaar/PAN KYC Checks, SMS/WhatsApp Gateways & Ticker Data"
    ws_rails["A2"].font = FONT_MUTED
    
    ws_rails.row_dimensions[4].height = 28
    for col_idx, text in enumerate(headers_cloud, 1):
        cell = ws_rails.cell(row=4, column=col_idx, value=text if col_idx > 1 else "Integration / Partner API")
        cell.font = FONT_HEADER
        cell.fill = PURPLE_HEADER
        cell.alignment = ALIGN_LEFT if col_idx == 1 else ALIGN_RIGHT
        cell.border = BORDER_THIN

    fintech_items = [
        ("Aadhaar e-KYC & DigiLocker Verification (Hyperverge/IDfy)", [8000, 10000, 12000, 15000, 22000, 28000, 35000, 40000, 45000, 48000, 50000, 52000]),
        ("PAN Verification & Fraud Screening API", [4000, 5000, 6000, 7500, 10000, 13000, 16000, 18000, 20000, 22000, 23000, 24000]),
        ("UPI Autopay & E-Mandate Processing (Cashfree/Razorpay)", [12000, 15000, 18000, 22000, 32000, 42000, 52000, 58000, 65000, 70000, 72000, 75000]),
        ("SMS & WhatsApp OTP Authentication (MSG91 / Gupshup)", [6000, 7000, 8500, 10000, 15000, 19000, 24000, 27000, 30000, 32000, 34000, 36000]),
        ("Live Crypto Market Data Feed (CoinGecko Pro API)", [11000, 11000, 11000, 11000, 15000, 15000, 15000, 18000, 18000, 18000, 18000, 18000]),
        ("Transactional Emails & Notification Webhooks (Resend/SES)", [2000, 2000, 2500, 2500, 3500, 4000, 4500, 5000, 5500, 6000, 6000, 6500]),
        ("Exchange Liquidity / Custody Partner Webhooks & Nodes", [5000, 5000, 6000, 7000, 10000, 12000, 15000, 18000, 20000, 22000, 24000, 25000]),
        ("Bank Payout & Withdrawal Rails (Instant IMPS/NEFT)", [3000, 4000, 5000, 6000, 9000, 12000, 15000, 17000, 19000, 20000, 21000, 22000])
    ]

    for idx, (comp, monthly_vals) in enumerate(fintech_items, 5):
        ws_rails.row_dimensions[idx].height = 20
        ws_rails.cell(row=idx, column=1, value=comp).font = FONT_REGULAR
        ws_rails.cell(row=idx, column=1).border = BORDER_THIN
        
        for m_i, val in enumerate(monthly_vals, 2):
            cell_v = ws_rails.cell(row=idx, column=m_i, value=val)
            cell_v.font = FONT_INPUT
            cell_v.number_format = NUM_FORMAT_INR
            cell_v.alignment = ALIGN_RIGHT
            cell_v.border = BORDER_THIN
            
        cell_t = ws_rails.cell(row=idx, column=14, value=f"=SUM(B{idx}:M{idx})")
        cell_t.font = FONT_BOLD
        cell_t.number_format = NUM_FORMAT_INR
        cell_t.alignment = ALIGN_RIGHT
        cell_t.border = BORDER_THIN
        cell_t.fill = SUBHEADER_FILL

    # Total Fintech Rails
    ws_rails.row_dimensions[14].height = 26
    c_rsum = ws_rails.cell(row=14, column=1, value="TOTAL FINTECH RAILS & INTEGRATION APIS")
    c_rsum.font = FONT_BOLD
    c_rsum.fill = TOTAL_FILL
    c_rsum.border = BORDER_DOUBLE_BOTTOM
    for c_i in range(2, 14):
        col_letter = get_column_letter(c_i)
        cell_r = ws_rails.cell(row=14, column=c_i, value=f"=SUM({col_letter}5:{col_letter}12)")
        cell_r.font = FONT_BOLD
        cell_r.number_format = NUM_FORMAT_INR
        cell_r.alignment = ALIGN_RIGHT
        cell_r.border = BORDER_DOUBLE_BOTTOM
        cell_r.fill = TOTAL_FILL
    rails_grand = ws_rails.cell(row=14, column=14, value="=SUM(N5:N12)")
    rails_grand.font = Font(name="Calibri", size=12, bold=True, color="1E1B4B")
    rails_grand.number_format = NUM_FORMAT_INR
    rails_grand.alignment = ALIGN_RIGHT
    rails_grand.border = BORDER_DOUBLE_BOTTOM
    rails_grand.fill = TOTAL_FILL

    # -------------------------------------------------------------
    # SHEET 5: Security Audits, VAPT & FIU Compliance
    # -------------------------------------------------------------
    ws_sec = wb.create_sheet(title="Security & Compliance")
    ws_sec.views.sheetView[0].showGridLines = True
    
    ws_sec.merge_cells("A1:N1")
    ws_sec["A1"] = "SECURITY AUDITS, VAPT & FIU-IND COMPLIANCE BUDGET"
    ws_sec["A1"].font = FONT_TITLE
    ws_sec["A1"].fill = NAVY_HEADER
    ws_sec["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_sec.row_dimensions[1].height = 36
    
    ws_sec["A2"] = "CERT-In Audits, Penetration Testing, AML Tooling, FIU Reporting & Legal Tech Retainers"
    ws_sec["A2"].font = FONT_MUTED
    
    ws_sec.row_dimensions[4].height = 28
    for col_idx, text in enumerate(headers_cloud, 1):
        cell = ws_sec.cell(row=4, column=col_idx, value=text if col_idx > 1 else "Security & Compliance Milestone")
        cell.font = FONT_HEADER
        cell.fill = PURPLE_HEADER
        cell.alignment = ALIGN_LEFT if col_idx == 1 else ALIGN_RIGHT
        cell.border = BORDER_THIN

    sec_items = [
        ("CERT-In Certified VAPT Audit (Pre-Launch & Bi-Annual)", [250000, 0, 0, 0, 0, 0, 150000, 0, 0, 0, 0, 0]),
        ("FIU-IND AML Screening & Sanction Check Software", [10000, 10000, 10000, 10000, 12000, 12000, 12000, 12000, 15000, 15000, 15000, 15000]),
        ("Smart Contract / Non-Custodial Vault Logic Audit", [50000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        ("Cloudflare Enterprise DDoS Protection & Wildcard SSL", [4500, 4500, 4500, 4500, 4500, 4500, 4500, 4500, 4500, 4500, 4500, 4500]),
        ("Legal Tech, ToS & FIU Disclosures Retainer", [40000, 0, 0, 15000, 0, 15000, 0, 15000, 0, 15000, 0, 15000]),
        ("Data Protection & ISO 27001 Readiness Prep", [0, 0, 10000, 10000, 15000, 15000, 15000, 15000, 20000, 20000, 20000, 20000])
    ]

    for idx, (comp, monthly_vals) in enumerate(sec_items, 5):
        ws_sec.row_dimensions[idx].height = 20
        ws_sec.cell(row=idx, column=1, value=comp).font = FONT_REGULAR
        ws_sec.cell(row=idx, column=1).border = BORDER_THIN
        
        for m_i, val in enumerate(monthly_vals, 2):
            cell_v = ws_sec.cell(row=idx, column=m_i, value=val)
            cell_v.font = FONT_INPUT
            cell_v.number_format = NUM_FORMAT_INR
            cell_v.alignment = ALIGN_RIGHT
            cell_v.border = BORDER_THIN
            
        cell_t = ws_sec.cell(row=idx, column=14, value=f"=SUM(B{idx}:M{idx})")
        cell_t.font = FONT_BOLD
        cell_t.number_format = NUM_FORMAT_INR
        cell_t.alignment = ALIGN_RIGHT
        cell_t.border = BORDER_THIN
        cell_t.fill = SUBHEADER_FILL

    # Total Security
    ws_sec.row_dimensions[12].height = 26
    c_ssum = ws_sec.cell(row=12, column=1, value="TOTAL SECURITY, VAPT & COMPLIANCE")
    c_ssum.font = FONT_BOLD
    c_ssum.fill = TOTAL_FILL
    c_ssum.border = BORDER_DOUBLE_BOTTOM
    for c_i in range(2, 14):
        col_letter = get_column_letter(c_i)
        cell_s = ws_sec.cell(row=12, column=c_i, value=f"=SUM({col_letter}5:{col_letter}10)")
        cell_s.font = FONT_BOLD
        cell_s.number_format = NUM_FORMAT_INR
        cell_s.alignment = ALIGN_RIGHT
        cell_s.border = BORDER_DOUBLE_BOTTOM
        cell_s.fill = TOTAL_FILL
    sec_grand = ws_sec.cell(row=12, column=14, value="=SUM(N5:N10)")
    sec_grand.font = Font(name="Calibri", size=12, bold=True, color="1E1B4B")
    sec_grand.number_format = NUM_FORMAT_INR
    sec_grand.alignment = ALIGN_RIGHT
    sec_grand.border = BORDER_DOUBLE_BOTTOM
    sec_grand.fill = TOTAL_FILL

    # -------------------------------------------------------------
    # SHEET 6: Developer Tooling & Software Licences
    # -------------------------------------------------------------
    ws_tool = wb.create_sheet(title="Tooling & Licences")
    ws_tool.views.sheetView[0].showGridLines = True
    
    ws_tool.merge_cells("A1:N1")
    ws_tool["A1"] = "DEVELOPER ACCOUNTS, SOFTWARE LICENCES & PRODUCTIVITY"
    ws_tool["A1"].font = FONT_TITLE
    ws_tool["A1"].fill = NAVY_HEADER
    ws_tool["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_tool.row_dimensions[1].height = 36
    
    ws_tool["A2"] = "App Store, Google Play, GitHub Enterprise, Figma, Linear & Team Productivity"
    ws_tool["A2"].font = FONT_MUTED
    
    ws_tool.row_dimensions[4].height = 28
    for col_idx, text in enumerate(headers_cloud, 1):
        cell = ws_tool.cell(row=4, column=col_idx, value=text if col_idx > 1 else "Software Tool / Licence")
        cell.font = FONT_HEADER
        cell.fill = PURPLE_HEADER
        cell.alignment = ALIGN_LEFT if col_idx == 1 else ALIGN_RIGHT
        cell.border = BORDER_THIN

    tool_items = [
        ("Apple Developer Enterprise Program ($99/year)", [8900, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        ("Google Play Developer Console ($25 one-time)", [2100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        ("GitHub Enterprise & Copilot Team Licences", [4500, 4500, 4500, 4500, 7500, 7500, 7500, 7500, 7500, 7500, 7500, 7500]),
        ("Figma Organization (UI/UX Systems & Design Tokens)", [3000, 3000, 3000, 3000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000]),
        ("Linear, Notion & Postman Team Workspaces", [4000, 4000, 4000, 4000, 6500, 6500, 6500, 6500, 6500, 6500, 6500, 6500]),
        ("Google Workspace & Domain Inboxes (10 Accounts)", [5500, 5500, 5500, 5500, 8000, 8000, 8000, 8000, 8000, 8000, 8000, 8000]),
        ("TestFlight & Android Internal App Distribution Tools", [1500, 1500, 1500, 1500, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000]),
        ("Code Signing & Production SSL Certificates", [15000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    ]

    for idx, (comp, monthly_vals) in enumerate(tool_items, 5):
        ws_tool.row_dimensions[idx].height = 20
        ws_tool.cell(row=idx, column=1, value=comp).font = FONT_REGULAR
        ws_tool.cell(row=idx, column=1).border = BORDER_THIN
        
        for m_i, val in enumerate(monthly_vals, 2):
            cell_v = ws_tool.cell(row=idx, column=m_i, value=val)
            cell_v.font = FONT_INPUT
            cell_v.number_format = NUM_FORMAT_INR
            cell_v.alignment = ALIGN_RIGHT
            cell_v.border = BORDER_THIN
            
        cell_t = ws_tool.cell(row=idx, column=14, value=f"=SUM(B{idx}:M{idx})")
        cell_t.font = FONT_BOLD
        cell_t.number_format = NUM_FORMAT_INR
        cell_t.alignment = ALIGN_RIGHT
        cell_t.border = BORDER_THIN
        cell_t.fill = SUBHEADER_FILL

    # Total Tooling
    ws_tool.row_dimensions[14].height = 26
    c_tsum = ws_tool.cell(row=14, column=1, value="TOTAL SOFTWARE LICENCES & TOOLING")
    c_tsum.font = FONT_BOLD
    c_tsum.fill = TOTAL_FILL
    c_tsum.border = BORDER_DOUBLE_BOTTOM
    for c_i in range(2, 14):
        col_letter = get_column_letter(c_i)
        cell_tool = ws_tool.cell(row=14, column=c_i, value=f"=SUM({col_letter}5:{col_letter}12)")
        cell_tool.font = FONT_BOLD
        cell_tool.number_format = NUM_FORMAT_INR
        cell_tool.alignment = ALIGN_RIGHT
        cell_tool.border = BORDER_DOUBLE_BOTTOM
        cell_tool.fill = TOTAL_FILL
    tool_grand = ws_tool.cell(row=14, column=14, value="=SUM(N5:N12)")
    tool_grand.font = Font(name="Calibri", size=12, bold=True, color="1E1B4B")
    tool_grand.number_format = NUM_FORMAT_INR
    tool_grand.alignment = ALIGN_RIGHT
    tool_grand.border = BORDER_DOUBLE_BOTTOM
    tool_grand.fill = TOTAL_FILL

    # -------------------------------------------------------------
    # SHEET 7: Unit Economics & Scenario Planning
    # -------------------------------------------------------------
    ws_unit = wb.create_sheet(title="Unit Economics & Scenarios")
    ws_unit.views.sheetView[0].showGridLines = True
    
    ws_unit.merge_cells("A1:G1")
    ws_unit["A1"] = "MARGINAL TECH UNIT ECONOMICS & SCALE SCENARIOS"
    ws_unit["A1"].font = FONT_TITLE
    ws_unit["A1"].fill = NAVY_HEADER
    ws_unit["A1"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws_unit.row_dimensions[1].height = 36
    
    ws_unit["A2"] = "One-Time Customer Onboarding Cost vs Monthly Active SIP Operational Cost"
    ws_unit["A2"].font = FONT_MUTED

    # Table 1: Onboarding Tech Cost
    ws_unit.cell(row=4, column=1, value="One-Time Onboarding & KYC Cost per User").font = FONT_SUBHEADER
    ws_unit.row_dimensions[5].height = 24
    ws_unit.cell(row=5, column=1, value="Verification / Onboarding Step").font = FONT_HEADER
    ws_unit.cell(row=5, column=1).fill = PURPLE_HEADER
    ws_unit.cell(row=5, column=2, value="Vendor / Method").font = FONT_HEADER
    ws_unit.cell(row=5, column=2).fill = PURPLE_HEADER
    ws_unit.cell(row=5, column=3, value="Cost per User (INR)").font = FONT_HEADER
    ws_unit.cell(row=5, column=3).fill = PURPLE_HEADER
    ws_unit.cell(row=5, column=3).alignment = ALIGN_RIGHT

    onboarding_steps = [
        ("Mobile OTP Authentication (2 attempts)", "MSG91 Gateway", 0.30),
        ("DigiLocker Aadhaar e-KYC Verification", "Hyperverge / IDfy", 1.50),
        ("Real-time PAN Database Validation", "NSDL / Income Tax API", 1.00),
        ("Liveness Check & Anti-Fraud Face Match", "AI Verification Engine", 4.50),
        ("UPI Autopay Mandate Registration Setup", "Cashfree / Razorpay", 5.00),
        ("Encrypted Document Storage & DB Indexing", "AWS S3 & Postgres", 1.20)
    ]
    for idx, (step, vendor, cost) in enumerate(onboarding_steps, 6):
        ws_unit.cell(row=idx, column=1, value=step).font = FONT_REGULAR
        ws_unit.cell(row=idx, column=2, value=vendor).font = FONT_REGULAR
        c_cost = ws_unit.cell(row=idx, column=3, value=cost)
        c_cost.font = FONT_INPUT
        c_cost.number_format = "₹ #,##0.00"
        c_cost.alignment = ALIGN_RIGHT
        for c_i in range(1, 4):
            ws_unit.cell(row=idx, column=c_i).border = BORDER_THIN
            
    ws_unit.row_dimensions[12].height = 24
    ws_unit.cell(row=12, column=1, value="TOTAL ONE-TIME ONBOARDING TECH COST").font = FONT_BOLD
    ws_unit.cell(row=12, column=1).fill = TOTAL_FILL
    ws_unit.cell(row=12, column=2, value="").fill = TOTAL_FILL
    tot_onb = ws_unit.cell(row=12, column=3, value="=SUM(C6:C11)")
    tot_onb.font = FONT_BOLD
    tot_onb.fill = TOTAL_FILL
    tot_onb.number_format = "₹ #,##0.00"
    tot_onb.alignment = ALIGN_RIGHT
    for c_i in range(1, 4):
        ws_unit.cell(row=12, column=c_i).border = BORDER_DOUBLE_BOTTOM

    # Table 2: Monthly Recurring Tech Cost
    ws_unit.cell(row=14, column=1, value="Monthly Recurring Tech Cost per Active SIP User (30 Days)").font = FONT_SUBHEADER
    ws_unit.row_dimensions[15].height = 24
    ws_unit.cell(row=15, column=1, value="Recurring Service Line").font = FONT_HEADER
    ws_unit.cell(row=15, column=1).fill = PURPLE_HEADER
    ws_unit.cell(row=15, column=2, value="Frequency / Assumption").font = FONT_HEADER
    ws_unit.cell(row=15, column=2).fill = PURPLE_HEADER
    ws_unit.cell(row=15, column=3, value="Cost per Mo (INR)").font = FONT_HEADER
    ws_unit.cell(row=15, column=3).fill = PURPLE_HEADER
    ws_unit.cell(row=15, column=3).alignment = ALIGN_RIGHT

    recurring_steps = [
        ("UPI Recurring Autopay Execution", "30 Daily Debits @ ₹0.12/debit", 3.60),
        ("Streak Milestones & Push Notifications", "FCM & WhatsApp Triggers", 0.20),
        ("Database Transaction Records & Rebalancing", "Postgres I/O & Compute", 1.00)
    ]
    for idx, (step, vendor, cost) in enumerate(recurring_steps, 16):
        ws_unit.cell(row=idx, column=1, value=step).font = FONT_REGULAR
        ws_unit.cell(row=idx, column=2, value=vendor).font = FONT_REGULAR
        c_cost = ws_unit.cell(row=idx, column=3, value=cost)
        c_cost.font = FONT_INPUT
        c_cost.number_format = "₹ #,##0.00"
        c_cost.alignment = ALIGN_RIGHT
        for c_i in range(1, 4):
            ws_unit.cell(row=idx, column=c_i).border = BORDER_THIN
            
    ws_unit.row_dimensions[19].height = 24
    ws_unit.cell(row=19, column=1, value="TOTAL MONTHLY TECH RUN COST / ACTIVE INVESTOR").font = FONT_BOLD
    ws_unit.cell(row=19, column=1).fill = TOTAL_FILL
    ws_unit.cell(row=19, column=2, value="").fill = TOTAL_FILL
    tot_rec = ws_unit.cell(row=19, column=3, value="=SUM(C16:C18)")
    tot_rec.font = FONT_BOLD
    tot_rec.fill = TOTAL_FILL
    tot_rec.number_format = "₹ #,##0.00"
    tot_rec.alignment = ALIGN_RIGHT
    for c_i in range(1, 4):
        ws_unit.cell(row=19, column=c_i).border = BORDER_DOUBLE_BOTTOM

    # Table 3: User Scale Scenarios (Columns E, F, G)
    ws_unit.cell(row=4, column=5, value="Scale Simulation Matrix").font = FONT_SUBHEADER
    ws_unit.row_dimensions[5].height = 24
    ws_unit.cell(row=5, column=5, value="Active SIP Users").font = FONT_HEADER
    ws_unit.cell(row=5, column=5).fill = NAVY_HEADER
    ws_unit.cell(row=5, column=6, value="Monthly Variable Tech (₹)").font = FONT_HEADER
    ws_unit.cell(row=5, column=6).fill = NAVY_HEADER
    ws_unit.cell(row=5, column=7, value="Annualized Variable Cost").font = FONT_HEADER
    ws_unit.cell(row=5, column=7).fill = NAVY_HEADER

    scenarios = [1000, 5000, 15000, 50000, 100000]
    for idx, user_count in enumerate(scenarios, 6):
        ws_unit.cell(row=idx, column=5, value=user_count).font = FONT_REGULAR
        ws_unit.cell(row=idx, column=5).number_format = NUM_FORMAT_INT
        ws_unit.cell(row=idx, column=5).alignment = ALIGN_RIGHT
        
        c_monthly = ws_unit.cell(row=idx, column=6, value=f"=E{idx}*$C$19")
        c_monthly.font = FONT_BOLD
        c_monthly.number_format = NUM_FORMAT_INR
        c_monthly.alignment = ALIGN_RIGHT
        
        c_annual = ws_unit.cell(row=idx, column=7, value=f"=F{idx}*12")
        c_annual.font = FONT_BOLD
        c_annual.number_format = NUM_FORMAT_INR
        c_annual.alignment = ALIGN_RIGHT
        
        for c_i in range(5, 8):
            ws_unit.cell(row=idx, column=c_i).border = BORDER_THIN

    # Auto-adjust column widths for all sheets
    for sheet in wb.worksheets:
        for col in sheet.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                if cell.value:
                    val_str = str(cell.value)
                    if not val_str.startswith("="):
                        max_len = max(max_len, len(val_str))
            sheet.column_dimensions[col_letter].width = max(max_len + 4, 14)
            
    # Set custom widths for primary description columns
    ws_sum.column_dimensions['A'].width = 44
    ws_team.column_dimensions['A'].width = 44
    ws_team.column_dimensions['B'].width = 18
    ws_team.column_dimensions['C'].width = 18
    ws_cloud.column_dimensions['A'].width = 50
    ws_rails.column_dimensions['A'].width = 52
    ws_sec.column_dimensions['A'].width = 52
    ws_tool.column_dimensions['A'].width = 50
    ws_unit.column_dimensions['A'].width = 46
    ws_unit.column_dimensions['B'].width = 30
    ws_unit.column_dimensions['C'].width = 22
    ws_unit.column_dimensions['E'].width = 20
    ws_unit.column_dimensions['F'].width = 26
    ws_unit.column_dimensions['G'].width = 26

    wb.save(filepath)
    print(f"Successfully generated: {filepath}")

if __name__ == "__main__":
    out_path = r"c:\Veer\Satmix\Website 4.0\Satmix_App_Development_Financial_Model.xlsx"
    build_satmix_financial_model(out_path)
