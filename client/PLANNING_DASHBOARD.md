# Windsurf Prompt: หน้า Dashboard สหกรณ์ออมทรัพย์

## 🎯 บริบทโครงการ

สร้างหน้า **Dashboard** สำหรับ **ระบบจัดการสมาชิกสหกรณ์ออมทรัพย์** โดยใช้ **shadcn/ui** เป็น Component Library หลัก กลุ่มผู้ใช้งานหลักคือ **เจ้าหน้าที่สหกรณ์ อายุ 30 ปีขึ้นไป** จึงต้องการ UI ที่ **อ่านง่าย ชัดเจน ข้อความภาษาไทยทุกส่วน** และไม่ซับซ้อนเกินไป

---

## 🛠️ Tech Stack

- **Framework**: React (Vite ตามโครงสร้างปัจจุบัน)
- **UI Library**: `shadcn/ui` (ใช้ component จาก shadcn เป็นหลักทุกส่วน)
- **Chart Library**: `Recharts` (ติดตั้งผ่าน `pnpm install recharts`)
- **Styling**: Tailwind CSS (มากับ shadcn/ui)
- **Language**: ทุก label, tooltip, title, placeholder, และข้อความใน UI ต้องเป็น **ภาษาไทย 100%**

---

## 📐 โครงสร้างหน้า DashboardPage.tsx

### Layout หลัก

```
┌─────────────────────────────────────────────────────────┐
│  Header: "ภาพรวมสมาชิกสหกรณ์"  +  Filter Bar           │
├─────────────────────────────────────────────────────────┤
│  KPI Row: 4 การ์ด                                        │
├──────────────────────────┬──────────────────────────────┤
│  Row 1 (ซ้าย):           │  Row 1 (ขวา):               │
│  Histogram               │  Pie Chart                   │
│  การกระจายมูลค่าหุ้น      │  สมาชิกตามตำบล              │
├─────────────────────────────────────────────────────────┤
│  Row 2 (เต็มแถว):                                        │
│  Line Chart: การเติบโตสมาชิกรายปี                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 ส่วนที่ 1: Filter Bar

วางไว้ใต้ Header อยู่ใน `shadcn/ui Card` หรือ inline แถวเดียว

### Filter 1 — ปีบัญชี

```tsx
// shadcn/ui Select component
<Select defaultValue="2568">
  <SelectTrigger className="w-[140px]">
    <SelectValue placeholder="เลือกปีบัญชี" />
  </SelectTrigger>
  <SelectContent>
    {["2568", "2569", "2570", "2571", "2572"].map((year) => (
      <SelectItem key={year} value={year}>{year}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

- Default value: **"2568"**
- Label ด้านหน้า: **"ปีบัญชี:"**

### Filter 2 — ตำบล

```tsx
// shadcn/ui Select component
// get dropdown data from API "/protected/dashboard/subdistricts"
<Select defaultValue="all">
  <SelectContent>
    <SelectItem value="all">ทุกตำบล</SelectItem>
    <SelectItem value="ตุ่น">ตุ่น</SelectItem>
    <SelectItem value="แม่ใส">แม่ใส</SelectItem>
    <SelectItem value="สาง">สาง</SelectItem>
    <SelectItem value="แม่นาเรือ">แม่นาเรือ</SelectItem>
    <SelectItem value="เม่ใส">เม่ใส</SelectItem>
  </SelectContent>
</Select>
```

- Label ด้านหน้า: **"ตำบล:"**
- Default: "ทุกตำบล"

> **หมายเหตุ**: ทั้ง 2 filter เมื่อเปลี่ยนค่าให้แสดง `toast` หรือ update state เพื่อ re-render chart (mock ข้อมูลได้)

---

## 📊 ส่วนที่ 2: KPI Cards (4 การ์ด)

ใช้ `shadcn/ui Card` จัดแบบ `grid grid-cols-4 gap-4`

เรียกให้ API `/protected/dashboard/overview` เพื่อเอาข้อมูลมาแสดง

ข้อมูลจาก:

```json
{
  "averageSharesPerPerson": 13380,
  "membersThisYear": {
    "currentCount": 0,
    "lastYearCount": 14,
    "memberChange": -14
  },
  "totalMembers": 474,
  "totalShares": 13380
}
```

### การ์ดที่ 1 — สมาชิกทั้งหมด

```
ไอคอน: Users
หัวข้อ: "สมาชิกทั้งหมด"
ค่า: "474 คน"  (font-size ใหญ่, font-bold)
ข้อความเสริม: "ปีบัญชี 2568"
สี accent: สีน้ำเงินเข้ม (primary)
```

### การ์ดที่ 2 — สมาชิกใหม่ปีนี้

```
ไอคอน: UserPlus
หัวข้อ: "สมาชิกใหม่ปีนี้"
ค่า: "0 คน"
Badge ใต้ตัวเลข:
  - ↓ ลดลง 14 คน จากปีที่แล้ว
  - สีแดง (destructive variant) เพราะ memberChange = -14
สี accent: แดง / warning
```

### การ์ดที่ 3 — จำนวนหุ้นรวม

```
ไอคอน: TrendingUp
หัวข้อ: "จำนวนหุ้นรวม"
ค่า: "13,380 หุ้น"
ข้อความเสริม: "มูลค่ารวม 133,800 บาท" (คำนวณ หุ้น × 10)
สี accent: เขียว (success)
```

### การ์ดที่ 4 — หุ้นเฉลี่ยต่อคน

```
ไอคอน: BarChart2
หัวข้อ: "หุ้นเฉลี่ย/คน"
ค่า: "13,380 หุ้น"
ข้อความเสริม: "มูลค่าเฉลี่ย 133,800 บาท"
สี accent: ม่วง / secondary
```

> **Design note**: ทุกการ์ดมี `CardHeader` + `CardContent` ใช้ Tailwind สำหรับ icon color และ text สี

---

## 📊 ส่วนที่ 3: Row 1 — Charts (2 คอลัมน์)

### Chart ซ้าย — Histogram: การกระจายมูลค่าหุ้น

- **shadcn/ui Card** + **Recharts `BarChart`**
- **Title**: "การกระจายมูลค่าหุ้น"
- **Subtitle**: "จำนวนสมาชิกตามช่วงมูลค่าหุ้น"

**ข้อมูล**:

```json
[
  { "bucket": "น้อยกว่า 1 หมื่น",    "memberCount": 0,  "percentage": 0   },
  { "bucket": "1 หมื่น - 5 หมื่น",   "memberCount": 1,  "percentage": 100 },
  { "bucket": "5 หมื่น - 1 แสน",     "memberCount": 0,  "percentage": 0   },
  { "bucket": "มากกว่า 1 แสน",       "memberCount": 0,  "percentage": 0   }
]
```

**Recharts config**:

```tsx
<BarChart data={sharesDistributionData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
  <CartesianGrid strokeDasharray="3 3" vertical={false} />
  <XAxis
    dataKey="bucket"
    tick={{ fontSize: 12, fill: "#6b7280" }}
    angle={-20}
    textAnchor="end"
  />
  <YAxis
    label={{ value: "จำนวนสมาชิก (คน)", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
    allowDecimals={false}
  />
  <Tooltip
    formatter={(value: number) => [`${value} คน`, "จำนวนสมาชิก"]}
    labelFormatter={(label) => `ช่วง: ${label}`}
  />
  <Bar dataKey="memberCount" fill="#3b82f6" radius={[4, 4, 0, 0]} name="จำนวนสมาชิก" />
</BarChart>
```

---

### Chart ขวา — Pie Chart: สมาชิกตามตำบล

- **shadcn/ui Card** + **Recharts `PieChart`**
- **Title**: "สัดส่วนสมาชิกตามตำบล"
- **Subtitle**: "จำนวนและเปอร์เซ็นต์ของสมาชิกในแต่ละตำบล"

**ข้อมูล**:

```json
[
  { "subdistrict": "ตุ่น",      "count": 326, "percent": 68.78 },
  { "subdistrict": "แม่ใส",    "count": 80,  "percent": 16.88 },
  { "subdistrict": "สาง",      "count": 66,  "percent": 13.92 },
  { "subdistrict": "แม่นาเรือ","count": 1,   "percent": 0.21  },
  { "subdistrict": "เม่ใส",    "count": 1,   "percent": 0.21  }
]
```

**Recharts config**:

```tsx
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

<PieChart>
  <Pie
    data={pieData}
    cx="50%"
    cy="50%"
    outerRadius={110}
    dataKey="count"
    nameKey="subdistrict"
    label={({ subdistrict, percent }) =>
      `${subdistrict} ${(percent * 100).toFixed(1)}%`
    }
    labelLine={true}
  >
    {pieData.map((_, index) => (
      <Cell key={index} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip
    formatter={(value: number, name: string) => [`${value} คน`, name]}
  />
  <Legend
    formatter={(value) => <span className="text-sm">{value}</span>}
  />
</PieChart>
```

> เพิ่ม Legend แบบ custom ด้านล่าง Pie ให้แสดงชื่อตำบล + จำนวนคน

---

## 📊 ส่วนที่ 4: Row 2 — Line Chart (เต็มแถว)

- **shadcn/ui Card** เต็มความกว้าง
- **Title**: "แนวโน้มการเติบโตสมาชิก"
- **Subtitle**: "จำนวนสมาชิกใหม่ที่เข้ารับในแต่ละปี (พ.ศ. 2543–2568)"

**ข้อมูล** (แปลงปี ค.ศ. → พ.ศ. โดยบวก 543):

```tsx
const membershipGrowthData = [
  { year: "2543", count: 35 },
  { year: "2544", count: 8  },
  { year: "2545", count: 8  },
  { year: "2546", count: 12 },
  { year: "2547", count: 23 },
  { year: "2548", count: 15 },
  { year: "2549", count: 9  },
  { year: "2550", count: 8  },
  { year: "2551", count: 24 },
  { year: "2552", count: 22 },
  { year: "2553", count: 34 },
  { year: "2554", count: 28 },
  { year: "2555", count: 24 },
  { year: "2556", count: 19 },
  { year: "2557", count: 26 },
  { year: "2558", count: 9  },
  { year: "2559", count: 14 },
  { year: "2560", count: 13 },
  { year: "2561", count: 10 },
  { year: "2562", count: 17 },
  { year: "2563", count: 22 },
  { year: "2564", count: 24 },
  { year: "2565", count: 18 },
  { year: "2566", count: 9  },
  { year: "2567", count: 29 },
  { year: "2568", count: 14 },
];
```

**Recharts config**:

```tsx
<LineChart data={membershipGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
  <XAxis
    dataKey="year"
    tick={{ fontSize: 11, fill: "#6b7280" }}
    interval={1}
    angle={-45}
    textAnchor="end"
    height={60}
  />
  <YAxis
    tick={{ fontSize: 12, fill: "#6b7280" }}
    label={{ value: "จำนวนสมาชิก (คน)", angle: -90, position: "insideLeft", offset: 10 }}
    allowDecimals={false}
  />
  <Tooltip
    formatter={(value: number) => [`${value} คน`, "สมาชิกใหม่"]}
    labelFormatter={(label) => `ปี พ.ศ. ${label}`}
    contentStyle={{ fontFamily: "inherit" }}
  />
  <ReferenceLine y={20} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "ค่าเฉลี่ย", position: "right", fontSize: 11 }} />
  <Line
    type="monotone"
    dataKey="count"
    stroke="#3b82f6"
    strokeWidth={2.5}
    dot={{ r: 3, fill: "#3b82f6" }}
    activeDot={{ r: 6 }}
    name="สมาชิกใหม่"
  />
</LineChart>
```

> เพิ่ม `ReferenceLine` แสดงเส้นค่าเฉลี่ย (เฉลี่ย ~17 คน/ปี) ด้วยสีเหลืองเส้นประ พร้อม label "ค่าเฉลี่ย"

---

## 🎨 Design System & UX Guidelines

### Typography (ภาษาไทย)
- **Font**: ใช้ `font-family: 'Sarabun', sans-serif` หรือ `Noto Sans Thai` — เพิ่มใน `globals.css` หรือ `index.html`
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  ```
- **ตัวเลข KPI**: `text-3xl font-bold` หรือใหญ่กว่า
- **Title chart**: `text-base font-semibold`
- **Subtitle / label**: `text-sm text-muted-foreground`

### Color Palette
```
Primary (น้ำเงิน):  #3b82f6  — สมาชิก, bar chart
Success (เขียว):   #10b981  — ค่าบวก, จำนวนหุ้น
Warning (เหลือง):  #f59e0b  — ค่าเฉลี่ย, เส้นอ้างอิง
Destructive (แดง): #ef4444  — ค่าลบ, การลดลง
Purple:            #8b5cf6  — KPI เสริม
```

### Spacing & Layout
- Container หลัก: `max-w-7xl mx-auto px-6 py-8`
- KPI grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
- Row 1 charts: `grid grid-cols-1 lg:grid-cols-2 gap-4`
- Row 2: `w-full` card
- Chart height: Row 1 = `h-[320px]`, Row 2 = `h-[360px]`

### shadcn/ui Components ที่ต้องใช้
```bash
npx shadcn@latest add card
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add separator
npx shadcn@latest add tooltip
```

### Responsive
- Mobile (`< lg`): stack ทุกอย่างเป็น 1 คอลัมน์
- Tablet (`lg`): 2 คอลัมน์สำหรับ Row 1
- Desktop: Layout เต็มตามที่ออกแบบ

---

## 📁 โครงสร้างไฟล์ที่แนะนำ

```
src/
├── app/ หรือ pages/
│   └── dashboard/
│       └── page.tsx          ← หน้าหลัก Dashboard
├── components/
│   └── dashboard/
│       ├── FilterBar.tsx      ← Filter ปีบัญชี + ตำบล
│       ├── KpiCards.tsx       ← 4 KPI Cards
│       ├── SharesHistogram.tsx ← Bar Chart
│       ├── SubdistrictPie.tsx  ← Pie Chart
│       └── MembershipGrowthLine.tsx ← Line Chart
├── data/
│   └── mockData.ts           ← ข้อมูล mock ทั้งหมด
└── types/
    └── dashboard.ts          ← TypeScript types
```

---

## 📦 TypeScript Types

```typescript
// types/dashboard.ts

export interface KpiData {
  averageSharesPerPerson: number;
  membersThisYear: {
    currentCount: number;
    lastYearCount: number;
    memberChange: number;
  };
  totalMembers: number;
  totalShares: number;
}

export interface SubdistrictCount {
  subdistrict: string;
  count: number;
  percent: number;
}

export interface MembershipGrowthPoint {
  year: string;   // พ.ศ. เช่น "2543"
  count: number;
}

export interface SharesBucket {
  bucket: string;
  memberCount: number;
  percentage: number;
}

export interface DashboardFilters {
  accountYear: string;
  subdistrict: string;
}
```

---

## 🔄 State Management

```tsx
// ใน page.tsx หลัก
const [filters, setFilters] = useState<DashboardFilters>({
  accountYear: "2568",
  subdistrict: "all",
});

// ส่ง filters ลงทุก Component เพื่อให้ re-render ตาม filter
// (mock: filter เปลี่ยน → แสดง data เดิมก่อน เพราะยังไม่มี API)
```

---

## ⚠️ ข้อกำหนดสำคัญ (Constraints)

1. **ภาษาไทย 100%**: ห้ามมี label, tooltip, placeholder, หรือ text ใดๆ เป็นภาษาอังกฤษในหน้า UI (ยกเว้นชื่อ prop/variable ใน code)
2. **shadcn/ui เป็นหลัก**: Card, Select, Badge, Separator ต้องมาจาก shadcn — ห้ามสร้าง component ซ้ำซ้อน
3. **Recharts สำหรับ chart ทั้งหมด**: ห้ามใช้ library chart อื่น
4. **Responsive**: ต้องดูดีทั้ง mobile และ desktop
5. **ตัวเลขต้องมี format**: ใช้ `toLocaleString('th-TH')` สำหรับตัวเลขทุกตัว
6. **KPI badge การเปลี่ยนแปลง**: ถ้า `memberChange < 0` → Badge สีแดง + ไอคอน ↓ / ถ้า `> 0` → Badge สีเขียว + ไอคอน ↑
7. **Chart ต้องมี empty state**: ถ้า data เป็น 0 ทุกตัว แสดงข้อความ "ไม่มีข้อมูลในช่วงที่เลือก" แทน chart เปล่า
8. **Line chart แปลงปี ค.ศ. → พ.ศ.**: ทุก `year` ต้อง +543 ก่อนแสดงใน UI

---

## ✅ Checklist สำหรับ Windsurf

- [ ] ติดตั้ง `recharts` และ shadcn components ที่จำเป็น
- [ ] เพิ่ม Google Fonts Sarabun ใน `globals.css` หรือ `layout.tsx`
- [ ] สร้าง `mockData.ts` พร้อมข้อมูลครบทุก section
- [ ] สร้าง TypeScript types ครบ
- [ ] สร้าง `FilterBar` component พร้อม state management
- [ ] สร้าง `KpiCards` พร้อม badge แสดงการเปลี่ยนแปลง
- [ ] สร้าง `SharesHistogram` (BarChart แนวตั้ง)
- [ ] สร้าง `SubdistrictPie` (PieChart พร้อม Legend)
- [ ] สร้าง `MembershipGrowthLine` (LineChart + ReferenceLine ค่าเฉลี่ย)
- [ ] ตรวจสอบว่าทุก text เป็นภาษาไทย
- [ ] ตรวจสอบ responsive บน mobile

---

*สร้างโดย Context Engineering สำหรับ Windsurf — ข้อมูล mock จาก สหกรณ์ออมทรัพย์ พะเยา ปีบัญชี 2568*