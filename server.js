require('dotenv').config();
const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/util/connect');

const DB_URI = process.env.MONGODB_URI;
connect(DB_URI);

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('server running on', server.address().port);
});