import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { IDashboardOverview } from "@/types/dash_types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MemberYearlyGrowthChartProps {
  data: IDashboardOverview;
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({
  active,
  payload,
}) => {
  if (active && payload && payload[0]) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">
          ปี {payload[0].payload.year}
        </p>
        <p className="text-sm text-gray-700">สมาชิก: {payload[0].value} คน</p>
        <p className="text-sm text-gray-700">
          อัตราการเติบโต: {payload[0].payload.growthRate > 0 ? "+" : ""}
          {payload[0].payload.growthRate}%
        </p>
      </div>
    );
  }
  return null;
};

export const MemberYearlyGrowthChart: React.FC<
  MemberYearlyGrowthChartProps
> = ({ data }) => {
  const rawData = data.charts?.membershipGrowth?.data || [];

  const chartData = rawData.map((item: any, index: number) => {
    const prevCount = index > 0 ? rawData[index - 1].memberCount : item.memberCount;
    const growthRate =
      prevCount === 0 ? 0 : ((item.memberCount - prevCount) / prevCount) * 100;

    return {
      ...item,
      growthRate: Number(growthRate.toFixed(2)),
    };
  });

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden py-5">
      <CardHeader className="gap-0">
        <p className="text-lg font-medium text-gray-700 leading-tight">
          การเติบโตสมาชิกรายปี
        </p>
        <p className="text-sm text-gray-500 mt-0.5">
          จำนวนสมาชิกและอัตราการเติบโตต่อปี
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              style={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: "จำนวนสมาชิก (คน)",
                angle: -90,
                position: "center",
                style: { fontSize: 12 },
              }}
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              activeDot={{ r: 1 }}
              name="จำนวนสมาชิก"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
