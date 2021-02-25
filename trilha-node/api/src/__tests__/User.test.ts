import app from '../app';
import request from 'supertest';

import createConnection from '../database/connection';
import { Connection } from 'typeorm';

describe('Users', () => {
  let connection: Connection = null;

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });
  afterAll(async () => {
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'User Example',
      email: 'user@example.com',
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a user with a existing email', async () => {
    const response = await request(app).post('/users').send({
      name: 'User Example',
      email: 'user@example.com',
    });

    expect(response.status).toBe(400);
  });
});
