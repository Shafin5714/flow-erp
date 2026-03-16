"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_BRANDS, CREATE_BRAND, DELETE_BRAND } from "@/lib/graphql/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw, AlertCircle, Tag, Trash2, Loader2, Search } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Brand {
  id: string;
  name: string;
}

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ brands: Brand[] }>(GET_BRANDS, {
    fetchPolicy: "network-only",
  });

  const [createBrand, { loading: creating }] = useMutation(CREATE_BRAND, {
    onCompleted: () => {
      toast.success("Brand created successfully");
      setNewBrandName("");
      setPopoverOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create brand");
    },
  });

  const [deleteBrand, { loading: deleting }] = useMutation(DELETE_BRAND, {
    onCompleted: () => {
      toast.success("Brand deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete brand");
    },
  });

  const brands = data?.brands || [];

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // sort alphabetically
  filteredBrands.sort((a, b) => a.name.localeCompare(b.name));

  const handleCreate = () => {
    if (!newBrandName.trim()) return;
    createBrand({ variables: { input: { name: newBrandName.trim() } } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">Manage product brands and manufacturers.</p>
        </div>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="lg" className="rounded-full shadow-md">
              <Plus className="mr-2 h-5 w-5" /> Add Brand
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">New Brand</h4>
                <p className="text-sm text-muted-foreground">
                  Create a new brand for your products.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="space-y-1.5">
                  <Input
                    placeholder="Brand Name"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreate();
                    }}
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full h-9"
                  disabled={creating || !newBrandName.trim()}
                  onClick={handleCreate}
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Brand"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-4 gap-4 sm:gap-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">All Brands</h2>
            </div>
            <div className="relative max-w-sm w-full hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search brands..."
                className="pl-9 h-9 bg-background border-zinc-200 dark:border-zinc-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
              className="h-8 gap-1.5 border-zinc-200 dark:border-zinc-800"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading brands...</p>
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-destructive">Failed to load brands</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-3 text-zinc-400">
                <Tag className="h-8 w-8" />
              </div>
              <div>
                <p className="font-semibold">No brands found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "No results match your search."
                    : "Get started by adding your first brand."}
                </p>
              </div>
              {!searchQuery && (
                <Button variant="outline" onClick={() => setPopoverOpen(true)}>
                  Add First Brand
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex-1">Brand Name</div>
                <div className="w-48 text-right">Actions</div>
              </div>
              <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredBrands.map((brand) => (
                  <div
                    key={brand.id}
                    className="group flex items-center justify-between px-6 py-3 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {brand.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-end w-48 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${brand.name}"?`)) {
                            deleteBrand({ variables: { id: brand.id } });
                          }
                        }}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
