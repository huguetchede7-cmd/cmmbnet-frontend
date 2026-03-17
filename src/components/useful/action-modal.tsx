import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import ButtonWithLoading from "@/components/ui/button-with-loading.tsx"
import { Button } from "@/components/ui/button.tsx";

interface ActionModalProps {
    title: string
    description: string
    isOpen: boolean
    isetIsOpen: (isOpen: boolean) => void
    isLoading?: boolean
    onConfirm: () => void
    onCancel?: () => void
    confirmText?: string
    confirmColor?: "red" | "blue" | "green" | "yellow" | "gray" | "purple"
    icon?: React.ReactNode // 👈 ici
}

const getButtonColorClasses = (color: ActionModalProps["confirmColor"] = "blue") => {
    const colors = {
        red: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        blue: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
        green: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
        yellow: "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700",
        gray: "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700",
        purple: "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
    }
    return colors[color] ?? colors.blue
}

export default function ActionModal({
    title,
    description,
    isOpen,
    isetIsOpen,
    isLoading,
    onConfirm,
    onCancel,
    confirmText = "Confirmer",
    confirmColor = "blue",
    icon,
}: ActionModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={isetIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader className="flex flex-col  space-y-2">
                    {icon && <div className="text-2xl font-bold">{icon}</div>}
                    <AlertDialogTitle className="text- font-bold m-0">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm m-0">{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <Button onClick={onCancel}
                        style={{ backgroundColor: "#ffffff", color: "#000" }}
                        variant={"outline"}
                        className="btn-exclude border-1 border-gray-300 bg-gray-50"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="w-fit bg-transparent hover:bg-transparent p-0 shadow-none"
                    >
                        <ButtonWithLoading
                            type="button"
                            classList={`w-fit flex items-center gap-2 text-white ${getButtonColorClasses(confirmColor)}`}
                            title={confirmText}
                            loading={isLoading ? isLoading : false}
                        />
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

