export type GlobalUsersStatsHTypes = {
    global: {
        all: {
            total: number;
            currentMonth: number;
        };
        allwithoutAdmin: {
            total: number;
            currentMonth: number;
        };
        clients: {
            total: number;
            currentMonth: number;
        };
        companies: {
            total: number;
            currentMonth: number;
        };
        deliveries: {
            total: number;
            currentMonth: number;
        };
        admin: {
            total: number;
            currentMonth: number;
        };
    };
    chartData: Array<{
        month: string;
        clients: number;
        companies: number;
        deliveries: number;
        admin: number;
}>;
};