


const request = require('supertest');
const app = require('../app'); 
// Mock createToken
jest.mock('../utils/createToken', () => 
  jest.fn().mockReturnValue('mocked-jwt-token')
);

jest.mock('../models/userModel');


const User = require('../models/userModel');



describe('POST /i-one/user/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/i-one/user/register').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('all fields must be filled');
  });


  it('should return 400 if isOwner is not provided', async () => {
    const res = await request(app).post('/i-one/user/register').send({
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane@example.com',
      password: '123456',
      nickname: 'janed',
      locationInfo: {
        address: '123 Main',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      position: 'Captain',
      phoneNumber: '1234567890',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Specify your role as a user');
  });


  it('should return 400 if email is invalid', async () => {
    const res = await request(app).post('/i-one/user/register').send({
      firstname: 'John',
      lastname: 'Doe',
      email: 'not-an-email',
      password: '123456',
      nickname: 'johnny',
      isOwner: true,
      locationInfo: {
        address: '123 Main',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      position: 'Manager',
      phoneNumber: '1234567890',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('invalid Email');
  });

 
  it('should return 409 if email already exists', async () => {
    User.findOne.mockResolvedValueOnce({}); // email found

    const res = await request(app).post('/i-one/user/register').send({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: '123456',
      nickname: 'johnny',
      isOwner: true,
      locationInfo: {
        address: '123 Main',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      position: 'Manager',
      phoneNumber: '1234567890',
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('email already in use');
  });


  it('should return 400 if nickname already exists', async () => {
    User.findOne
      .mockResolvedValueOnce(null) // email not found
      .mockResolvedValueOnce({}); // nickname found

    const res = await request(app).post('/i-one/user/register').send({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: '123456',
      nickname: 'johnny',
      isOwner: true,
      locationInfo: {
        address: '123 Main',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      position: 'Manager',
      phoneNumber: '1234567890',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Nickname already in use');
  });


// In your test file (user.spec.js), update your test case:

it('should register user and return 201 with token', async () => {
  // Mock User model methods
  User.findOne.mockResolvedValueOnce(null); // No user for email
  User.findOne.mockResolvedValueOnce(null); // No user for nickname
  User.create.mockResolvedValueOnce({
    _id: 'mockedId',
    email: 'john@example.com',
    nickname: 'johnny',
    isAdmin: false,
  });

  // Get a reference to the mocked function
  const createTokenMock = require('../utils/createToken');

  // Perform the POST request
  const response = await request(app).post('/i-one/user/register').send({
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: '123456',
    nickname: 'johnny',
    isOwner: true,
    locationInfo: {
      address: '123 Main',
      location: {
        type: 'Point',
        coordinates: [0, 0],
      },
    },
    position: 'MF',
    phoneNumber: '1234567890',
  });

  console.log('Response:', response.body); // Debug the response
  expect(response.statusCode).toBe(201);
  expect(response.body).toEqual({
    email: 'john@example.com',
    nickname: 'johnny',
    id: 'mockedId',
    isAdmin: false,
    token: 'mocked-jwt-token',
  });

  // Verify that createToken was called (using the correct reference)
  expect(createTokenMock).toHaveBeenCalled();
  // If you want to verify the arguments:
  expect(createTokenMock).toHaveBeenCalledWith(expect.anything(), 'mockedId');
});


  it('should return 500 if there is a server error', async () => {
    User.findOne.mockRejectedValueOnce(new Error('DB failure'));

    const res = await request(app).post('/i-one/user/register').send({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: '123456',
      nickname: 'johnny',
      isOwner: true,
      locationInfo: {
        address: '123 Main',
        location: {
          type: 'Point',
          coordinates: [0, 0],
        },
      },
      position: 'Manager',
      phoneNumber: '1234567890',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Internal Server Error');
  });
});
