"use client";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ApiAlert from "@/components/ui/ApiAlert";
import { useOrigin } from "@/hooks/useOrigin";

const formSchema = z.object({
  name: z.string().min(2),
});

type FormType = z.infer<typeof formSchema>;

interface SettingsFormProps {
  store: Store;
}

export default function SettingsForm({ store }: SettingsFormProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const origin = useOrigin();
  const router = useRouter();
  const params = useParams();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store.name,
    },
  });

  const onSubmit = async (data: FormType) => {
    console.log(data);

    try {
      await axios.patch(`/api/${store.id}`, data);
      toast({
        title: "Store updated successfully",
        description: new Date().toLocaleString(),
      });

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
      await axios.delete(`/api/${store.id}`);
      toast({
        title: "Store deleted successfully",
        description: new Date().toLocaleString(),
      });

      router.refresh();
      router.push("/");
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
        <Heading title="Settings" description="Manage store details" />
        <Button variant="destructive" size="icon" onClick={() => setOpen(true)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field, formState }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="on"
                      disabled={formState.isSubmitting}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={form.formState.isSubmitting} className="ml-auto">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={origin + "api/" + params.storeId}
        variant="public"
      />
    </>
  );
}
