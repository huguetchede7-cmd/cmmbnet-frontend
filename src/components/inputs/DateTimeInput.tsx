"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateTimeInput({
  value,
  onChange,
  disabled,
}: {
  value?: string
  onChange: (val: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  // Séparer date et heure depuis la valeur
  const datePart = value ? value.split(" ")[0] : ""
  const timePart = value ? value.split(" ")[1] : "00:00:00"

  const dateObj = datePart ? new Date(datePart) : undefined

  const handleDateChange = (d: Date | undefined) => {
    if (!d) return
    // Formater la date en YYYY-MM-DD local
    const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`
    onChange(`${formattedDate} ${timePart}`)
    setOpen(false)
  }

  const handleTimeChange = (t: string) => {
    const todayDate = datePart || `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
    onChange(`${todayDate} ${t}`)
  }

  return (
    <div className="flex gap-4">
      {/* Sélecteur Date */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="btn-exclude border-1 border-gray-300 bg-gray-50 w-36 justify-between font-normal"
          >
            {datePart || "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={dateObj}
            captionLayout="dropdown"
            toYear={2100}
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>

      {/* Sélecteur Time */}
      <Input
        type="time"
        step="1"
        value={timePart}
        disabled={disabled}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  )
}
