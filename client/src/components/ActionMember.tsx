import { ListFilter, Plus, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import type { IDropdownData } from "@/types/dropdown_types";
import MemberForm from "./form/MemberForm";
import { useState } from "react";

interface ActionMemberProps {
  fullName: string;
  subdistrict: string;
  district: string;
  province: string;
  limit: number;
  onFullNameChange: (fullName: string) => void;
  onSearch: () => void;
  onSelectedChange: (name: string, value: string) => void;
  onLimitChange: (limit: number) => void;
  isLoadingMembers: boolean;
  isLoadingDropdown: boolean;
  dropdownData: IDropdownData;
}

const ActionMember = ({
  fullName,
  subdistrict,
  district,
  province,
  limit,
  onFullNameChange,
  onSearch,
  onSelectedChange,
  onLimitChange,
  isLoadingMembers,
  isLoadingDropdown,
  dropdownData,
}: ActionMemberProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Search */}
      <InputGroup className="w-full max-w-sm">
        <InputGroupInput
          placeholder="ค้นหา..."
          name="fullName"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          disabled={isLoadingMembers || isLoadingDropdown}
        />
        <InputGroupAddon className="cursor-pointer" onClick={onSearch}>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {/* Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          disabled={isLoadingMembers || isLoadingDropdown}
          className="cursor-pointer"
        >
          <Button variant="outline">
            <ListFilter /> ตัวกรอง
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {/* Subdistrict */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>ตำบล</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>ตำบล</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={subdistrict}
                    onValueChange={(value: string) =>
                      onSelectedChange("subdistrict", value)
                    }
                  >
                    <DropdownMenuRadioItem value="all">
                      ทั้งหมด
                    </DropdownMenuRadioItem>
                    {dropdownData?.subdistricts?.map((subdistrict) => (
                      <DropdownMenuRadioItem
                        key={subdistrict}
                        value={subdistrict}
                      >
                        {subdistrict}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {/* District */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>อำเภอ</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>อำเภอ</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={district}
                    onValueChange={(value: string) =>
                      onSelectedChange("district", value)
                    }
                  >
                    <DropdownMenuRadioItem value="all">
                      ทั้งหมด
                    </DropdownMenuRadioItem>
                    {dropdownData?.districts?.map((district) => (
                      <DropdownMenuRadioItem key={district} value={district}>
                        {district}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {/* Province */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>จังหวัด</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>จังหวัด</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={province}
                    onValueChange={(value: string) =>
                      onSelectedChange("province", value)
                    }
                  >
                    <DropdownMenuRadioItem value="all">
                      ทั้งหมด
                    </DropdownMenuRadioItem>
                    {dropdownData?.provinces?.map((province) => (
                      <DropdownMenuRadioItem key={province} value={province}>
                        {province}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {/* Limit */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>จำนวนแถวต่อหน้า</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>จำนวนแถวต่อหน้า</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={limit.toString()}
                    onValueChange={(value: string) =>
                      onLimitChange(Number(value))
                    }
                  >
                    <DropdownMenuRadioItem value="20">20</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="100">
                      100
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="200">
                      200
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Member */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button
            className="cursor-pointer"
            disabled={isLoadingMembers || isLoadingDropdown}
          >
            <Plus className="mr-2 h-4 w-4" /> เพิ่มสมาชิก
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-2xl w-full z-70 [&>button]:size-8 [&>button]:p-2 [&>button]:rounded-full [&>button]:hover:bg-primary/10 [&>button]:hover:text-primary [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:duration-200 [&>button]:transition-colors">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">เพิ่มสมาชิกสหกรณ์ใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลรายละเอียดของสมาชิกใหม่ด้านล่าง ข้อมูลที่มีเครื่องหมาย *
              จำเป็นต้องกรอก
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            onSuccess={() => setIsAddOpen(false)}
            onCancel={() => setIsAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionMember;
