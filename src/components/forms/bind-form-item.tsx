import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input.tsx';
import { FormInputHelper } from '@/helpers/FormInputHelper.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import InputNumberWithChevrons from '@/components/inputs/input-number-with-chevrons.tsx'
import InputWithStartAddOn from '@/components/inputs/input-with-start-add-on.tsx'

import InputPassword from '@/components/inputs/input-password.tsx'
import { PhoneInput } from '@/components/inputs/phone-input.tsx'
import { cn } from '@/lib/utils.ts'
import ColorPickerInput from "@/components/inputs/ColorPickerInput.tsx";
import { Checkbox } from '@/components/ui/checkbox.tsx'
import { DateInput } from '@/components/inputs/DateInput.tsx'
import { DateTimeInput } from "@/components/inputs/DateTimeInput.tsx"
import type { Dispatch, SetStateAction } from "react"


export interface FieldOption {
  label?: string;
  tag: string;
  input_type: 'text' | 'textarea' | 'select' | 'file' | 'number' | 'link' | 'password' | 'phone' | 'richtexteditor' | "colorpicker" | "colorpicker_" | 'multiselect' | 'checkbox' | 'date' | 'datetime' | 'email';
  placeholder?: string;
  required?: boolean;
  size?: string;
  currency?: string
  defaultValue?: string
  options?: { value: string; label: string, hex?: string }[]; // Pour les selects
  files_array?: File[]
  setFiles?: Dispatch<SetStateAction<File[]>> // Make setFiles optional
  accepts?: string,


}

const defaultColors = [
  { value: "blue", label: "Bleu", hex: "#3b82f6" },
  { value: "indigo", label: "Indigo", hex: "#6366f1" },
  { value: "pink", label: "Rose", hex: "#ec4899" },
  { value: "red", label: "Rouge", hex: "#ef4444" },
  { value: "orange", label: "Orange", hex: "#f97316" },
  { value: "amber", label: "Ambre", hex: "#f59e0b" },
  { value: "emerald", label: "Émeraude", hex: "#10b981" },
];



const BindFormItem = ({ index, option, form, tag, readonly = false }: { index: number, readonly: boolean, option: FieldOption; form: never; tag: string }) => {


  return (
    <FormField
      key={index}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      control={form.control}
      name={tag}
      render={({ field }) => (
        <FormItem className={option?.size ?? 'col-span-12'}>
          <p className={`text-sm font-medium mt-2 ${option?.required ? "after:content-['*'] after:ml-1 after:text-red-500" : ''}`}>
            {option.label}
          </p>
          <FormControl>

            {option.input_type === 'textarea' ? (
              <Textarea
                className={` ${FormInputHelper.getInputBorderClass(form, option.tag, field.value)} resize-none w-full min-h-[150px]`}
                placeholder={option.placeholder}
                {...field}
                readOnly={readonly}
                value={(field.value as string) || ''}
              />
            ) : option.input_type === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  disabled={readonly}
                  className="w-6 h-6 border border-gray-600"
                />
                <label className="text-sm text-gray-700">{option.placeholder || option.label}</label>
              </div>
            ) : option.input_type === 'date' ? (
              <DateInput
                value={field.value as string}
                onChange={field.onChange}
                placeholder={option.placeholder}
                disabled={readonly}
              />
            ) : option.input_type === 'datetime' ? (
              <DateTimeInput
                value={field.value as string}
                onChange={field.onChange}
                disabled={readonly}
              />
            ) : option.input_type === 'select' ? (
              <Select value={(field.value as string) || ''} onValueChange={field.onChange} defaultValue={option.defaultValue} disabled={readonly}>
                <SelectTrigger className={` ${FormInputHelper.getInputBorderClass(form, option.tag, field.value)}`} >
                  <SelectValue placeholder={(option.placeholder as string) || ''} />
                </SelectTrigger>
                <SelectContent aria-readonly={readonly}>
                  {option.options && option.options.length > 0 &&
                    option.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            ) : option.input_type === "colorpicker_" ? (
              <ColorPickerInput
                colors={option.options?.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                  hex: opt.hex || "",
                })) || defaultColors}
                value={field.value || ""}
                onChange={field.onChange}
              />
            ) : option.input_type === "colorpicker" ? (
              <Select
                value={(field.value as string) || ''}
                onValueChange={field.onChange}
                defaultValue={option.defaultValue}
                disabled={readonly}
              >
                <SelectTrigger className={` ${FormInputHelper.getInputBorderClass(form, option.tag, field.value)}`}>
                  <SelectValue placeholder={(option.placeholder as string) || ''} />
                </SelectTrigger>
                <SelectContent aria-readonly={readonly}>
                  {option.options && option.options.length > 0 &&
                    option.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-sm border"
                            style={{ backgroundColor: opt.hex }}
                          ></span>
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            ) : option.input_type === 'file' ? (
              <Input
                type="file"
                accept={option.accepts ?? "image/jpeg,image/png,application/pdf"}
                className={` ${FormInputHelper.getInputBorderClass(form, option.tag, field.value)}`}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  field.onChange(file);
                }}
                readOnly={readonly}
              />
            ) : option.input_type === 'number' ? (
              <InputNumberWithChevrons
                {...option && option.currency ? { currency: option.currency } : {}}
                className={` ${FormInputHelper.getInputBorderClass(form, option.tag, field.value)}`}
                {...field}
                value={(field.value as number) || 0}
                {...readonly ? { readOnly: false } : {}}

              />
            ) : option.input_type == "phone" ? (
              <PhoneInput
                className={cn(` ${FormInputHelper.getInputBorderClass(form, option.tag, field.value)}`)} {...field}
                value={(field.value as string) || ""}
                onChange={(dialCode: string, phoneNumber: string) => {
                  if (dialCode && phoneNumber) {
                    field.onChange(dialCode.replace("+", "") + "_" + phoneNumber);
                  } else {
                    field.onChange("");
                  }
                }}

                placeholder={option.placeholder ?? "-- -- -- -- --"}
                defaultCountry='BJ'

                defaultDialCode="+229"

              />
            ) : option.input_type === 'link' ? (
              <InputWithStartAddOn
                className={` ${FormInputHelper.getInputBorderClass(form, option?.tag, field.value)}`}
                {...field}
                value={(field.value as string) || ""}
                placeholder={option.placeholder}
                {...readonly ? { readOnly: true } : {}}

              />
            ) : option.input_type === 'password' ? (
              <InputPassword
                className={` ${FormInputHelper.getInputBorderClass(form, option?.tag, field.value)}`}
                {...field}
                value={(field.value as string) || ""}
                placeholder={option.placeholder}
              />

            ) : option.input_type === 'email' ? (
              <Input
                type="email"
                className={` ${FormInputHelper.getInputBorderClass(form, option?.tag, field.value)}`}
                placeholder={option.placeholder}
                {...field}
                value={(field.value as string) || ''}
                readOnly={readonly}
              />
            ) : (
              <Input
                type="text"
                className={` ${FormInputHelper.getInputBorderClass(form, option?.tag, field.value)}`}
                placeholder={option.placeholder}
                {...field}
                value={(field.value as string) || ''}
                readOnly={readonly}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { BindFormItem };
