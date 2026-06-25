"use client";

import { cn } from '@/lib/utils.ts';

interface InputNumberWithChevronsProps {
  label?: string;
  defaultValue?: number;
  currency?: string;
  value?: number;
  className?: string;
  onChange?: (value: number) => void;
  [key: string]: any;
}

export default function InputNumberWithChevrons({
  label,
  currency,
  className,
  value,
  onChange,
  ...props
}: InputNumberWithChevronsProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        type="number"
        min={0}
        placeholder="0"
        value={value || ""}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={cn(
          "flex h-9 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring",
          className
        )}
      />
    </div>
  );
}
