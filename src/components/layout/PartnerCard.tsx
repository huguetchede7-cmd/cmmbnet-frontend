"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Pencil, Trash2, Eye } from "lucide-react"
import {PartnerType} from "@/types/UtilsTypes.ts";

interface PartnerCardProps {
    partner: PartnerType
    onDetail: () => void
    onDelete: () => void
    onEdit: () => void
}

export default function PartnerCard({ partner, onDetail, onDelete, onEdit }: PartnerCardProps) {
    return (
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition p-1">
            <CardHeader className="flex flex-row items-center gap-3 p-1">
                {partner.logo ? (
                    <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-12 h-12 rounded-full object-cover border"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        N/A
                    </div>
                )}
                <div>
                    <CardTitle className="text-sm">{partner.name}</CardTitle>
                    <p className="text-sm text-gray-500">{partner.type}</p>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-2">

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="icon" onClick={onDetail}>
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={onEdit}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={onDelete}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
