'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  AlertCircle
} from 'lucide-react';

export default function ProductListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  const products = [
    {
      id: 1,
      productId: '#7712309',
      name: 'Dog Food, Chicken & Chicken Liver Recipe...',
      image: '🥫',
      price: '$1,452.500',
      quantity: 1638,
      sale: 20,
      stock: 'Out of stock'
    },
    {
      id: 2,
      productId: '#7712309',
      name: 'Grain Free Dry Dog Food | Rachael Ray® Nutrish®',
      image: '🍖',
      price: '$1,452.500',
      quantity: 1638,
      sale: 20,
      stock: 'Out of stock'
    },
    {
      id: 3,
      productId: '#7712309',
      name: 'Weruva Pumpkin Patch Up! Pumpkin With Ginger...',
      image: '🎃',
      price: '$1,452.500',
      quantity: 1638,
      sale: 20,
      stock: 'Out of stock'
    },
    {
      id: 4,
      productId: '#7712309',
      name: 'Milk-Bone Mini\'s Flavor Snacks Dog Treats, 15 Ounce',
      image: '🦴',
      price: '$1,452.500',
      quantity: 1638,
      sale: 20,
      stock: 'Out of stock'
    }
  ];

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
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto whitespace-nowrap">
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
                  <TableHead className="text-slate-900 font-semibold">Product ID</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Price</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Quantity</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Sale</TableHead>
                  <TableHead className="text-slate-900 font-semibold">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl md:text-3xl shrink-0">
                          {product.image}
                        </div>
                        <div className="min-w-[200px] max-w-[300px]">
                          <p className="font-medium text-slate-900 text-xs md:text-sm">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{product.productId}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{product.price}</TableCell>
                    <TableCell className="text-slate-600">{product.quantity}</TableCell>
                    <TableCell className="text-slate-600">{product.sale}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-orange-600">
                          {product.stock}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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