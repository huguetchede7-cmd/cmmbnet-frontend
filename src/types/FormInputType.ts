type TextChangeHandler = (value: string) => void
type LocationChangeHandler = (latitude: number, longitude: number, address: string, department: string, city: string) => void

export type FormInputType = {
  tag: string
  label: string
  input_type: string
  size: string
  placeholder?: string
  required: boolean

  readonly?: boolean | undefined
  onCustomChange?: TextChangeHandler | LocationChangeHandler | undefined
  options?: { label: string; value: number | string }[] | undefined
  hasIAAutocomplete?: boolean | undefined
  defaultValue?: string | null | undefined
  defaultImg?: string | null | undefined
}
