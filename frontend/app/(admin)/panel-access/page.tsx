/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    ArrowUpRight,
    MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from "@/firebase/firebaseConfig";
import Link from 'next/link';

interface DashboardStat {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
}


type OrderStatus =
    | 'Completed'
    | 'Processing'
    | 'Pending'
    | 'Shipped'
    | 'Cancelled';


interface RecentOrder {
    id: string;
    customer: string;
    product: string;
    amount: string;
    status: OrderStatus;
}



interface TopProduct {
    id: string;
    name: string;
    sales: number;
    revenue: number;
    revenueFormatted: string;
    trend: string;
    percentage: number;
    image: string;
}


export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        customerSatisfaction: 4.8
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [ordersSnapshot, customersSnapshot, productsSnapshot] = await Promise.all([
                    getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"))),
                    getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"))),
                    getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")))
                ]);

                // Calculate total revenue and orders
                let totalRevenue = 0;
                const orders: RecentOrder[] = [];
                const productSales: Record<string, { sales: number; revenue: number; name: string }> = {};

                ordersSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const total = data.total || 0;
                    totalRevenue += total;

                    // Track product sales
                    if (data.items && Array.isArray(data.items)) {
                        data.items.forEach((item: any) => {
                            if (item.productId) {
                                if (!productSales[item.productId]) {
                                    productSales[item.productId] = {
                                        sales: 0,
                                        revenue: 0,
                                        name: item.name || 'Unknown Product'
                                    };
                                }
                                productSales[item.productId].sales += item.quantity || 1;
                                productSales[item.productId].revenue += (item.price || 0) * (item.quantity || 1);
                            }
                        });
                    }

                    if (orders.length < 5) {
                        const customerName = data.customerName || "Unknown Customer";
                        const firstProduct = data.items && data.items.length > 0
                            ? data.items[0].name
                            : "No products";

                        orders.push({
                            id: `#${doc.id.substring(0, 6)}`,
                            customer: customerName,
                            product: firstProduct,
                            amount: `₦${total.toLocaleString()}`,
                            status: data.status
                        });
                    }
                });

                // Calculate top products
                const topProductsList: TopProduct[] = Object.entries(productSales)
                    .map(([id, data]) => ({
                        id,
                        name: data.name,
                        sales: data.sales,
                        revenue: data.revenue,
                        revenueFormatted: `₦${data.revenue.toLocaleString()}`,
                        trend: '+12%', // This would need actual trend calculation
                        percentage: Math.round((data.revenue / totalRevenue) * 100) || 0,
                        image: ''
                    }))
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5);

                // Calculate conversion rate (simplified)
                const totalCustomers = customersSnapshot.size;
                const totalOrdersCount = ordersSnapshot.size;
                const conversionRate = totalCustomers > 0 ? (totalOrdersCount / totalCustomers) * 100 : 0;

                // Calculate average order value
                const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

                // Update dashboard stats
                setDashboardStats({
                    totalRevenue,
                    totalOrders: totalOrdersCount,
                    totalCustomers,
                    totalProducts: productsSnapshot.size,
                    conversionRate,
                    avgOrderValue,
                    customerSatisfaction: 4.8
                });

                // Update stats cards
                setStats([
                    {
                        title: 'Total Revenue',
                        value: `₦${totalRevenue.toLocaleString()}`,
                        icon: DollarSign,
                        color: 'bg-green-500'
                    },
                    {
                        title: 'Orders',
                        value: totalOrdersCount.toLocaleString(),
                        icon: ShoppingCart,
                        color: 'bg-blue-500'
                    },
                    {
                        title: 'Customers',
                        value: totalCustomers.toLocaleString(),
                        icon: Users,
                        color: 'bg-purple-500'
                    },
                    {
                        title: 'Products',
                        value: productsSnapshot.size.toString(),
                        icon: Package,
                        color: 'bg-orange-500'
                    }
                ]);

                setRecentOrders(orders);
                setTopProducts(topProductsList);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                // Fallback to mock data if there's an error
                setStats(getMockStats());
                setRecentOrders(getMockOrders());
                setTopProducts(getMockTopProducts());
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper functions for mock data (fallback)
    const getMockStats = (): DashboardStat[] => [
        {
            title: 'Total Revenue',
            value: '₦0',
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'Orders',
            value: '0',
            icon: ShoppingCart,
            color: 'bg-blue-500'
        },
        {
            title: 'Customers',
            value: '0',
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            title: 'Products',
            value: '0',
            icon: Package,
            color: 'bg-orange-500'
        }
    ];

    const getMockOrders = (): RecentOrder[] => [
        { id: '#0001', customer: 'No orders yet', product: 'N/A', amount: '₦0', status: 'Pending' }
    ];

    const getMockTopProducts = (): TopProduct[] => [
        { id: '1', name: 'No products yet', sales: 0, revenue: 0, revenueFormatted: '₦0', trend: '+0%', percentage: 0, image: '' }
    ];

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Processing': return 'secondary';
            case 'Pending': return 'outline';
            case 'Shipped': return 'secondary';
            case 'Cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4 md:p-6">
                                <div className="h-24 bg-gray-200 rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <Card className="lg:col-span-2 animate-pulse">
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                    <Card className="animate-pulse">
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4 md:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center`}>
                                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Export Data</DropdownMenuItem>
                                            <DropdownMenuItem>Share</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div>
                                    <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.title}</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                        <Link href="/panel-access/products/add-product">
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 w-full">
                                <Package className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
                                <span className="text-xs md:text-sm font-medium">Add Product</span>
                            </Button>
                        </Link>
                        <Link href="/panel-access/orders">
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 w-full">
                                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                                <span className="text-xs md:text-sm font-medium">View Orders</span>
                            </Button>
                        </Link>
                        <Link href="/panel-access/customers">
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200 w-full">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                                <span className="text-xs md:text-sm font-medium">Customers</span>
                            </Button>
                        </Link>

                    </div>
                </CardContent>
            </Card>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest customer orders</CardDescription>
                        </div>
                        <Link href="/admin/orders">
                            <Button variant="outline" size="sm" className="text-xs md:text-sm">
                                View All
                                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs md:text-sm">Order ID</TableHead>
                                        <TableHead className="text-xs md:text-sm">Customer</TableHead>
                                        <TableHead className="text-xs md:text-sm hidden md:table-cell">Product</TableHead>
                                        <TableHead className="text-xs md:text-sm">Amount</TableHead>
                                        <TableHead className="text-xs md:text-sm">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.map((order, index) => (
                                        <TableRow key={index} className="hover:bg-muted/50">
                                            <TableCell className="font-medium text-xs md:text-sm">{order.id}</TableCell>
                                            <TableCell className="text-xs md:text-sm">{order.customer}</TableCell>
                                            <TableCell className="text-xs md:text-sm hidden md:table-cell">{order.product}</TableCell>
                                            <TableCell className="font-medium text-xs md:text-sm">{order.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(order.status)} className="text-xs">
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Products</CardTitle>
                        <CardDescription>Best selling products</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={product.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs md:text-sm font-medium text-foreground truncate">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs md:text-sm font-bold text-foreground">{product.revenueFormatted}</p>
                                            <p className="text-xs text-green-600 font-medium">{product.trend}</p>
                                        </div>
                                    </div>
                                    <Progress value={product.percentage} className="h-1" />
                                </div>
                            ))}
                        </div>
                        <Separator className="my-4" />
                        <Link href="/admin/products">
                            <Button variant="outline" className="w-full text-xs md:text-sm">
                                View All Products
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}