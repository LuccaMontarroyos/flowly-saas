import { createUploadthing, type FileRouter } from "uploadthing/next";
import { parseCookies } from "nookies";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const cookies = parseCookies({ req });
      const token = cookies["flowly.token"];

      if (!token) throw new Error("Unauthorized");

      return { token };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete. URL:", file.url);
      
      try {
          const response = await fetch("http://localhost:3000/users/avatar", {
              method: "PATCH",
              headers: {
                  "Authorization": `Bearer ${metadata.token}`,
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ avatarUrl: file.ufsUrl })
          });

          if (!response.ok) {
            console.error("Failed to update avatar on backend:", await response.text());
          }
      } catch (error) {
          console.error("Error calling backend:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;