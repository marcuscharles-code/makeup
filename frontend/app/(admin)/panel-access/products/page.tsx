/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import {
  Search,
  Plus,
  Coffee,
  ChevronRight,
  Eye,
  Mail,
  MoreVertical,
  Edit,
  Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';



export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));

        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const truncate = (text: string, maxLength = 15) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.slice(0, maxLength) + '...'
      : text;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Product List</h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Button variant="link" className="p-0 h-auto font-normal text-slate-600 hover:text-slate-900">
            Dashboard
          </Button>
          <ChevronRight className="w-4 h-4" />
          <Button variant="link" className="p-0 h-auto font-normal text-slate-600 hover:text-slate-900">
            Ecommerce
          </Button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-400">Product List</span>
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <Coffee className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-slate-700 text-sm md:text-base">
          Tip search by Product ID: Each product is provided with a unique ID, which you can rely on to find the exact product you need.
        </AlertDescription>
      </Alert>

      {/* Controls Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Entries Dropdown */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-600 whitespace-nowrap">Showing</span>
              <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-slate-600">entries</span>
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Add New Button */}
            <Button
              onClick={() => router.push('/panel-access/products/add-product')}
              variant='default'>
              <Plus className="w-4 h-4 mr-2" />
              Add new
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-slate-900 font-semibold">Product</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Name</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Price</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Quantity</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Sale</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Stock</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                          <Image
                            src={product.mainImage}
                            alt={product.name}
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>

                      <TableCell className="text-slate-600">
                        {truncate(product.name, 30)}
                      </TableCell>

                      <TableCell className="font-semibold text-slate-900">
                        ₦{product.basePrice.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-slate-600">
                        {product.moq}
                      </TableCell>

                      <TableCell className="text-slate-600">
                        {product.variantCount}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`font-semibold ${product.status === 'active'
                            ? 'text-green-600'
                            : 'text-red-600'
                            }`}
                        >
                          {product.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/panel-access/products/view-products/${product.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Product
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => router.push(`/panel-access/products/edit-products/${product.id}`)}

                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>

                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                              <Trash className="w-4 h-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          Showing 1 to {products.length} of {products.length} entries
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}