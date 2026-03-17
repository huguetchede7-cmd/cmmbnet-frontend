import type { RolesAdminType } from "./UtilsTypes"


export interface UserModelTypes {
    fullname: string;
    avatar: string;
    email: string;
    token: string;
    name: string;
    phone: string;
    [key: string]: any | null;
    roles: RolesAdminType[]
}
