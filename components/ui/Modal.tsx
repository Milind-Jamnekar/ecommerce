"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { FC, ReactNode } from "react";

interface ModalProps {
  title: string;
  description: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ children, description, title, isOpen }) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
