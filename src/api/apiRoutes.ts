const apiRoutes = {
    admin: {
        auth: {
            login: "/admin/auth/login",
        },
        app: {
            accounts: {
                stats: "/admin/app/accounts/stats",
                list: "/admin/app/accounts/list",
                create: "/admin/app/accounts/create/admin",
                createClient: "/admin/app/accounts/create/client",
                createDeliverer: "/admin/app/accounts/create/deliverer",
                createBusiness: "/admin/app/accounts/create/business",
            },
            dashboard: {
                stats: "/admin/app/dashboard/stats",
                order: "/admin/app/reports/orders",
                stats_rdv: "/admin/app/reports/appointments",
                appointments: "/admin/app/appointments?page=1",
                stats_users: "/admin/app/reports/users",
                pendingRequests: "/admin/app/reports/pending-requests",
            },
            profile: {
                detail: "/admin/app/detail",
                logout: "/admin/app/auth/logout"
            },
            bannersImages: {
                list: "/admin/app/banners",
                create: "/admin/app/banners/create",
                update: "/admin/app/banners",
                delete: "/admin/app/banners",
            },
            bannersTexts: {
                list: "/admin/app/banners/texts",
                create: "/admin/app/banners/texts",
                update: "/admin/app/banners/texts",
                delete: "/admin/app/banners/texts"
            },
            popups: {
                list: "/admin/app/popups",
                create: "/admin/app/popups/create",
                update: (id: number) => `/admin/app/popups/${id}`,
                delete: (id: number) => `/admin/app/popups/${id}`
            },
            testimonials: {
                list: "/admin/app/testimonials",
                create: "/admin/app/testimonials/create",
                update: "/admin/app/testimonials/update",
                delete: "/admin/app/testimonials/delete"
            },
            brands: {
                list: "/admin/app/brands",
                create: "/admin/app/brands",
                update: "/admin/app/brands",
                delete: "/admin/app/brands"
            },
            services: {
                list: "/admin/app/services",
                create: "/admin/app/services",
                update: "/admin/app/services",
                delete: "/admin/app/services"
            },
            frames: {
                list: "/admin/app/frames",
                create: "/admin/app/frames",
                update: "/admin/app/frames",
                delete: "/admin/app/frames"
            },
            categories: {
                list: "/admin/app/categories",
                create: "/admin/app/categories",
                update: "/admin/app/categories",
                delete: "/admin/app/categories",
            },
            shapes: {
                list: "/admin/app/shapes",
                create: "/admin/app/shapes",
                update: "/admin/app/shapes",
                delete: "/admin/app/shapes"
            },
            colors: {
                list: "/public/colors",
                create: "/admin/app/colors",
                update: "/admin/app/colors",
                delete: "/admin/app/colors"
            },
            sizes: {
                list: "/admin/app/sizes",
                create: "/admin/app/sizes",
                update: "/admin/app/sizes",
                delete: "/admin/app/sizes"
            },
            glassSizes: {
                list: "/admin/app/glass-sizes",
                create: "/admin/app/glass-sizes",
                update: "/admin/app/glass-sizes",
                delete: "/admin/app/glass-sizes"
            },
            news: {
                list: "/admin/app/news",
                create: "/admin/app/news",
                update: "/admin/app/news",
                delete: "/admin/app/news"
            },
            products: {
                list: "/admin/app/products",
                create: "/admin/app/products",
                update: "/admin/app/products",
                delete: "/admin/app/products",
                show: "/admin/app/products",
                duplicate: "/admin/app/products/duplicated",
                images: {
                    addImage: "/admin/app/products",
                    deleteImage: "/admin/app/products/images"
                }
            },
            accessories: {
                create: "/admin/app/products-accessories",
                update: "/admin/app/products-accessories",
            },
            shops: {
                list: "/admin/app/shops",
                create: "/admin/app/shops",
                update: "/admin/app/shops",
                delete: "/admin/app/shops",
                show: "/admin/app/shops",
            },
            faqs: {
                list: "/admin/app/faqs",
                create: "/admin/app/faqs",
                update: "/admin/app/faqs",
                delete: "/admin/app/faqs",
            },
            partners: {
                list: "/admin/app/partners",
                create: "/admin/app/partners",
                update: "/admin/app/partners",
                delete: "/admin/app/partners",
            },
            deliveryModes: {
                list: "/admin/app/delivery-prices",
                create: "/admin/app/delivery-prices",
                update: "/admin/app/delivery-prices",
                delete: "/admin/app/delivery-prices",
            },
            appointments: {
                index: "/admin/app/appointments",
                list: "/admin/app/appointments?page=1",
                listByMonth: "/admin/app/appointments/listBy",
                detail: "/admin/app/appointments",
                complete: "/admin/app/appointments",
                listByUser: "/admin/app/appointments/listBy/user",
            },
            documents: {
                delete: "/public/app/documents",
                list: "/admin/app/documents",
                create: "/public/app/documents/add",
                view: "/public/app/documents/view",
            },
            events: {
                index: "/admin/app/events"
            },
            offers: {
                index: "/admin/app/offers",
            },
            accessoriesCategories: {
                list: "/admin/app/accessories-categories",
                create: "/admin/app/accessories-categories",
                update: "/admin/app/accessories-categories",
                delete: "/admin/app/accessories-categories",
            },
            superCategories: {
                list: "/admin/app/super-categories",
                update: (id: number) => `/admin/app/super-categories/${id}`
            },
            orders: {
                index: "/admin/app/orders",
                list: "/admin/app/orders?page=1",
                listByMonth: "/admin/app/orders/listBy",
                detail: "/admin/app/orders",
                complete: "/admin/app/orders",
                statusList: "/admin/app/orders-status-list",
                updateStatus: "/admin/app/orders/change-status",
                statistics: "/admin/app/orders/statistics",
                listByUser: "/admin/app/orders/user",
            },
            users: {
                list: "/admin/app/users",
                create: "/admin/app/users",
                update: "/admin/app/users",
                delete: "/admin/app/users",
                show: "/admin/app/users",
                unblock: "/admin/app/users/unblockUser",
                block: "/admin/app/users/blockUser",
            },
            roles: {
                list: "/admin/app/user/administrator/all/roles",
            },
            administrator: {
                list: "/admin/app/user/administrator",
                create: "/admin/app/user/administrator",
                update: "/admin/app/user/administrator",
                show: "/admin/app/user/administrator/show",
                unblock: "/admin/app/user/administrator/unblockUser",
                block: "/admin/app/user/administrator/blockUser",
            },
            clients: {
                list: "/admin/app/clients",
                create: "/admin/app/clients",
                show: "/admin/app/clients",
                update: "/admin/app/clients",
                 delete: "/admin/app/clients",
             },
             comptes: {
                list: "/admin/app/comptes",
                create: "/admin/app/comptes",
                show: "/admin/app/comptes",
                byClient: "/admin/app/comptes/client",
               }, 
               depots: {
                list: "/admin/app/depots",
                create: "/admin/app/depots",
                byCompte: "/admin/app/depots/compte",
                },
               retraits: {
               list: "/admin/app/retraits",
               create: "/admin/app/retraits",
               byCompte: "/admin/app/retraits/compte",
               },
          comments:{
              list: "/admin/app/comments/pending",
              validate:"/admin/app/comments/validate",
              rejected:"/admin/app/comments/rejet",
              valid_by_user:"/admin/app/comments/by-user",
          },
           settings: {
             index: "/admin/app/dynamic-settings",
             update: "/admin/app/dynamic-settings",
           }
        },
        utils: {
            resetPasswordInit: "/utils/password/reset/init",
            resetPassword: "/utils/password/reset",
            // notifications
            notifications: {
                setReaded: "/utils/app/notifications/set-readed",
                setViewed: "/utils/app/notifications/set-viewed",
                stats: "/utils/app/notifications/stats",
                list: "/utils/app/notifications/list"
            },
            accessoriesCategories: {
                list: "/public/accessories-categories"
            },
        },
        public: {
            passwordUpdate: "/public/app/password/edit"
        }
    }
}

export default apiRoutes