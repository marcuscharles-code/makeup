/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import logo from '@/public/images/Fragrancebynayalogo2.png'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Users,
    Settings,
    ShoppingBag,
    LogOut,
    Menu,
    X,
    Sparkles,
    Package,
    MapPin,
    PlusCircle,
    FolderTree,
    Home,
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

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/panel-access'
        },
        {
            id: 'products',
            label: 'All Products',
            icon: Package,
            path: '/panel-access/products'
        },
        {
            id: 'add-product',
            label: 'Add Product',
            icon: PlusCircle,
            path: '/panel-access/products/add-product'
        },
        {
            id: 'categories',
            label: 'Categories',
            icon: FolderTree,
            path: '/panel-access/category'
        },
        {
            id: 'orders',
            label: 'Orders',
            icon: ShoppingBag,
            path: '/panel-access/orders'
        },
        {
            id: 'customers',
            label: 'Customers',
            icon: Users,
            path: '/panel-access/customers'
        },
        {
            id: 'pickup-address',
            label: 'Pickup Address',
            icon: MapPin,
            path: '/panel-access/address'
        }
    ];

    const handleMenuClick = (menuId: string, path: string) => {
        router.push(path);
        setActiveMenu(menuId);
    };

    const isActive = (menuId: string) => activeMenu === menuId;

    return (
        <div
            className={`fixed md:relative top-0 left-0 h-screen z-50 bg-white text-black transition-all duration-300 ${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'}`} >


            <div className="h-24 flex items-center justify-between px-4 border-b border-gray-800">
                {!isCollapsed && (
                    <div className="w-full h-24 flex items-center">
                        <Image
                            src={logo}
                            alt=''
                            className='object-contain'
                        />
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-black hover:bg-gray-800 hover:text-white"
                >
                    {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2  overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.id);

                    return (
                        <Button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id, item.path)}
                            className={`w-full justify-start gap-3 h-10 mb-1 transition-all ${active
                                ? 'bg-gray-800 text-white shadow-lg'
                                : 'text-black hover:bg-gray-800 hover:text-white hover:shadow-md'
                                } ${isCollapsed ? 'px-3' : 'px-4'}`}
                            variant="ghost"
                        >
                            <Icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left font-medium">{item.label}</span>
                                    {active && (
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    )}
                                </>
                            )}
                        </Button>
                    );
                })}
            </nav>


            <div className="p-1 border-t border-gray-200 space-y-2">
                <Button
                    variant="ghost"
                    className={`w-full flex items-center gap-3 text-black hover:bg-gray-800 hover:text-white ${isCollapsed ? 'justify-center px-0' : 'justify-start'
                        }`}
                    onClick={() => router.push('/')}
                >
                    <Home className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Back to Store</span>}
                </Button>

                <Button
                    variant="ghost"
                    className={`w-full flex items-center gap-3 text-black hover:bg-gray-800 hover:text-white ${isCollapsed ? 'justify-center px-0' : 'justify-start'
                        }`}
                    onClick={() => router.push('/')}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </Button>
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
    const router = useRouter();

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
                    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                    <p className="text-xs text-gray-500 hidden md:block">E-commerce Admin Dashboard</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex items-center gap-2"
                    onClick={() => router.push('/panel-access/quick-links')}
                >
                    <Sparkles className="w-4 h-4" />
                    Go to Store
                </Button>
            
                <Button variant="outline" size="icon">
                    <Settings className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}