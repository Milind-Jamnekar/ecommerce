"use client";
import Modal from "@/components/ui/Modal";
import { useStoreModalStore } from "@/hooks/useStoreModal";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  const onOpen = useStoreModalStore().onOpen;
  const isOpen = useStoreModalStore().isOpen;

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
