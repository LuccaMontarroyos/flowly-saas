import { createUploadthing, type FileRouter } from "uploadthing/server";
 
const f = createUploadthing();
 
export const uploadRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => ({ userId: "user-id-placeholder" }))
    .onUploadComplete((data: any) => { console.log("upload completed", data); }),

  projectAttachment: f([
    "image", 
    "pdf", 
    "text", 
    "blob"
  ]) 
    .middleware(async ({ req }) => {
       return { valid: true };
    })
    .onUploadComplete((data: any) => {
      console.log("Attachment uploaded", data);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof uploadRouter;