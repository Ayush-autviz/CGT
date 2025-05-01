
"use client";

import * as React from "react";
import { ChatInterface } from "@/components/Chat";
import { SessionSidebar } from "@/components/SessionSidebar";
import { Menu } from "lucide-react"; // Import an icon for the FAB
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative grid h-full grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <ChatInterface />
      </div>

      {/* Session Sidebar - Desktop */}
      <div
  className="hidden lg:block lg:col-span-1 bg-[#1E293B] fixed bottom-0 right-0 h-[calc(100vh-64px)] w-[calc((100%-264px)/3)]"
>
  <SessionSidebar />
</div>

      {/* Session Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 right-0 z-55 w-80 bg-[#1E293B] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-start p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-[#2a3548]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        <SessionSidebar />
      </div>

      {/* Floating Action Button - Visible on Mobile */}
      <Button
        onClick={toggleSidebar}
        className="fixed bottom-25 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg hover:bg-amber-600 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
