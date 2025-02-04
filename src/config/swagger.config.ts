import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function swaggerConfigInit(app: INestApplication) : void {
    const document = new DocumentBuilder()
    .setTitle('SnappFood-BackEnd')
    .setDescription('The SnappFood API description')
    .setVersion('1.0')
    .addBasicAuth(swaggerAuthConfig(), 'Authorization')
    .build();
    const swaggerDocument = SwaggerModule.createDocument(app, document);
    SwaggerModule.setup('/api', app, swaggerDocument);
    
}

function swaggerAuthConfig() : SecuritySchemeObject {
    return {
        type: 'http',
        bearerFormat: 'JWT',
        scheme: 'bearer',
        in: 'header',
    }
}