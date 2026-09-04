"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSubmission, getDocumentTypes } from "@/action/action";

type DocumentRow = {
  documentName: string;
  documentNumber: string;
  documentTypeId?: string;
  rev: number;
};

export function InsertButton() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [trNumber, setTrNumber] = useState("");
  const [submitDate, setSubmitDate] = useState("");
  const [documents, setDocuments] = useState<DocumentRow[]>([
    { documentName: "", documentNumber: "", documentTypeId: "", rev: 0 },
  ]);

  const [documentTypes, setDocumentTypes] = useState<
    { id: string; name: string }[]
  >([]);
  useEffect(() => {
    getDocumentTypes().then(setDocumentTypes);
  }, []);
  function addRow() {
    setDocuments([
      ...documents,
      { documentName: "", documentNumber: "", documentTypeId: "", rev: 0 },
    ]);
  }

  function removeRow(index: number) {
    setDocuments(documents.filter((_, i) => i !== index));
  }

  function updateRow(
    index: number,
    field: keyof DocumentRow,
    value: string | number,
  ) {
    setDocuments(
      documents.map((doc, i) =>
        i === index ? { ...doc, [field]: value } : doc,
      ),
    );
  }

  function resetForm() {
    setTrNumber("");
    setSubmitDate("");
    setDocuments([
      { documentName: "", documentNumber: "", documentTypeId: "", rev: 0 },
    ]);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await createSubmission({
        trNumber,
        submitDate,
        documents: documents.map((d) => ({
          documentName: d.documentName,
          documentNumber: d.documentNumber || null,
          documentTypeId: d.documentTypeId ?? "",
          rev: d.rev,
        })),
      });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Insert
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>TR Number</Label>
              <Input
                value={trNumber}
                onChange={(e) => setTrNumber(e.target.value)}
                placeholder="e.g. 007"
              />
            </div>
            <div>
              <Label>Submit Date</Label>
              <Input
                type="date"
                value={submitDate}
                onChange={(e) => setSubmitDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Documents</Label>
            {documents.map((doc, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Input
                  placeholder="Document name"
                  value={doc.documentName}
                  onChange={(e) =>
                    updateRow(index, "documentName", e.target.value)
                  }
                />
                <Input
                  placeholder="Document number"
                  value={doc.documentNumber}
                  onChange={(e) =>
                    updateRow(index, "documentNumber", e.target.value)
                  }
                />
                <Select
                  value={doc.documentTypeId}
                  onValueChange={(value) =>
                    updateRow(index, "documentTypeId", value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Rev"
                  className="w-20"
                  value={doc.rev}
                  onChange={(e) =>
                    updateRow(index, "rev", Number(e.target.value))
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  disabled={documents.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="size-4 mr-1" />
              Add Document
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
