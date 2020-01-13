/* eslint-disable */
const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();
const {
  Chess
} = require('chess.js');
const GameModel = require('../models/game');

const uri = process.env.DATABASE;
const url = 'http://localhost:8000/api';
let testUser;
let gameId;

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Create test Fen object
 */
const chess = new Chess();

while (!chess.game_over()) {
  const moves = chess.moves();
  const move = moves[Math.floor(Math.random() * moves.length)];
  chess.move(move);
}

const testFen = chess.fen();

/**
 * Save the id and userId of the test game object in game database
 * */
beforeAll((done) => {
  testUser = makeid(5);
  console.log(testUser);
  
  return request(url)
    .post('/seeks')
    .send({
      userId: testUser
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .then(() => {
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
            console.log(docs[docs.length - 1]._id)
            gameId = docs[docs.length - 1]._id
            done();
          }
        });
      });
    })
});

afterAll(() => {
  return request(url)
    .post('/game/deleteUnActiveGame')
    .send({
      id: gameId,
      userId: testUser,
    })
    .expect('Content-Type', /json/)
    .expect(200);
});

describe('GET /game', () => {
  it('succeeds with /game/_id', async () => {
    const response = await request(url)
      .get(`/game/5e14771a587d383c33092e83`)
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    return response;
  });

  it('fails without _id', async () => {
    const response = await request(url)
      .get('/game')
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    return response;
  });
});

describe('POST /game/move', () => {
  it('succeeds when valid id is sent', async () => {
    const response = await request(url)
      .post('/game/move')
      .send({
        id: gameId,
        gameHistory: [],
        gameFen: testFen,
        gameStyle: {},
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('fen');
    expect(response.body).toHaveProperty('history');
    expect(response.body).toHaveProperty('squareStyles');
    expect(response.body.fen).toEqual(testFen);
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/game/move')
      .send({
        gameHistory: [],
        gameFen: testFen,
        gameStyle: {},
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('id is required');
    return response;
  });
});

describe('POST /game/play', () => {
  testUser = makeid(5)
  it('succeeds when valid id and playerTwo are sent', async () => {
    const response = await request(url)
      .post('/game/play')
      .send({
        id: gameId,
        playerTwo: testUser,
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/game/play')
      .send({
        gameHistory: [],
        gameFen: testFen,
        gameStyle: {},
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('id is required');
    return response;
  });
});

describe('POST /game/deleteUnActiveGame', () => {
  let testGameId;

  it('succeeds when valid id and userId is sent', async () => {
    testUser = makeid(5);
    const response = await request(url)
      .post('/seeks')
      .send({
        userId: testUser
      })
      .then((response) => {
        testGameId = response.body._id
        return response
      })
      .then((res) => {
        expect(res.statusCode).toEqual(200)
        return request(url)
          .post('/game/deleteUnActiveGame')
          .send({
            id: testGameId,
            userId: testUser,
          })
          .expect('Content-Type', /json/)
          .then((response) => {
            expect(response.statusCode).toEqual(200);
            expect(typeof response.body).toBe('object');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toEqual('this game has been successfully deleted');
          })
      })
    return response;
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/game/deleteUnActiveGame')
      .send({
        id: gameId,
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('userId is required');
    return response;
  });
});