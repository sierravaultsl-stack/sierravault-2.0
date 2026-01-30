"use client";
import { useState } from "react";
import { GovSidebar } from "@/components/gov/gov-sidebar";
import { ChatWidget } from "@/components/chatbot/chat-widget";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex relative">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Gov Sidebar */}
            <GovSidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            {/* Main content */}
            <main
                className={`flex-1 overflow-auto transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                    }`}
            >
                {/* Mobile menu button */}
                <div className="lg:hidden p-4">
                    <Button variant="ghost" onClick={() => setMobileOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                {/* Page content */}
                <div className="p-4 sm:p-6">{children}</div>
            </main>

            {/* Reuse Chat Widget if needed, or remove for gov officials */}
            {/* <ChatWidget /> */}
        </div>
    );
}
