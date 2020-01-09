const request = require('supertest');
const Chess = require('chess.js').Chess;
const chess = new Chess();

const url = 'http://localhost:8000/api';
const testId = 'testUser';
const shortId = 'boo';
const validFriend = 'testFriend';
let gameId;

while (!chess.game_over()) {
  var moves = chess.moves();
  var move = moves[Math.floor(Math.random() * moves.length)];
  chess.move(move);
}

const testFen = chess.fen();

beforeAll(async () => {
  const response = await request(url)
    .post('/seeks')
    .send({ userId: testId });
  
  gameId = response.body._id;
});

afterAll(async () => {
  await request(url)
  .post('/game/deleteUnActiveGame')
  .send({ id: gameId, userId: testId })
});

describe('GET /game', () => {
  it('succeeds with /game/_id', async () => {
    const response = await request(url)
      .get(`/game/${gameId}`)
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
  });

  it('fails without _id', async () => {
    const response = await request(url)
      .get('/game')
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
  });
});

describe('POST /game/move', () => {
  it('succeeds when valid id is sent', async () => {
    const response = await request(url)
      .post('/game/move')
      .send({
        id: gameId, gameHistory: [], gameFen: testFen, gameStyle: {}
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('fen');
    expect(response.body).toHaveProperty('history');
    expect(response.body).toHaveProperty('squareStyles');
    expect(response.body.fen).toEqual(testFen);
  });
 
  it('fails without userId', async () => {
    const response = await request(url)
      .post('/game/move')
      .send({
        gameHistory: [], gameFen: 'a1', gameStyle: {}
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('id is required');
  });
});

describe('POST /game/play', () => {
  it('succeeds when valid id and playerTwo are sent', async () => {
    const response = await request(url)
      .post('/game/play')
      .send({
        id: gameId, playerTwo: testId
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
 
  });
 
  /* it('fails without userId', async () => {
    const response = await request(url)
      .post('/game/play')
      .send({
        gameHistory: [], gameFen: 'a1', gameStyle: {}
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('id is required');
  }); */
});

/* describe('POST /game/deleteUnActiveGame', () => {
  it('succeeds when valid id is sent', async () => {
    const response = await request(url)
      .post('/game/deleteUnActiveGame')
      .send({
        id: gameId, gameHistory: [], gameFen: 'a1', gameStyle: {}
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('fen');
    expect(response.body).toHaveProperty('history');
    expect(response.body).toHaveProperty('squareStyles');
    expect(response.body.fen).toEqual('a1');
  });
 
  it('fails without userId', async () => {
    const response = await request(url)
      .post('/game/deleteUnActiveGame')
      .send({
        gameHistory: [], gameFen: 'a1', gameStyle: {}
      })
      .expect('Content-Type', /json/);
    expect(response.statusCode).toEqual(422);
    expect(response.body.err).toEqual('id is required');
  });
});
 */