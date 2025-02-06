"use client";

import * as React from "react";
import { addDays, format, Locale } from "date-fns";
import { es } from "date-fns/locale"; // Importa el idioma que desees
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  locale?: Locale; // Agrega soporte para el idioma
}

export function DatePickerWithRange({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  locale = es, // Usa el idioma por defecto
  className,
}: DatePickerWithRangeProps & React.HTMLAttributes<HTMLDivElement>) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startDate || new Date(),
    to: endDate || addDays(new Date(), 7),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onStartDateChange(range?.from || null);
    onEndDateChange(range?.to || null);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-900",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y", { locale })} - {format(dateRange.to, "LLL dd, y", { locale })}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y", { locale })
              )
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            min={7}
            selected={dateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={locale}
            className="dark:bg-gray-800 dark:border-gray-900"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}