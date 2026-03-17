export type PopupType = {
    id: number;
    image: string | null;
    image_mobile?: string | null;
    redirection_link: string | null;
    created_by: number;
    created_at: string; // ou `Date` si tu les transformes à l'import
    updated_at: string; // ou `Date`
    deleted_at: string | null; // ou `Date | null`
};