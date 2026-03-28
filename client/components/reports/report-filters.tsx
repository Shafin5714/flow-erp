"use client";

import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";

interface ReportFiltersProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  showDateRange?: boolean;
}

export function ReportFilters({
  dateRange,
  onDateRangeChange,
  showDateRange = true,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
      {showDateRange && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Date Range
          </label>
          <CalendarDateRangePicker
            date={dateRange}
            onDateChange={onDateRangeChange}
            className="w-[280px]"
          />
        </div>
      )}

      {/* We can add category/vendor dropdowns here in the future as needed per report */}
    </div>
  );
}
