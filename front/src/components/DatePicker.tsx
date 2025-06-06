"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// locale
import { ptBR } from "date-fns/locale"

// Prop types for the DatePicker component
// This component allows users to select a date using a calendar popover.
// It accepts an expiryDate prop to set the initial date and a setExpiryDate function to update the date.

type DatePickerProps = {
  expiryDate: Date | undefined;
  setExpiryDate: (date: Date | undefined) => void;
}

export function DatePicker({ expiryDate, setExpiryDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "form-input border border-purple-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 h-11 focus:ring-purple-500 flex justify-center",
            !expiryDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {expiryDate ? format(expiryDate, "PPP", { locale: ptBR }) : <span className="text-purple-600">Escolha uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-[320px] text-xl  p-0 bg-white rounded-lg shadow-lg">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={expiryDate}
          onSelect={setExpiryDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}