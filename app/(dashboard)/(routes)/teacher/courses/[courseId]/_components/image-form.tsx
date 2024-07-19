"use client";
import "../_utils/style.css";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "تصویر دوره اجباری است" }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: { imageUrl?: string }) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success("تصویر دوره تغییر پیدا کرد");
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
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-samim-bold text-lg">
        تصویر دوره
        <Button
          variant={isEditing ? "destructive" : "ghost"}
          onClick={toggleEdit}
        >
          {isEditing && <>لغو</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="w-4 h-4 ml-2" />
              بارگزاری تصویر دوره
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              تغییر تصویر
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="upload"
              src={`${initialData.imageUrl}`}
              fill
              className="object-cover rounded-md"
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              console.log("Received URL:", url);
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 font-sans">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageForm;
