"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

// 🎨 Couleurs limitées aux plus visibles (tons 500–700)
const colorSchemes = {
  red: "from-red-500 to-red-700 text-white",
  orange: "from-orange-500 to-orange-700 text-white",
  amber: "from-amber-500 to-amber-700 text-white",
  lime: "from-lime-500 to-lime-700 text-white",
  green: "from-green-500 to-green-700 text-white",
  teal: "from-teal-500 to-teal-700 text-white",
  cyan: "from-cyan-500 to-cyan-700 text-white",
  blue: "from-blue-500 to-blue-700 text-white",
  indigo: "from-indigo-500 to-indigo-700 text-white",
  violet: "from-violet-500 to-violet-700 text-white",
  fuchsia: "from-fuchsia-500 to-fuchsia-700 text-white",
  pink: "from-pink-500 to-pink-700 text-white",
  rose: "from-rose-500 to-rose-700 text-white",
} as const

type ColorScheme = keyof typeof colorSchemes

// 🧮 Génération pseudo-aléatoire basée sur le nom
function getColorFromName(name: string): ColorScheme {
  const colors = Object.keys(colorSchemes) as ColorScheme[]
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// 🅰️ Initiales du nom
function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

// 📏 Tailles disponibles
const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-14 w-14 text-xl",
  "2xl": "h-16 w-16 text-2xl",
  "3xl": "h-20 w-20 text-3xl",
  "4xl": "h-24 w-24 text-4xl",
  "5xl": "h-28 w-28 text-5xl",
  "6xl": "h-32 w-32 text-6xl",
  "7xl": "h-36 w-36 text-7xl",
  "8xl": "h-40 w-40 text-8xl",
  "9xl": "h-44 w-44 text-9xl",
  "10xl": "h-48 w-48 text-10xl",
} as const

// 🎯 Statuts
const statusColors = {
  online: "bg-green-500 border-background",
  offline: "bg-gray-400 border-background",
  away: "bg-yellow-500 border-background",
  busy: "bg-red-500 border-background",
  none: "hidden",
}

const statusSizes = {
  xs: "h-1.5 w-1.5 border",
  sm: "h-2 w-2 border",
  md: "h-2.5 w-2.5 border-2",
  lg: "h-3 w-3 border-2",
  xl: "h-3.5 w-3.5 border-2",
  "2xl": "h-4 w-4 border-2",
  "3xl": "h-5 w-5 border-2",
  "4xl": "h-6 w-6 border-2",
  "5xl": "h-7 w-7 border-2",
  "6xl": "h-8 w-8 border-2",
  "7xl": "h-9 w-9 border-2",
  "8xl": "h-10 w-10 border-2",
  "9xl": "h-11 w-11 border-2",
  "10xl": "h-12 w-12 border-2",
}

// 🎨 Couleurs unies pour TinyAvatar avec leurs bordures correspondantes
const tinyColorSchemes = {
  red: {
    bg: "bg-red-100",
    border: "border-red-200",
    text: "text-red-700"
  },
  orange: {
    bg: "bg-orange-100",
    border: "border-orange-200",
    text: "text-orange-700"
  },
  amber: {
    bg: "bg-amber-100",
    border: "border-amber-200",
    text: "text-amber-700"
  },
  lime: {
    bg: "bg-lime-100",
    border: "border-lime-200",
    text: "text-lime-700"
  },
  green: {
    bg: "bg-green-100",
    border: "border-green-200",
    text: "text-green-700"
  },
  teal: {
    bg: "bg-teal-100",
    border: "border-teal-200",
    text: "text-teal-700"
  },
  cyan: {
    bg: "bg-cyan-100",
    border: "border-cyan-200",
    text: "text-cyan-700"
  },
  blue: {
    bg: "bg-blue-100",
    border: "border-blue-200",
    text: "text-blue-700"
  },
  indigo: {
    bg: "bg-indigo-100",
    border: "border-indigo-200",
    text: "text-indigo-700"
  },
  violet: {
    bg: "bg-violet-100",
    border: "border-violet-200",
    text: "text-violet-700"
  },
  fuchsia: {
    bg: "bg-fuchsia-100",
    border: "border-fuchsia-200",
    text: "text-fuchsia-700"
  },
  pink: {
    bg: "bg-pink-100",
    border: "border-pink-200",
    text: "text-pink-700"
  },
  rose: {
    bg: "bg-rose-100",
    border: "border-rose-200",
    text: "text-rose-700"
  },
} as const

type TinyColorScheme = keyof typeof tinyColorSchemes

// 🧮 Génération de couleur pour TinyAvatar basée sur le nom
function getTinyColorFromName(name: string): TinyColorScheme {
  const colors = Object.keys(tinyColorSchemes) as TinyColorScheme[]
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

interface AdvancedAvatarProps {
  name: string
  size?: keyof typeof sizeClasses
  image?: string
  color?: ColorScheme
  className?: string
  showTooltip?: boolean
  status?: "online" | "offline" | "away" | "busy" | "none"
}

export function AdvancedAvatar({
                                 name,
                                 size = "md",
                                 image,
                                 color,
                                 className,
                                 showTooltip = false,
                                 status = "none",
                               }: AdvancedAvatarProps) {
  const trimmedName = name.trim()
  const selectedColor = color || getColorFromName(trimmedName)
  const gradient = colorSchemes[selectedColor]
  const initials = getInitials(trimmedName)

  const avatarContent = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="relative inline-block cursor-pointer"
    >
      <Avatar className={cn(sizeClasses[size], className, "overflow-hidden")}>
        <AvatarImage src={image} alt={trimmedName} />
        <AvatarFallback
          className={cn(
            `bg-gradient-to-br ${gradient} font-semibold`,
            "flex items-center justify-center"
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      {status !== "none" && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full shadow-sm",
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </motion.div>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{avatarContent}</TooltipTrigger>
          <TooltipContent>
            <p>{trimmedName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return avatarContent
}

// 👥 Groupe d'avatars
interface AvatarGroupProps {
  avatars: Array<{
    name: string
    image?: string
    color?: ColorScheme
  }>
  size?: keyof typeof sizeClasses
  max?: number
  className?: string
}

export function AvatarGroup({
                              avatars,
                              size = "md",
                              max = 5,
                              className,
                            }: AvatarGroupProps) {
  const displayedAvatars = avatars.slice(0, max)
  const remainingCount = avatars.length - max

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {displayedAvatars.map((avatar, index) => (
          <AdvancedAvatar
            key={index}
            name={avatar.name.trim()}
            image={avatar.image}
            color={avatar.color}
            size={size}
            className="ring-2 ring-background"
          />
        ))}
        {remainingCount > 0 && (
          <Avatar
            className={cn(sizeClasses[size], "ring-2 ring-background bg-muted")}
          >
            <AvatarFallback className="text-muted-foreground font-medium">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}

// 🏷️ Avatar avec badge
interface AvatarWithBadgeProps extends AdvancedAvatarProps {
  badgeText?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}

export function AvatarWithBadge({
                                  badgeText,
                                  badgeVariant = "default",
                                  ...avatarProps
                                }: AvatarWithBadgeProps) {
  return (
    <div className="relative inline-block">
      <AdvancedAvatar {...avatarProps} />
      {badgeText && (
        <Badge
          variant={badgeVariant}
          className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs shadow-sm"
        >
          {badgeText}
        </Badge>
      )}
    </div>
  )
}

// 👶 Avatar très petit, fond uni, avec bordure automatique
interface TinyAvatarProps {
  name: string
  size?: "xs" | "sm"|"md"|"lg"|"xl"|"2xl"|"3xl"|"4xl"|"5xl"|"6xl"|"7xl"|"8xl"|"9xl"|"10xl"
  image?: string|null
  color?: TinyColorScheme // Utilise le nouveau type de couleur
  className?: string
  showTooltip?: boolean
  status?: "online" | "offline" | "away" | "busy" | "none"
  withBorder?: boolean // Option pour ajouter une bordure
}

export function TinyAvatar({
                             name,
                             size = "xs",
                             image,
                             color,
                             className,
                             showTooltip = false,
                             status = "none",
                             withBorder = true,
                           }: TinyAvatarProps) {
  const trimmedName = name.trim()
  const selectedColor = color || getTinyColorFromName(trimmedName)
  const colorScheme = tinyColorSchemes[selectedColor]
  const initials = getInitials(trimmedName)

  const avatarContent = (
    <div className={cn("relative inline-block cursor-pointer")}>
      <Avatar className={cn(
        sizeClasses[size],
        className,
        colorScheme.bg,
        colorScheme.text,
        "flex items-center justify-center font-semibold",
        withBorder && `border ${colorScheme.border}`
      )}>
        {image ? (
          <AvatarImage src={image} alt={trimmedName} />
        ) : (
          <AvatarFallback className={cn(colorScheme.text,colorScheme.bg, "font-semibold")}>
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
      {status !== "none" && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full shadow-sm",
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{avatarContent}</TooltipTrigger>
          <TooltipContent>
            <p>{trimmedName}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return avatarContent
}

export type { ColorScheme, TinyColorScheme }
