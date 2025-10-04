const http = require('http');
const { readDatabase, addSlide } = require('./db');

/*
 * HTTP server definition.
 *
 * The server listens on port 3000 by default and exposes two
 * simple JSON endpoints for working with the database:
 *   GET /api/slides      → returns the contents of db.json
 *   POST /api/slides     → appends a new slide object to the database
 * Any other route returns a 404 Not Found response.
 */

function handleGetData(req, res) {
  const db = readDatabase();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(db));
}

function handlePostData(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const newEntry = JSON.parse(body);
      const slide = addSlide(newEntry);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', data: slide }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}

/*
 * HTTP server definition.
 *
 * The server listens on port 3000 by default and exposes two
 * simple JSON endpoints for working with the database:
 *   GET /api/slides      → returns the contents of db.json
 *   POST /api/slides     → appends a new slide object to the database
 * Any other route returns a 404 Not Found response.
 */

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  if (method === 'GET' && url === '/api/slides') {
    return handleGetData(req, res);
  }
  if (method === 'POST' && url === '/api/slides') {
    return handlePostData(req, res);
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});