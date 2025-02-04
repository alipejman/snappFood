import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigInit(app);
  const {PORT = 3000} = process.env;
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger is running on http://localhost:${PORT}/api`);
  })
}
bootstrap();
