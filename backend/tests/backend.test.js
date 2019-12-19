
// import request from 'supertest';

const request = require('supertest');
let url = 'http://localhost:8000';

test('GET /seeks returns an object', () => {
  return request(url)
  .get('/seeks')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(response => {
    expect(typeof response.body.data).toBe('object');
  });
});

test('POST /seeks returns an object with an id key', () => {
  return request(url)
  .post('/seeks')
  .send({minutesPerPlayer: 5, addSeconds: 8}) //Send minutesPerPlayer and addSeconds as data - both with numbers as values
  .expect('Content-Type', /json/)
  .expect(200)
  .then(response => {
    expect(typeof response.body.data).toBe('object');
    expect(response.body.data).toHaveProperty('id');
    expect(typeof response.body.data.id).toBe('string');
  });
});

test('POST /seeks responds with 404 if data is incorrect (string)', () => {
  return request(url)
  .post('/seeks')
  .send({minutesPerPlayer: 'five', addSeconds: 8})
  .expect(404);
});

test('POST /seeks responds with 404 if data is incorrect (no data)', () => {
  return request(url)
  .post('/seeks')
  .expect(404);
});

test('Add game proposal', () => {
  let seeksObject = {};
  let gameId = '';
  //First request (add game proposal)
  return request(url)
  .post('/seeks')
  .send({minutesPerPlayer: 5, addSeconds: 8})
  .then(response => {
    //Save game id that the server responds with
    gameId = response.body.data.id;
  })
  .then(() => {
    //Second request (ask for all game proposals)
    request(url)
    .get('/seeks')
    .then(response => {
      seeksObject = response.body.data;
      //Check that the game proposal was added
      expect(seeksObject).toHaveProperty(gameId);
    });
  });
});
