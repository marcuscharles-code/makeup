'use client';

import "./globals.css";
import { useState } from 'react';
import { AdminSidebar, AdminNavbar } from '@/components/shared/AdminSidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">
        <div className="flex h-screen">
          <AdminSidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          {!isCollapsed && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsCollapsed(true)}
            />
          )}

          <div className="flex-1 flex flex-col">
            <AdminNavbar
              onMenuClick={() => setIsCollapsed(false)}
            />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}
