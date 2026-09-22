"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateDocument, getDocumentTypes } from "@/action/action";
import { DocStatus } from "@/app/constants/status";

const STATUS_OPTIONS: DocStatus[] = [
  "WAITING_FOR_APPROVAL",
  "APPROVED",
  "APPROVED_WITH_COMMENT",
  "NOT_APPROVED",
  "CANCELLED",
  "RECALLED",
];

const formSchema = z.object({
  documentName: z.string().min(1, "Document name is required"),
  documentNumber: z.string().optional(),
  documentTypeId: z.string().min(1, "Document type is required"),
  rev: z.coerce.number().min(0, "Rev must be 0 or more"),
  status: z.enum([
    "WAITING_FOR_APPROVAL",
    "APPROVED",
    "APPROVED_WITH_COMMENT",
    "NOT_APPROVED",
    "CANCELLED",
    "RECALLED",
  ]),
  returnDate: z.string().optional(),
});

// FormInput ditulis manual (bukan z.input<>) supaya "rev" punya tipe
// string | number yang cocok dipakai langsung di <Input>, bukan "unknown".
type FormInput = {
  documentName: string;
  documentNumber?: string;
  documentTypeId: string;
  rev: string | number;
  status: DocStatus;
  returnDate?: string;
};

// FormValues adalah tipe HASIL setelah divalidasi zod (rev sudah pasti number).
type FormValues = z.output<typeof formSchema>;

type DocumentType = { id: string; name: string };

export function EditButton({
  documentId,
  documentName,
  documentNumber,
  documentTypeId,
  rev,
  status,
  returnDate,
}: {
  documentId: string;
  documentName: string;
  documentNumber: string | null;
  documentTypeId: string | null;
  rev: number;
  status: DocStatus;
  returnDate: string | null;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  useEffect(() => {
    getDocumentTypes().then(setDocumentTypes);
  }, []);

  const form = useForm<FormInput>({
    // zod's z.coerce.number() membuat resolver meng-infer "rev" sebagai
    // unknown secara internal, yang tidak cocok dengan FormInput manual
    // kita (rev: string | number). Cast di sini aman karena zodResolver
    // tetap memvalidasi & mengonversi rev jadi number saat submit.
    resolver: zodResolver(formSchema) as unknown as Resolver<FormInput>,
    defaultValues: {
      documentName,
      documentNumber: documentNumber ?? "",
      documentTypeId: documentTypeId ?? "",
      rev,
      status,
      returnDate: returnDate ?? "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) =>
      updateDocument(documentId, {
        documentName: data.documentName,
        documentNumber: data.documentNumber || null,
        documentTypeId: data.documentTypeId,
        rev: data.rev,
        status: data.status,
        returnDate: data.returnDate || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document updated");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update document",
      );
    },
  });

  // zodResolver otomatis convert FormInput -> FormValues saat validasi
  // (misal rev "3" jadi number 3), makanya di sini aman di-cast.
  const onSubmit = (data: FormInput) => mutate(data as unknown as FormValues);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-yellow-500"
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-3">
            <Controller
              control={form.control}
              name="documentName"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel>Document Name</FieldLabel>
                  <Input {...field} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <Field className="gap-1">
                  <FieldLabel>Document Number</FieldLabel>
                  <Input {...field} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="documentTypeId"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel>Document Type</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="rev"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel>Rev</FieldLabel>
                  <Input {...field} type="number" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <Field className="gap-1">
                  <FieldLabel>Status</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="returnDate"
              render={({ field }) => (
                <Field className="gap-1">
                  <FieldLabel>Return Date</FieldLabel>
                  <Input {...field} type="date" />
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
