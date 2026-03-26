import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, Plus } from "lucide-react";

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  loading: boolean;
  onSubmit: () => void;
}

export function NewCustomerDialog({
  open,
  onOpenChange,
  name,
  setName,
  phone,
  setPhone,
  loading,
  onSubmit,
}: NewCustomerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Quick Add Customer
          </DialogTitle>
          <DialogDescription>
            Create a new customer record. You can add more details later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="customer-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customer-name"
              placeholder="Customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone</Label>
            <Input
              id="customer-phone"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={loading || !name.trim()} className="rounded-lg">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </div>
            ) : (
              <>
                <Plus className="mr-1 h-4 w-4" /> Add Customer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
