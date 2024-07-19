import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = () => {
    const { userId } = auth()
    if (!userId){
        throw new Error("Unauthorized")

    } 
    else{

        return {userId}
    } 
} 
export const ourFileRouter = {
    courseImage: f({image : {maxFileSize: "4MB", maxFileCount: 1}})
    .middleware(() => handleAuth())
    .onUploadComplete( async ()=>{
        console.log("onupload completed log");
        
    }),
    courseAttachment: f(["text","image","video","audio","pdf"]).onUploadComplete(()=>{}),
    chapterVideo: f({video: {maxFileCount: 1 , maxFileSize: "512GB"}}).onUploadComplete(()=>{})

  
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;