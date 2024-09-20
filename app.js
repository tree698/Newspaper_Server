import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import newsRoute from './news_routes.js'; // news 라우트 추가
import { config } from './config.js';

const app = express();
app.use(express.json()); // JSON 바디 파싱 설정
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

app.use('/news', newsRoute); // /news 라우트 추가

// 에러 처리
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(config.host.port, () => {
  console.log('Server is running on port 8080');
});
