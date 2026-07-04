import { generateReactNativeHelpers } from "@uploadthing/expo";

import type { OurFileRouter } from "../../../server/src/uploadthing/upload-router";

export const { useImageUploader, useDocumentUploader } =
  generateReactNativeHelpers<OurFileRouter>({
    url: process.env.EXPO_PUBLIC_SERVER_URL,
  });
