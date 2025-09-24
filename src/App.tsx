import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Page Login sans sidebar ni header */}
          <Route path="/" element={<Login onLoginSuccess={() => {}} />} />

          {/* Pages protégées avec sidebar et header */}
          <Route
            path="/*"
            element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full" dir="rtl">
                  <AdminSidebar />
                  <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <header className="h-14 flex items-center justify-between border-b border-border bg-background px-6">
                      <div className="flex items-center gap-4">
                        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                        <h1 className="text-lg font-semibold text-foreground">
                          نظام إدارة المتجر الإلكتروني
                        </h1>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        مرحباً، مدير المتجر
                      </div>
                    </header>

                    {/* Main content */}
                    <main className="flex-1 bg-gradient-subtle">
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="products" element={<Products />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
