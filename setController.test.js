const mockingoose = require('mockingoose');
const Set = require('../models/Set');
const Session = require('../models/session');
const setController = require('../controllers/setController');

describe('Set Controller', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('createSet', () => {
    it('should create sets successfully', async () => {
      const mockSession = {
        _id: '507f191e810c19729de860ea',
        setNumber: 2,
        maxNumber: 10,
        members: ['user1', 'user2', 'user3', 'user4'],
      };

      mockingoose(Session).toReturn(mockSession, 'findOne');
      mockingoose(Set).toReturn([], 'find');

      const req = {
        params: { sessionid: mockSession._id },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await setController.createSet(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'sets created Sucessfully',
        })
      );
    });

    it('should return 404 if session not found', async () => {
      mockingoose(Session).toReturn(null, 'findOne');

      const req = {
        params: { sessionid: 'nonexistent_id' },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await setController.createSet(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Session not found',
        })
      );
    });
  });

  // Add more tests for other controller functions
});