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
            search: "/dashboard/clients/search",
        },

        comptes: {
    index: "/dashboard/comptes",
    create: "/dashboard/comptes/create",
    show: "/dashboard/comptes/detail",
    detail: "/dashboard/comptes/detail",
},

        groupes: {
            index: "/dashboard/groupes",
            create: "/dashboard/groupes/create",
            show: "/dashboard/groupes/detail",
        },

         epargne: {
         depots: {
         index: "/dashboard/epargne/depots",
         create: "/dashboard/epargne/depots/create",
         },

         retraits: {
         index: "/dashboard/epargne/retraits",
         create: "/dashboard/epargne/retraits/create",
         },
         },

         transactions: {
         historique: {
         index: "/dashboard/transactions/historique",
          },
         transfert: {
         index: "/dashboard/transactions/transfert",
         create: "/dashboard/transactions/transfert/create",
         },
         },

         paiements: {
         index: "/dashboard/paiements",
         create: "/dashboard/paiements/create",
         factures: {
         index: "/dashboard/paiements/factures",
         create: "/dashboard/paiements/factures/create",
         },
         },

         rapports: {
         financier: {
         index: "/dashboard/rapports/financier",
         },
         epargne: {
         index: "/dashboard/rapports/epargne",
         },
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
        // @ts-ignore
        return url.replace(/:([a-zA-Z0-9_]+)/g, (match, key) => {
            if (params[key] !== undefined) {
                return params[key].toString();
            }
            throw new Error(`Missing parameter for :${key}`);
        });
    },
};