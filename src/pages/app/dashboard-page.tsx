
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClockIcon } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6">
      <Card className="max-w-md w-full text-center shadow-sm">

        <CardHeader className="flex flex-col items-center gap-3">
          <ClockIcon className="h-10 w-10 text-primary" />

          <Badge variant="secondary">
            En développement
          </Badge>

          <CardTitle className="text-2xl">
            Bientôt disponible
          </CardTitle>

          <CardDescription>
            Cette fonctionnalité sera bientôt disponible dans votre application.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nous travaillons actuellement sur cette section pour améliorer
            votre système de gestion de poissonnerie.
          </p>
        </CardContent>

      </Card>
    </div>
  )
}

