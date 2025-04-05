// scaps-app/app/api/uploadthing/route.ts

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/app/api/uploadthing/core";

// Export UploadThing handlers
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
