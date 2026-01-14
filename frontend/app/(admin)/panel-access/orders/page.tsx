'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Search,
    Filter,
    Download,
    Eye,
    MoreVertical,
    Calendar,
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Package,
    ChevronDown,
    X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface Order {
    id: string;
    customer: string;
    email: string;
    products: string;
    quantity: number;
    amount: string;
    status: 'Completed' | 'Processing' | 'Pending' | 'Shipped' | 'Cancelled';
    date: string;
    payment: string;
}

interface OrderStat {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: string;
}

interface FilterOption {
    label: string;
    value: string;
    count: number;
}

export default function OrdersPage() {
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [dateRange, setDateRange] = useState('last-7-days');

    const orderStats: OrderStat[] = [
        {
            title: 'Total Orders',
            value: '2,345',
            change: '+12.5%',
            icon: ShoppingCart,
            color: 'bg-blue-500'
        },
        {
            title: 'Pending Orders',
            value: '156',
            change: '+8.2%',
            icon: Package,
            color: 'bg-yellow-500'
        },
        {
            title: 'Completed',
            value: '2,089',
            change: '+15.3%',
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'Total Revenue',
            value: '$186,234',
            change: '+20.1%',
            icon: DollarSign,
            color: 'bg-purple-500'
        }
    ];

    const orders: Order[] = [
        {
            id: '#3210',
            customer: 'John Doe',
            email: 'john.doe@email.com',
            products: 'Chanel No. 5, Dior Sauvage',
            quantity: 2,
            amount: '$224.00',
            status: 'Completed',
            date: '2026-01-08',
            payment: 'Credit Card'
        },
        {
            id: '#3209',
            customer: 'Jane Smith',
            email: 'jane.smith@email.com',
            products: 'Dior Sauvage',
            quantity: 1,
            amount: '$95.00',
            status: 'Processing',
            date: '2026-01-08',
            payment: 'PayPal'
        },
        {
            id: '#3208',
            customer: 'Mike Johnson',
            email: 'mike.j@email.com',
            products: 'Tom Ford Black Orchid',
            quantity: 1,
            amount: '$185.00',
            status: 'Pending',
            date: '2026-01-07',
            payment: 'Credit Card'
        },
        {
            id: '#3207',
            customer: 'Sarah Williams',
            email: 'sarah.w@email.com',
            products: 'Versace Eros',
            quantity: 1,
            amount: '$78.00',
            status: 'Completed',
            date: '2026-01-07',
            payment: 'Debit Card'
        },
        {
            id: '#3206',
            customer: 'Chris Brown',
            email: 'chris.b@email.com',
            products: 'Gucci Bloom',
            quantity: 1,
            amount: '$112.00',
            status: 'Cancelled',
            date: '2026-01-06',
            payment: 'Credit Card'
        },
        {
            id: '#3205',
            customer: 'Emily Davis',
            email: 'emily.d@email.com',
            products: 'Chanel No. 5, Versace Eros',
            quantity: 2,
            amount: '$207.00',
            status: 'Completed',
            date: '2026-01-06',
            payment: 'PayPal'
        },
        {
            id: '#3204',
            customer: 'David Wilson',
            email: 'david.w@email.com',
            products: 'Tom Ford Black Orchid',
            quantity: 3,
            amount: '$555.00',
            status: 'Processing',
            date: '2026-01-05',
            payment: 'Credit Card'
        },
        {
            id: '#3203',
            customer: 'Lisa Anderson',
            email: 'lisa.a@email.com',
            products: 'Dior Sauvage',
            quantity: 1,
            amount: '$95.00',
            status: 'Shipped',
            date: '2026-01-05',
            payment: 'Debit Card'
        }
    ];

    const filters: FilterOption[] = [
        { label: 'All', value: 'all', count: orders.length },
        { label: 'Completed', value: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
        { label: 'Processing', value: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
        { label: 'Pending', value: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
        { label: 'Shipped', value: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
        { label: 'Cancelled', value: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
    ];

    const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Completed': return 'default';
            case 'Processing': return 'secondary';
            case 'Pending': return 'outline';
            case 'Shipped': return 'secondary';
            case 'Cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Orders</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage all customer orders</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Download className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {orderStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                                        <h3 className="text-xl font-bold text-foreground mt-1">{stat.value}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-600">{stat.change}</span>
                                            <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search orders by customer, ID, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Date Range Selector */}
                <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="last-7-days">Last 7 days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 days</SelectItem>
                        <SelectItem value="last-90-days">Last 90 days</SelectItem>
                        <SelectItem value="this-month">This month</SelectItem>
                        <SelectItem value="last-month">Last month</SelectItem>
                    </SelectContent>
                </Select>

                {/* Filter Tabs */}
                <div className="flex-1">
                    <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                        <TabsList className="flex w-full overflow-x-auto">
                            {filters.map((filter) => (
                                <TabsTrigger
                                    key={filter.value}
                                    value={filter.value}
                                    className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white"
                                >
                                    {filter.label}
                                    <Badge
                                        variant="secondary"
                                        className="ml-2 px-2 py-0.5 text-xs"
                                    >
                                        {filter.count}
                                    </Badge>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-bold text-foreground">{filteredOrders.length}</span> of <span className="font-bold text-foreground">{orders.length}</span> orders
                </p>
            </div>

            {/* Table View with horizontal scroll on mobile */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Order List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                        <div className="min-w-full px-2 sm:px-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap">Order ID</TableHead>
                                        <TableHead className="whitespace-nowrap">Customer</TableHead>
                                        <TableHead className="whitespace-nowrap hidden sm:table-cell">Products</TableHead>
                                        <TableHead className="whitespace-nowrap">Qty</TableHead>
                                        <TableHead className="whitespace-nowrap">Amount</TableHead>
                                        <TableHead className="whitespace-nowrap hidden md:table-cell">Date</TableHead>
                                        <TableHead className="whitespace-nowrap">Status</TableHead>
                                        <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium whitespace-nowrap">{order.id}</TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <div>
                                                    <p className="font-medium text-foreground">{order.customer}</p>
                                                    <p className="text-xs text-muted-foreground sm:hidden">{order.email.substring(0, 15)}...</p>
                                                    <p className="text-xs text-muted-foreground hidden sm:block">{order.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <p className="text-sm text-muted-foreground max-w-xs truncate">{order.products}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-medium whitespace-nowrap">
                                                    {order.quantity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold whitespace-nowrap">{order.amount}</TableCell>
                                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                                    <span className="text-sm">{order.date}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(order.status)} className="whitespace-nowrap">
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 sm:gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        <span className="hidden sm:inline ml-2">View</span>
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Download className="w-4 h-4 mr-2" />
                                                                Download Invoice
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">
                                                                Cancel Order
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                   
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="text-sm text-muted-foreground">
                    Page <span className="font-bold text-foreground">1</span> of <span className="font-bold text-foreground">3</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" className="bg-muted">
                        1
                    </Button>
                    <Button variant="outline">
                        2
                    </Button>
                    <Button variant="outline">
                        3
                    </Button>
                    <Button variant="outline">
                        Next
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredOrders.length} orders per page
                </div>
            </div>

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            <Separator />

                            {/* Order Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Order Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Order ID:</span>
                                                <span className="text-sm font-bold text-foreground">{selectedOrder.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Date:</span>
                                                <span className="text-sm text-foreground">{selectedOrder.date}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Status:</span>
                                                <Badge variant={getStatusVariant(selectedOrder.status)}>
                                                    {selectedOrder.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Customer</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Name:</span>
                                                <span className="text-sm font-medium text-foreground">{selectedOrder.customer}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Email:</span>
                                                <span className="text-sm text-foreground">{selectedOrder.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Payment & Products</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Payment Method:</span>
                                                <span className="text-sm text-foreground">{selectedOrder.payment}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Quantity:</span>
                                                <span className="text-sm font-bold text-foreground">{selectedOrder.quantity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Total Amount:</span>
                                                <span className="text-lg font-bold text-primary">{selectedOrder.amount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Products Ordered</h4>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="text-sm text-muted-foreground">{selectedOrder.products}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button variant="outline" className="flex-1">
                                    Print Invoice
                                </Button>
                                <Button variant="default" className="flex-1">
                                    Update Status
                                </Button>
                                <Button variant="default" className="flex-1">
                                    Contact Customer
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}