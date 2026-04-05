import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, User, Loader2 } from "lucide-react";
import type { IMember } from "@/types/member_types";
import { getMembers } from "@/services/memberServices";

interface MemberSearchSelectProps {
  onSelect: (member: IMember) => void;
  excludeIds?: string[]; // IDs already selected by other applicants
  label?: string;
}

const MemberSearchSelect = ({
  onSelect,
  excludeIds = [],
  label = "ค้นหาสมาชิก",
}: MemberSearchSelectProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await getMembers({
          fullName: query.trim(),
          subdistrict: "",
          district: "",
          province: "",
          limit: 20,
          page: 1,
        });
        const members: IMember[] = response?.data || [];
        // Filter out already-selected members
        const filtered = members.filter(
          (m) => !excludeIds.includes(m.id),
        );
        setResults(filtered);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, excludeIds]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (member: IMember) => {
    onSelect(member);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Label className="mb-2 block">{label}</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="พิมพ์ชื่อสมาชิกเพื่อค้นหา..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg max-h-72 overflow-y-auto">
          {results.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => handleSelect(member)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors border-b last:border-b-0"
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {member.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  รหัสสมาชิก: {member.memberId} · บัตรปชช: {member.idCard}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim().length >= 1 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg px-4 py-6 text-center text-sm text-muted-foreground">
          ไม่พบสมาชิกที่ค้นหา
        </div>
      )}
    </div>
  );
};

export default MemberSearchSelect;
