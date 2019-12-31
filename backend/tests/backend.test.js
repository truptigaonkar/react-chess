const request = require('supertest');

const url = 'http://localhost:8000/api';
const testId = 'testUser';

describe('GET /seeks', () => {
  it('succeeds with /seeks/userId', async () => {
    const response = await request(url)
      .get(`/seeks/${testId}`)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .get('/seeks');
    expect(response.statusCode).toEqual(404);
  });
});

describe('POST /seeks', () => {
  it('succeeds when userId is sent', async () => {
    const response = await request(url)
      .post('/seeks')
      .send({ userId: testId })
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('playerOne');
    expect(response.body.finished).toEqual(false);
    expect(response.body.startedBy).toEqual(testId);
  });

  it('fails without userId', async () => {
    const response = await request(url)
      .post('/seeks');
    expect(response.statusCode).toEqual(422);
  });

  it('returns error when userId is shorter than 5 characters', async () => {
    const shortId = 'boo';
    const response = await request(url)
      .post('/seeks')
      .send({ userId: shortId })
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toEqual(422);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('err');
    expect(response.body.err).toEqual('must be at least 5 letters long');
  });
});


/*   
    it('Add game proposal', () => {
    let initialArrayLength = 0;
    let newArrayLength = 0;
    let newArray = [];
    let gameId = '';
    //First request
    return request(url)
    .get('/seeks')
    .then(response => {
      //Check initial array length
      initialArrayLength = response.body.data.length;
    })
    .then(() => {
      //Second request
      request(url)
      .post(/seeks)
      .then(response => {
        //Save game id that the server responds with
        gameId = response.body.data.id;
      })
    })
    .then(() => {
      //Third request
      request(url)
      .get(/seeks)
      .then(response => {
        //Check new array length and id
        newArray = response.body.data;
        newArrayLength = response.body.data.length;
        expect(newArrayLength).toBe(initialArrayLength + 1);
        //Check that the game proposal was added to the array
        expect(newArray).toContain(gameId); // OBS Assumes that a game proposal is saved as a string
      })
    })
  }); */

