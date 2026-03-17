// components/LottieAlertDialog.tsx

import {
    AlertDialog,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {Button} from "@/components/ui/button.tsx";

type LottieAlertDialogProps = {
    isOpen: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    lottieUrl: string;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    loop?: boolean;
    autoplay?: boolean;
    confirmButtonClassName?: string;
    cancelButtonClassName?: string;
};

export const LottieModal = ({
                                isOpen,
                                onClose,
                                onConfirm,
                                lottieUrl,
                                title = "Attention",
                                message,
                                confirmText = "Continuer",
                                cancelText = "OK",
                                cancelButtonClassName="",
                                confirmButtonClassName="",
                                loop = true,
                                autoplay = true,
                                  }: LottieAlertDialogProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
            <AlertDialogContent className="sm:max-w-sm">
                <div className="w-full h-24 flex items-center justify-center">
                    <DotLottieReact
                        src={lottieUrl}
                        loop={loop}
                        autoplay={autoplay}
                        style={{width: "100%", height: "100%"}}
                    />
                </div>
                <div>
                    <h3 className="text-center text-lg font-semibold">{title}</h3>
                    <p className={"text-center text-sm font-normal text-muted-foreground"}>{message}</p>

                </div>
                <div className={"flex justify-center gap-2 mt-2"}>
                    {onClose && <Button onClick={onClose} className={cancelButtonClassName}>{cancelText}</Button>}
                    {onConfirm && <Button onClick={onConfirm} className={confirmButtonClassName}>{confirmText}</Button>}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};
