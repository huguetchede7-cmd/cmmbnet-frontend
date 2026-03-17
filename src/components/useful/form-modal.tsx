import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Icon } from '@tabler/icons-react';
import ButtonWithLoading from '@/components/ui/button-with-loading';
import { Form } from "../ui/form";
import { BindFormItem, FieldOption } from '@/components/forms/bind-form-item';
import { Skeleton } from '@/components/ui/skeleton';
import clsx from 'clsx';


// Types
interface FormModalProps {
    icon?: Icon;
    title?: string;
    description?: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    fields: FieldOption[];
    className?: string;
    loading?: boolean;
    isSubmitLoading?: boolean;
    onSubmit: (data: never) => void;
    onClose?: () => void;
    onSubmitSuccess?: () => void;
    size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
}

// ✅ Map des tailles vers des classes
const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    xxl: "max-w-5xl",
    xxxl: "max-w-7xl",
};

export default function FormModal({
    icon: Icon,
    title,
    description,
    isOpen,
    setIsOpen,
    fields,
    form,
    onSubmit,
    isSubmitLoading,
    onClose,
    className,
    size = "md",
    loading = false,
    onSubmitSuccess
}: FormModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose?.();
            }
            setIsOpen(open);
        }}>
            <AlertDialogContent className={clsx(
                sizeClasses[size],
                "flex flex-col p-0 sm:max-h-[min(640px,80vh)]"
            ) + " " + (className ?? "")}>
                <AlertDialogHeader className="sticky top-0 z-10 bg-background px-6 pt-6 rounded-t-lg">
                    <div>
                        <AlertDialogTitle className={"flex items-center gap-2"}>
                            {Icon && <Icon className="h-5 w-5" />}
                            {title ?? ""}
                        </AlertDialogTitle>
                        {description && (
                            <AlertDialogDescription className={"text-xs italic"}>
                                {description}
                            </AlertDialogDescription>
                        )}
                    </div>
                </AlertDialogHeader>

                {/* Corps du formulaire scrollable */}
                <div className="flex-1 overflow-y-auto px-6 pb-20">
                    {loading ? (
                        <div className="grid grid-cols-12 gap-2 p-2">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="col-span-6 h-10" />
                            ))}
                        </div>
                    ) : (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(async () => {
                                    try {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-expect-error
                                        onSubmit(form.getValues());
                                        onSubmitSuccess?.();
                                    } catch (error) {
                                        console.error("Erreur de soumission du formulaire :", error);
                                    }
                                })}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-12 gap-4 mb-16">
                                    {fields.map((option, index) => (
                                        <div key={index} className={option.size}>
                                            <BindFormItem
                                                index={index}
                                                readonly={false}
                                                option={option}
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-expect-error
                                                form={form}
                                                tag={option.tag}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Le footer sera en dehors de la zone scrollable */}
                                <AlertDialogFooter className="fixed left-1/2 -translate-x-1/2 bottom-0 z-10 bg-white px-6 pb-3 pt-4 w-full max-w-[inherit] rounded-b-lg">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {

                                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                            onClose && onClose();
                                            setIsOpen(false);
                                        }}
                                        className="btn-exclude border-1 border-gray-300 bg-gray-50 w-fit flex items-center gap-2 bg-gray-200 hover:bg-gray-300"
                                        disabled={loading}
                                    >
                                        Annuler
                                    </Button>
                                    <ButtonWithLoading
                                        type="submit"
                                        classList="w-fit flex items-center gap-2"
                                        title="Enregistrer"
                                        loading={isSubmitLoading ?? false}
                                    />
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    )}
                </div>

                {/* Footer fixe */}

            </AlertDialogContent>
        </AlertDialog>
    );
}
