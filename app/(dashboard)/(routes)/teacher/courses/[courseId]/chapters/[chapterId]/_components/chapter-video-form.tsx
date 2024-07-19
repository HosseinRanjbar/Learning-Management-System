"use client";
import "../_utils/style.css";
import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Chapter, Course, muxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoProps {
  initialData: Chapter & { muxData?: muxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideo = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: { videoUrl?: string }) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );

      toast.success("ویدیو دوره تغییر پیدا کرد");
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
        ویدیو دوره
        <Button
          variant={isEditing ? "destructive" : "ghost"}
          onClick={toggleEdit}
        >
          {isEditing && <>لغو</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="w-4 h-4 ml-2" />
              بارگزاری ویدیو دوره
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              تغییر ویدیو
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playback || ""} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              console.log("Received URL:", url);
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 font-sans">
            ویدیوی این فصل را آپلود کنید
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          پردازش ویدیو ممکن است چند دقیقه طول بکشد اگر ویدیو نمایش داده نشد صفحه
          را رفرش کنید
        </div>
      )}
    </div>
  );
};

export default ChapterVideo;
