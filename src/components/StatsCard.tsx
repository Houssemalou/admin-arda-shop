import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description?: string
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  description 
}: StatsCardProps) {
  const changeColor = {
    positive: "text-success",
    negative: "text-destructive", 
    neutral: "text-muted-foreground"
  }[changeType]

  return (
    <Card className="relative overflow-hidden shadow-soft hover:shadow-medium transition-smooth">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {value}
          </div>
          {change && (
            <p className={`text-xs ${changeColor} mb-1`}>
              {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
      
      {/* Subtle background accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-gold opacity-30"></div>
    </Card>
  )
}