/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
const GameModel = require('../models/game');
require('dotenv').config();

const uri = process.env.DATABASE;
const url = 'http://localhost:8000/api';
const testId = 'testUser';
const shortId = 'boo';
const validFriend = 'testFriend';
let existingUserId;
let gameId;
let gameWithFriendId;
let gameIdToDelete;
let userIdToDelete;

beforeAll((done) => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true
  }, (err) => {
    if (err) {
      console.error(err);
    }

    GameModel.find({}, (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        existingUserId = docs[0].startedBy
        done();
      }
    });
  });
});

afterAll((done) => {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true
  }, (err) => {
    if (err) {
      console.error(err);
    }

    GameModel.find({}, (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        gameIdToDelete = docs[docs.length - 1]._id
        userIdToDelete = docs[docs.length - 1].startedBy
        done();
      }
    });
  });
  return request(url)
    .post('/game/deleteUnActiveGame')
    .send({
      id: gameIdToDelete,
      userId: userIdToDelete
    })
    .expect(200);
});

describe('GET /seeks', () => {
  it('succeeds with /seeks/userId', async () => {
    const response = await request(url)
      .get(`/seeks/${testId}`)
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .get('/seeks')
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    return response;
  });
});

describe('POST /seeks', () => {
  afterAll(() => {
    return request(url)
      .post('/game/deleteUnActiveGame')
      .send({
        id: gameId,
        userId: testId
      })
      .expect(200);
  });

  it('succeeds when valid userId and color are sent', async () => {
    const response = await request(url)
      .post('/seeks')
      .send({
        userId: testId,
        color: "b" //"b" for black or "w" for white 
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('playerOne');
    expect(response.body.finished).toEqual(false);
    expect(response.body.startedBy).toEqual(testId);

    gameId = response.body._id;
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/seeks')
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('userId is required');
    return response;
  });

  it('fails when userId is shorter than 5 characters', async () => {
    const response = await request(url)
      .post('/seeks')
      .send({
        userId: shortId
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(typeof response.body).toBe('object');
    expect(response.body.err).toEqual('userId must be at least 5 characters long');
    return response;
  });
});

describe('POST /newUser', () => {
  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const newUser = makeid(5);

  it('succeeds when valid userId is sent', async () => {
    const response = await request(url)
      .post('/newUser')
      .send({
        userId: newUser
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('inGame');
    expect(response.body.userId).toEqual(newUser);
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/newUser')
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('userId is required');
    return response;
  });

  it('fails when userId is shorter than 5 characters', async () => {
    const response = await request(url)
      .post('/newUser')
      .send({
        userId: shortId
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(typeof response.body).toBe('object');
    expect(response.body.err).toEqual('userId must be at least 5 characters long');
    return response;
  });

  it('fails when userId already exists', async () => {
    const response = await request(url)
      .post('/newUser')
      .send({
        userId: existingUserId
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(400);
    expect(typeof response.body).toBe('object');
    expect(response.body.err).toEqual('there is already a user with this id');
    return response;
  });

});

describe('POST /withFriend', () => {
  afterAll(() => {
    return request(url)
      .post('/game/deleteUnActiveGame')
      .send({
        id: gameWithFriendId,
        userId: validFriend
      })
      .expect(200)
  });

  it('succeeds when valid userId is sent', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({
        userId: validFriend,
        friendId: testId
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('friendId');
    expect(response.body.withFriend).toEqual(true);
    expect(response.body.friendId).toEqual(testId);

    gameWithFriendId = response.body._id;
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({
        friendId: validFriend
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('userId is required');
    return response;
  });

  it('fails without friendId', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({
        userId: testId
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('friendId is required');
    return response;
  });

  it('fails when userId is shorter than 5 characters', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({
        userId: shortId,
        friendId: validFriend
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('err');
    expect(response.body.err).toEqual('userId must be at least 5 characters long');
    return response;
  });

  it('fails when friendId is shorter than 5 characters', async () => {
    const response = await request(url)
      .post('/withFriend')
      .send({
        userId: testId,
        friendId: shortId
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('err');
    expect(response.body.err).toEqual('friendId must be at least 5 characters long');
    return response;
  });
});

describe('GET /withFriendRequests', () => {
  it('succeeds with /withFriendRequests/userId', async () => {
    const response = await request(url)
      .get(`/withFriendRequests/${testId}`)
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .get('/withFriendRequests')
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    return response;
  });
});

describe('GET /allUserGames', () => {
  it('succeeds with /allUserGames/userId', async () => {
    const response = await request(url)
      .get(`/allUserGames/${testId}`)
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .get('/allUserGames')
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    return response;
  });
});