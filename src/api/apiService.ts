import ToastHelpers from '@/helpers/ToastHelpers';
import axios, { AxiosError } from 'axios';
import { genralConfig } from '../../config';
import { toast } from 'sonner';
import { useModalStore } from '@/contexts/modalUserLogginStore';

import type { UseFormReturn } from "react-hook-form"
import type { ApiResponseTypes } from "@/types/ApiResponseTypes.ts"

const apiClient = axios.create({
    baseURL: genralConfig.apiUrl,
    headers: { 'Content-Type': 'application/json' },
});

const checkAndHandleUnauthorized = (error: unknown) => {
    if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 401
    ) {
        useModalStore.getState().setShowModal(true);
    }
};

const get = async (
    data: { url: string; params?: unknown; headers?: unknown | null },
    miscellaneous: { userToken: string; hasNoSuccessModal?: boolean } | null = null
) => {
    try {
        const response = await apiClient.get(data.url, {
            params: data.params,
            headers: {
                Authorization: `${miscellaneous?.userToken}`,
                ...(data?.headers ?? {}),
            },
        });
        if (!miscellaneous?.hasNoSuccessModal) {
            handleSucess(response.data);
        }
        return response.data;
    } catch (error) {
        checkAndHandleUnauthorized(error);
        throw new Error(JSON.stringify(error));
    }
};

const post = async (
    data: { url: string; body?: unknown | null; headers?: unknown | null },
    miscellaneous: { userToken: string; hasNoSuccessModal?: boolean } | null = null
) => {
    try {
        const response = await apiClient.post(data.url, data.body, {
            headers: {
                Authorization: `${miscellaneous?.userToken}`,
                ...(data?.headers ?? {}),
            },
        });
        if (!miscellaneous?.hasNoSuccessModal) {
            handleSucess(response.data);
        }
        return response.data as ApiResponseTypes;
    } catch (error) {
        checkAndHandleUnauthorized(error);
        if (error instanceof AxiosError) {
            throw new Error(JSON.stringify(error?.response?.data));
        }
        throw error;
    }
};

const put = async (
    data: { url: string; body?: unknown | null; headers?: unknown | null },
    miscellaneous: { userToken: string; hasNoSuccessModal?: boolean } | null = null
) => {
    try {
        const response = await apiClient.put(data.url, data.body, {
            headers: {
                Authorization: `${miscellaneous?.userToken}`,
                ...(data?.headers ?? {}),
            },
        });
        if (!miscellaneous?.hasNoSuccessModal) {
            handleSucess(response.data);
        }
        return response.data as ApiResponseTypes;
    } catch (error) {
        checkAndHandleUnauthorized(error);
        if (error instanceof AxiosError) {
            throw new Error(JSON.stringify(error?.response?.data));
        }
        throw error;
    }
};

const del = async (
    data: { url: string; params?: unknown; headers?: unknown | null },
    miscellaneous: { userToken: string; hasNoSuccessModal?: boolean } | null = null
) => {
    try {
        const response = await apiClient.delete(data.url, {
            params: data.params,
            headers: {
                Authorization: `${miscellaneous?.userToken}`,
                ...(data?.headers ?? {}),
            },
        });
        if (!miscellaneous?.hasNoSuccessModal) {
            handleSucess(response.data);
        }
        return response.data as ApiResponseTypes;
    } catch (error) {
        checkAndHandleUnauthorized(error);
        if (error instanceof AxiosError) {
            throw new Error(JSON.stringify(error?.response?.data));
        }
        throw error;
    }
};

const handleError = (
    errorStr: string,
    miscelleanous?: { form?: unknown; hasNoFailureModal?: boolean }
) => {
    if (errorStr) {
        const error = JSON.parse(errorStr);

        if (!miscelleanous?.hasNoFailureModal) {
            toast.error(error?.message, ToastHelpers.UI.ERROR);
        }

        if (error.status == '401') {
            useModalStore.getState().setShowModal(true);
        } else {
            if (miscelleanous && miscelleanous?.form && error.errors) {
                Object.keys(error.errors).forEach((tag) => {
                    (miscelleanous?.form as UseFormReturn).setError(tag, {
                        type: 'manual',
                        message: error.errors[tag],
                    });
                });
                return;
            }
        }
    } else {
        console.error('Erreur réseau => Erreur inconnue');
        toast.error(
            'Problème survenu, veuillez réessayer plus tard',
            ToastHelpers.UI.ERROR
        );
    }

    return null;
};

const handleSucess = (responseData: { message?: string }) => {
    if (responseData?.message) {
        toast.success(
            responseData.message ?? 'Modification effectuée avec succès',
            ToastHelpers.UI.SUCCESS
        );
    }
};

const formatUrl = (path: string) => {
    return `${genralConfig.apiUrl}${path}`;
};

const apiService = { get, post, put, delete: del, handleError, formatUrl };

export default apiService;