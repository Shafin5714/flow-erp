import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Receipt, RotateCcw, FileText, Printer } from "lucide-react";
import { Sale } from "@/lib/types";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/sales/InvoicePDF";

interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  onNewSale: () => void;
}

export function InvoicePreviewDialog({
  open,
  onOpenChange,
  sale,
  onNewSale,
}: InvoicePreviewDialogProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = async () => {
    if (!sale) return;
    try {
      setIsGeneratingPDF(true);
      const blob = await pdf(<InvoicePDF sale={sale} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold">Sale Invoice</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-100 dark:bg-zinc-900">
          {sale && (
            <div className="bg-white dark:bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none mx-auto border border-zinc-200 dark:border-zinc-100">
              <div className="p-8 text-center text-muted-foreground">
                Invoice generated successfully. Click Print to view/download the PDF.
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex sm:justify-between items-center gap-3">
          <Button
            variant="ghost"
            onClick={onNewSale}
            className="rounded-lg hidden sm:flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" /> New Sale
          </Button>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none rounded-lg items-center gap-2 border-zinc-200 dark:border-zinc-800"
              onClick={() => {
                toast.info("Downloading PDF...", { duration: 1000 });
              }}
            >
              <FileText className="h-4 w-4" /> Save PDF
            </Button>
            <Button
              className="flex-1 sm:flex-none rounded-lg items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-primary dark:hover:bg-primary/90 shadow-lg"
              onClick={() => handlePrint()}
              disabled={isGeneratingPDF}
            >
              <Printer className="h-4 w-4" /> {isGeneratingPDF ? "Preparing..." : "Print Invoice"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
