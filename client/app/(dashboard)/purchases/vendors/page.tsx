"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_VENDORS, CREATE_VENDOR, UPDATE_VENDOR, DELETE_VENDOR } from "@/lib/graphql/vendors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  RefreshCw,
  AlertCircle,
  Truck,
  Trash2,
  Loader2,
  Search,
  Pencil,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Vendor } from "@/lib/types";

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { data, loading, error, refetch } = useQuery<{ vendors: Vendor[] }>(GET_VENDORS, {
    fetchPolicy: "network-only",
  });

  const [createVendor, { loading: creating }] = useMutation(CREATE_VENDOR, {
    onCompleted: () => {
      toast.success("Vendor created successfully");
      closeSheet();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create vendor");
    },
  });

  const [updateVendor, { loading: updating }] = useMutation(UPDATE_VENDOR, {
    onCompleted: () => {
      toast.success("Vendor updated successfully");
      closeSheet();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update vendor");
    },
  });

  const [deleteVendor, { loading: deleting }] = useMutation(DELETE_VENDOR, {
    onCompleted: () => {
      toast.success("Vendor deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete vendor");
    },
  });

  const vendors = data?.vendors || [];

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.email && vendor.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (vendor.phone && vendor.phone.includes(searchQuery))
  );

  // Sort alphabetically by name
  filteredVendors.sort((a, b) => a.name.localeCompare(b.name));

  const handleOpenEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
    });
    setSheetOpen(true);
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setTimeout(() => {
      setEditingVendor(null);
      setFormData({ name: "", email: "", phone: "", address: "" });
    }, 200);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Vendor name is required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() || null,
      address: formData.address.trim() || null,
    };

    if (editingVendor) {
      updateVendor({ variables: { id: editingVendor.id, input: payload } });
    } else {
      createVendor({ variables: { input: payload } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground">Manage your suppliers and purchase contacts.</p>
        </div>

        <Sheet
          open={sheetOpen}
          onOpenChange={(open) => {
            if (!open) closeSheet();
            else setSheetOpen(true);
          }}
        >
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="rounded-full shadow-md"
              onClick={() => {
                setEditingVendor(null);
                setFormData({ name: "", email: "", phone: "", address: "" });
              }}
            >
              <Plus className="mr-2 h-5 w-5" /> Add Vendor
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md flex flex-col p-0">
            <SheetHeader className="px-6 py-6 border-b border-zinc-200 dark:border-zinc-800">
              <SheetTitle>{editingVendor ? "Edit Vendor" : "New Vendor"}</SheetTitle>
              <SheetDescription>
                {editingVendor
                  ? "Update the details for this vendor."
                  : "Enter the details to create a new vendor profile."}
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Vendor Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Acme Tech Corp"
                      className="pl-9"
                    />
                    <Truck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@acme.com"
                      className="pl-9"
                    />
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="pl-9"
                    />
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Physical Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Supplier Blvd, Suite 100"
                      className="pl-9"
                    />
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3 mt-auto">
              <div className="flex flex-col gap-3 w-full">
                <Button
                  className="w-full"
                  onClick={handleSave}
                  disabled={creating || updating || !formData.name.trim()}
                >
                  {(creating || updating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingVendor ? "Update Vendor" : "Create Vendor"}
                </Button>
                <Button variant="outline" className="w-full" onClick={closeSheet}>
                  Cancel
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-4 gap-4 sm:gap-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-1.5">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                All Vendors
              </h2>
            </div>
            <div className="relative max-w-sm w-full hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
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
          {loading && vendors.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading vendors...</p>
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-destructive">Failed to load vendors</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center px-4">
              <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-4 text-zinc-400">
                <Truck className="h-8 w-8" />
              </div>
              <div>
                <p className="font-semibold">No vendors found</p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                  {searchQuery
                    ? "No vendors match your search criteria. Try a different term."
                    : "Add your first vendor to start creating purchase orders and tracking inventory sources."}
                </p>
              </div>
              {!searchQuery && (
                <Button variant="outline" onClick={() => setSheetOpen(true)} className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Vendor
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="hidden md:flex items-center px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <div className="w-[30%]">Vendor Details</div>
                <div className="w-[25%]">Contact Info</div>
                <div className="w-[25%]">Location</div>
                <div className="w-[10%] text-right">Balance</div>
                <div className="w-[10%] text-right">Actions</div>
              </div>
              <div className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="group flex flex-col md:flex-row md:items-center px-6 py-4 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 gap-4 md:gap-0"
                  >
                    <div className="w-full md:w-[30%]">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {vendor.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ID: {vendor.id.slice(0, 8)}
                      </p>
                    </div>

                    <div className="w-full md:w-[25%] space-y-1">
                      {vendor.email ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="mr-2 h-3.5 w-3.5 opacity-70" />
                          {vendor.email}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground/50 italic">No email</div>
                      )}
                      {vendor.phone ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-2 h-3.5 w-3.5 opacity-70" />
                          {vendor.phone}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground/50 italic">No phone</div>
                      )}
                    </div>

                    <div className="w-full md:w-[25%]">
                      {vendor.address ? (
                        <div className="flex items-start text-sm text-muted-foreground pr-4 line-clamp-2">
                          <MapPin className="mr-2 h-3.5 w-3.5 opacity-70 shrink-0 mt-0.5" />
                          <span>{vendor.address}</span>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground/50 italic flex items-center">
                          <MapPin className="mr-2 h-3.5 w-3.5 opacity-40 shrink-0" /> No address
                          provided
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-[10%] md:text-right flex items-center md:items-end justify-between md:flex-col md:justify-center">
                      <span className="md:hidden text-sm font-medium text-muted-foreground">
                        Balance:
                      </span>
                      <div
                        className={`font-medium ${vendor.balance > 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-500"}`}
                      >
                        ${vendor.balance.toFixed(2)}
                      </div>
                    </div>

                    <div className="w-full md:w-[10%] flex items-center justify-end md:opacity-0 md:group-hover:opacity-100 transition-opacity gap-1 border-t md:border-0 border-zinc-200 dark:border-zinc-800 pt-3 md:pt-0 mt-2 md:mt-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-full"
                        onClick={() => handleOpenEdit(vendor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${vendor.name}"?`)) {
                            deleteVendor({ variables: { id: vendor.id } });
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
