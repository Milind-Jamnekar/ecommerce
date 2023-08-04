"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";

import ImageUpload from "@/components/ImageUpload";
import AlertModal from "@/components/modals/AlertModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  label: z.string().min(2),
  imageUrl: z.string().min(2),
});

type FormType = z.infer<typeof formSchema>;

interface BillboardFormProps {
  billboard: Billboard | null;
}

export default function BillboardForm({ billboard }: BillboardFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const title = billboard ? "Edit Billboard" : "Create Billboard";
  const description = billboard
    ? "Edit existing Billboard"
    : "Add new Billboard";
  const toastMessage = billboard
    ? "Billboard updated"
    : "Billboard added succefully";
  const action = billboard ? "Save Changes" : "Create";

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: billboard || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: FormType) => {
    try {
      if (billboard) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      toast({
        title: toastMessage,
        description: new Date().toLocaleString(),
      });
      router.push(`/${params.storeId}/billboards/`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error from servers! Please try later",
      });
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      toast({
        title: "Store deleted successfully",
        description: new Date().toLocaleString(),
      });

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Make Sure you removed all products and categories first.",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={form.formState.isSubmitting}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {billboard && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field, formState }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={formState.isSubmitting}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    values={field.value ? [field.value] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={formState.isSubmitting}
                      placeholder="billboard name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={form.formState.isSubmitting} className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
