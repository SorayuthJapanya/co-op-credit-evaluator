package services

import (
	"fmt"
	"strings"

	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/database"
	"github.com/SorayuthJapanya/co-op-credit-evaluator/internal/models"
)

type SeedSubCategoryData struct {
	SubCategoryName string
	SubNetProfit    float64
}

type SeedCareerCategoryData struct {
	CategoryName  string
	SubCategories []SeedSubCategoryData
}

// careerSeedData is the raw data used for seeding
var careerSeedData = []SeedCareerCategoryData{
	{
		CategoryName: "หมวด C การผลิต",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "การแปรรูป และการถนอมอาหารประเภทเนื้อสัตว์ และสัตว์ปีก", SubNetProfit: 33},
			{SubCategoryName: "การแปรรูป และการถนอมอาหารประเภทสัตว์น้ำ", SubNetProfit: 33},
			{SubCategoryName: "การแปรรูป และการถนอมผลไม้ และผัก", SubNetProfit: 34},
			{SubCategoryName: "การผลิตน้ำมันพืช (ยกเว้นน้ำมันปาล์ม)", SubNetProfit: 43},
			{SubCategoryName: "การผลิตน้ำมันปาล์ม", SubNetProfit: 17},
			{SubCategoryName: "การผลิตผลิตภัณฑ์นม", SubNetProfit: 37},
			{SubCategoryName: "การผลิตผลิตภัณฑ์จากเมล็ดธัญพืช แป้ง สตาร์ช และผลิตภัณฑ์จากสตาร์ช", SubNetProfit: 24},
			{SubCategoryName: "การผลิตผลิตภัณฑ์อาหาร และเครื่องปรุงอาหาร", SubNetProfit: 37},
			{SubCategoryName: "การผลิตอาหารสัตว์สำเร็จรูป", SubNetProfit: 30},
			{SubCategoryName: "การผลิตเครื่องดื่มที่ไม่มีแอลกอฮอล์ น้ำแร่ และน้ำดื่ม", SubNetProfit: 44},
			{SubCategoryName: "การผลิตสิ่งทอ", SubNetProfit: 40},
			{SubCategoryName: "การผลิตเสื้อผ้าเครื่องแต่งกาย", SubNetProfit: 42},
			{SubCategoryName: "การผลิตเครื่องหนัง การผลิตกระเป๋าเดินทาง กระเป๋าถือ รองเท้า", SubNetProfit: 39},
			{SubCategoryName: "การผลิตผลิตภัณฑ์จากไม้ ไม้ก๊อก ฟาง และวัสดุถักสาน", SubNetProfit: 42},
			{SubCategoryName: "การผลิตกระดาษ และผลิตภัณฑ์กระดาษ", SubNetProfit: 19},
			{SubCategoryName: "การพิมพ์ และบริการที่เกี่ยวเนื่องกับการพิมพ์", SubNetProfit: 28},
			{SubCategoryName: "การผลิตเคมีภัณฑ์ และผลิตภัณฑ์เคมี", SubNetProfit: 28},
			{SubCategoryName: "การผลิตเภสัชภัณฑ์ เคมีภัณฑ์ที่ใช้รักษาโรค และผลิตภัณฑ์จากพืชและสัตว์ที่ใช้รักษาโรค", SubNetProfit: 34},
			{SubCategoryName: "การผลิตยางนอก และยางใน การหล่อดอกยาง และการซ่อมสร้างยางล้อ", SubNetProfit: 37},
			{SubCategoryName: "การผลิตผลิตภัณฑ์ยางอื่นๆ", SubNetProfit: 25},
			{SubCategoryName: "การผลิตผลิตภัณฑ์พลาสติก", SubNetProfit: 28},
			{SubCategoryName: "การผลิตแก้ว และผลิตภัณฑ์ที่ทำจากแก้ว", SubNetProfit: 38},
			{SubCategoryName: "การผลิตวัสดุก่อสร้างที่ทำจากดินเหนียว และเซรามิก", SubNetProfit: 43},
			{SubCategoryName: "การผลิตปูนซีเมนต์ คอนกรีต ปูนไลม์ (ปูนขาว) และปูปลาสเตอร์", SubNetProfit: 35},
			{SubCategoryName: "การตัด การขึ้นรูป และการแต่งสำเร็จหิน", SubNetProfit: 35},
			{SubCategoryName: "การหล่อเหล็ก และโลหะ", SubNetProfit: 30},
			{SubCategoryName: "การผลิตผลิตภัณฑ์ที่ทำจากโลหะประดิษฐ์ (ยกเว้นเครื่องจักร และอุปกรณ์)", SubNetProfit: 35},
			{SubCategoryName: "การผลิตชิ้นส่วน และแผ่นวงจรอิเล็กทรอนิกส์", SubNetProfit: 33},
			{SubCategoryName: "การผลิตอุปกรณ์สื่อสาร", SubNetProfit: 29},
			{SubCategoryName: "การผลิตเครื่องฉายรังสี เครื่องไฟฟ้าทางการแพทย์ และทางกายภาพบำบัด", SubNetProfit: 28},
			{SubCategoryName: "การผลิตอุปกรณ์ไฟฟ้า และเครื่องอิเล็กทรอนิกส์ชนิดใช้ในครัวเรือน", SubNetProfit: 37},
			{SubCategoryName: "การผลิตเครื่องจักร และเครื่องมือ", SubNetProfit: 28},
			{SubCategoryName: "การผลิตเฟอร์นิเจอร์", SubNetProfit: 29},
			{SubCategoryName: "การเจียระไน การขัดเพชรพลอย และการผลิตเครื่องประดับ สิ่งของเครื่องใช้จากเพชรพลอย และโลหะมีค่า", SubNetProfit: 34},
			{SubCategoryName: "การผลิตเครื่องประดับเพชรพลอยเทียม และสิ่งของที่เกี่ยวข้อง", SubNetProfit: 33},
			{SubCategoryName: "การผลิตเครื่องดนตรี", SubNetProfit: 35},
			{SubCategoryName: "การผลิตเครื่องกีฬา", SubNetProfit: 33},
			{SubCategoryName: "การผลิตเกม และของเล่น", SubNetProfit: 35},
			{SubCategoryName: "การผลิตเครื่องมือ และอุปกรณ์ทางการแพทย์ และทางทันตกรรม", SubNetProfit: 37},
			{SubCategoryName: "อื่นๆ", SubNetProfit: 17},
		},
	},
	{
		CategoryName: "หมวด G การขายส่ง และการขายปลีก",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "การขายยานยนต์", SubNetProfit: 25},
			{SubCategoryName: "การขายส่งชิ้นส่วน และอุปกรณ์เสริมใหม่ของยานยนต์", SubNetProfit: 19},
			{SubCategoryName: "การขายปลีกชิ้นส่วน และอุปกรณ์เสริมใหม่ของยานยนต์", SubNetProfit: 24},
			{SubCategoryName: "การขายส่งและปลีกชิ้นส่วน และอุปกรณ์เสริมเก่าของยานยนต์", SubNetProfit: 34},
			{SubCategoryName: "การขายจักรยานยนต์", SubNetProfit: 17},
			{SubCategoryName: "การขายส่งชิ้นส่วน และอุปกรณ์เสริมใหม่ของจักรยานยนต์", SubNetProfit: 34},
			{SubCategoryName: "การขายปลีกชิ้นส่วน และอุปกรณ์เสริมใหม่ของจักรยานยนต์", SubNetProfit: 39},
			{SubCategoryName: "การขายส่ง และปลีกชิ้นส่วน และอุปกรณ์เสริมเก่าของจักรยานยนต์", SubNetProfit: 31},
			{SubCategoryName: "การขายส่งวัตถุดิบทางการเกษตร และสัตว์มีชีวิต โดยได้รับค่าตอบแทน/ตามสัญญาจ้าง", SubNetProfit: 24},
			{SubCategoryName: "การขายส่งพืชน้ำมันที่ใช้ในการผลิตน้ำมันพืช", SubNetProfit: 16},
			{SubCategoryName: "การขายส่งสัตว์มีชีวิต", SubNetProfit: 24},
			{SubCategoryName: "การขายส่งดอกไม้ ต้นไม้ และเมล็ดพันธุ์พืช", SubNetProfit: 33},
			{SubCategoryName: "การขายส่งวัตถุดิบทางการเกษตร", SubNetProfit: 30},
			{SubCategoryName: "การขายส่งเนื้อสัตว์ และผลิตภัณฑ์เนื้อสัตว์", SubNetProfit: 25},
			{SubCategoryName: "การขายส่งปลา และผลิตภัณฑ์สัตว์น้ำ", SubNetProfit: 38},
			{SubCategoryName: "การขายส่งผัก และผลไม้", SubNetProfit: 27},
			{SubCategoryName: "การขายส่งผลิตภัณฑ์นม", SubNetProfit: 32},
			{SubCategoryName: "การขายส่งข้าวสาร และผลิตภัณฑ์ที่ได้จากโรงสีข้าว", SubNetProfit: 43},
			{SubCategoryName: "การขายส่งผลิตภัณฑ์ขนมอบ น้ำมัน และไขมันที่ใช้ในการบริโภค", SubNetProfit: 34},
			{SubCategoryName: "การขายส่งน้ำตาล ช็อกโกแลต ลูกกวาด และขนมที่ทำจากน้ำตาล", SubNetProfit: 34},
			{SubCategoryName: "การขายส่งกาแฟ ชา โกโก้", SubNetProfit: 31},
			{SubCategoryName: "การขายส่งผลิตภัณฑ์อาหารอื่นๆ", SubNetProfit: 35},
			{SubCategoryName: "การขายส่งเครื่องดื่มที่ไม่มีแอลกอฮอล์", SubNetProfit: 28},
			{SubCategoryName: "การขายส่งของใช้ในครัวเรือนที่ทำจากสิ่งทอ", SubNetProfit: 37},
			{SubCategoryName: "การขายส่งเสื้อผ้า", SubNetProfit: 35},
			{SubCategoryName: "การขายส่งรองเท้า", SubNetProfit: 31},
			{SubCategoryName: "การขายส่งเครื่องใช้ไฟฟ้า และอิเล็กทรอนิกส์ชนิดใช้ในครัวเรือน", SubNetProfit: 24},
			{SubCategoryName: "การขายส่งหนังสือ หนังสือพิมพ์ และเครื่องเขียน", SubNetProfit: 11},
			{SubCategoryName: "การขายส่งสื่อบันทึกภาพ และเสียง", SubNetProfit: 39},
			{SubCategoryName: "การขายส่งเครื่องกีฬา", SubNetProfit: 41},
			{SubCategoryName: "การขายส่งเกม และของเล่น", SubNetProfit: 34},
			{SubCategoryName: "การขายส่งสินค้าทางเภสัชกรรม และทางการแพทย์", SubNetProfit: 28},
			{SubCategoryName: "การขายส่งเครื่องหอม", SubNetProfit: 42},
			{SubCategoryName: "การขายส่งเครื่องสำอาง และเครื่องประทินโฉม", SubNetProfit: 35},
			{SubCategoryName: "การขายส่งอุปกรณ์ถ่ายภาพ และเลนส์", SubNetProfit: 35},
			{SubCategoryName: "การขายส่งนาฬิกา เครื่องประดับเพชรพลอย", SubNetProfit: 27},
			{SubCategoryName: "การขายส่งเครื่องหนัง", SubNetProfit: 32},
			{SubCategoryName: "การขายส่งเฟอร์นิเจอร์", SubNetProfit: 36},
			{SubCategoryName: "การขายส่งเครื่องดินเผา เครื่องแก้ว และเครื่องครัว", SubNetProfit: 18},
			{SubCategoryName: "การขายส่งคอมพิวเตอร์ อุปกรณ์ต่อพ่วง และซอฟต์แวร์", SubNetProfit: 31},
			{SubCategoryName: "การขายส่งอุปกรณ์ และชิ้นส่วนทางอิเล็กทรอนิกส์ และโทรคมนาคม", SubNetProfit: 38},
			{SubCategoryName: "การขายส่งเชื้อเพลิงแข็ง เชื้อเพลิงเหลว และเชื้อเพลิงก๊าซ", SubNetProfit: 27},
			{SubCategoryName: "การขายส่งโลหะ และสินแร่โลหะ", SubNetProfit: 25},
			{SubCategoryName: "การขายส่งวัสดุก่อสร้าง", SubNetProfit: 28},
			{SubCategoryName: "การขายส่งเคมีภัณฑ์ทางอุตสาหกรรม", SubNetProfit: 26},
			{SubCategoryName: "การขายส่งยางพารา และพลาสติกขั้นต้น", SubNetProfit: 12},
			{SubCategoryName: "การขายส่งบรรจุภัณฑ์ชนิดใช้ในทางอุตสาหกรรม", SubNetProfit: 37},
			{SubCategoryName: "การขายส่งของเสีย และเศษวัสดุที่สามารถนำกลับมาใช้ใหม่", SubNetProfit: 44},
			{SubCategoryName: "ร้านขายปลีกเนื้อสัตว์ และผลิตภัณฑ์เนื้อสัตว์", SubNetProfit: 26},
			{SubCategoryName: "ร้านขายปลีกปลา และผลิตภัณฑ์สัตว์น้ำ", SubNetProfit: 24},
			{SubCategoryName: "ร้านขายปลีกผัก และผลไม้", SubNetProfit: 35},
			{SubCategoryName: "ร้านขายปลีกข้าว", SubNetProfit: 29},
			{SubCategoryName: "ร้านขายปลีกผลิตภัณฑ์ขนมอบ", SubNetProfit: 35},
			{SubCategoryName: "ร้านขายปลีกอาหารอื่นๆ", SubNetProfit: 38},
			{SubCategoryName: "ร้านขายปลีกเครื่องดื่มที่ไม่มีแอลกอฮอล์", SubNetProfit: 47},
			{SubCategoryName: "ร้านขายปลีกเชื้อเพลิงยานยนต์", SubNetProfit: 14},
			{SubCategoryName: "ร้านขายปลีกคอมพิวเตอร์ และอุปกรณ์ต่อพ่วง เครื่องเล่นวีดิโอเกม ซอฟต์แวร์ และอุปกรณ์สื่อสารโทรคมนาคม", SubNetProfit: 30},
			{SubCategoryName: "ร้านขายปลีกอุปกรณ์ภาพ และเสียง", SubNetProfit: 17},
			{SubCategoryName: "ร้านขายปลีกวัสดุก่อสร้าง", SubNetProfit: 30},
			{SubCategoryName: "ร้านขายปลีกเครื่องใช้ไฟฟ้า เฟอร์นิเจอร์ อุปกรณ์ไฟฟ้าสำหรับให้แสงสว่าง และของใช้อื่นๆ ในครัวเรือน", SubNetProfit: 36},
			{SubCategoryName: "ร้านขายปลีกหนังสือ หนังสือพิมพ์ วารสาร และนิตยสาร", SubNetProfit: 29},
			{SubCategoryName: "ร้านขายปลีกเครื่องเขียน และเครื่องใช้สำนักงาน", SubNetProfit: 37},
			{SubCategoryName: "ร้านขายปลีกสื่อบันทึกเสียง และภาพ", SubNetProfit: 39},
			{SubCategoryName: "ร้านขายปลีกเครื่องกีฬา", SubNetProfit: 35},
			{SubCategoryName: "ร้านขายปลีกเกม และของเล่น", SubNetProfit: 37},
			{SubCategoryName: "ร้านขายปลีกผลิตภัณฑ์งานฝีมือคนไทย และของที่ระลึก", SubNetProfit: 36},
			{SubCategoryName: "ร้านขายปลีกเสื้อผ้า", SubNetProfit: 40},
			{SubCategoryName: "ร้านขายปลีกรองเท้า", SubNetProfit: 37},
			{SubCategoryName: "ร้านขายปลีกเครื่องหนัง", SubNetProfit: 37},
			{SubCategoryName: "ร้านขายปลีกสินค้าทางเภสัชกรรม และเวชภัณฑ์", SubNetProfit: 31},
			{SubCategoryName: "ร้านขายปลีกเครื่องหอม", SubNetProfit: 34},
			{SubCategoryName: "ร้านขายปลีกเครื่องสำอาง และเครื่องประทินโฉม", SubNetProfit: 28},
			{SubCategoryName: "ร้านขายปลีกนาฬิกา แว่นตา และอุปกรณ์ถ่ายภาพ", SubNetProfit: 39},
			{SubCategoryName: "ร้านขายปลีกเครื่องประดับเพชรพลอย", SubNetProfit: 17},
			{SubCategoryName: "ร้านขายปลีกดอกไม้ ต้นไม้ และอุปกรณ์ที่เกี่ยวข้อง", SubNetProfit: 34},
			{SubCategoryName: "ร้านขายปลีกสัตว์เลี้ยง และอุปกรณ์ที่เกี่ยวข้อง", SubNetProfit: 30},
			{SubCategoryName: "ร้านขายปลีกก๊าซบรรจุถัง ถ่านไม้ และเชื้อเพลิงอื่นๆ สำหรับใช้ในครัวเรือน", SubNetProfit: 32},
			{SubCategoryName: "ร้านขายปลีกสินค้าใช้แล้ว", SubNetProfit: 38},
			{SubCategoryName: "การขายอาหารปศุสัตว์", SubNetProfit: 45},
			{SubCategoryName: "การขายด้าย และผ้า", SubNetProfit: 34},
			{SubCategoryName: "การขายอุปกรณ์ตัดเย็บ", SubNetProfit: 35},
			{SubCategoryName: "การขายเครื่องจักร อุปกรณ์ และเครื่องใช้ทางการเกษตร", SubNetProfit: 27},
			{SubCategoryName: "การขายเครื่องจักร และอุปกรณ์อื่นๆ", SubNetProfit: 28},
			{SubCategoryName: "การขายปุ๋ย และเคมีภัณฑ์ทางการเกษตร", SubNetProfit: 30},
			{SubCategoryName: "ซุปเปอร์มาร์เก็ต", SubNetProfit: 26},
			{SubCategoryName: "ดิสเคาท์สโตร์/ซุปเปอร์เซ็นเตอร์/ไฮเปอร์มาร์เก็ต", SubNetProfit: 27},
			{SubCategoryName: "ร้านสะดวกซื้อ/มินิมาร์ท", SubNetProfit: 26},
			{SubCategoryName: "ร้านขายของชำ", SubNetProfit: 35},
			{SubCategoryName: "ร้านขายสิ่งทอ", SubNetProfit: 40},
			{SubCategoryName: "ร้านขายพรม สิ่งปูพื้น วัสดุปิดผนัง และปูพื้น", SubNetProfit: 50},
			{SubCategoryName: "การขายตรง", SubNetProfit: 33},
			{SubCategoryName: "อื่นๆ", SubNetProfit: 18},
		},
	},
	{
		CategoryName: "หมวด H การขนส่ง",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "รถประจำทาง", SubNetProfit: 57},
			{SubCategoryName: "รถแท็กซี่", SubNetProfit: 49},
			{SubCategoryName: "รถสามล้อ และจักรยานยนต์รับจ้าง", SubNetProfit: 79},
			{SubCategoryName: "ขับรถรับจ้างทั่วไป", SubNetProfit: 66},
			{SubCategoryName: "อื่นๆ", SubNetProfit: 49},
		},
	},
	{
		CategoryName: "หมวด I การบริการด้านอาหาร",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "สวนอาหาร/ภัตตาคาร/ร้านอาหาร", SubNetProfit: 40},
			{SubCategoryName: "การจัดเลี้ยงนอกสถานที่", SubNetProfit: 48},
			{SubCategoryName: "เครื่องดื่มที่ไม่มีแอลกอฮอล์เป็นหลักในร้าน", SubNetProfit: 55},
			{SubCategoryName: "อื่นๆ", SubNetProfit: 40},
		},
	},
	{
		CategoryName: "หมวด J ข้อมูลข่าวสาร และการสื่อสาร",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "การจัดพิมพ์จำหน่ายหรือเผยแพร่หนังสือ และนิตยสาร", SubNetProfit: 23},
			{SubCategoryName: "การจัดทำซอฟต์แวร์สำเร็จรูป", SubNetProfit: 24},
			{SubCategoryName: "การจัดทำโปรแกรมคอมพิวเตอร์ การให้คำปรึกษาเกี่ยวกับคอมพิวเตอร์", SubNetProfit: 62},
			{SubCategoryName: "การบริการเทคโนโลยีสารสนเทศ และคอมพิวเตอร์อื่นๆ", SubNetProfit: 80},
			{SubCategoryName: "การให้เช่าพื้นที่บนเครื่องแม่ข่าย/สำนักข่าว", SubNetProfit: 47},
			{SubCategoryName: "อื่นๆ", SubNetProfit: 23},
		},
	},
	{
		CategoryName: "หมวด M กิจกรรมทางวิชาชีพ วิทยาศาสตร์ และเทคนิค",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "กิจกรรมทางกฎหมาย", SubNetProfit: 58},
			{SubCategoryName: "กิจกรรมการบัญชี การทำบัญชี และการตรวจสอบบัญชี การให้คำปรึกษาด้านภาษี", SubNetProfit: 81},
			{SubCategoryName: "การให้คำปรึกษาด้านการบริหารจัดการ", SubNetProfit: 47},
			{SubCategoryName: "สถาปัตยกรรม และวิศวกรรม รวมถึงการทดสอบ และการวิเคราะห์ทางเทคนิค", SubNetProfit: 48},
			{SubCategoryName: "การวิจัย และพัฒนาเชิงทดลองด้านวิทยาศาสตร์ธรรมชาติ และวิศวกรรม", SubNetProfit: 70},
			{SubCategoryName: "การโฆษณา และการวิจัยตลาด", SubNetProfit: 46},
			{SubCategoryName: "การออกแบบ และตกแต่งภายใน", SubNetProfit: 35},
			{SubCategoryName: "การถ่ายภาพ", SubNetProfit: 54},
			{SubCategoryName: "การแปล และล่าม", SubNetProfit: 57},
			{SubCategoryName: "อื่นๆ", SubNetProfit: 35},
		},
	},
	{
		CategoryName: "หมวด R ศิลปะ ความบันเทิง และนันทนาการ",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "การสร้างสรรค์ศิลปะ และความบันเทิง", SubNetProfit: 74},
			{SubCategoryName: "การดำเนินงานเกี่ยวกับสิ่งอำนวยความสะดวกด้านการกีฬา", SubNetProfit: 54},
			{SubCategoryName: "สโมสรกีฬา", SubNetProfit: 51},
			{SubCategoryName: "สวนสนุก และธีมปาร์ค", SubNetProfit: 38},
			{SubCategoryName: "อื่นๆ", SubNetProfit: 38},
		},
	},
	{
		CategoryName: "หมวด S กิจกรรมบริการด้านอื่นๆ",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "การซ่อม และการติดตั้งเครื่องจักร และอุปกรณ์ชนิดใช้ในทางอุตสาหกรรม", SubNetProfit: 36},
			{SubCategoryName: "การบำรุงรักษา และซ่อมระบบเครื่องยนต์ และชิ้นส่วนยานยนต์", SubNetProfit: 51},
			{SubCategoryName: "การบำรุงรักษายานยนต์ทั่วไป", SubNetProfit: 66},
			{SubCategoryName: "การบำรุงรักษา และซ่อมจักรยานยนต์", SubNetProfit: 37},
			{SubCategoryName: "ตัวแทนอสังหาริมทรัพย์ โดยได้รับค่าตอบแทน/ตามสัญญาจ้าง", SubNetProfit: 54},
			{SubCategoryName: "การให้เช่ายานยนต์", SubNetProfit: 38},
			{SubCategoryName: "การให้เช่าของใช้ส่วนบุคคล และของใช้ในครัวเรือน", SubNetProfit: 40},
			{SubCategoryName: "การให้เช่าเครื่องจักร อุปกรณ์", SubNetProfit: 49},
			{SubCategoryName: "สำนักงาน หรือตัวแทนจัดหางาน", SubNetProfit: 60},
			{SubCategoryName: "ตัวแทนธุรกิจท่องเที่ยว และการจัดนำเที่ยว", SubNetProfit: 52},
			{SubCategoryName: "การรักษาความปลอดภัย", SubNetProfit: 48},
			{SubCategoryName: "การบริการทำความสะอาด", SubNetProfit: 59},
			{SubCategoryName: "การบริการดูแล และบำรุงรักษาภูมิทัศน์", SubNetProfit: 58},
			{SubCategoryName: "การถ่ายเอกสาร", SubNetProfit: 43},
			{SubCategoryName: "การเตรียมเอกสาร และกิจกรรมเฉพาะด้านอื่นๆ ที่สนับสนุนการดำเนินงานสำนักงาน", SubNetProfit: 62},
			{SubCategoryName: "การซ่อมอุปกรณ์คอมพิวเตอร์ และอุปกรณ์สื่อสารโทรคมนาคม", SubNetProfit: 41},
			{SubCategoryName: "การซ่อมของใช้ส่วนบุคคล และของใช้ในครัวเรือน", SubNetProfit: 41},
			{SubCategoryName: "สปา และการนวด", SubNetProfit: 61},
			{SubCategoryName: "บริการลดน้ำหนัก", SubNetProfit: 36},
			{SubCategoryName: "การแต่งผม", SubNetProfit: 59},
			{SubCategoryName: "การดูแลความงาม แต่งเล็บมือ และเล็บเท้า", SubNetProfit: 49},
			{SubCategoryName: "การบริการซักรีด และซักแห้ง (ยกเว้นโดยเครื่องซักผ้าชนิดหยอดเหรียญ)", SubNetProfit: 48},
			{SubCategoryName: "การบริการซักรีด และซักแห้ง โดยเครื่องซักผ้าชนิดหยอดเหรียญ", SubNetProfit: 38},
			{SubCategoryName: "การบริการฟอก และย้อมสี", SubNetProfit: 71},
			{SubCategoryName: "การทำศพ และกิจกรรมที่เกี่ยวข้อง", SubNetProfit: 59},
			{SubCategoryName: "การดูแลสัตว์เลี้ยง", SubNetProfit: 52},
			{SubCategoryName: "บริการด้วยเครื่องหยอดเหรียญ", SubNetProfit: 36},
			{SubCategoryName: "สถาบันกวดวิชาทั่วไป /การสอนดนตรี/ศิลปะ/อาชีพ และอื่นๆ ที่มีลักษณะคล้ายกัน", SubNetProfit: 39},
			{SubCategoryName: "อื่นๆ", SubNetProfit: 39},
		},
	},
	{
		CategoryName: "อื่นๆ",
		SubCategories: []SeedSubCategoryData{
			{SubCategoryName: "อื่นๆ (ที่ไม่ได้จัดไว้ในประเภทธุรกิจตามที่กำหนด)", SubNetProfit: 17},
		},
	},
}

// SeedCareerCategoriesData seeds the pre-defined categories and subcategories into the database
func SeedCareerCategoriesData() error {
	for _, categoryData := range careerSeedData {
		cleanCategoryName := strings.ReplaceAll(categoryData.CategoryName, " ", "")

		var existingCategory models.CareerCategory
		var targetCategory *models.CareerCategory

		// Check if the CareerCategory already exists
		if err := database.DB.Where("REPLACE(category_name, ' ', '') = ?", cleanCategoryName).First(&existingCategory).Error; err == nil {
			fmt.Printf("CareerCategory already exists: %s\n", categoryData.CategoryName)
			targetCategory = &existingCategory
		} else {
			// Create the new CareerCategory
			created, err := CreateCareerCategory(categoryData.CategoryName)
			if err != nil {
				return fmt.Errorf("failed to create category %s: %v", categoryData.CategoryName, err)
			}
			targetCategory = created
			fmt.Printf("Created CareerCategory: %s\n", targetCategory.CategoryName)
		}

		// Process subcategories for the CareerCategory
		for _, subData := range categoryData.SubCategories {
			cleanSubCategoryName := strings.ReplaceAll(subData.SubCategoryName, " ", "")

			// Check if the SubCategory already exists under this CareerCategory
			var existingSub models.SubCategory
			if err := database.DB.Where("REPLACE(sub_category_name, ' ', '') = ? AND category_id = ?", cleanSubCategoryName, targetCategory.Id).First(&existingSub).Error; err != nil {
				// SubCategory does not exist, create it
				_, err := CreateSubCategory(targetCategory.Id, subData.SubCategoryName, subData.SubNetProfit)
				if err != nil {
					return fmt.Errorf("failed to create subcategory %s for category %s: %v", subData.SubCategoryName, targetCategory.CategoryName, err)
				}
				fmt.Printf("  Created SubCategory: %s (%.0f%%)\n", subData.SubCategoryName, subData.SubNetProfit)
			}
		}
	}

	fmt.Println("Successfully seeded Career Categories and Subcategories.")
	return nil
}
