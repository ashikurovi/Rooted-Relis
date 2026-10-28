"use client";

import { Search } from "lucide-react";
import { SimpleSelect } from "@/components/ui/simple-select";

interface TableControlsProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter?: string;
  setStatusFilter?: (val: string) => void;
  statusOptions?: { label: string; value: string }[];
  searchPlaceholder?: string;
  className?: string;
}

export function TableControls({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  statusOptions,
  searchPlaceholder = "Search blogs...",
  className = "",
}: TableControlsProps) {
  const hasFilter = statusOptions && statusOptions.length > 0 && statusFilter !== undefined && setStatusFilter !== undefined;

  return (
    <div className={`flex flex-col md:flex-row gap-4 items-center justify-between mb-4 ${className}`}>
      <div className={`relative w-full ${hasFilter ? "md:flex-1" : "w-full"}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-normal text-gray-800 placeholder-gray-400 rounded-xl focus:border-gray-300 focus:outline-none transition-all shadow-2xs" 
        />
      </div>
      {hasFilter && (
        <div className="w-full md:w-auto">
          <SimpleSelect 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
            className="md:w-auto min-w-[160px] rounded-xl border-gray-200 py-2.5 text-sm"
          />
        </div>
      )}
    </div>
  );
}
