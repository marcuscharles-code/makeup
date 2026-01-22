'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
    PlusCircle,
    FolderTree,
    MapPin,
    Package,
    ShoppingBag,
    Users,
    Settings,
    BarChart3,
    FileText,
    Tag,
    DollarSign,
    Image,
    Truck,
    Home,
    Shield,
    Bell,
    Zap,
    ArrowRight
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function QuickLinksPage() {
    const router = useRouter();

    const quickActions = [
        {
            title: 'Add New Product',
            description: 'Add a new product to your store',
            icon: PlusCircle,
            color: 'bg-gradient-to-br from-purple-500 to-pink-500',
            path: '/panel-access/products/add',
            badge: 'Primary'
        },
        {
            title: 'Manage Categories',
            description: 'Organize your product categories',
            icon: FolderTree,
            color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
            path: '/panel-access/categories',
            badge: 'Important'
        },
        {
            title: 'Set Pickup Address',
            description: 'Configure default pickup location',
            icon: MapPin,
            color: 'bg-gradient-to-br from-green-500 to-emerald-500',
            path: '/panel-access/pickup-address',
            badge: 'Required'
        },
        {
            title: 'View All Products',
            description: 'Browse and manage all products',
            icon: Package,
            color: 'bg-gradient-to-br from-orange-500 to-amber-500',
            path: '/panel-access/products',
            badge: 'View'
        },
    ];

    const managementLinks = [
        {
            title: 'Orders Management',
            description: 'Process and track customer orders',
            icon: ShoppingBag,
            path: '/panel-access/orders'
        },
        {
            title: 'Customer Management',
            description: 'View and manage customer accounts',
            icon: Users,
            path: '/panel-access/customers'
        },
        {
            title: 'General Settings',
            description: 'Configure store settings',
            icon: Settings,
            path: '/panel-access/settings'
        },
        {
            title: 'Sales Analytics',
            description: 'View sales reports and analytics',
            icon: BarChart3,
            path: '/panel-access/analytics'
        },
    ];

    const utilityLinks = [
        {
            title: 'Inventory Report',
            description: 'Generate stock level reports',
            icon: FileText,
            path: '/panel-access/reports/inventory'
        },
        {
            title: 'Discount Management',
            description: 'Create and manage discounts',
            icon: Tag,
            path: '/panel-access/discounts'
        },
        {
            title: 'Payment Settings',
            description: 'Configure payment methods',
            icon: DollarSign,
            path: '/panel-access/settings/payments'
        },
        {
            title: 'Media Library',
            description: 'Manage product images and files',
            icon: Image,
            path: '/panel-access/media'
        },
    ];

    const handleQuickAction = (path: string) => {
        router.push(path);
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Quick Links</h1>
                    <p className="text-sm text-gray-600 mt-1">Fast access to common admin tasks</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full font-medium">
                        <Zap className="w-3 h-3 inline mr-1" />
                        Quick Access
                    </span>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border hover:border-purple-300 cursor-pointer" onClick={() => handleQuickAction(action.path)}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded font-medium">
                                            {action.badge}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{action.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1 mb-4">{action.description}</p>
                                    <Button variant="ghost" size="sm" className="w-full justify-between group-hover:text-purple-700">
                                        Go to Page
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <Separator />

            {/* Management Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Management</h2>
                    <div className="space-y-3">
                        {managementLinks.map((link, index) => {
                            const Icon = link.icon;
                            return (
                                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction(link.path)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{link.title}</h4>
                                                <p className="text-sm text-gray-600">{link.description}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Utility Links */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Utilities & Tools</h2>
                    <div className="space-y-3">
                        {utilityLinks.map((link, index) => {
                            const Icon = link.icon;
                            return (
                                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction(link.path)}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{link.title}</h4>
                                                <p className="text-sm text-gray-600">{link.description}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                    <CardDescription>At a glance overview</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-700">24</div>
                            <p className="text-sm text-blue-600">Pending Orders</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-700">156</div>
                            <p className="text-sm text-green-600">Total Products</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-700">89</div>
                            <p className="text-sm text-purple-600">Active Customers</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-700">₦245K</div>
                            <p className="text-sm text-orange-600">This Month</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}