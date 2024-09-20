import mysql from 'mysql2/promise'; // 비동기 방식의 mysql2 사용
import { config } from './config.js';

// MySQL 연결 설정
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 오늘 날짜의 모든 기사를 가져옴
export const getTodayNews = async () => {
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const day = String(todayDate.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  const [rows] = await pool.query('SELECT * FROM news WHERE DATE(date) = ?', [
    today,
  ]);
  return rows;
};

// 검색어로 제목에서 찾음
export const searchByTitle = async (keyword) => {
  const [rows] = await pool.query(
    'SELECT * FROM news WHERE title LIKE ? ORDER BY date DESC',
    [`%${keyword}%`]
  );
  return rows;
};

// name과 date 범위로 검색 (name이 'all'이면 모든 name 반환)
export const getArticlesByNameAndDate = async (name, startDate, endDate) => {
  const query =
    name === 'all'
      ? 'SELECT * FROM news WHERE DATE(date) BETWEEN ? AND ? ORDER BY date DESC'
      : 'SELECT * FROM news WHERE name = ? AND DATE(date) BETWEEN ? AND ? ORDER BY date DESC';

  const params =
    name === 'all' ? [startDate, endDate] : [name, startDate, endDate];

  const [rows] = await pool.query(query, params);
  return rows;
};

// language와 date 범위로 검색 (language가 'all'이면 모든 language 반환)
export const getArticlesByLanguageAndDate = async (
  language,
  startDate,
  endDate
) => {
  const query =
    language === 'all'
      ? 'SELECT * FROM news WHERE DATE(date) BETWEEN ? AND ? ORDER BY date DESC'
      : 'SELECT * FROM news WHERE language = ? AND DATE(date) BETWEEN ? AND ? ORDER BY date DESC';

  const params =
    language === 'all' ? [startDate, endDate] : [language, startDate, endDate];

  const [rows] = await pool.query(query, params);
  return rows;
};

// id로 특정 기사를 가져옴
export const getArticleById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
  return rows;
};

// summary 수정
export const updateSummary = async (id, summary) => {
  const [result] = await pool.query(
    'UPDATE news SET summary = ? WHERE id = ?',
    [summary, id]
  );
  return result;
};

// memo 수정
export const updateMemo = async (id, memo) => {
  const [result] = await pool.query('UPDATE news SET memo = ? WHERE id = ?', [
    memo,
    id,
  ]);
  return result;
};

// classification 수정
export const updateClassification = async (id, classification) => {
  const [result] = await pool.query(
    'UPDATE news SET classification = ? WHERE id = ?',
    [classification, id]
  );
  return result;
};

// background 수정
export const updateBackground = async (id, background) => {
  const [result] = await pool.query(
    'UPDATE news SET background = ? WHERE id = ?',
    [background, id]
  );
  return result;
};

// keyword 수정
export const updateKeyword = async (id, keyword) => {
  const [result] = await pool.query(
    'UPDATE news SET keyword = ? WHERE id = ?',
    [keyword, id]
  );
  return result;
};

// 새로운 기사 추가
export const addArticle = async ({
  name,
  title,
  date,
  language,
  summary,
  keyword,
  classification,
  background,
  memo,
}) => {
  const [result] = await pool.query(
    'INSERT INTO news (name, title, date, language, summary, keyword, classification, background, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      name,
      title,
      date,
      language,
      summary,
      keyword,
      classification,
      background,
      memo,
    ]
  );
  return result;
};

// id 값으로 기사 삭제
export const deleteArticleById = async (id) => {
  const [result] = await pool.query('DELETE FROM news WHERE id = ?', [id]);
  return result;
};

// Get detailed data (summary, keyword, classification, background, memo) by ID
export const getArticleDetailsById = async (id) => {
  const [rows] = await pool.query(
    'SELECT summary, keyword, classification, background, memo FROM news WHERE id = ?',
    [id]
  );
  return rows[0]; // Return the first row (should be the only one)
};
