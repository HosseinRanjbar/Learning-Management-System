"use client";
import "../_utils/style.css";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachment: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: { url?: string }) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);

      toast.success("منابع و پیوست دوره تغییر پیدا کرد");
      toggleEdit();
      router.refresh();
    } catch (error: any) {
      if (error.response) {
        toast.error(
          `Server responded with ${error.response.status}: ${error.message}`
        );
      } else if (error.request) {
        toast.error("Request was made but no response was received");
      } else {
        toast.error(error.message);
      }
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeleteId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("پیوست حذف شد");
      router.refresh();
    } catch (error: any) {
      toast.error("delete fail");
      console.log(error, "delete attachment error");
    } finally {
      setDeleteId(null);
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-samim-bold text-lg">
        منابع و پیوست دوره
        <Button
          variant={isEditing ? "destructive" : "ghost"}
          onClick={toggleEdit}
        >
          {isEditing && <>لغو</>}
          {!isEditing && (
            <>
              <PlusCircle className="w-4 h-4 ml-2" />
              بارگزاری منابع و پیوست دوره
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachment.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              هیچ پیوستی وجود ندارد
            </p>
          )}
          {initialData.attachment.length > 0 && (
            <div className="space-y-2 ">
              {initialData.attachment.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center w-full p-3 bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0 " />
                  <p className="text-sm line-clamp-1">{attachment.name}</p>
                  {deleteId === attachment.id && (
                    <div className="mr-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deleteId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="mr-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4 " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              console.log("Received URL:", url);
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 font-sans">
            منابع مورد نیاز دانشجویان را اینجا آپلود کنید
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
