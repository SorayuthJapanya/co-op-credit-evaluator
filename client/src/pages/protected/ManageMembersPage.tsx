import ActionMember from "@/components/ActionMember";
import Header from "@/components/Header";
import Pagination from "@/components/Pagination";
import MembersTable from "@/components/table/MembersTable";
import { useFullDropdownData } from "@/hooks/useDropdown";
import { useMembers } from "@/hooks/useMember";
import { useState } from "react";

const ManageMembersPage = () => {
  // Search State
  const [fullName, setFullName] = useState("");
  const [searchFullName, setSearchFullName] = useState("");

  // Dropdown State
  const [subdistrict, setSubdistrict] = useState("all");
  const [district, setDistrict] = useState("all");
  const [province, setProvince] = useState("all");

  // Pagination State
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);

  // Get members
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: errorMembers,
  } = useMembers({
    fullName: searchFullName,
    subdistrict,
    district,
    province,
    limit,
    page,
  });

  // Get Dropdown
  const {
    data: dropdownData,
    isLoading: isLoadingDropdown,
    error: errorDropdown,
  } = useFullDropdownData();

  const handleSelectedChange = (name: string, value: string) => {
    if (name === "subdistrict") {
      setSubdistrict(value);
    } else if (name === "district") {
      setDistrict(value);
    } else if (name === "province") {
      setProvince(value);
    }
  };

  if (errorMembers || errorDropdown) {
    return (
      <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8">
        <div className="text-red-500">
          {errorMembers?.message || errorDropdown?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl xl:max-w-8xl mx-auto p-8 space-y-6">
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:justify-between mb-8">
        <Header
          title="จัดการสมาชิกสหกรณ์"
          subTitle="จัดการข้อมูลสมาชิกสหกรณ์"
        />
      </div>

      {/* All User & filters */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
        <h3 className="font-medium">
          สมาชิกทั้งหมด{" "}
          <span className="mx-2 text-primary text-xl font-semibold">
            {membersData?.pagination?.total || 0}
          </span>{" "}
          คน
        </h3>
        <ActionMember
          fullName={fullName}
          subdistrict={subdistrict}
          district={district}
          province={province}
          onFullNameChange={setFullName}
          onSearch={() => setSearchFullName(fullName)}
          onSelectedChange={handleSelectedChange}
          limit={limit}
          onLimitChange={setLimit}
          isLoadingMembers={isLoadingMembers}
          isLoadingDropdown={isLoadingDropdown}
          dropdownData={dropdownData}
        />
      </div>

      {/* Table */}
      {membersData && membersData?.data.length !== 0 ? (
        <MembersTable members={membersData?.data || []} />
      ) : isLoadingMembers ? (
        <div className="w-full flex items-center justify-center">
          <p className="text-gray-500">กำลังโหลด...</p>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center">
          <p className="text-gray-500">ไม่พบข้อมูล</p>
        </div>
      )}

      {/* Pagination Logic */}
      {membersData && membersData?.data.length !== 0 ? (
        <div className="w-full flex items-center justify-center mt-4">
          <Pagination
            page={page}
            totalPages={membersData?.pagination?.totalPages || 0}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ManageMembersPage;
