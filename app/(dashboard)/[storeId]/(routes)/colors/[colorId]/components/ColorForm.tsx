"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Billboard, Color } from "@prisma/client";
import { Trash } from "lucide-react";

import ImageUpload from "@/components/ImageUpload";
import AlertModal from "@/components/modals/AlertModal";
import {
  Form,
  FormControl,
  FormDescription,
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
  name: z.string().min(2),
  value: z
    .string()
    .min(4)
    .regex(/^#/, { message: "String must be valid hex code" }),
});

type FormType = z.infer<typeof formSchema>;

interface BillboardFormProps {
  color: Color | null;
}

export default function ColorForm({ color }: BillboardFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const title = color ? "Edit Color" : "Create Color";
  const description = color ? "Edit existing Color" : "Add new Color";
  const toastMessage = color ? "Color updated" : "Color added succefully";
  const action = color ? "Save Changes" : "Create";

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: color || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: FormType) => {
    try {
      if (color) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      toast({
        title: toastMessage,
        description: new Date().toLocaleString(),
      });
      router.push(`/${params.storeId}/colors/`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      toast({
        title: "Color deleted successfully",
        description: new Date().toLocaleString(),
      });

      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
        {color && (
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
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="value"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        type="color"
                        disabled={formState.isSubmitting}
                        placeholder="Color Value"
                        {...field}
                      />

                      <div
                        className="p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Try To select the color from base color category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      disabled={formState.isSubmitting}
                      placeholder="Color name"
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
