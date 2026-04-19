export const routeHelpers = {
    auth: {
        login: "/login",
        forgetPassword: "/forgot-password",
        pasword: {
            reset: "/password/reset",
        }
    },
    dashboard: {
        home: "/dashboard/welcome",
        index: "/dashboard/home",
        notifications: "/dashboard/notifications",
        logout: "/dashboard/logout",

        clients: {
            index: "/dashboard/clients",
            create: "/dashboard/clients/create",
            show: "/dashboard/clients/detail",
        },

        administrator: {
            index: "/dashboard/administrator",
            create: "/dashboard/administrator/create",
            show: "/dashboard/administrator/detail",
        },

    },

    composeWithQueries: (url: string, queries: { [key: string]: string | number }) => {
        const searchParams = new URLSearchParams();
        Object.entries(queries).forEach(([key, value]) => {
            searchParams.append(key, value as string);
        });
        return `${url}?${searchParams.toString()}`
    },

    composeWithParams: (url: string, params: { [key: string]: string | number }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return url.replace(/:([a-zA-Z0-9_]+)/g, (match, key) => {
            if (params[key] !== undefined) {
                return params[key].toString(); // Replace the placeholder
            }
            throw new Error(`Missing parameter for :${key}`);
        });
    },
};