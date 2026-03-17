import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ColorPickerInputProps = {
    label?: string;
    colors: { value: string; label: string; hex: string }[];
    value: string;
    onChange: (value: string) => void;
};

export default function ColorPickerInput({
                                             label,
                                             colors,
                                             value,
                                             onChange,
                                         }: ColorPickerInputProps) {
    return (
        <fieldset className="space-y-4">
            {label && (
                <legend className="text-foreground text-sm leading-none font-medium">
                    {label}
                </legend>
            )}
            <RadioGroup
                className="flex gap-1.5"
                value={value}
                onValueChange={onChange}
            >
                {colors.map((color) => (
                    <RadioGroupItem
                        key={color.value}
                        value={color.value}
                        aria-label={color.label}
                        className={`size-6 border-${color.value}-500 bg-${color.value}-500 shadow-none data-[state=checked]:border-${color.value}-500 data-[state=checked]:bg-${color.value}-500`}
                        style={{
                            borderColor: color.hex,
                            backgroundColor: color.hex,
                        }}
                    />
                ))}
            </RadioGroup>
        </fieldset>
    );
}
