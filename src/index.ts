import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

import router from './router';

dotenv.config();

const app = express();

app.use(cors({
  credentials: true,
}));

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080/');
});

app.use('/', router());
