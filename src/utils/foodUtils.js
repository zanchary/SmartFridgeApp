// src/utils/foodUtils.js
import Colors from '../constants/colors';

/**
 * 獲取食物類別的顏色
 * @param {String} category - 食物類別
 * @returns {String} 類別對應的顏色代碼
 */
export const getCategoryColor = (category) => {
  switch (category.toLowerCase()) {
    case '肉類':
      return Colors.meat;
    case '蔬菜':
      return Colors.vegetable;
    case '水果':
      return Colors.fruit;
    case '乳製品':
      return Colors.dairy;
    default:
      return Colors.other;
  }
};

/**
 * 獲取食物保存位置的圖標名稱
 * @param {String} location - 保存位置
 * @returns {String} 圖標名稱
 */
export const getLocationIcon = (location) => {
  switch (location.toLowerCase()) {
    case '冷藏':
      return {
        name: 'snowflake-o',
        family: 'FontAwesome'
      };
    case '冷凍':
      return {
        name: 'snowflake',
        family: 'FontAwesome5'
      };
    default:
      return {
        name: 'archive',
        family: 'FontAwesome5'
      };
  }
};

/**
 * 根據食物類別獲取預設保存天數
 * @param {String} category - 食物類別
 * @returns {Number} 預設的保存天數
 */
export const getDefaultExpiryDays = (category) => {
  switch (category.toLowerCase()) {
    case '肉類':
      return 3;  // 3天
    case '蔬菜':
      return 7;  // 7天
    case '水果':
      return 10; // 10天
    case '乳製品':
      return 5;  // 5天
    default:
      return 14; // 14天
  }
};

/**
 * 獲取食物類別的中文名稱列表
 * @returns {Array} 類別名稱數組
 */
export const getFoodCategories = () => {
  return ['肉類', '蔬菜', '水果', '乳製品', '海鮮', '熟食', '其他'];
};

/**
 * 獲取食物存放位置的中文名稱列表
 * @returns {Array} 存放位置數組
 */
export const getStorageLocations = () => {
  return ['冷藏', '冷凍'];
};

/**
 * 為測試/演示目的生成模擬食物數據
 * @param {Number} count - 要生成的食物數量
 * @returns {Array} 食物數據數組
 */
export const generateMockFoodData = (count = 10) => {
  const categories = getFoodCategories();
  const locations = getStorageLocations();
  const foods = [
    '蘋果', '香蕉', '雞胸肉', '牛肉', '牛奶', '優格',
    '蛋', '胡蘿蔔', '番茄', '白菜', '鮭魚', '蝦子',
    '牛排', '起司', '火腿', '麵包', '豆腐', '青菜'
  ];
  
  const mockData = [];
  
  // 獲取過去30天內的隨機日期
  const getRandomPastDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 獲取未來1-20天的隨機日期
  const getRandomFutureDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 20) + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const name = foods[Math.floor(Math.random() * foods.length)];
    
    mockData.push({
      id: i.toString(),
      name: name,
      category: category,
      location: location,
      purchaseDate: getRandomPastDate(),
      expiryDate: getRandomFutureDate(),
      image: null  // 實際應用中這裡會存放圖片路徑或URI
    });
  }
  
  return mockData;
};