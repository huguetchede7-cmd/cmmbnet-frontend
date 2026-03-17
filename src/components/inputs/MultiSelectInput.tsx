"use client"


import { Label } from "@/components/ui/label"

import { cn } from "@/lib/utils"
import MultipleSelector, { type Option } from "../ui/multiselect"
import { type Control, Controller, type FieldValues } from "react-hook-form"
import type { Path } from "react-router-dom"




interface MultiSelectInputProps<T extends FieldValues> {
    name: Path<T>
    control: Control<T>
    label?: string
    placeholder?: string
    options: Option[]
    disabled?: boolean
    className?: string
    required?: boolean
}

export function MultiSelectInput<T extends FieldValues>({
                                                            name,
                                                            control,
                                                            label,
                                                            placeholder,
                                                            options,
                                                            disabled,
                                                            className,
                                                            required,
                                                        }: MultiSelectInputProps<T>) {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label && (
                <Label htmlFor={name}>
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}

            <Controller
                control={control}
                name={name}
                render={({ field, fieldState }) => (
                    <>
                        <MultipleSelector
                            {...field}
                            defaultOptions={options}
                            placeholder={placeholder ?? "Sélectionner..."}
                            disabled={disabled}
                            value={field.value || []} // ✅ ici toujours un tableau
                            onChange={(val: Option[]) => field.onChange(val)} // ✅ typage strict
                            emptyIndicator={
                                <p className="text-center text-sm text-muted-foreground">
                                    Aucun résultat
                                </p>
                            }
                        />
                        {fieldState?.error && (
                            <span className="text-xs text-red-500 mt-1">
                {fieldState.error.message}
              </span>
                        )}
                    </>
                )}
            />
        </div>
    )
}
