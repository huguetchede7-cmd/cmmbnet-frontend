import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx'
import { Button } from '@/components/ui/button.tsx'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar.tsx'

export function DateInput({
                            value,
                            onChange,
                            placeholder,
                            disabled,
                          }: {
  value?: string
  onChange: (val: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] =useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [month, setMonth] =useState<Date | undefined>(date)

  // formater en YYYY-MM-DD
  function formatISO(d: Date | undefined) {
    if (!d) return ""
    return d.toISOString().split("T")[0] // → "2025-02-26"
  }

  useEffect(() => {
    if (value) {
      const parsed = new Date(value)
      if (!isNaN(parsed.getTime())) {
        setDate(parsed)
        setMonth(parsed)
      }
    }
  }, [value])

  return (
    <div className="relative flex gap-2">
      <Input
        value={value || ""}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-background pr-10"
        onChange={(e) => {
          const newDate = new Date(e.target.value)
          if (!isNaN(newDate.getTime())) {
            onChange(formatISO(newDate))
          } else {
            onChange(e.target.value)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            disabled={disabled}
          >
            <CalendarIcon className="size-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(d) => {
              setDate(d)
              onChange(formatISO(d)) // 🔥 renvoie toujours YYYY-MM-DD
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
