"use client";

// * 1. import library yg penting

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ? useForm = hook untuk mengelola state form, validasi, submit, dan semuanya
// ? useFieldArray = hook untuk mengelola field dalam bentuk array (misal: list dokumen)
// ? Controller = komponen untuk menghubungkan komponen shadcn dengan react-hook-form

// * 2. import komponen UI (komponen shadcn, symbol, dll)
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { createSubmission, getDocumentTypes } from "@/action/action";

// * 3. buat schema validasi form pakai Zod
const formSchema = z.object({
  trNumber: z.string().min(1, "TR Number is required"),
  submitDate: z.string().min(1, "Submit date is required"),
  // * 4. buat validasi untuk array dokumen
  documents: z
    .array(
      z.object({
        documentName: z.string().min(1, "Document name is required"),
        documentNumber: z.string().nullable(),
        documentTypeId: z.string().min(1, "Document type is required"),
        rev: z
          .number({ message: "Rev must be a number" })
          .min(0, "Rev must be 0 or more"),
      }),
    )
    .min(1, "At least 1 document is required"),
});

// * 5. buat type untuk form values berdasarkan schema
type FormValues = z.infer<typeof formSchema>;

// * 6. buat komponen InsertButton
export function InsertButton() {
  // * 7. setup react-query untuk invalidasi query setelah submit sukses
  // ? "tolong tandai cache dengan key ["documents"] sebagai basi/gak valid lagi, terus fetch ulang otomatis." Jadi begitu submit sukses, tabel submissions otomatis refresh nampilin data terbaru, tanpa user harus reload halaman manual.

  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false); // * 8. setup state untuk buka/tutup dialog

  // * 9. setup state untuk simpan document types ke dalam array
  const [documentTypes, setDocumentTypes] = useState<
    { id: string; name: string }[]
  >([]);

  const [typesLoading, setTypesLoading] = useState(true); // * 10. setup state untuk loading saat fetch document types
  const [typesError, setTypesError] = useState(false); // * 11. setup state untuk error saat fetch document types

  // * 12. setup useEffect untuk fetch document types saat komponen pertama kali di-render
  useEffect(() => {
    getDocumentTypes()
      .then((data) => {
        // ? "apabila berhasil lakukan ini"
        setDocumentTypes(data); // ? set state documentTypes dengan data yg diterima dari API
        setTypesError(false); // ? set state typesError ke false, karena berhasil fetch
      })
      .catch(() => {
        // ?` "apabila gagal lakukan ini"
        setTypesError(true); // ? set state typesError ke true, karena gagal fetch
      })
      .finally(() => {
        // ? "apapun hasilnya, lakukan ini di akhir"
        setTypesLoading(false); // ? set state typesLoading ke false, karena proses fetch sudah selesai
      });
  }, []);

  // * 13. setup react-hook-form untuk mengelola form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trNumber: "",
      submitDate: "",
      documents: [
        { documentName: "", documentNumber: null, documentTypeId: "", rev: 0 },
      ],
    },
  });

  // * 14. setup useFieldArray untuk mengelola field array dokumen
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "documents",
  });

  // * 15. setup useMutation untuk submit form ke API
  // ? "tolong jalankan fungsi createSubmission dengan data form, terus kalau sukses lakukan ini, kalau gagal lakukan itu"
  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormValues) => createSubmission(data),
    onSuccess: () => {
      // ? "kalau sukses lakukan ini"
      form.reset(); // ? reset form ke default values
      queryClient.invalidateQueries({ queryKey: ["documents"] }); // ? membuat tabel/list dokumen di tempat lain refresh otomatis nampilin data terbaru.
      toast.success("Submission created successfully!"); // ? tampilkan toast sukses
      setOpen(false); // ? tutup dialog
    },
    onError: (error) => {
      // ? "kalau gagal lakukan ini"
      toast.error(
        // ? tampilkan toast error
        error instanceof Error ? error.message : "Failed to create submission",
      );
    },
  });

  // * 16. membuat fungsi onSubmit untuk submit form
  const onSubmit = (data: FormValues) => {
    mutate(data); // ? jalankan useMutation untuk submit data ke API
  };

  const handleOpenChange = (val: boolean) => {
    // ? fungsi untuk handle buka/tutup dialog
    setOpen(val);
    if (!val) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Insert
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>New Submission</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="overflow-y-auto flex-1 pr-2 space-y-4">
            <FieldGroup className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="trNumber"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="trNumber">TR Number</FieldLabel>
                    <Input {...field} id="trNumber" placeholder="e.g. 007" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="submitDate"
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel htmlFor="submitDate">Submit Date</FieldLabel>
                    <Input {...field} id="submitDate" type="date" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="gap-2">
              <FieldLabel>Documents</FieldLabel>

              {/* FIX #4: tampilkan pesan kalau gagal ambil document types */}
              {typesError && (
                <p className="text-sm text-red-500">
                  Failed to load document types. Please refresh and try again.
                </p>
              )}

              {fields.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-2 items-start">
                  <Controller
                    control={form.control}
                    name={`documents.${index}.documentName`}
                    render={({ field, fieldState }) => (
                      <Field className="gap-1 flex-1">
                        <Input {...field} placeholder="Document name" />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`documents.${index}.documentNumber`}
                    render={({ field, fieldState }) => (
                      <Field className="gap-1 flex-1">
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          placeholder="Document number"
                        />
                        {/* FIX #1: tampilkan error untuk documentNumber juga */}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`documents.${index}.documentTypeId`}
                    render={({ field, fieldState }) => (
                      <Field className="gap-1 w-40">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          // FIX #5: disable select selama data masih loading
                          disabled={typesLoading}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={typesLoading ? "Loading..." : "Type"}
                            />
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
                    name={`documents.${index}.rev`}
                    render={({ field, fieldState }) => (
                      <Field className="gap-1 w-20">
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="number"
                          placeholder="Rev"
                          onChange={(e) => {
                            // FIX #2: kalau input dikosongkan, kirim undefined
                            // bukan otomatis jadi 0, supaya validasi Zod jalan benar
                            const val = e.target.value;
                            field.onChange(
                              val === "" ? undefined : Number(val),
                            );
                          }}
                        />
                        {/* FIX #1: tampilkan error untuk rev juga */}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    documentName: "",
                    documentNumber: null,
                    documentTypeId: "",
                    rev: 0,
                  })
                }
              >
                <Plus className="size-4 mr-1" />
                Add Document
              </Button>
            </FieldGroup>
          </div>

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
