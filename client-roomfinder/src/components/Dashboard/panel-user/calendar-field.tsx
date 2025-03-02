import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover-dialog';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { fifteenYearsAgo } from '@/utils/functions';

interface CalendarFieldProps {
  field: any;
}

export const CalendarField: React.FC<CalendarFieldProps> = ({ field }) => {

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Fecha de nacimiento</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(field.value, "PPP", { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[120]" align="center">
          <Calendar
            mode="single"
            locale={es}
            selected={field.value}
            onSelect={field.onChange}
            disabled={{ after: fifteenYearsAgo }}
            defaultMonth={fifteenYearsAgo}
            initialFocus
            className="z-[120]"
          />
        </PopoverContent>
      </Popover>
      <FormDescription>
        Selecciona la fecha de nacimiento del usuario.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
};