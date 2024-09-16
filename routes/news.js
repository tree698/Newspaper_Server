import express from 'express';
import {
  getTodayNews,
  searchByTitle,
  getArticlesByNameAndDate,
  getArticlesByLanguageAndDate,
  getArticleById,
  updateSummary,
  updateMemo,
  updateMark,
  updateRanking,
  updateKeyword,
  addArticle,
  deleteArticleById,
} from '../repository/news.js';

const router = express.Router();

// 오늘 날짜의 모든 기사를 가져옴
router.get('/today', async (req, res, next) => {
  try {
    const rows = await getTodayNews();
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// 검색어로 제목에서 찾음
router.get('/search', async (req, res, next) => {
  const { keyword } = req.query;
  try {
    const rows = await searchByTitle(keyword);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// name과 date 범위로 검색
router.get('/searchByNameAndDate', async (req, res, next) => {
  const { name, startDate, endDate } = req.query;
  try {
    const rows = await getArticlesByNameAndDate(name, startDate, endDate);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

// language와 date 범위로 검색
router.get('/searchByLanguageAndDate', async (req, res, next) => {
  const { language, startDate, endDate } = req.query; // 쿼리에서 language와 날짜 범위 가져오기
  try {
    const rows = await getArticlesByLanguageAndDate(
      language,
      startDate,
      endDate
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching articles by language and date:', error); // 에러 로그 출력
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
});

// id로 특정 기사를 가져옴
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const rows = await getArticleById(id);
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

// summary 수정
router.put('/summary/:id', async (req, res, next) => {
  const { id } = req.params;
  const { summary } = req.body;
  try {
    const result = await updateSummary(id, summary);
    res.json({ message: 'Summary updated', affectedRows: result.affectedRows });
  } catch (error) {
    next(error);
  }
});

// memo 수정
router.put('/memo/:id', async (req, res, next) => {
  const { id } = req.params;
  const { memo } = req.body;
  try {
    const result = await updateMemo(id, memo);
    res.json({ message: 'Memo updated', affectedRows: result.affectedRows });
  } catch (error) {
    next(error);
  }
});

// mark 수정
router.put('/mark/:id', async (req, res, next) => {
  const { id } = req.params;
  const { mark } = req.body;
  try {
    const result = await updateMark(id, mark);
    res.json({ message: 'Mark updated', affectedRows: result.affectedRows });
  } catch (error) {
    console.error('Error updating mark:', error); // 에러 로그 추가
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
});

// ranking 수정
router.put('/ranking/:id', async (req, res, next) => {
  const { id } = req.params;
  const { ranking } = req.body;
  try {
    const result = await updateRanking(id, ranking);
    res.json({ message: 'Ranking updated', affectedRows: result.affectedRows });
  } catch (error) {
    next(error);
  }
});

// keyword 수정
router.put('/keyword/:id', async (req, res, next) => {
  const { id } = req.params;
  const { keyword } = req.body;
  try {
    const result = await updateKeyword(id, keyword);
    res.json({ message: 'Keyword updated', affectedRows: result.affectedRows });
  } catch (error) {
    next(error);
  }
});

// 새로운 기사 추가
router.post('/', async (req, res, next) => {
  try {
    const result = await addArticle(req.body);
    res
      .status(201)
      .json({ message: 'Article added', insertId: result.insertId });
  } catch (error) {
    next(error);
  }
});

// id 값으로 기사 삭제
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await deleteArticleById(id);
    res.json({ message: 'Article deleted', affectedRows: result.affectedRows });
  } catch (error) {
    next(error);
  }
});

export default router;
