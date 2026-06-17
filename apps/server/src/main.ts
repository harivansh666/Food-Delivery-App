import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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
  const port = process.env.PORT;

  await app.listen(port ?? 3000);
  console.log(`Server is running on ${port} 🚀`);
}
void bootstrap();
