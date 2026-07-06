import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './uploadthing/upload-router';
import { TransformInterceptor } from './transform/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api'); // grlobal prefix means /api/...

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // agar user kush extra fields send krega to remove ho jyegi
      forbidNonWhitelisted: true, // agar user kush extra fields send krega to error dega
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(
    '/api/uploadthing',
    createRouteHandler({
      router: uploadRouter,
      config: { token: process.env.UPLOADTHING_API_KEY! },
    }),
  );
  const port = process.env.PORT;

  await app.listen(port ?? 3000, '0.0.0.0');
  console.log(`Server is running on ${port} 🚀`);
}
void bootstrap();
