import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createUser } from '../factories';
import { createActivities, createLocation } from '../factories/activities.factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /activities/locations', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activities/locations');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/activities/locations').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activities/locations').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status 400 if there date is empty', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/activities/locations').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it('should respond with status 400 if there date is not a valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server
        .get('/activities/locations?date=2023-21-21')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it('should respond with status 200 if the date is valid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const location = await createLocation();
      const activitiesByDate = await createActivities(location.id);

      const response = await server
        .get('/activities/locations?date=2023-01-21')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toStrictEqual([
        {
          id: location.id,
          name: location.name,
          activities: [
            {
              id: activitiesByDate.id,
              name: activitiesByDate.name,
              startsAt: activitiesByDate.startsAt.toISOString().substring(0, 19),
              endsAt: activitiesByDate.endsAt.toISOString().substring(0, 19),
              available: 10,
              capacity: 10,
            },
          ],
        },
      ]);
    });
  });
});
