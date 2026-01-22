'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
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
    Upload,
    FolderTree,
    Package,
    Eye,
    MoreVertical,
    ChevronDown,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    BarChart3,
    Loader2,
    UploadCloud,
    X
} from 'lucide-react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    productCount: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
}

interface CategoryStats {
    totalCategories: number;
    activeCategories: number;
    totalProducts: number;
    averageProductsPerCategory: number;
    mostProductsCategory: string;
    mostProductsCount: number;
}

interface CategoryImage {
    id: string;
    url: string;
    file: File;
    name: string;
    cloudinaryData?: {
        url: string;
        publicId: string;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryImage, setCategoryImage] = useState<CategoryImage | null>(null);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState<CategoryStats>({
        totalCategories: 0,
        activeCategories: 0,
        totalProducts: 0,
        averageProductsPerCategory: 0,
        mostProductsCategory: '',
        mostProductsCount: 0
    });

    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        isActive: true
    });

    // Fetch categories and product counts
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);

            // Fetch categories
            const categoriesQuery = query(
                collection(db, "categories"),
                orderBy("createdAt", "desc")
            );
            const categoriesSnapshot = await getDocs(categoriesQuery);

            // Fetch products to count per category
            const productsQuery = query(collection(db, "products"));
            const productsSnapshot = await getDocs(productsQuery);

            // Count products per category
            const categoryProductCount: Record<string, number> = {};
            productsSnapshot.docs.forEach(doc => {
                const productData = doc.data();
                const category = productData.category || 'Uncategorized';
                if (category) {
                    categoryProductCount[category] = (categoryProductCount[category] || 0) + 1;
                }
            });

            const categoriesData: Category[] = [];
            let totalProducts = 0;
            let activeCategories = 0;
            let mostProductsCount = 0;
            let mostProductsCategory = '';

            categoriesSnapshot.docs.forEach(doc => {
                const data = doc.data();
                const categoryName = data.name || 'Unnamed Category';
                const productCount = categoryProductCount[categoryName] || 0;
                totalProducts += productCount;
                if (data.isActive !== false) activeCategories++;

                // Track category with most products
                if (productCount > mostProductsCount) {
                    mostProductsCount = productCount;
                    mostProductsCategory = categoryName;
                }

                categoriesData.push({
                    id: doc.id,
                    name: categoryName,
                    description: data.description || '',
                    imageUrl: data.imageUrl || '/placeholder-category.jpg',
                    productCount,
                    isActive: data.isActive !== false,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                    slug: data.slug || categoryName.toLowerCase().replace(/\s+/g, '-')
                });
            });

            // Add uncategorized category if there are uncategorized products
            const uncategorizedCount = categoryProductCount['Uncategorized'] || 0;
            if (uncategorizedCount > 0) {
                totalProducts += uncategorizedCount;
                categoriesData.push({
                    id: 'uncategorized',
                    name: 'Uncategorized',
                    description: 'Products without a category',
                    imageUrl: '/placeholder-category.jpg',
                    productCount: uncategorizedCount,
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    slug: 'uncategorized'
                });
            }

            setCategories(categoriesData);

            // Calculate stats
            const totalCategories = categoriesData.length;
            const averageProductsPerCategory = totalCategories > 0 ? totalProducts / totalCategories : 0;

            setStats({
                totalCategories,
                activeCategories,
                totalProducts,
                averageProductsPerCategory,
                mostProductsCategory,
                mostProductsCount
            });

        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const uploadToCloudinary = async (file: File) => {
        const CLOUD_NAME = "dvoyvhkjp";
        const UPLOAD_PRESET = "brandsquare_blogs";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", "perfume-categories");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
        );

        if (!res.ok) {
            throw new Error("Cloudinary upload failed");
        }

        const data = await res.json();
        return { url: data.secure_url, publicId: data.public_id };
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);

        setCategoryImage({
            id: Date.now().toString(),
            url: imageUrl,
            file: file,
            name: file.name
        });
    };

    const removeImage = () => {
        if (categoryImage?.url) {
            URL.revokeObjectURL(categoryImage.url);
        }
        setCategoryImage(null);
    };

    const handleAddCategory = async (e: FormEvent) => {
        e.preventDefault();
        if (!newCategory.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        try {
            setUploading(true);

            let imageUrl = '';

            if (categoryImage) {
                const cloudinaryData = await uploadToCloudinary(categoryImage.file);
                imageUrl = cloudinaryData.url;
            }

            const categoryData = {
                name: newCategory.name.trim(),
                description: newCategory.description.trim(),
                imageUrl,
                isActive: newCategory.isActive,
                slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await addDoc(collection(db, "categories"), categoryData);

            // Reset form
            setNewCategory({
                name: '',
                description: '',
                isActive: true
            });
            if (categoryImage?.url) {
                URL.revokeObjectURL(categoryImage.url);
            }
            setCategoryImage(null);
            setShowAddDialog(false);

            // Refresh categories
            fetchCategories();

            alert('Category created successfully! 🎉');

        } catch (error) {
            console.error("Error adding category:", error);
            alert(`Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleEditCategory = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedCategory || !selectedCategory.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        try {
            setUploading(true);
            let imageUrl = selectedCategory.imageUrl;

            if (categoryImage) {
                const cloudinaryData = await uploadToCloudinary(categoryImage.file);
                imageUrl = cloudinaryData.url;
            }

            const categoryData = {
                name: selectedCategory.name.trim(),
                description: selectedCategory.description.trim(),
                imageUrl,
                isActive: selectedCategory.isActive,
                slug: selectedCategory.name.toLowerCase().replace(/\s+/g, '-'),
                updatedAt: new Date()
            };

            await updateDoc(doc(db, "categories", selectedCategory.id), categoryData);

            // Reset
            setSelectedCategory(null);
            if (categoryImage?.url) {
                URL.revokeObjectURL(categoryImage.url);
            }
            setCategoryImage(null);
            setShowEditDialog(false);

            // Refresh categories
            fetchCategories();

            alert('Category updated successfully! ✅');

        } catch (error) {
            console.error("Error updating category:", error);
            alert(`Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            // Check if category is "Uncategorized" (system category)
            if (selectedCategory.id === 'uncategorized') {
                alert('Cannot delete the Uncategorized system category');
                setShowDeleteDialog(false);
                return;
            }

            await deleteDoc(doc(db, "categories", selectedCategory.id));
            setShowDeleteDialog(false);
            setSelectedCategory(null);

            // Refresh categories
            fetchCategories();

            alert('Category deleted successfully! 🗑️');
        } catch (error) {
            console.error("Error deleting category:", error);
            alert(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category);
        setCategoryImage(null); // Reset image
        setShowEditDialog(true);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (productCount: number) => {
        if (productCount === 0) return 'bg-gray-100 text-gray-800 border-gray-200';
        if (productCount < 5) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        if (productCount < 20) return 'bg-green-50 text-green-800 border-green-200';
        return 'bg-blue-50 text-blue-800 border-blue-200';
    };

    const getProductCountLabel = (count: number) => {
        if (count === 0) return 'No products';
        if (count === 1) return '1 product';
        return `${count} products`;
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-600 mt-1">Organize products into categories for better management</p>
                </div>
                <div className="flex gap-2">

                    <Button
                        onClick={() => setShowAddDialog(true)}
                        variant='outline'
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Category
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <FolderTree className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 font-medium">Total Categories</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCategories}</h3>

                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 font-medium">Active Categories</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.activeCategories}</h3>
                                <div className="text-sm text-gray-500">
                                    {stats.totalCategories > 0
                                        ? `${Math.round((stats.activeCategories / stats.totalCategories) * 100)}% active rate`
                                        : 'No categories'
                                    }
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 font-medium">Total Products</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</h3>
                                <div className="text-sm text-gray-500">
                                    Across all categories
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 font-medium">Top Category</p>
                                <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">
                                    {stats.mostProductsCategory || 'N/A'}
                                </h3>
                                <div className="text-sm text-gray-500">
                                    {stats.mostProductsCount} products
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="relative max-w-4xl flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    placeholder="Search categories by name, description, or slug..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border border-black"
                />
            </div>

            {/* Categories Table */}
            <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Category List</CardTitle>
                            <CardDescription>
                                Manage your product categories
                            </CardDescription>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{filteredCategories.length}</span> of <span className="font-semibold text-gray-900">{categories.length}</span> categories
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4 py-8">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-30" />
                                            <Skeleton className="h-3 w-30" />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-8 w-20" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                            <p className="text-gray-500 mb-4 max-w-md mx-auto">
                                {searchTerm
                                    ? 'No categories match your search. Try different keywords.'
                                    : 'Start organizing your products by creating categories.'
                                }
                            </p>
                            <Button
                                onClick={() => setShowAddDialog(true)}
                                className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Category
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[300px]">Category</TableHead>
                                        <TableHead>Products</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Description</TableHead>
                                        <TableHead className="hidden lg:table-cell">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.map((category) => (
                                        <TableRow key={category.id} className="hover:bg-gray-50/50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12 border-2 border-gray-100">
                                                        <AvatarImage
                                                            src={category.imageUrl}
                                                            alt={category.name}
                                                            className="object-cover"
                                                        />
                                                        <AvatarFallback className="bg-linear-to-br from-purple-100 to-pink-100 text-purple-800 font-semibold">
                                                            {category.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{category.name}</p>
                                                        <p className="text-sm text-gray-500">/{category.slug}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={`font-medium w-fit ${getStatusColor(category.productCount)}`}
                                                    >
                                                        {getProductCountLabel(category.productCount)}
                                                    </Badge>
                                                    {category.productCount > 0 && (
                                                        <Progress
                                                            value={Math.min(category.productCount * 2, 100)}
                                                            className="w-24 h-1.5"
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={category.isActive ? "default" : "secondary"}
                                                    className={`${category.isActive
                                                        ? "bg-green-50 text-green-700 hover:bg-green-50 border border-green-200"
                                                        : "bg-gray-50 text-gray-700 hover:bg-gray-50 border border-gray-200"
                                                        }`}
                                                >
                                                    {category.isActive ? (
                                                        <>
                                                            <CheckCircle className="w-3 h-3 mr-1.5" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3 h-3 mr-1.5" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                                                    {category.description || 'No description provided'}
                                                </p>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-900">
                                                        {category.createdAt.toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {category.createdAt.toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
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
                                                        <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Category
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Products
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {category.id !== 'uncategorized' && (
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedCategory(category);
                                                                    setShowDeleteDialog(true);
                                                                }}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete Category
                                                            </DropdownMenuItem>
                                                        )}
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

            {/* Add Category Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                            Add a new product category to organize your products.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddCategory}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-1">
                                    Category Name
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Perfumes, Body Sprays, Gift Sets"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    This will create a URL slug: /{newCategory.name ? newCategory.name.toLowerCase().replace(/\s+/g, '-') : 'category-name'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe this category (optional)"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Category Image</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors">
                                    {categoryImage ? (
                                        <div className="space-y-3">
                                            <div className="relative w-32 h-32 mx-auto">
                                                <Image
                                                    src={categoryImage.url}
                                                    alt="Preview"
                                                    width={500}
                                                    height={500}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6"
                                                    onClick={removeImage}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{categoryImage.name}</p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                            >
                                                Change Image
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600 mb-2">Upload category image (optional)</p>
                                            <p className="text-xs text-gray-500 mb-3">Recommended: 500x500px, JPG/PNG</p>
                                            <Label htmlFor="image-upload" className="cursor-pointer">
                                                <Button type="button" variant="outline" size="sm">
                                                    Choose File
                                                </Button>
                                                <Input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageUpload}
                                                />
                                            </Label>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="space-y-0.5">
                                    <Label htmlFor="active" className="text-sm font-medium">Category Status</Label>
                                    <p className="text-xs text-gray-500">Make this category visible to customers</p>
                                </div>
                                <Switch
                                    id="active"
                                    checked={newCategory.isActive}
                                    onCheckedChange={(checked) => setNewCategory({ ...newCategory, isActive: checked })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowAddDialog(false)}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={uploading || !newCategory.name.trim()}
                                className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Category'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update category information and settings.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCategory && (
                        <form onSubmit={handleEditCategory}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name" className="flex items-center gap-1">
                                        Category Name
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="edit-name"
                                        value={selectedCategory.name}
                                        onChange={(e) => setSelectedCategory({
                                            ...selectedCategory,
                                            name: e.target.value
                                        })}
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        URL slug: /{selectedCategory.name.toLowerCase().replace(/\s+/g, '-')}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                        id="edit-description"
                                        value={selectedCategory.description}
                                        onChange={(e) => setSelectedCategory({
                                            ...selectedCategory,
                                            description: e.target.value
                                        })}
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-image">Category Image</Label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-20 h-20">
                                                <Image
                                                    src={categoryImage?.url || selectedCategory.imageUrl}
                                                    alt="Current"
                                                    width={500}
                                                    height={500}
                                                    className="w-full h-full object-cover rounded-lg border"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor="edit-image-upload" className="cursor-pointer">
                                                    <Button type="button" variant="outline" size="sm">
                                                        Change Image
                                                    </Button>
                                                    <Input
                                                        id="edit-image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleImageUpload}
                                                    />
                                                </Label>
                                                {categoryImage && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="mt-2 text-red-600 hover:text-red-700"
                                                        onClick={removeImage}
                                                    >
                                                        Remove new image
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="edit-active" className="text-sm font-medium">Category Status</Label>
                                        <p className="text-xs text-gray-500">Make this category visible to customers</p>
                                    </div>
                                    <Switch
                                        id="edit-active"
                                        checked={selectedCategory.isActive}
                                        onCheckedChange={(checked) => setSelectedCategory({
                                            ...selectedCategory,
                                            isActive: checked
                                        })}
                                    />
                                </div>

                                {/* Category Stats */}
                                <div className="p-3 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-900 mb-2">Category Statistics</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-2 bg-white rounded border">
                                            <p className="text-lg font-bold text-purple-600">{selectedCategory.productCount}</p>
                                            <p className="text-xs text-gray-600">Total Products</p>
                                        </div>
                                        <div className="text-center p-2 bg-white rounded border">
                                            <p className="text-xs font-medium text-gray-900">
                                                {selectedCategory.createdAt.toLocaleDateString('short')}
                                            </p>
                                            <p className="text-xs text-gray-600">Created Date</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEditDialog(false)}
                                    disabled={uploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={uploading || !selectedCategory.name.trim()}
                                    className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Category'
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
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedCategory?.productCount > 0 ? (
                                <>
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm font-medium text-red-800">
                                            ⚠️ <span className="font-bold">Warning:</span> This category contains {selectedCategory.productCount} product(s).
                                        </p>
                                        <p className="text-sm text-red-700 mt-1">
                                            Deleting this category will remove it from all associated products.
                                            Products will be moved to &quot;Uncategorized&quot;.
                                        </p>
                                    </div>
                                    <p>Are you sure you want to delete &quot;{selectedCategory?.name}&quot;?</p>
                                    <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete &quot;{selectedCategory?.name}&quot;?
                                    <p className="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCategory}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Category
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}