import React from "react"
import { Button } from "@/components/ui/button"

export type InfoCardAction = {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "primary" | "danger" | "outline"
}

type InfoCardProps = {
  coverImage?: string
  avatarImage?: string
  title: string
  subtitle?: string
  pt?: number
  description?: React.ReactNode // ⬅️ JSX ou string
  actions?: InfoCardAction[]
  onClick?: () => void
}

export const InfoCard: React.FC<InfoCardProps> = ({
  coverImage,
  avatarImage,
  title,
  subtitle,
  pt,
  description,
  actions,
  onClick,
}) => {
  return (
    <div
      className="rounded-xl shadow-md bg-white overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-gray-100"
    >
      {/* Image de couverture */}
      {coverImage && (
        <div className="relative h-32" onClick={onClick}>
          <img
            src={coverImage}
            alt="cover"
            className="w-full h-full object-cover"
          />
          {avatarImage && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <img
                src={avatarImage}
                alt={title}
                className="w-16 h-16 rounded-full border-2 border-white shadow-md bg-white"
              />
            </div>
          )}
        </div>
      )}

      {/* Infos */}
      <div className={`pt-${pt ?? 10} px-4 pb-4 text-center`}>

        <div onClick={onClick}>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-blue-600 text-sm">{subtitle}</p>}
          {description && (
            <div className="mt-2 text-gray-600 text-sm">{description}</div>
          )}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 mt-4">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick()
                }}
                className={`btn-exclude border-1 border-gray-300 bg-gray-50 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                  ${action.variant === "primary" ? "bg-blue-500 hover:bg-blue-600" : ""} 
                  ${action.variant === "danger" ? "bg-red-500 hover:bg-red-600 text-white" : ""}
                  ${action.variant === "outline" ? "bg-gray-200" : ""}
                  `}
                variant={action.variant === "outline" ? "outline" : "default"}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
