// src/utils/dateUtils.js

/**
 * 計算兩個日期之間的天數差
 * @param {String} dateString - YYYY-MM-DD 格式的日期字串
 * @returns {Number} 天數差，負數表示已過期
 */
export const getDaysRemaining = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 獲取食物狀態的顏色代碼
 * @param {Number} daysRemaining - 剩餘天數
 * @returns {String} 對應的顏色代碼
 */
export const getExpiryStatusColor = (daysRemaining) => {
  if (daysRemaining < 0) {
    return 'expired';
  } else if (daysRemaining <= 2) {
    return 'urgent';
  } else if (daysRemaining <= 7) {
    return 'warning';
  } else {
    return 'fresh';
  }
};

/**
 * 格式化日期為顯示格式
 * @param {String} dateString - YYYY-MM-DD 格式的日期字串
 * @returns {String} 格式化後的日期 (例如：'2025/03/18' 或 '3月18日')
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/**
 * 獲取今天的日期，格式為 YYYY-MM-DD
 * @returns {String} YYYY-MM-DD 格式的日期字串
 */
export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 將日期增加指定天數
 * @param {String} dateString - YYYY-MM-DD 格式的日期字串
 * @param {Number} days - 要增加的天數
 * @returns {String} YYYY-MM-DD 格式的新日期字串
 */
export const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};