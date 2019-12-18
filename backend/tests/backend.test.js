
// import request from 'supertest';

const request = require('supertest');
let url = 'http://localhost:8000';

test('GET /seeks returns an array', () => {
  return request(url)
  .get('/seeks')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(response => {
    expect(typeof reponse.body.data).toBe('array');
  })
});

//Should you send any data when you post to /seeks?
test('POST /seeks returns an object with an id key', () => {
  return request(url)
  .post('/seeks')
  .expect('Content-Type', /json/)
  .expect(200)
  .then(response => {
    expect(typeof response.body.data).toBe('object');
    expect(response.body.data).toHaveProperty('id');
    expect(typeof response.body.data.id).toBe('string');
  })
});

test('Add game proposal', () => {
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
});
