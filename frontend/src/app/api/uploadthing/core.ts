import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const token = req.cookies.get("flowly.token")?.value;
      if (!token) throw new Error("Unauthorized - No token found");

      return { userId: "user" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete on Server. URL:", file.ufsUrl || file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;