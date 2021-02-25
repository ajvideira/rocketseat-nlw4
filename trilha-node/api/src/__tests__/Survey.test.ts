import app from '../app';
import request from 'supertest';

import createConnection from '../database/connection';
import { Connection } from 'typeorm';

describe('Surveys', () => {
  let connection: Connection = null;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.close();
  });

  it('Should be able to create a new survey', async () => {
    const response = await request(app).post('/surveys').send({
      title: 'Title Example',
      description: 'Description Example',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Should be able to get all surveys', async () => {
    await request(app).post('/surveys').send({
      title: 'Title Example 2',
      description: 'Description Example 2',
    });

    const response = await request(app).get('/surveys');

    expect(response.body.length).toBe(2);
  });
});
