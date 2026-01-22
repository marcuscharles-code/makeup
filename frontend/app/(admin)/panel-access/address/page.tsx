'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    Download,
    Upload,
    MapPin,
    Navigation,
    Clock,
    MoreVertical,
    ChevronDown,
    CheckCircle,
    XCircle,
    Star,
    Loader2,
} from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

interface PickupAddress {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    contactPerson: string;
    phone: string;
    email: string;
    instructions: string;
    isDefault: boolean;
    isActive: boolean;
    businessHours: {
        opening: string;
        closing: string;
        days: string[];
    };
    createdAt: Date;
    updatedAt: Date;
}

export default function PickupAddressPage() {
    const [addresses, setAddresses] = useState<PickupAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<PickupAddress | null>(null);
    const [saving, setSaving] = useState(false);

    const [newAddress, setNewAddress] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        country: 'Nigeria',
        zipCode: '',
        contactPerson: '',
        phone: '',
        email: '',
        instructions: '',
        isDefault: false,
        isActive: true,
        businessHours: {
            opening: '09:00',
            closing: '18:00',
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);

            const addressesQuery = query(
                collection(db, "pickupAddresses"),
                orderBy("createdAt", "desc")
            );

            const addressesSnapshot = await getDocs(addressesQuery);

            const addressesData: PickupAddress[] = addressesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name || 'Unnamed Location',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    country: data.country || 'Nigeria',
                    zipCode: data.zipCode || '',
                    contactPerson: data.contactPerson || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    instructions: data.instructions || '',
                    isDefault: data.isDefault || false,
                    isActive: data.isActive !== false,
                    businessHours: data.businessHours || {
                        opening: '09:00',
                        closing: '18:00',
                        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                    },
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                };
            });

            setAddresses(addressesData);

        } catch (error) {
            console.error("Error fetching pickup addresses:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: FormEvent) => {
        e.preventDefault();


        if (!newAddress.name.trim() || !newAddress.address.trim() || !newAddress.city.trim() || !newAddress.state.trim()) {
            alert('Please fill in all required fields: Name, Address, City, and State');
            return;
        }

        try {
            setSaving(true);
            if (newAddress.isDefault) {
                const defaultAddresses = addresses.filter(addr => addr.isDefault);
                for (const addr of defaultAddresses) {
                    await updateDoc(doc(db, "pickupAddresses", addr.id), {
                        isDefault: false,
                        updatedAt: new Date()
                    });
                }
            }

            const addressData = {
                ...newAddress,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await addDoc(collection(db, "pickupAddresses"), addressData);

            // Reset form
            setNewAddress({
                name: '',
                address: '',
                city: '',
                state: '',
                country: 'Nigeria',
                zipCode: '',
                contactPerson: '',
                phone: '',
                email: '',
                instructions: '',
                isDefault: false,
                isActive: true,
                businessHours: {
                    opening: '09:00',
                    closing: '18:00',
                    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                }
            });

            setShowAddDialog(false);
            fetchAddresses();

            alert('Pickup address added successfully! 📍');

        } catch (error) {
            console.error("Error adding address:", error);
            alert(`Failed to add address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleEditAddress = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedAddress) return;

        if (!selectedAddress.name.trim() || !selectedAddress.address.trim() || !selectedAddress.city.trim() || !selectedAddress.state.trim()) {
            alert('Please fill in all required fields: Name, Address, City, and State');
            return;
        }

        try {
            setSaving(true);

            if (selectedAddress.isDefault) {
                const defaultAddresses = addresses.filter(addr => addr.isDefault && addr.id !== selectedAddress.id);
                for (const addr of defaultAddresses) {
                    await updateDoc(doc(db, "pickupAddresses", addr.id), {
                        isDefault: false,
                        updatedAt: new Date()
                    });
                }
            }

            const addressData = {
                ...selectedAddress,
                updatedAt: new Date()
            };

            await updateDoc(doc(db, "pickupAddresses", selectedAddress.id), addressData);


            setSelectedAddress(null);
            setShowEditDialog(false);

            // Refresh addresses
            fetchAddresses();

            alert('Pickup address updated successfully! ✅');

        } catch (error) {
            console.error("Error updating address:", error);
            alert(`Failed to update address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAddress = async () => {
        if (!selectedAddress) return;

        try {
            if (selectedAddress.isDefault && addresses.length > 1) {
                const otherAddresses = addresses.filter(addr => addr.id !== selectedAddress.id);
                if (otherAddresses.length > 0) {
                    await updateDoc(doc(db, "pickupAddresses", otherAddresses[0].id), {
                        isDefault: true,
                        updatedAt: new Date()
                    });
                }
            }

            await deleteDoc(doc(db, "pickupAddresses", selectedAddress.id));
            setShowDeleteDialog(false);
            setSelectedAddress(null);

            // Refresh addresses
            fetchAddresses();

            alert('Pickup address deleted successfully! 🗑️');
        } catch (error) {
            console.error("Error deleting address:", error);
            alert(`Failed to delete address: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const openEditDialog = (address: PickupAddress) => {
        setSelectedAddress(address);
        setShowEditDialog(true);
    };

    const handleDayToggle = (day: string) => {
        if (selectedAddress) {
            const currentDays = selectedAddress.businessHours.days;
            const newDays = currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day];

            setSelectedAddress({
                ...selectedAddress,
                businessHours: {
                    ...selectedAddress.businessHours,
                    days: newDays
                }
            });
        }
    };

    const filteredAddresses = addresses.filter(address =>
        address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatBusinessHours = (hours: { opening: string; closing: string; days: string[] }) => {
        const days = hours.days.length === 7 ? 'Everyday' : hours.days.join(', ');
        return `${days}: ${hours.opening} - ${hours.closing}`;
    };

    const getStatusColor = (isActive: boolean, isDefault: boolean) => {
        if (isDefault) return 'bg-linear-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200';
        if (isActive) return 'bg-green-50 text-green-800 border-green-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pickup Addresses</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage locations where customers can pick up their orders</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setShowAddDialog(true)}
                        variant='outline'                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Pickup Address
                    </Button>
                </div>
            </div>

            {/* Info Card */}
            <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">About Pickup Addresses</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Add multiple pickup locations for customers. Set one as default to show first on checkout.
                                Include business hours and contact information for each location.
                            </p>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {addresses.filter(a => a.isDefault).length} Default Address
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="relative flex-1 max-w-4xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    placeholder="Search addresses by name, location, or contact person..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Pickup Locations</CardTitle>
                            <CardDescription>
                                Manage all pickup addresses for customer orders
                            </CardDescription>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{filteredAddresses.length}</span> of <span className="font-semibold text-gray-900">{addresses.length}</span> addresses
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4 py-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-3 w-[150px]" />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredAddresses.length === 0 ? (
                        <div className="text-center py-12">
                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No pickup addresses found</h3>
                            <p className="text-gray-500 mb-4 max-w-md mx-auto">
                                {searchTerm
                                    ? 'No addresses match your search. Try different keywords.'
                                    : 'Set up pickup locations for customers to collect their orders.'
                                }
                            </p>
                            <Button
                                onClick={() => setShowAddDialog(true)}
                                className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Pickup Address
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[300px]">Location</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead className="hidden md:table-cell">Business Hours</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAddresses.map((address) => (
                                        <TableRow key={address.id} className="hover:bg-gray-50/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-linear-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                                        <MapPin className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900">{address.name}</p>
                                                            {address.isDefault && (
                                                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {address.city}, {address.state}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                                                    {address.address}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {address.zipCode}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-gray-900">{address.contactPerson}</p>
                                                    <p className="text-xs text-gray-600">{address.phone}</p>
                                                    {address.email && (
                                                        <p className="text-xs text-gray-600 truncate">{address.email}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-600">
                                                            {address.businessHours.opening} - {address.businessHours.closing}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {address.businessHours.days.length} days/week
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={`font-medium w-fit ${getStatusColor(address.isActive, address.isDefault)}`}
                                                    >
                                                        {address.isDefault ? (
                                                            <>
                                                                <Star className="w-3 h-3 mr-1 fill-current" />
                                                                Default
                                                            </>
                                                        ) : address.isActive ? (
                                                            <>
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Active
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-3 h-3 mr-1" />
                                                                Inactive
                                                            </>
                                                        )}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => openEditDialog(address)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Address
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Navigation className="w-4 h-4 mr-2" />
                                                            View on Map
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedAddress(address);
                                                                setShowDeleteDialog(true);
                                                            }}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete Address
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Address Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Pickup Address</DialogTitle>
                        <DialogDescription>
                            Create a new pickup location for customer orders.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddAddress}>
                        <div className="space-y-4 py-4">
                            {/* Location Name & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-1">
                                        Location Name
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Main Store, Warehouse, Branch Office"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="isDefault" className="text-sm font-medium">Set as Default</Label>
                                        <p className="text-xs text-gray-500">Show this address first on checkout</p>
                                    </div>
                                    <Switch
                                        id="isDefault"
                                        checked={newAddress.isDefault}
                                        onCheckedChange={(checked) => setNewAddress({ ...newAddress, isDefault: checked })}
                                    />
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-1">
                                    Street Address
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="address"
                                    placeholder="Full street address, building number, floor, etc."
                                    value={newAddress.address}
                                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                    rows={2}
                                    required
                                />
                            </div>

                            {/* City, State, Country */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="flex items-center gap-1">
                                        City
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="city"
                                        placeholder="City"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state" className="flex items-center gap-1">
                                        State
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="state"
                                        placeholder="State"
                                        value={newAddress.state}
                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={newAddress.country}
                                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Zip Code & Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                                    <Input
                                        id="zipCode"
                                        placeholder="ZIP/Postal Code"
                                        value={newAddress.zipCode}
                                        onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson">Contact Person</Label>
                                    <Input
                                        id="contactPerson"
                                        placeholder="Name of contact person"
                                        value={newAddress.contactPerson}
                                        onChange={(e) => setNewAddress({ ...newAddress, contactPerson: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        placeholder="Phone number"
                                        value={newAddress.phone}
                                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email address for notifications"
                                    value={newAddress.email}
                                    onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                                />
                            </div>

                            {/* Business Hours */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Business Hours
                                </Label>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="opening">Opening Time</Label>
                                        <Input
                                            id="opening"
                                            type="time"
                                            value={newAddress.businessHours.opening}
                                            onChange={(e) => setNewAddress({
                                                ...newAddress,
                                                businessHours: {
                                                    ...newAddress.businessHours,
                                                    opening: e.target.value
                                                }
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="closing">Closing Time</Label>
                                        <Input
                                            id="closing"
                                            type="time"
                                            value={newAddress.businessHours.closing}
                                            onChange={(e) => setNewAddress({
                                                ...newAddress,
                                                businessHours: {
                                                    ...newAddress.businessHours,
                                                    closing: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm">Operating Days</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {daysOfWeek.map(day => (
                                            <Button
                                                key={day}
                                                type="button"
                                                variant={newAddress.businessHours.days.includes(day) ? "default" : "outline"}
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => {
                                                    const currentDays = newAddress.businessHours.days;
                                                    const newDays = currentDays.includes(day)
                                                        ? currentDays.filter(d => d !== day)
                                                        : [...currentDays, day];

                                                    setNewAddress({
                                                        ...newAddress,
                                                        businessHours: {
                                                            ...newAddress.businessHours,
                                                            days: newDays
                                                        }
                                                    });
                                                }}
                                            >
                                                {day.substring(0, 3)}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Instructions */}
                            <div className="space-y-2">
                                <Label htmlFor="instructions">Additional Instructions</Label>
                                <Textarea
                                    id="instructions"
                                    placeholder="Special instructions for customers (parking, entrance, identification, etc.)"
                                    value={newAddress.instructions}
                                    onChange={(e) => setNewAddress({ ...newAddress, instructions: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label htmlFor="isActive" className="text-sm font-medium">Address Status</Label>
                                    <p className="text-xs text-gray-500">Make this pickup location available to customers</p>
                                </div>
                                <Switch
                                    id="isActive"
                                    checked={newAddress.isActive}
                                    onCheckedChange={(checked) => setNewAddress({ ...newAddress, isActive: checked })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAddDialog(false)}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving || !newAddress.name.trim() || !newAddress.address.trim() || !newAddress.city.trim() || !newAddress.state.trim()}
                                className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Add Pickup Address'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Address Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Pickup Address</DialogTitle>
                        <DialogDescription>
                            Update pickup location information.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedAddress && (
                        <form onSubmit={handleEditAddress}>
                            <div className="space-y-4 py-4">
                                {/* Location Name & Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name" className="flex items-center gap-1">
                                            Location Name
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            value={selectedAddress.name}
                                            onChange={(e) => setSelectedAddress({
                                                ...selectedAddress,
                                                name: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="edit-isDefault" className="text-sm font-medium">Set as Default</Label>
                                            <p className="text-xs text-gray-500">Show this address first on checkout</p>
                                        </div>
                                        <Switch
                                            id="edit-isDefault"
                                            checked={selectedAddress.isDefault}
                                            onCheckedChange={(checked) => setSelectedAddress({
                                                ...selectedAddress,
                                                isDefault: checked
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="space-y-2">
                                    <Label htmlFor="edit-address" className="flex items-center gap-1">
                                        Street Address
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="edit-address"
                                        value={selectedAddress.address}
                                        onChange={(e) => setSelectedAddress({
                                            ...selectedAddress,
                                            address: e.target.value
                                        })}
                                        rows={2}
                                        required
                                    />
                                </div>

                                {/* City, State, Country */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-city" className="flex items-center gap-1">
                                            City
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="edit-city"
                                            value={selectedAddress.city}
                                            onChange={(e) => setSelectedAddress({
                                                ...selectedAddress,
                                                city: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-state" className="flex items-center gap-1">
                                            State
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="edit-state"
                                            value={selectedAddress.state}
                                            onChange={(e) => setSelectedAddress({
                                                ...selectedAddress,
                                                state: e.target.value
                                            })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-country">Country</Label>
                                        <Input
                                            id="edit-country"
                                            value={selectedAddress.country}
                                            onChange={(e) => setSelectedAddress({
                                                ...selectedAddress,
                                                country: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Zip Code & Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-zipCode">ZIP/Postal Code</Label>
                                        <Input
                                            id="edit-zipCode"
                                            value={selectedAddress.zipCode}
                                            onChange={(e) => setSelectedAddress({
                                                ...selectedAddress,
                                                zipCode: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-contactPerson">Contact Person</Label>
                                        <Input
                                            id="edit-contactPerson"
                                            value={selectedAddress.contactPerson}
                                            onChange={(e) => setSelectedAddress({
                                                ...selectedAddress,
                                                contactPerson: e.target.value
                                            })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edit-phone">Phone Number</Label>
                                        <Input
                                            id="edit-phone"
                                            value={selectedAddress.phone}
                                            onChange={(e) => setSelectedAddress({
                                                ...selectedAddress,
                                                phone: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email Address</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={selectedAddress.email}
                                        onChange={(e) => setSelectedAddress({
                                            ...selectedAddress,
                                            email: e.target.value
                                        })}
                                    />
                                </div>

                                {/* Business Hours */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Business Hours
                                    </Label>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-opening">Opening Time</Label>
                                            <Input
                                                id="edit-opening"
                                                type="time"
                                                value={selectedAddress.businessHours.opening}
                                                onChange={(e) => setSelectedAddress({
                                                    ...selectedAddress,
                                                    businessHours: {
                                                        ...selectedAddress.businessHours,
                                                        opening: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="edit-closing">Closing Time</Label>
                                            <Input
                                                id="edit-closing"
                                                type="time"
                                                value={selectedAddress.businessHours.closing}
                                                onChange={(e) => setSelectedAddress({
                                                    ...selectedAddress,
                                                    businessHours: {
                                                        ...selectedAddress.businessHours,
                                                        closing: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm">Operating Days</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {daysOfWeek.map(day => (
                                                <Button
                                                    key={day}
                                                    type="button"
                                                    variant={selectedAddress.businessHours.days.includes(day) ? "default" : "outline"}
                                                    size="sm"
                                                    className="text-xs"
                                                    onClick={() => handleDayToggle(day)}
                                                >
                                                    {day.substring(0, 3)}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Instructions */}
                                <div className="space-y-2">
                                    <Label htmlFor="edit-instructions">Additional Instructions</Label>
                                    <Textarea
                                        id="edit-instructions"
                                        value={selectedAddress.instructions}
                                        onChange={(e) => setSelectedAddress({
                                            ...selectedAddress,
                                            instructions: e.target.value
                                        })}
                                        rows={3}
                                    />
                                </div>

                                {/* Active Status */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="edit-isActive" className="text-sm font-medium">Address Status</Label>
                                        <p className="text-xs text-gray-500">Make this pickup location available to customers</p>
                                    </div>
                                    <Switch
                                        id="edit-isActive"
                                        checked={selectedAddress.isActive}
                                        onCheckedChange={(checked) => setSelectedAddress({
                                            ...selectedAddress,
                                            isActive: checked
                                        })}
                                    />
                                </div>

                                {/* Metadata */}
                                <div className="p-3 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900 mb-2">Address Information</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-2 bg-white rounded border">
                                            <p className="text-xs font-medium text-gray-900">
                                                {selectedAddress.createdAt.toLocaleDateString('short')}
                                            </p>
                                            <p className="text-xs text-gray-600">Created Date</p>
                                        </div>
                                        <div className="text-center p-2 bg-white rounded border">
                                            <p className="text-xs font-medium text-gray-900">
                                                {selectedAddress.isDefault ? 'Default' : 'Not Default'}
                                            </p>
                                            <p className="text-xs text-gray-600">Address Type</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEditDialog(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving || !selectedAddress.name.trim() || !selectedAddress.address.trim() || !selectedAddress.city.trim() || !selectedAddress.state.trim()}
                                    className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Address'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Pickup Address</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedAddress?.isDefault ? (
                                <>
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm font-medium text-red-800">
                                            ⚠️ <span className="font-bold">Warning:</span> This is the default pickup address.
                                        </p>
                                        <p className="text-sm text-red-700 mt-1">
                                            Deleting this address will automatically set another address as default.
                                        </p>
                                    </div>
                                    <p>Are you sure you want to delete &quot;{selectedAddress?.name}&quot;?</p>
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete &quot;{selectedAddress?.name}&quot;?
                                </>
                            )}
                            <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAddress}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Address
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}