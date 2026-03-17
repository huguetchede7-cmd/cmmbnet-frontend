import { Badge } from "@/components/ui/badge";
import { WithdrawDetailTypes } from "@/types/WithdrawDetailTypes";

export class WithdrawHelper {
    public static getWithdrawStatus (item: WithdrawDetailTypes)  {
        if (item.withdraw_transaction.is_cancelled) {
            return (
                <Badge className="bg-red-100 text-red-700 flex items-center gap-1 px-2 py-1 rounded-full w-fit mx-auto">
                    <span>Refusé</span>
                </Badge>
            );
        } else if (item.withdraw_transaction.payment_status) {
            return (
                <Badge className="bg-green-100 text-green-700 flex items-center gap-1 px-2 py-1 rounded-full w-fit mx-auto">
                    <span>Accepté</span>
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-yellow-200 text-yellow-700 flex items-center gap-1 px-2 py-1 rounded-full w-fit mx-auto">
                    <span>En attente</span>
                </Badge>
            );
        }
    };
}