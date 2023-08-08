"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/ImageUpload";
import AlertModal from "@/components/modals/AlertModal";
import { Checkbox } from "@/components/ui/Checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Trash } from "lucide-react";

import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Please Fill out the name field"),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1, "Please Fill out the price field"),
  categoryId: z.string().min(1, "Please select the category field"),
  colorId: z.string().min(1, "Please select the color field"),
  sizeId: z.string().min(1, "Please select the size field"),
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

export default function ProductForm({
  product,
  categories,
  colors,
  sizes,
}: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const title = product ? "Edit Product" : "Create Product";
  const description = product ? "Edit existing Product" : "Add new Product";
  const toastMessage = product
    ? "Product updated"
    : "Product added successfully";
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
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={formState.isSubmitting}
                      placeholder="0.99"
                      min="1"
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
                  <FormLabel>Category</FormLabel>
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

            <FormField
              control={form.control}
              name="colorId"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                      {colors.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          <div className="flex items-center gap-x-2">
                            <div
                              className="p-2 rounded-full"
                              style={{ backgroundColor: item.value }}
                            />
                            {item.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sizeId"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={formState.isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Size form list" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      You can manage your mobile notifications in the{" "}
                      <Link href="/examples/forms">mobile settings</Link> page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      You can manage your mobile notifications in the{" "}
                      <Link href="/examples/forms">mobile settings</Link> page.
                    </FormDescription>
                  </div>
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
