/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Users,
    Settings,
    ShoppingBag,
    BarChart3,
    Tags,
    LogOut,
    Menu,
    X,
    Sparkles
} from 'lucide-react';

export function AdminSidebar(
    {
        isCollapsed,
        setIsCollapsed,
    }: {
        isCollapsed: boolean;
        setIsCollapsed: (value: boolean) => void;
    }
) {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [productsExpanded, setProductsExpanded] = useState(false);

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/panel-access'
        },

        { id: 'all-products', label: 'All Products', icon: ShoppingBag, path: '/panel-access/products' },
        { id: 'add-product', label: 'Add New', icon: Sparkles },
        { id: 'categories', label: 'Categories', icon: Tags },
        {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingBag,
            path: '/panel-access/orders',
            badge: '12'
        },
        {
            id: 'customers',
            label: 'Customers',
            icon: Users,
            path: '/panel-access/customers'
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            path: '/admin/analytics'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/admin/settings'
        }
    ];

    const handleMenuClick = (menuId: string, path?: string) => {
        if (menuId === 'products') {
            setProductsExpanded(!productsExpanded);
        } else if (path) {
            router.push(path);
        }
        setActiveMenu(menuId);
    };


    return (
        <div
            className={`fixed md:relative top-0 left-0 h-screen z-50 bg-black text-white transition-all duration-300 ${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'}`} >

            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white "
                >
                    {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </Button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;

                    return (
                        <div key={item.id}>
                            <Button
                                onClick={() => handleMenuClick(item.id, item.path)}
                                className={`w-full justify-start gap-3 h-11 ${isActive
                                    ? 'text-black bg-white hover:bg-white'
                                    : 'text-white '
                                    } ${isCollapsed ? 'px-3' : 'px-4'}`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.badge && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </Button>
                        </div>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-slate-800">

                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 mt-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </Button>
                )}
            </div>
        </div>
    );
}

export function AdminNavbar({
    title = "Dashboard",
    onMenuClick,
}: {
    title?: string;
    onMenuClick: () => void;
}) {
    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="w-5 h-5" />
                </Button>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                    <Settings className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}