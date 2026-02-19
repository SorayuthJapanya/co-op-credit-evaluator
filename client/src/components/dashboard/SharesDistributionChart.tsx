import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { IDashboardOverview } from "@/types/dash_types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TooltipData {
  bucket: string;
  memberCount: number;
  percentage: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * สีแต่ละแท่ง: ไล่จาก indigo → blue → sky → cyan
 * ให้ความรู้สึก "ช่วงต่อเนื่อง" ของข้อมูล histogram
 */
const BAR_COLORS = ["#818cf8", "#3b82f6", "#0ea5e9", "#06b6d4"];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({
  active,
  payload,
}) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload as TooltipData;
  const color = payload[0].fill as string;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden w-52">
      {/* แถบสีบนสุดตรงกับแท่ง */}
      <div className="h-1 w-full" style={{ background: color }} />
      <div className="p-3 space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          ช่วงมูลค่าหุ้น
        </p>
        <p className="text-sm font-bold text-gray-800">{d.bucket}</p>
        <div className="border-t border-gray-100 pt-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">จำนวนสมาชิก</span>
            <span className="text-sm font-bold" style={{ color }}>
              {d.memberCount.toLocaleString("th-TH")} คน
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">สัดส่วน</span>
            <span className="text-sm font-semibold text-gray-700">
              {d.percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Custom X-Axis Tick ───────────────────────────────────────────────────────

const CustomXAxisTick: React.FC<any> = ({ x, y, payload, index }) => {
  const color = BAR_COLORS[index % BAR_COLORS.length];
  // ตัดบรรทัดถ้าข้อความยาว (split ที่ " - " หรือ "กว่า")
  const lines: string[] = payload.value.includes(" - ")
    ? payload.value.split(" - ")
    : payload.value.includes("น้อยกว่า")
      ? ["น้อยกว่า", payload.value.replace("น้อยกว่า ", "")]
      : payload.value.includes("มากกว่า")
        ? ["มากกว่า", payload.value.replace("มากกว่า ", "")]
        : [payload.value];

  return (
    <g transform={`translate(${x},${y})`}>
      {/* จุดสีบน tick */}
      <circle cy={-6} r={4} fill={color} opacity={0.8} />
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={10 + i * 16}
          textAnchor="middle"
          fill="#6b7280"
          fontSize={11}
          fontFamily="Sarabun, sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );
};


// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[300px] gap-3">
    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
      <svg
        className="w-7 h-7 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    </div>
    <p className="text-sm text-gray-400 font-medium">
      ไม่มีข้อมูลในช่วงที่เลือก
    </p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface SharesDistributionChartProps {
  data: IDashboardOverview;
}

export const SharesDistributionChart: React.FC<
  SharesDistributionChartProps
> = ({ data }) => {
  const chartData = data.charts?.sharesDistribution?.data || [];
  const isEmpty = chartData.every((d) => d.memberCount === 0);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden py-5">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-medium text-gray-700 leading-tight">
              การกระจายมูลค่าหุ้น
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              จำนวนสมาชิกตามช่วงมูลค่าหุ้น (บาท)
            </p>
          </div>
          {/* badge จำนวน bucket ที่มีสมาชิก */}
          <span className="shrink-0 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full px-2.5 py-1">
            {chartData.filter((d) => d.memberCount > 0).length} / {chartData.length} ช่วง
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 8, bottom: 48 }}
                barCategoryGap="35%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="bucket"
                  tick={<CustomXAxisTick />}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  height={72}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#9ca3af",
                    fontFamily: "Sarabun, sans-serif",
                  }}
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  tickFormatter={(v) => (v === 0 ? "" : v.toString())}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(59,130,246,0.04)" }}
                />
                <Bar
                  dataKey="memberCount"
                  radius={[6, 6, 0, 0]}
                  name="จำนวนสมาชิก"
                  maxBarSize={72}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                      opacity={chartData[index].memberCount === 0 ? 0.15 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

          </div>
        )}
      </CardContent>
    </Card>
  );
};
