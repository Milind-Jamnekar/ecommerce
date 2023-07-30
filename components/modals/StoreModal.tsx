import Modal from "@/components/ui/Modal";
import { useStoreModalStore } from "@/hooks/useStoreModal";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "../ui/Dialog";

const formShema = z.object({
  name: z.string().min(1),
});

type Form = z.infer<typeof formShema>;

const StoreModal = () => {
  const storeModal = useStoreModalStore();

  const form = useForm<Form>({
    resolver: zodResolver(formShema),
  });

  const onSubmit = (data: Form) => {
    console.log(data);
  };

  return (
    <>
      <Modal
        title="Create Store"
        description="Add new store "
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
      >
        <div>
          <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E-commerce" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-end gap-4">
                  <Button variant="outline" onClick={storeModal.onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StoreModal;
