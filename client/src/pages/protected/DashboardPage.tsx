import { useState } from "react";
import Header from "@/components/Header";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { KPICards } from "@/components/dashboard/KPICards";
import { SharesDistributionChart } from "@/components/dashboard/SharesDistributionChart";
import { MembersBySubdistrictChart } from "@/components/dashboard/MembersBySubdistrictChart";
import { MemberYearlyGrowthChart } from "@/components/dashboard/MemberYearlyGrowthChart";
import { useDashboardOverview, useSubdistrictData } from "@/hooks/useDashboard";

const DashboardPage = () => {
  const [selectedYear, setSelectedYear] = useState("2568");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("all");

  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    error: overviewError,
  } = useDashboardOverview(selectedYear, selectedSubdistrict);
  
  const {
    data: subdistrictData,
    isLoading: isLoadingSubdistrict,
    error: subdistrictError,
  } = useSubdistrictData();

  if (isLoadingOverview || isLoadingSubdistrict) {
    return (
      <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8">
        <div>กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (overviewError || subdistrictError) {
    return (
      <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8">
        <div className="text-red-500">
          {overviewError?.message || subdistrictError?.message}
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8">
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:justify-between mb-8">
        <Header
          title="ภาพรวมสมาชิกสหกรณ์"
          subTitle="ระบบจัดการสมาชิกสหกรณ์ออมทรัพย์"
        />

        <DashboardFilters
          selectedYear={selectedYear}
          selectedSubdistrict={selectedSubdistrict}
          onYearChange={setSelectedYear}
          onSubdistrictChange={setSelectedSubdistrict}
          subdistricts={subdistrictData || []}
        />
      </div>

      {overviewData && (
        <KPICards data={overviewData} selectedYear={selectedYear} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SharesDistributionChart
          data={overviewData}
        />
        <MembersBySubdistrictChart
          data={overviewData}
        />
      </div>

      <div className="mb-6">
        <MemberYearlyGrowthChart
          data={overviewData}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
