import { JwtPayload } from '@food-delivery-app/types';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { createUploadthing, type FileRouter } from 'uploadthing/express';

type AuthenticateRequest = Request & { user?: JwtPayload }; //Bro, ye TypeScript ka type intersection (&) hai. Iska matlab hai Request object me ek extra property (user) add kar do.

const f = createUploadthing();

export const uploadRouter: FileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  restaurantImages: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      const authReq = req as AuthenticateRequest;
      if (!authReq.user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        uplodedBy: authReq.user.id,
      };
    })
    .onUploadComplete(({ file, metadata }) => {
      console.log('Upload complete for userId:', metadata.uplodedBy);
      console.log('file url:', file.url);
      return {
        fileUrl: file.ufsUrl,
      };
    }),

  // Menu Images

  restaurantMenuImages: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(({ req }) => {
      const authReq = req as AuthenticateRequest;
      if (!authReq.user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        uplodedBy: authReq.user.id,
      };
    })
    .onUploadComplete(({ file, metadata }) => {
      console.log('Upload complete for userId:', metadata.uplodedBy);
      console.log('file url:', file.url);
      return {
        fileUrl: file.ufsUrl,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
