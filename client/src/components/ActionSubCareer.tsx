import { Plus, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import AddSubCareerForm from "./form/AddSubCareerForm";

interface ActionSubCareerProps {
  categoryId: string;
  searchTerm: string;
  onSearchTermChange: (searchTerm: string) => void;
  isAddOpen: boolean;
  setIsAddOpen: (isAddOpen: boolean) => void;
  isPending: boolean;
}

const ActionSubCareer = ({
  categoryId,
  searchTerm,
  onSearchTermChange,
  isAddOpen,
  setIsAddOpen,
  isPending,
}: ActionSubCareerProps) => {
  
  return (
    <div className="flex items-center gap-2">
      {/* Search Term */}
      <InputGroup className="w-full max-w-sm">
        <InputGroupInput
          placeholder="ค้นหา..."
          name="searchTerm"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
        <InputGroupAddon className="cursor-pointer">
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {/* Add new category */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer">
            <Plus /> เพิ่มอาชีพ
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-sm w-full z-70 [&>button]:size-8 [&>button]:p-2 [&>button]:rounded-full [&>button]:hover:bg-primary/10 [&>button]:hover:text-primary [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:duration-200 [&>button]:transition-colors">
          <DialogHeader>
            <DialogTitle className="text-2xl">เพิ่มอาชีพ</DialogTitle>
          </DialogHeader>

          {/* add form */}
          <AddSubCareerForm categoryId={categoryId} setIsAddOpen={setIsAddOpen} isPending={isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionSubCareer;
