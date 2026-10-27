import { Search } from "lucide-react";
import { SimpleSelect } from "@/components/ui/simple-select";

interface TableControlsProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  statusOptions: { label: string; value: string }[];
  searchPlaceholder?: string;
}

export function TableControls({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  statusOptions,
  searchPlaceholder = "Search..."
}: TableControlsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
      <div className="relative w-full md:max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full border border-gray-300 bg-white p-2 pl-9 text-sm font-medium text-gray-800 placeholder-gray-400 rounded-md focus:border-[#106840] focus:ring-1 focus:ring-[#106840] focus:outline-none transition-all" 
        />
      </div>
      <div className="w-full md:w-auto">
        <SimpleSelect 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="md:w-auto min-w-[160px]"
        />
      </div>
    </div>
  );
}
