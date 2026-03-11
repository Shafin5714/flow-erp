"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ruler, Tag } from "lucide-react";
import { BadgeInput } from "@/components/ui/badge-input";
import { DatePicker } from "@/components/ui/date-picker";
import { ProductFormValues } from "./product-schema";

interface ShippingTabProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ShippingTab({ form }: ShippingTabProps) {
  return (
    <div className="space-y-6">
      {/* Physical Attributes */}
      <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Ruler className="h-5 w-5 text-primary" />
            Physical Attributes
          </CardTitle>
          <CardDescription>Enter weight and dimensions (Shipping info).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dimensionL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensionW"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dimensionH"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card className="border-none shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Additional Details
          </CardTitle>
          <CardDescription>Set tags, expiry date, and warranty info.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date</FormLabel>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Select expiry date"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warrantyPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty Period</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 1 Year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <BadgeInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Type a tag and press Enter"
                  />
                </FormControl>
                <FormDescription>Press Enter to add multiple tags</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
