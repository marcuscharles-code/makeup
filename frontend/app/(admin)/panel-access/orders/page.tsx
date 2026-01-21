/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    collection,
    query,
    getDocs,
    orderBy
} from "firebase/firestore";
import Image from 'next/image';
import { db } from "@/firebase/firebaseConfig";
import {
    Search,
    Download,
    Eye,
    MoreVertical,
    Calendar,
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Package,
    User,
    MapPin,
    Phone
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    productId: string;
}

interface DeliveryAddress {
    address: string;
    city: string;
    state: string;
    country: string;
}

interface Order {
    id: string;
    customer: string;
    email: string;
    phone: string;
    products: string;
    quantity: number;
    amount: string;
    status: 'completed' | 'processing' | 'pending' | 'shipped' | 'cancelled';
    date: string;
    paymentMethod: string;
    paymentStatus: string;
    deliveryAddress: DeliveryAddress;
    deliveryMethod: string;
    items: OrderItem[];
    total: number;
}

interface OrderStat {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
}

interface FilterOption {
    label: string;
    value: string;
    count: number;
}

const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

const formatPaymentStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'pending_bank_transfer': 'Pending Bank Transfer',
        'paid': 'Paid',
        'failed': 'Failed',
        'refunded': 'Refunded'
    };
    return statusMap[status] || capitalize(status.replace('_', ' '));
};

export default function OrdersPage() {
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [dateRange, setDateRange] = useState('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0
    });

    const orderStats: OrderStat[] = [
        {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),          
            icon: ShoppingCart,
            color: 'bg-blue-500'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders.toString(),           
            icon: Package,
            color: 'bg-yellow-500'
        },
        {
            title: 'Completed',
            value: stats.completedOrders.toString(),          
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            title: 'Total Revenue',
            value: `₦${stats.totalRevenue.toLocaleString()}`,           
            icon: DollarSign,
            color: 'bg-purple-500'
        }
    ];

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const q = query(
                    collection(db, "orders"),
                    orderBy("createdAt", "desc")
                );

                const snapshot = await getDocs(q);

                const fetchedOrders: Order[] = [];
                let totalRevenue = 0;
                let pendingOrders = 0;
                let completedOrders = 0;

                snapshot.docs.forEach(doc => {
                    const data = doc.data();

                    // Calculate order total
                    const total = data.total || 0;
                    totalRevenue += total;

                    // Get order status
                    const status = data.status || 'pending';
                    if (status === 'pending' || status === 'processing') {
                        pendingOrders++;
                    } else if (status === 'completed' || status === 'shipped') {
                        completedOrders++;
                    }

                   
                    let dateString = '';
                    if (data.createdAt) {
                        const date = data.createdAt.toDate();
                        dateString = date.toISOString().split('T')[0];
                    }

                    // Format products string
                    const items = data.items || [];
                    const products = items.map((item: any) =>
                        `${item.name} (x${item.quantity})`
                    ).join(', ') || "No products";

                    const totalQuantity = items.reduce(
                        (sum: number, item: any) => sum + (item.quantity || 0),
                        0
                    );

                    const order: Order = {
                        id: doc.id,
                        customer: data.customerName || "Unknown Customer",
                        email: data.email || "N/A",
                        phone: data.customerPhone || "N/A",
                        products,
                        quantity: totalQuantity,
                        amount: `₦${total.toLocaleString()}`,
                        status: status.toLowerCase() as Order['status'],
                        date: dateString,
                        paymentMethod: data.paymentMethod || "N/A",
                        paymentStatus: formatPaymentStatus(data.paymentStatus || 'pending'),
                        deliveryAddress: data.deliveryAddress || {
                            address: '',
                            city: '',
                            state: '',
                            country: ''
                        },
                        deliveryMethod: data.deliveryMethod || "N/A",
                        items: items,
                        total: total
                    };

                    fetchedOrders.push(order);
                });

                setOrders(fetchedOrders);
                setStats({
                    totalOrders: fetchedOrders.length,
                    totalRevenue,
                    pendingOrders,
                    completedOrders
                });
            } catch (error) {
                console.error("Error loading orders:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const filters: FilterOption[] = [
        { label: 'All', value: 'all', count: orders.length },
        { label: 'Completed', value: 'completed', count: orders.filter(o => o.status === 'completed').length },
        { label: 'Processing', value: 'processing', count: orders.filter(o => o.status === 'processing').length },
        { label: 'Pending', value: 'pending', count: orders.filter(o => o.status === 'pending').length },
        { label: 'Shipped', value: 'shipped', count: orders.filter(o => o.status === 'shipped').length },
        { label: 'Cancelled', value: 'cancelled', count: orders.filter(o => o.status === 'cancelled').length }
    ];

    const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'completed': return 'default';
            case 'processing': return 'secondary';
            case 'pending': return 'outline';
            case 'shipped': return 'secondary';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const getStatusDisplay = (status: Order['status']): string => {
        return capitalize(status);
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
        const matchesSearch =
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Orders</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage all customer orders</p>
                </div>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {orderStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-4">
                                <div className="flex  items-center gap-4">
                                    <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                                        <h3 className="text-xl font-bold text-foreground mt-1">{stat.value}</h3>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>


            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search orders by customer, ID, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>


                <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="last-7-days">Last 7 days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 days</SelectItem>
                        <SelectItem value="last-90-days">Last 90 days</SelectItem>
                        <SelectItem value="this-month">This month</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex-1">
                    <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                        <TabsList className="flex w-full overflow-x-auto">
                            {filters.map((filter) => (
                                <TabsTrigger
                                    key={filter.value}
                                    value={filter.value}
                                    className="shrink-0 data-[state=active]:bg-primary data-[state=active]:text-white"
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


            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-bold text-foreground">{filteredOrders.length}</span> of <span className="font-bold text-foreground">{orders.length}</span> orders
                </p>
            </div>

            {/* Table View */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Order List</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading orders...</div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No orders found
                        </div>
                    ) : (
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
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    <span className="text-xs md:text-sm">{order.id.substring(0, 8)}...</span>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <div>
                                                        <p className="font-medium text-foreground">{order.customer}</p>
                                                        <p className="text-xs text-muted-foreground">{order.phone}</p>
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
                                                        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        <span className="text-sm">{order.date}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(order.status)} className="whitespace-nowrap">
                                                        {getStatusDisplay(order.status)}
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
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">                                   
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Order Information
                                        </h4>
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
                                                    {getStatusDisplay(selectedOrder.status)}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Delivery Method:</span>
                                                <span className="text-sm text-foreground">{capitalize(selectedOrder.deliveryMethod)}</span>
                                            </div>
                                        </div>
                                    </div>

                                
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Customer Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Name:</span>
                                                <span className="text-sm font-medium text-foreground">{selectedOrder.customer}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Email:</span>
                                                <span className="text-sm text-foreground">{selectedOrder.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Phone:</span>
                                                <span className="text-sm text-foreground">{selectedOrder.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-muted-foreground">Payment Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Payment Method:</span>
                                                <span className="text-sm text-foreground">{capitalize(selectedOrder.paymentMethod)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Payment Status:</span>
                                                <Badge variant={
                                                    selectedOrder.paymentStatus.toLowerCase().includes('paid')
                                                        ? 'default'
                                                        : selectedOrder.paymentStatus.toLowerCase().includes('pending')
                                                            ? 'outline'
                                                            : 'destructive'
                                                }>
                                                    {selectedOrder.paymentStatus}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Total Amount:</span>
                                                <span className="text-lg font-bold text-primary">{selectedOrder.amount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    {selectedOrder.deliveryAddress && (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Delivery Address
                                            </h4>
                                            <div className="p-3 bg-muted rounded-lg space-y-2">
                                                <p className="text-sm text-foreground">{selectedOrder.deliveryAddress.address}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}, {selectedOrder.deliveryAddress.country}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Products Ordered */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground">Products Ordered</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={item.id || index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                                                    {item.image && (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={500}
                                                            height={500}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">₦{item.price.toLocaleString()} each</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-foreground">x{item.quantity}</p>
                                                <p className="text-sm font-bold text-foreground">₦{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t">
                                    <span className="text-sm font-medium text-foreground">Total Items:</span>
                                    <span className="text-sm font-bold text-foreground">{selectedOrder.quantity}</span>
                                </div>
                            </div>

                            <Separator />

                     
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button variant="outline" className="flex-1">
                                    Print Invoice
                                </Button>
                                <Button variant="default" className="flex-1">
                                    Update Status
                                </Button>
                                <Button variant="default" className="flex-1">
                                    <Phone className="w-4 h-4 mr-2" />
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