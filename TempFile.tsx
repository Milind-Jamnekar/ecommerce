"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Image, Category, Color, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { formatPrice } from "@/lib/utils";
import ImageUpload from "@/components/ImageUpload";

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type FormType = z.infer<typeof formSchema>;

interface ProductFormProps {
  product:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const title = product ? "Edit Category" : "Create Category";
  const description = product ? "Edit existing Category" : "Add new Category";
  const toastMessage = product
    ? "Category updated"
    : "Category added succefully";
  const action = product ? "Save Changes" : "Create";

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? { ...product, price: parseFloat(String(product.price.toNumber())) }
      : {
          name: "",
          categoryId: "",
          colorId: "",
          images: [],
          isArchived: false,
          isFeatured: false,
          price: 0,
          sizeId: "",
        },
  });

  const onSubmit = async (data: FormType) => {
    try {
      if (product) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      toast({
        title: toastMessage,
        description: new Date().toLocaleString(),
      });
      router.push(`/${params.storeId}/categories/`);
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
        `/api/${params.storeId}/categories/${params.categoryId}`
      );

      toast({
        title: "Category deleted succesfully",
        description: new Date().toLocaleString(),
      });

      router.refresh();
      router.push(`/${params.storeId}/categories/`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Make Sure you removed all products using categories first.",
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
        {product && (
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
            name="images"
            render={({ field, formState }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={formState.isSubmitting}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                    values={field.value.map((image) => image.url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-8">
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
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <Select
                    disabled={formState.isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
