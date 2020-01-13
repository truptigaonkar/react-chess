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
const testId = 'testUser';
let gameId;

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
  return request(url)
    .post('/seeks')
    .send({
      userId: testId
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
      userId: testId,
    })
    .expect('Content-Type', /json/)
    .expect(200);
});

describe('GET /game', () => {
  it('succeeds with /game/_id', async () => {
    const response = await request(url)
      .get(`/game/${gameId}`)
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
  it('succeeds when valid id and playerTwo are sent', async () => {
    const response = await request(url)
      .post('/game/play')
      .send({
        id: gameId,
        playerTwo: testId,
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
        gameFen: 'a1',
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
    const response = await request(url)
      .post('/seeks')
      .send({
        userId: testId
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
            userId: testId,
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