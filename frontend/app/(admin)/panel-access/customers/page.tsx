'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    ShoppingBag
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
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: string;
    status: 'Active' | 'Inactive' | 'New';
    joinDate: string;
    lastOrder: string;
}



export default function CustomersPage() {

    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);


    const customerStats = [
        {
            title: 'Total Customers',
            value: '1,234',
            change: '+18.2%',
            icon: Users,
            color: 'bg-purple-500'
        },
        {
            title: 'New This Month',
            value: '89',
            change: '+12.5%',
            icon: UserPlus,
            color: 'bg-green-500'
        },
        {
            title: 'Active Customers',
            value: '892',
            change: '+8.1%',
            icon: TrendingUp,
            color: 'bg-blue-500'
        },
        {
            title: 'Avg. Order Value',
            value: '$156.50',
            change: '+15.3%',
            icon: DollarSign,
            color: 'bg-orange-500'
        }
    ];

    const customers: Customer[] = [
        {
            id: 'C001',
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+1 (555) 123-4567',
            totalOrders: 12,
            totalSpent: '$1,548.00',
            status: 'Active',
            joinDate: '2025-08-15',
            lastOrder: '2026-01-08',
           
        },
        {
            id: 'C002',
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            phone: '+1 (555) 234-5678',
            totalOrders: 8,
            totalSpent: '$892.00',
            status: 'Active',
            joinDate: '2025-09-22',
            lastOrder: '2026-01-07',
           
        },
        {
            id: 'C003',
            name: 'Mike Johnson',
            email: 'mike.j@email.com',
            phone: '+1 (555) 345-6789',
            totalOrders: 25,
            totalSpent: '$3,245.00',
            status: 'Active',
            joinDate: '2025-05-10',
            lastOrder: '2026-01-06',
           
        },
        {
            id: 'C004',
            name: 'Sarah Williams',
            email: 'sarah.w@email.com',
            phone: '+1 (555) 456-7890',
            totalOrders: 5,
            totalSpent: '$456.00',
            status: 'Active',
            joinDate: '2025-11-03',
            lastOrder: '2026-01-05',
        
        },
        {
            id: 'C005',
            name: 'Chris Brown',
            email: 'chris.b@email.com',
            phone: '+1 (555) 567-8901',
            totalOrders: 3,
            totalSpent: '$289.00',
            status: 'Inactive',
            joinDate: '2025-10-18',
            lastOrder: '2025-12-20',
          
        },
        {
            id: 'C006',
            name: 'Emily Davis',
            email: 'emily.d@email.com',
            phone: '+1 (555) 678-9012',
            totalOrders: 15,
            totalSpent: '$1,892.00',
            status: 'Active',
            joinDate: '2025-07-08',
            lastOrder: '2026-01-08',
           
        },
        {
            id: 'C007',
            name: 'David Wilson',
            email: 'david.w@email.com',
            phone: '+1 (555) 789-0123',
            totalOrders: 18,
            totalSpent: '$2,156.00',
            status: 'Active',
            joinDate: '2025-06-14',
            lastOrder: '2026-01-07',
           
        },
        {
            id: 'C008',
            name: 'Lisa Anderson',
            email: 'lisa.a@email.com',
            phone: '+1 (555) 890-1234',
            totalOrders: 2,
            totalSpent: '$178.00',
            status: 'New',
            joinDate: '2026-01-02',
            lastOrder: '2026-01-05',
           
        }
    ];

    const filters = [
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
        const matchesFilter = selectedFilter === 'all' ||
            customer.status === selectedFilter;
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Customers</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage all customers</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Add Customer</span>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
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
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp className="w-3 h-3 text-green-600" />
                                            <span className="text-xs font-medium text-green-600">{stat.change}</span>
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customers by name, email, or ID..."
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

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-bold text-foreground">{filteredCustomers.length}</span> of <span className="font-bold text-foreground">{customers.length}</span> customers
                </p>
            </div>

            {/* Table View with horizontal scroll on mobile */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Customer List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                        <div className="min-w-full px-2 sm:px-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap">Customer</TableHead>
                                        <TableHead className="whitespace-nowrap hidden sm:table-cell">Contact</TableHead>
                                        <TableHead className="whitespace-nowrap">Orders</TableHead>
                                        <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer, index) => (
                                        <TableRow key={index}>
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
                                                    <p className="text-xs text-muted-foreground">{customer.phone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <Badge variant="outline" className="font-medium">
                                                    {customer.totalOrders}
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
                                                            <DropdownMenuItem>
                                                                <Phone className="w-4 h-4 mr-2" />
                                                                Call Customer
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
                                    <p className="text-sm text-muted-foreground mt-1">{selectedCustomer.id}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant={getStatusVariant(selectedCustomer.status)}>
                                            {selectedCustomer.status}
                                        </Badge>                                      
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">Contact Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <p className="text-sm text-foreground">{selectedCustomer.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Phone</p>
                                            <p className="text-sm text-foreground">{selectedCustomer.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">Membership</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Member Since</p>
                                            <p className="text-sm text-foreground">{selectedCustomer.joinDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Last Order</p>
                                            <p className="text-sm text-foreground">{selectedCustomer.lastOrder}</p>
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
                                    <p className="text-2xl font-bold text-primary">{selectedCustomer.totalSpent}</p>
                                </div>
                            </div>

                            <Separator />

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button variant="outline" className="flex-1">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Email
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call
                                </Button>
                                <Button variant="default" className="flex-1">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Orders
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}