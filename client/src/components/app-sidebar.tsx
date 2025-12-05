import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Clock, 
  Activity, 
  Settings,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Routine } from "@shared/schema";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Todas as Rotinas",
    url: "/routines",
    icon: Clock,
  },
  {
    title: "Rotinas Ativas",
    url: "/active",
    icon: Activity,
  },
  {
    title: "Configuracoes",
    url: "/settings",
    icon: Settings,
  },
];

interface AppSidebarProps {
  routines?: Routine[];
}

export function AppSidebar({ routines = [] }: AppSidebarProps) {
  const [location] = useLocation();
  
  const activeCount = routines.filter(r => r.isActive).length;
  const secondCount = routines.filter(r => r.frequencyType === "second").length;
  const minuteCount = routines.filter(r => r.frequencyType === "minute").length;
  const hourCount = routines.filter(r => r.frequencyType === "hour").length;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Gerenciador</span>
            <span className="text-xs text-muted-foreground">Rotinas do Sistema</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegacao</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                  >
                    <Link href={item.url} data-testid={`link-nav-${item.url.replace("/", "") || "home"}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Estatisticas</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 px-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Ativas</span>
                <Badge variant="default" className="text-xs" data-testid="badge-active-count">
                  {activeCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Por Segundo</span>
                <Badge className="text-xs bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20" data-testid="badge-second-count">
                  {secondCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Por Minuto</span>
                <Badge className="text-xs bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20" data-testid="badge-minute-count">
                  {minuteCount}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Por Hora</span>
                <Badge className="text-xs bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20" data-testid="badge-hour-count">
                  {hourCount}
                </Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 rounded-md bg-card p-3">
          <div className="h-2 w-2 rounded-full bg-status-online animate-pulse" />
          <span className="text-xs text-muted-foreground">Sistema Operacional</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
