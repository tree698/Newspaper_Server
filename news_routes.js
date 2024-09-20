import express from 'express';
import {
  getTodayNews,
  searchByTitle,
  getArticlesByNameAndDate,
  getArticlesByLanguageAndDate,
  getArticleById,
  updateSummary,
  updateMemo,
  updateClassification,
  updateBackground,
  updateKeyword,
  addArticle,
  deleteArticleById,
  getArticleDetailsById,
} from './news_repository.js';

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
  const { language, startDate, endDate } = req.query;
  try {
    const rows = await getArticlesByLanguageAndDate(
      language,
      startDate,
      endDate
    );
    res.json(rows);
  } catch (error) {
    next(error);
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

// classification 수정
router.put('/classification/:id', async (req, res, next) => {
  const { id } = req.params;
  const { classification } = req.body;
  try {
    const result = await updateClassification(id, classification);
    res.json({
      message: 'Classification updated',
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error('Error updating classification:', error); // 에러 로그 추가
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
});

// expection 수정
router.put('/background/:id', async (req, res, next) => {
  const { id } = req.params;
  const { background } = req.body;
  try {
    const result = await updateBackground(id, background);
    res.json({
      message: 'Background updated',
      affectedRows: result.affectedRows,
    });
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

// Route to get detailed data by ID (summary, keyword, classification, expection, memo)
router.get('/articleDetails/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const articleDetails = await getArticleDetailsById(id);
    if (articleDetails) {
      res.json(articleDetails); // Return the article details
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

export default router;
