import { BarChart3, Package, ShoppingCart, Tags, Home, Settings } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "لوحة التحكم", url: "/dashboard", icon: BarChart3 },
  { title: "المنتجات", url: "/products", icon: Package },
  { title: "الفئات", url: "/categories", icon: Tags },
  { title: "الطلبات", url: "/orders", icon: ShoppingCart },
  { title: "الإعدادات", url: "/settings", icon: Settings },
]

export function AdminSidebar() {
  const { open } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-soft" 
      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"

  return (
    <Sidebar
      className={`${open ? "w-64" : "w-16"} transition-smooth border-l border-sidebar-border`}
      collapsible="icon"
      side="right"
    >
      <SidebarContent className="bg-sidebar text-sidebar-foreground">
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            {open && (
              <div className="text-right">
                <h2 className="text-lg font-bold text-sidebar-primary">
                  لوحة الإدارة
                </h2>
                <p className="text-sm text-sidebar-foreground/70">
                  متجر إلكتروني
                </p>
              </div>
            )}
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Home className="h-5 w-5 text-accent-gold-foreground" />
            </div>
          </div>
        </div>

        <SidebarGroup className="px-4">
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-right font-medium">
            القائمة الرئيسية
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {open && (
                          <span className="text-right flex-1">{item.title}</span>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}