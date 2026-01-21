'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    collection,
    query,
    getDocs,
    orderBy,
    where,
    Timestamp
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
    Search,
    Download,
    Eye,
    Mail,
    MoreVertical,
    Users,
    UserPlus,
    TrendingUp,
    DollarSign,
    Phone,
    ShoppingBag,
    Calendar,
    ShoppingCart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface Customer {
    id: string;
    uid: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    totalSpentFormatted: string;
    status: 'Active' | 'Inactive' | 'New';
    joinDate: string;
    lastOrder: string;
    firstName: string;
    lastName: string;
    createdAt: Timestamp;
}

interface CustomerStat {
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

export default function CustomersPage() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        newThisMonth: 0,
        activeCustomers: 0,
        avgOrderValue: 0,
        totalRevenue: 0
    });

    const fetchCustomerOrders = async (userId: string) => {
        try {
            const ordersQuery = query(
                collection(db, "orders"),
                where("userId", "==", userId)
            );
            const ordersSnapshot = await getDocs(ordersQuery);

            let totalSpent = 0;
            let lastOrderDate = "";

            ordersSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const total = data.total || 0;
                totalSpent += total;

                if (data.createdAt) {
                    const orderDate = data.createdAt.toDate().toISOString().split('T')[0];
                    if (!lastOrderDate || orderDate > lastOrderDate) {
                        lastOrderDate = orderDate;
                    }
                }
            });

            return {
                totalOrders: ordersSnapshot.size,
                totalSpent,
                lastOrder: lastOrderDate || "No orders yet"
            };
        } catch (error) {
            console.error("Error fetching customer orders:", error);
            return {
                totalOrders: 0,
                totalSpent: 0,
                lastOrder: "No orders yet"
            };
        }
    };

    const determineCustomerStatus = (joinDate: Timestamp, lastOrder: string, totalOrders: number): 'Active' | 'Inactive' | 'New' => {
        const now = new Date();
        const joinDateTime = joinDate.toDate();
        const joinDiffDays = Math.floor((now.getTime() - joinDateTime.getTime()) / (1000 * 60 * 60 * 24));

        if (joinDiffDays <= 30) {
            return 'New';
        } else if (totalOrders === 0) {
            return 'Inactive';
        } else if (lastOrder === "No orders yet") {
            return 'Inactive';
        } else {
            const lastOrderDate = new Date(lastOrder);
            const lastOrderDiffDays = Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));

            if (lastOrderDiffDays <= 30) {
                return 'Active';
            } else {
                return 'Inactive';
            }
        }
    };

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const usersQuery = query(
                    collection(db, "users"),
                    orderBy("createdAt", "desc")
                );

                const usersSnapshot = await getDocs(usersQuery);
                const fetchedCustomers: Customer[] = [];
                let totalRevenue = 0;
                let activeCustomers = 0;
                let newThisMonth = 0;

                // Get current month for "New This Month" calculation
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                for (const doc of usersSnapshot.docs) {
                    const data = doc.data();

                    // Fetch order statistics for this customer
                    const orderStats = await fetchCustomerOrders(doc.id);

                    // Determine customer status
                    const status = determineCustomerStatus(
                        data.createdAt,
                        orderStats.lastOrder,
                        orderStats.totalOrders
                    );

                    if (status === 'Active') activeCustomers++;

                    // Check if customer joined this month
                    const joinDate = data.createdAt.toDate();
                    if (joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear) {
                        newThisMonth++;
                    }

                    totalRevenue += orderStats.totalSpent;

                    const customer: Customer = {
                        id: doc.id,
                        uid: data.uid || doc.id,
                        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || "Unnamed Customer",
                        email: data.email || "No email",
                        phone: data.phone || "No phone",
                        totalOrders: orderStats.totalOrders,
                        totalSpent: orderStats.totalSpent,
                        totalSpentFormatted: `₦${orderStats.totalSpent.toLocaleString()}`,
                        status,
                        joinDate: data.createdAt.toDate().toISOString().split('T')[0],
                        lastOrder: orderStats.lastOrder,
                        firstName: data.firstName || "",
                        lastName: data.lastName || "",
                        createdAt: data.createdAt
                    };

                    fetchedCustomers.push(customer);
                }

                // Calculate average order value
                const totalOrders = fetchedCustomers.reduce((sum, customer) => sum + customer.totalOrders, 0);
                const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

                setCustomers(fetchedCustomers);
                setStats({
                    totalCustomers: fetchedCustomers.length,
                    newThisMonth,
                    activeCustomers,
                    avgOrderValue,
                    totalRevenue
                });
            } catch (error) {
                console.error("Error loading customers:", error);
                setCustomers([]);
            } finally {
                setLoading(false);
            }
        };

        loadCustomers();
    }, []);

    const customerStats: CustomerStat[] = [
        {
            title: 'Total Customers',
            value: stats.totalCustomers.toLocaleString(),
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            title: 'New This Month',
            value: stats.newThisMonth.toString(),
            icon: UserPlus,
            color: 'bg-green-500'
        },
        {
            title: 'Active Customers',
            value: stats.activeCustomers.toString(),
            icon: TrendingUp,
            color: 'bg-blue-500'
        },
        {
            title: 'Avg. Order Value',
            value: `₦${stats.avgOrderValue.toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-orange-500'
        }
    ];

    const filters: FilterOption[] = [
        { label: 'All', value: 'all', count: customers.length },
        { label: 'Active', value: 'Active', count: customers.filter(c => c.status === 'Active').length },
        { label: 'New', value: 'New', count: customers.filter(c => c.status === 'New').length },
        { label: 'Inactive', value: 'Inactive', count: customers.filter(c => c.status === 'Inactive').length }
    ];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Active': return 'default';
            case 'Inactive': return 'destructive';
            case 'New': return 'secondary';
            default: return 'outline';
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesFilter = selectedFilter === 'all' || customer.status === selectedFilter;
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "No orders yet") return dateString;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Customers</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage all customers</p>
                </div>
                <div className="flex gap-2">                   
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Add Customer</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {customerStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                                        <h3 className="text-lg font-bold text-foreground mt-0.5">{stat.value}</h3>
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customers by name, email, phone, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Filter Tabs */}
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
                    Showing <span className="font-bold text-foreground">{filteredCustomers.length}</span> of <span className="font-bold text-foreground">{customers.length}</span> customers
                </p>
            </div>

            {/* Table View */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Customer List</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading customers...</div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No customers found
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-2 sm:mx-0">
                            <div className="min-w-full px-2 sm:px-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="whitespace-nowrap">Customer</TableHead>
                                            <TableHead className="whitespace-nowrap hidden sm:table-cell">Contact</TableHead>
                                            <TableHead className="whitespace-nowrap">Orders</TableHead>
                                            <TableHead className="whitespace-nowrap hidden md:table-cell">Spent</TableHead>
                                            <TableHead className="whitespace-nowrap">Status</TableHead>
                                            <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCustomers.map((customer) => (
                                            <TableRow key={customer.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                            {customer.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{customer.name}</p>
                                                            <p className="text-xs text-muted-foreground sm:hidden">{customer.email.substring(0, 15)}...</p>
                                                            <p className="text-xs text-muted-foreground hidden sm:block">{customer.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap hidden sm:table-cell">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                                                        <Badge variant="outline" className="font-medium">
                                                            {customer.totalOrders}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap hidden md:table-cell">
                                                    <p className="text-sm font-bold text-primary">{customer.totalSpentFormatted}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(customer.status)}>
                                                        {customer.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1 sm:gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                                                            onClick={() => setSelectedCustomer(customer)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Mail className="w-4 h-4 mr-2" />
                                                                    Send Email
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive">
                                                                    Deactivate Account
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


            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="text-sm text-muted-foreground">
                    Page <span className="font-bold text-foreground">1</span> of <span className="font-bold text-foreground">1</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" className="bg-muted">
                        1
                    </Button>
                    <Button variant="outline" disabled>
                        Next
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredCustomers.length} customers per page
                </div>
            </div>

            {/* Customer Detail Dialog */}
            <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                        <DialogDescription>
                            Complete customer information and history
                        </DialogDescription>
                    </DialogHeader>

                    {selectedCustomer && (
                        <div className="space-y-6">
                            <Separator />

                            {/* Customer Header */}
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
                                    {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-foreground">{selectedCustomer.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">User ID: {selectedCustomer.id.substring(0, 12)}...</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant={getStatusVariant(selectedCustomer.status)}>
                                            {selectedCustomer.status}
                                        </Badge>
                                        <Badge variant="outline" className="font-normal">
                                            {selectedCustomer.totalOrders} orders
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                            <UserPlus className="w-4 h-4" />
                                            Personal Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Full Name</p>
                                                <p className="text-sm text-foreground">{selectedCustomer.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Membership
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Member Since</p>
                                                <p className="text-sm text-foreground">{formatDate(selectedCustomer.joinDate)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Last Order</p>
                                                <p className="text-sm text-foreground">{formatDate(selectedCustomer.lastOrder)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Contact Information
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Email</p>
                                                <p className="text-sm text-foreground">{selectedCustomer.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Stats */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold text-foreground">{selectedCustomer.totalOrders}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                                    <p className="text-2xl font-bold text-primary">{selectedCustomer.totalSpentFormatted}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button variant="outline" className="flex-1">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email
                                </Button>
                                <Button variant="default" className="flex-1">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    View Orders
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}