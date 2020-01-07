const request = require('supertest');

const url = 'http://localhost:8000/api';
const testId = 'testUser';
const shortId = 'boo';
const validFriend = 'testFriend';
const gameId = '5e04ad71e8296713c02b218f';


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