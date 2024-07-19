"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ courseId, disabled, isPublished }: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onPublishHandler = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("وضعیت این دوره به منتشر نشده تغییر پیدا کرد");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("این دوره منتشر شد");
        confetti.onOpen();
      }

      router.refresh();
    } catch (error: any) {
      toast.error("erro");
      console.log("publish the chapter", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      toast.success("این دوره حذف شد");
      router.refresh();
      router.push(`/teacher/courses/`);
    } catch (error: any) {
      toast.error("erro");
      console.log("delete the chapter", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublishHandler}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"default"}
      >
        {isPublished ? "لغو انتشار" : "انتشار"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"sm"} variant={"destructive"} disabled={isLoading}>
          <Trash className="h-4 w-4 text-black font-bold" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
