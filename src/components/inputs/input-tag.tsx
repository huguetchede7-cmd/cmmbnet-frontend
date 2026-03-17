
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react"
import { type Dispatch, forwardRef, type SetStateAction, useState } from "react"



export interface InputTagsProps  {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  className?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}
export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("");

    const normalize = (val: string) => val.trim().toLowerCase();

    const addPendingDataPoint = () => {
      const tag = normalize(pendingDataPoint);
      if (!tag || tag.length < 2) return;

      const newTags = new Set([...value, tag]);
      onChange(Array.from(newTags));
      setPendingDataPoint("");
    };

    const removeTag = (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (["Enter", ",", " "].includes(e.key)) {
        e.preventDefault();
        addPendingDataPoint();
      }

      // Supprimer le dernier tag si input vide et backspace
      if (e.key === "Backspace" && !pendingDataPoint && value.length) {
        e.preventDefault();
        removeTag(value[value.length - 1]);
      }
    };


    return (
      <>
        <div className="flex">
          <Input
            className={`rounded-r-none ${typeof props.className === "string" ? props.className : ""}`}
            ref={ref}
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter un tag et appuyer sur Entrée"
            {...props}
          />
          <Button
            type="button"
            variant="secondary"
            className="rounded-l-none border-l-0"
            onClick={addPendingDataPoint}
            disabled={!pendingDataPoint.trim()}
            title="Ajouter le tag"
          >
            Ajouter
          </Button>
        </div>
        <div className=" rounded-md min-h-[2.5rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center">
          {value.map((item, idx) => (
            <span key={idx} className="flex items-center justify-between text-xs rounded-full bg-secondary py-0.5 px-2">
              <span className="truncate max-w-[10ch]">{item}</span>
                <XIcon className="w-3 ms-2 hover:cursor-pointer hover:text-red-600"  onClick={() => removeTag(item)} />
            </span>
          ))}
        </div>
      </>
    );
  }
);
