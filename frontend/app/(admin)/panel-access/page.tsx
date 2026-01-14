import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    const stats = [
        {
            title: 'Total Revenue',
            value: '$45,231.89',
            change: '+20.1%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'Orders',
            value: '2,345',
            change: '+15.3%',
            trend: 'up',
            icon: ShoppingCart,
            color: 'bg-blue-500'
        },
        {
            title: 'Customers',
            value: '1,234',
            change: '+8.2%',
            trend: 'up',
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            title: 'Products',
            value: '456',
            change: '-2.4%',
            trend: 'down',
            icon: Package,
            color: 'bg-orange-500'
        }
    ];

    const recentOrders = [
        { id: '#3210', customer: 'John Doe', product: 'Chanel No. 5', amount: '$129.00', status: 'Completed' },
        { id: '#3209', customer: 'Jane Smith', product: 'Dior Sauvage', amount: '$95.00', status: 'Processing' },
        { id: '#3208', customer: 'Mike Johnson', product: 'Tom Ford', amount: '$185.00', status: 'Pending' },
        { id: '#3207', customer: 'Sarah Williams', product: 'Versace Eros', amount: '$78.00', status: 'Completed' },
        { id: '#3206', customer: 'Chris Brown', product: 'Gucci Bloom', amount: '$112.00', status: 'Cancelled' }
    ];

    const topProducts = [
        { name: 'Chanel No. 5', sales: 234, revenue: '$30,186', trend: '+12%', percentage: 45 },
        { name: 'Dior Sauvage', sales: 189, revenue: '$17,955', trend: '+8%', percentage: 36 },
        { name: 'Tom Ford Black Orchid', sales: 156, revenue: '$28,860', trend: '+15%', percentage: 30 },
        { name: 'Versace Eros', sales: 142, revenue: '$11,076', trend: '+5%', percentage: 27 },
        { name: 'Gucci Bloom', sales: 128, revenue: '$14,336', trend: '+3%', percentage: 25 }
    ];

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Processing': return 'secondary';
            case 'Pending': return 'outline';
            case 'Cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

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

                                    <div className="flex items-center gap-1 mt-2">
                                        <TrendIcon className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                                        <span className={`text-xs md:text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-xs text-muted-foreground">from last month</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Recent Orders */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest customer orders</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs md:text-sm">
                            View All
                            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
                        </Button>
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
                        <CardDescription>Best selling fragrances</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={index} className="space-y-2">
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
                                            <p className="text-xs md:text-sm font-bold text-foreground">{product.revenue}</p>
                                            <p className="text-xs text-green-600 font-medium">{product.trend}</p>
                                        </div>
                                    </div>
                                    <Progress value={product.percentage} className="h-1" />
                                </div>
                            ))}
                        </div>
                        <Separator className="my-4" />
                        <Button variant="outline" className="w-full text-xs md:text-sm">
                            View All Products
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200">
                            <Package className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
                            <span className="text-xs md:text-sm font-medium">Add Product</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                            <span className="text-xs md:text-sm font-medium">View Orders</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200">
                            <Users className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                            <span className="text-xs md:text-sm font-medium">Customers</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200">
                            <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                            <span className="text-xs md:text-sm font-medium">Analytics</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.2%</div>
                        <p className="text-xs text-muted-foreground mt-1">+0.5% from last month</p>
                        <Progress value={32} className="mt-2" />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$128.50</div>
                        <p className="text-xs text-muted-foreground mt-1">+$12.50 from last month</p>
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">+10.7%</span>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.8/5</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on 245 reviews</p>
                        <div className="flex items-center gap-1 mt-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 text-yellow-500 fill-current">★</div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}