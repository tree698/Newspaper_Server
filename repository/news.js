import mysql from 'mysql2/promise'; // 비동기 방식의 mysql2 사용
import { config } from '../config.js';

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

// name과 date 범위로 검색
export const getArticlesByNameAndDate = async (name, startDate, endDate) => {
  const [rows] = await pool.query(
    'SELECT * FROM news WHERE name = ? AND DATE(date) BETWEEN ? AND ? ORDER BY date DESC',
    [name, startDate, endDate]
  );
  return rows;
};

// language와 date 범위로 검색 (날짜는 DATE()로 처리)
export const getArticlesByLanguageAndDate = async (
  language,
  startDate,
  endDate
) => {
  const [rows] = await pool.query(
    'SELECT * FROM news WHERE language = ? AND DATE(date) BETWEEN ? AND ? ORDER BY date DESC',
    [language, startDate, endDate]
  );
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

// expection 수정
export const updateExpection = async (id, expection) => {
  const [result] = await pool.query(
    'UPDATE news SET expection = ? WHERE id = ?',
    [expection, id]
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
  memo,
  ranking,
  url,
  image,
}) => {
  const [result] = await pool.query(
    'INSERT INTO news (name, title, date, language, summary, memo, ranking, url, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, title, date, language, summary, memo, ranking, url, image]
  );
  return result;
};

// id 값으로 기사 삭제
export const deleteArticleById = async (id) => {
  const [result] = await pool.query('DELETE FROM news WHERE id = ?', [id]);
  return result;
};

// Get detailed data (summary, keyword, classification, expection, memo) by ID
export const getArticleDetailsById = async (id) => {
  const [rows] = await pool.query(
    'SELECT summary, keyword, classification, expection, memo FROM news WHERE id = ?',
    [id]
  );
  return rows[0]; // Return the first row (should be the only one)
};
