package services

import (
	"bytes"
	"fmt"
	"strings"
	"html/template"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
)

// ---- helpers ----------------------------------------------------------------

func fmtNum(v float64) string {
	if v == 0 {
		return "0"
	}
	neg := ""
	if v < 0 {
		neg = "-"
		v = -v
	}
	intPart := int64(v)
	fracPart := v - float64(intPart)

	s := fmt.Sprintf("%d", intPart)
	if len(s) > 3 {
		var parts []string
		for len(s) > 3 {
			parts = append([]string{s[len(s)-3:]}, parts...)
			s = s[:len(s)-3]
		}
		parts = append([]string{s}, parts...)
		s = strings.Join(parts, ",")
	}

	if fracPart > 0.005 {
		frac := fmt.Sprintf("%.2f", fracPart)
		s += frac[1:]
	}
	return neg + s
}

func fmtPct(v float64) string {
	return fmt.Sprintf("%.2f", v)
}

// ---- HTML Template ----------------------------------------------------------

const htmlBaseTpl = `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <title>Evaluate Result PDF</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
        body { 
            font-family: 'Sarabun', sans-serif; 
            font-size: 8pt; 
            color: #000; 
            line-height: 1.2; 
            margin: 0; 
            padding: 40px; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 15px; 
        }
        td, th { 
            border: 1px solid #000; 
            padding: 4px; 
            vertical-align: middle; 
        }
        .no-border td { border: none; padding: 2px; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .font-bold { font-weight: bold; }
        .bg-highlight { background-color: #fce4d6; } /* สีส้ม */
        .bg-header { background-color: #f2f2f2; }
        .signature-box { margin-top: 30px; width: 100%; border: none; }
        .signature-box td { border: none; text-align: center; padding: 10px; }
        
        /* ตั้งค่าหน้ากระดาษ PDF */
        @page { size: A4; margin: 1.25cm; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body> <table class="no-border">
    <tr>
        <td width="60%"><strong>ประเภทสินเชื่อ :</strong> {{.EvaluateType}}</td>
        <td width="40%"></td>
    </tr>
    <tr>
        <td><strong>ผู้กู้ :</strong> {{.BorrowerName}}</td>
        <td><strong>เลขบัตรประชาชน :</strong> {{.BorrowerIDCard}}</td>
    </tr>
    {{range .CoBorrowers}}
    <tr>
        <td><strong>{{.Label}} :</strong> {{.Name}}</td>
        <td><strong>เลขบัตรประชาชน :</strong> {{.IDCard}}</td>
    </tr>
    {{end}}
</table>

<div class="text-left font-bold" style="margin: 10px 0;">
    สัดส่วนภาระผ่อนชำระหนี้รวมต่อรายได้สุทธิรวม (DTI) และ สัดส่วนความสามารถในการชำระหนี้ (DSCR)
</div>

{{.ApplicantBlocks}}

<table>
    {{.DebtRows}}
</table>

<table>
    <tr>
        <td width="80%" class="text-center font-bold">DTI (Debt to Income Ratio)</td>
        <td width="20%" class="text-center font-bold bg-highlight">{{.DTI}} %</td>
    </tr>
    <tr>
        <td class="text-center font-bold">DSCR (Debt Service Coverage Ratio)</td>
        <td class="text-center font-bold bg-highlight">{{.DSCR}} เท่า</td>
    </tr>
</table>

<table class="signature-box">
    <tr>
        <td width="10%" class="text-left">ลงนาม</td>
        <td width="40%">______________________________</td>
        <td width="10%"></td>
        <td width="40%">______________________________</td>
    </tr>
    <tr>
        <td></td>
        <td>(______________________________)</td>
        <td></td>
        <td>(______________________________)</td>
    </tr>
    <tr>
        <td class="text-left">ตำแหน่ง</td>
        <td>______________________________</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td class="text-left">วันที่</td>
        <td>........../........../..........</td>
        <td></td>
        <td>........../........../..........</td>
    </tr>
    <tr>
        <td></td>
        <td class="font-bold">ผู้จัดทำ</td>
        <td></td>
        <td class="font-bold">ผู้ตรวจสอบ</td>
    </tr>
</table>

<div style="margin-top: 20px;">
    <div class="font-bold" style="text-decoration: underline;">หมายเหตุ</div>
    <div>การคำนวณความสามารถในการชำระหนี้เป็นไปตามหลักเกณฑ์ เรื่อง การพิจารณาความสามารถในการชำระหนี้การให้สินเชื่อรายย่อยทุกประเภท</div>
</div>

</body>
</html>
`

// ---- Data Builders ----------------------------------------------------------

func dataRowHTML(label, value, unit string, bold bool) string {
	fw := "normal"
	if bold {
		fw = "bold"
	}
	return fmt.Sprintf(`<tr border="1px solid black"><td width="60%%" style="font-weight: %s;">%s</td><td width="20%%" class="text-right" style="font-weight: %s;">%s</td><td width="20%%" class="text-center">%s</td></tr>`, fw, label, fw, value, unit)
}

func highlightRowHTML(label, value, unit string) string {
	return fmt.Sprintf(`<tr class="bg-highlight"><td class="text-center font-bold">%s</td><td class="text-right font-bold">%s</td><td class="text-center">%s</td></tr>`, label, value, unit)
}

func buildApplicantRowsHTML(label string, a models.ResultApplicant) string {
	var sb strings.Builder
	sb.WriteString(`<table>`)
	// Header Row
	sb.WriteString(fmt.Sprintf(`<tr><td colspan="3" class="bg-header font-bold">%s</td></tr>`, label))

	// Data
	sb.WriteString(dataRowHTML("อัตราเงินเดือน", fmtNum(a.Salary), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("รายการหักของหน่วยงานที่ไม่ใช่ภาระหนี้", fmtNum(a.Expenses), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("เงินได้ประจำอื่นๆ", fmtNum(a.OtherSalary), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("เงินได้อื่นๆ ที่มีหลักฐาน", fmtNum(a.OptionsSalary), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("กำไรสุทธิจากการประกอบอาชีพตามสัดส่วนการถือหุ้นในธุรกิจ", fmtNum(a.ResultShareValue), "บาท/เดือน", false))

	sb.WriteString(highlightRowHTML("รายได้รวม", fmtNum(a.TotalSalary), "บาท/เดือน"))
	sb.WriteString(highlightRowHTML("รายได้สุทธิรวม", fmtNum(a.ResultIncome), "บาท/เดือน"))

	sb.WriteString(dataRowHTML("ค่าใช้จ่ายในการอุปโภคบริโภค", fmtNum(a.ResultCustomerExpenses), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("ค่าใช้จ่ายที่พักอาศัย", fmtNum(a.LivingExpenses), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("ค่าใช้จ่ายอื่นๆ", fmtNum(a.OtherExpenses), "บาท/เดือน", false))

	sb.WriteString(highlightRowHTML("ค่าใช้จ่ายรวม", fmtNum(a.TotalExpenses), "บาท/เดือน"))
	sb.WriteString(`</table>`)
	return sb.String()
}

func buildDebtRowsHTML(d models.DebtDetail) string {
	var sb strings.Builder
	sb.WriteString(dataRowHTML("หนี้ครั้งนี้", fmtNum(d.DebtAmount), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("หนี้สิน GSB (จาก CBS)", fmtNum(d.LastDebt), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("หนี้สินที่รายงานต่อ NCB (ไม่รวมหนี้สิน GSB)", fmtNum(d.DebtReported), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("หนี้สินที่ไม่ได้รายงานต่อ NCB", fmtNum(d.DebtNotReported), "บาท/เดือน", false))
	sb.WriteString(dataRowHTML("หัก เงินงวดเดิม กรณีคำขอนี้เป็นการ Refinance", fmtNum(d.LastDeduction), "บาท/เดือน", false))
	sb.WriteString(highlightRowHTML("ภาระผ่อนชำระหนี้รวม", fmtNum(d.TotalDebt), "บาท/เดือน"))
	return sb.String()
}

// Data Structure
type CoBorrowerData struct {
	Label  string
	Name   string
	IDCard string
}

type HtmlData struct {
	EvaluateType    string
	BorrowerName    string
	BorrowerIDCard  string
	CoBorrowers     []CoBorrowerData
	ApplicantBlocks template.HTML
	DebtRows        template.HTML
	DTI             string
	DSCR            string
}

// ---- Main Function ----------------------------------------------------------

// GenerateEvaluateHTML สร้างโค้ด HTML แทนที่ DOCX
func GenerateEvaluateHTML(eval *models.Evaluate) ([]byte, error) {
	result := eval.Result
	applicants := result.Applicants

	// ดึงข้อมูลผู้กู้หลัก
	borrowerName := ""
	borrowerIDCard := ""
	if len(applicants) > 0 {
		borrowerName = applicants[0].Name
		borrowerIDCard = applicants[0].IDCard
	}

	// ดึงข้อมูลผู้กู้ร่วม
	var coBorrowers []CoBorrowerData
	for i := 1; i < len(applicants); i++ {
		coBorrowers = append(coBorrowers, CoBorrowerData{
			Label:  fmt.Sprintf("ผู้ร่วม (คนที่ %d)", i),
			Name:   applicants[i].Name,
			IDCard: applicants[i].IDCard,
		})
	}

	// สร้างตารางข้อมูลรายได้/รายจ่าย
	var applicantBlocks strings.Builder
	applicantLabels := []string{"ผู้กู้"}
	for i := 1; i < len(applicants); i++ {
		applicantLabels = append(applicantLabels, fmt.Sprintf("ผู้ร่วม (คนที่ %d)", i))
	}
	for i, a := range applicants {
		applicantBlocks.WriteString(buildApplicantRowsHTML(applicantLabels[i], a))
	}

	// ยัดข้อมูลใส่ Struct เตรียม Render
	data := HtmlData{
		EvaluateType:    eval.EvaluateType,
		BorrowerName:    borrowerName,
		BorrowerIDCard:  borrowerIDCard,
		CoBorrowers:     coBorrowers,
		ApplicantBlocks: template.HTML(applicantBlocks.String()),
		DebtRows:        template.HTML(buildDebtRowsHTML(result.DebtDetail)),
		DTI:             fmtPct(result.Dti),
		DSCR:            fmtPct(result.Dscr),
	}

	// รัน Template
	tmpl := template.Must(template.New("pdf").Parse(htmlBaseTpl))
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return nil, fmt.Errorf("template execution failed: %w", err)
	}

	return buf.Bytes(), nil
}