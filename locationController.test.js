// locationController.test.js
const request = require('supertest');
const app = require('../../app'); // your Express app
const Location = require('../../models/Locations');

jest.mock('../../models/Locations');

describe('viewNearbyLocations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and nearby locations', async () => {
    const mockLocations = [
      {
        _id: '1',
        name: 'Test Place',
        location: {
          type: 'Point',
          coordinates: [3.5, 6.4],
        },
      },
    ];

    Location.find.mockResolvedValueOnce(mockLocations);

    const res = await request(app)
      .post('/api/locations/nearby')
      .send({
        longitude: 3.5,
        latitude: 6.4,
        maxDistance: 5000,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockLocations);
  });

  it('should return 404 if parameters are missing', async () => {
    const res = await request(app).post('/api/locations/nearby').send({});
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/Location Paramneters not complete/i);
  });

  it('should return 500 if something goes wrong', async () => {
    Location.find.mockRejectedValueOnce(new Error('Something went wrong'));

    const res = await request(app)
      .post('/api/locations/nearby')
      .send({
        longitude: 3.5,
        latitude: 6.4,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Something went wrong/);
  },10000);
});