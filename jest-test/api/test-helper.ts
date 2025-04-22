import supertest from 'supertest';

import { INestApplication } from '@nestjs/common';

export class testHelper {
  public static async login(app: INestApplication, userLogin): Promise<string> {
    const request = supertest(app.getHttpServer());
    const result = await request
      .post('/api/v1/login')
      .send(userLogin);
  
    return result.body.token;
  };
  
};
