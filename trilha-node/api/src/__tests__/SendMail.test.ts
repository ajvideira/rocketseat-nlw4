import request from 'supertest';
import { getConnection } from 'typeorm';
import app from '../app';
import createConnection from '../database/connection';

describe('SendMail', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to send an email with a survey', async () => {
    const responseUser = await request(app).post('/users').send({
      name: 'User Example',
      email: 'user@example.com',
    });

    const responseSurvey = await request(app).post('/surveys').send({
      title: 'Title Example',
      description: 'Description Example',
    });

    const response = await request(app).post('/sendMail').send({
      email: responseUser.body.email,
      survey_id: responseSurvey.body.id,
    });

    expect(response.status).toBe(200);
    expect(response.body.url).toContain('https://');
  });
});
