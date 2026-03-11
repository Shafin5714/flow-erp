"use client";

import { useMutation, useQuery } from "@apollo/client";
import { GET_CATEGORIES, CREATE_CATEGORY, DELETE_CATEGORY } from "@/lib/graphql/products";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  RefreshCw,
  AlertCircle,
  Tag,
  Trash2,
  Loader2,
  Search,
  ChevronRight,
  ChevronDown,
  CornerDownRight,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatParentId, setNewCatParentId] = useState<string>("none");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const { data, loading, error, refetch } = useQuery<{ categories: Category[] }>(GET_CATEGORIES, {
    fetchPolicy: "network-only",
  });

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category created successfully");
      setNewCatName("");
      setPopoverOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      toast.success("Category deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const categories = data?.categories || [];

  // Build category hierarchy map
  const categoryTree = useMemo(() => {
    const rootCats: Category[] = [];
    const childMap = new Map<string, Category[]>();

    categories.forEach((cat) => {
      if (!cat.parentId) {
        rootCats.push(cat);
      } else {
        const children = childMap.get(cat.parentId) || [];
        children.push(cat);
        childMap.set(cat.parentId, children);
      }
    });

    // Sort alphabetically
    rootCats.sort((a, b) => a.name.localeCompare(b.name));
    childMap.forEach((children) => children.sort((a, b) => a.name.localeCompare(b.name)));

    return { rootCats, childMap };
  }, [categories]);

  const toggleExpand = (id: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredRootCats = categoryTree.rootCats.filter((cat) => {
    // If the parent matches, show it (and its children)
    if (cat.name.toLowerCase().includes(searchQuery.toLowerCase())) return true;

    // Or if any of its children match, show the parent too
    const children = categoryTree.childMap.get(cat.id) || [];
    return children.some((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleCreate = () => {
    if (!newCatName.trim()) return;
    const input: { name: string; parentId?: string } = { name: newCatName.trim() };
    if (newCatParentId && newCatParentId !== "none") {
      input.parentId = newCatParentId;
    }
    createCategory({ variables: { input } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage product categories and organization.</p>
        </div>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="lg" className="rounded-full shadow-md">
              <Plus className="mr-2 h-5 w-5" /> Add Category
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">New Category</h4>
                <p className="text-sm text-muted-foreground">
                  Create a new category for your products.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="space-y-1.5">
                  <Input
                    placeholder="Category Name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreate();
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Select value={newCatParentId} onValueChange={setNewCatParentId}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Parent Category (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Root Category)</SelectItem>
                      {categoryTree.rootCats.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  className="w-full h-9"
                  disabled={creating || !newCatName.trim()}
                  onClick={handleCreate}
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Category"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-zinc-500" />
              <CardTitle className="text-lg">All Categories</CardTitle>
            </div>
            <div className="relative max-w-sm w-full hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-9 h-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
              className="h-8 gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-destructive">Failed to load categories</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredRootCats.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-3 text-zinc-400">
                <Tag className="h-8 w-8" />
              </div>
              <div>
                <p className="font-semibold">No categories found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "No results match your search."
                    : "Get started by adding your first category."}
                </p>
              </div>
              {!searchQuery && (
                <Button variant="outline" onClick={() => setPopoverOpen(true)}>
                  Add First Category
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Category Name</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {filteredRootCats.map((category) => {
                    const children = categoryTree.childMap.get(category.id) || [];
                    const matchesSearch = searchQuery
                      ? category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        children.some((c) =>
                          c.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      : true;

                    if (!matchesSearch) return null;

                    const isExpanded = searchQuery ? true : expandedCats.has(category.id);
                    const hasChildren = children.length > 0;

                    return (
                      <React.Fragment key={category.id}>
                        {/* Parent Category Row */}
                        <tr className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50">
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-6 w-6 rounded-md ${!hasChildren && "invisible"}`}
                                onClick={() => toggleExpand(category.id)}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-zinc-500" />
                                )}
                              </Button>
                              <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                {category.name}
                                {hasChildren && (
                                  <Badge
                                    variant="secondary"
                                    className="px-1.5 py-0 h-5 text-xs font-normal"
                                  >
                                    {children.length}
                                  </Badge>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                                onClick={() => {
                                  setNewCatParentId(category.id);
                                  setPopoverOpen(true);
                                }}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Subcategory
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  if (hasChildren) {
                                    alert(
                                      `Cannot delete "${category.name}" because it has subcategories. Delete them first.`
                                    );
                                    return;
                                  }
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete "${category.name}"?`
                                    )
                                  ) {
                                    deleteCategory({ variables: { id: category.id } });
                                  }
                                }}
                                disabled={deleting}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Child Categories Rows */}
                        {isExpanded &&
                          children.map((child) => {
                            const childMatchesSearch = searchQuery
                              ? child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                category.name.toLowerCase().includes(searchQuery.toLowerCase())
                              : true;

                            if (!childMatchesSearch) return null;

                            return (
                              <tr
                                key={child.id}
                                className="group transition-colors bg-zinc-50/30 hover:bg-zinc-50/80 dark:bg-zinc-900/20 dark:hover:bg-zinc-900/60 border-b border-zinc-100/50 dark:border-zinc-800/30"
                              >
                                <td className="px-6 py-2.5 whitespace-nowrap">
                                  <div className="flex items-center gap-2 ml-8">
                                    <CornerDownRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                                    <span className="text-zinc-700 dark:text-zinc-300">
                                      {child.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-2.5 whitespace-nowrap text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Are you sure you want to delete "${child.name}"?`
                                        )
                                      ) {
                                        deleteCategory({ variables: { id: child.id } });
                                      }
                                    }}
                                    disabled={deleting}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
