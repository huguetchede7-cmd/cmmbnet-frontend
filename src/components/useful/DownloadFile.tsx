import { LottieModal } from "@/components/useful/LottieModal.tsx";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth.ts";

interface DownloadFileProps {
    urlDownload: string;
    fileName: string;
    triggerDownload: boolean; // <- déclencheur
    onDownloadComplete?: () => void; // <- callback facultatif
    titleLoad?: string;
    messageLoad?: string;
    titleError?: string;
    messageError?: string;
    titleSuccess?: string;
    messageSuccess?: string;
}

export default function DownloadFile({
                                         urlDownload,
                                         fileName,
                                         triggerDownload,
                                         onDownloadComplete,
                                         titleLoad,
                                         messageLoad,
                                         titleError,
                                         messageError,
                                         titleSuccess,
                                         messageSuccess
                                     }: DownloadFileProps) {
    const { user } = useAuth();
    const { lottieFiles, errorLottieFiles, checkLottieFiles } = {
        lottieFiles:"/lottiesFiles/loader.json",
        checkLottieFiles: "/lottiesFiles/check.json",
        errorLottieFiles: "/lottiesFiles/cross.json"
    };

    const [isOpenLottieModal, setIsOpenLottieModal] = useState(false);
    const [shouldAllowClose, setShouldAllowClose] = useState(false);
    const [lottiesTitle, setLottiesTitle] = useState('');
    const [lottiesDescription, setLottiesDescription] = useState('');
    const [urlLottiesFille, setUrlLottiesFille] = useState('');

    const downloadFile = async () => {
        setShouldAllowClose(false);
        setUrlLottiesFille(lottieFiles);
        setLottiesTitle(titleLoad || "Téléchargement ...");
        setLottiesDescription(messageLoad || "Fichier en cours de téléchargement");
        setIsOpenLottieModal(true);

        try {
            const response = await fetch(`${urlDownload}`, {
                method: "GET",
                headers: {
                    Authorization: `${user?.type ?? ""} ${user?.token ?? ""}`,
                },
            });

            if (!response.ok) {
                throw new Error("Erreur lors du téléchargement du fichier");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setUrlLottiesFille(checkLottieFiles);
            setLottiesTitle(titleSuccess || "Succès");
            setLottiesDescription(messageSuccess || "Le fichier a été téléchargé avec succès");
            setShouldAllowClose(true);
/*
            setTimeout(() => {
                setIsOpenLottieModal(false);

            }, 2000);*/
            onDownloadComplete?.();

        } catch (error) {
            setUrlLottiesFille(errorLottieFiles);
            setLottiesTitle(titleError || "Erreur");
            setLottiesDescription(messageError || "Une erreur est survenue lors du téléchargement.");
            setShouldAllowClose(true);

            onDownloadComplete?.();
        }
    };

    // 👇 Déclenche le téléchargement quand triggerDownload passe à true
    useEffect(() => {
        if (triggerDownload) {
            downloadFile();
        }
    }, [triggerDownload]);

    return (
        <LottieModal
            isOpen={isOpenLottieModal}
            onClose={shouldAllowClose ? () => setIsOpenLottieModal(false) : undefined}
            lottieUrl={urlLottiesFille}
            title={lottiesTitle}
            message={lottiesDescription}
            loop
            autoplay
        />
    );
}
