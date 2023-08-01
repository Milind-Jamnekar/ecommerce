import { useStoreModalStore } from "@/hooks/useStoreModal";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Buttonutton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { redirect } from "next/navigation";

const formShema = z.object({
  name: z.string().min(1),
});

type Form = z.infer<typeof formShema>;

const StoreModal = () => {
  const storeModal = useStoreModalStore();
  const { toast } = useToast();

  const form = useForm<Form>({
    resolver: zodResolver(formShema),
  });

  const onSubmit = async (data: Form) => {
    try {
      const response = await axios.post("/api/stores", data);
      toast({
        title: "Store Create successfully",
        description: new Date(response.data.createdAt).toLocaleString(),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error from servers! Please try later",
      });
    }
  };

  return (
    <>
      <Modal
        title="Create Store"
        description="Add new store "
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="E-commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-4">
              <Button
                disabled={form.formState.isSubmitting}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancel
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default StoreModal;
