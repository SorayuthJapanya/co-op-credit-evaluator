import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { IDashboardOverview } from "@/types/dash_types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface MembersBySubdistrictChartProps {
  data: IDashboardOverview;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

import React from "react";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: {
      percentage?: number;
      count?: number;
    };
  }>;
}

const CustomTooltip: React.FC<TooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload[0]) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-700">สมาชิก: {payload[0].value} คน</p>
        <p className="text-sm text-gray-700">
          คิดเป็น: {payload[0].payload?.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const renderCustomizedLabel = (props: LabelProps) => {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props || {};

  if (percent < 0.05) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${percent}%`}
    </text>
  );
};

export const MembersBySubdistrictChart: React.FC<
  MembersBySubdistrictChartProps
> = ({ data }) => {
  const chartData = data.charts?.memberCountBySubdistrict?.data || [];

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden py-5">
      <CardHeader className="gap-0">
        <p className="text-lg font-medium text-gray-700 leading-tight">
          สมาชิกตามตำบล
        </p>
        <p className="text-sm text-gray-500 mt-0.5">จำนวนสมาชิกแยกตามตำบล</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              nameKey="subdistrict"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-xs text-gray-700">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
