// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FoodCard from '../components/FoodCard';
import Colors from '../constants/colors';
import { generateMockFoodData } from '../utils/foodUtils';
import { getDaysRemaining } from '../utils/dateUtils';

const HomeScreen = ({ navigation }) => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    // 模擬從資料庫載入食物資料
    const foodData = generateMockFoodData(15);
    setFoods(foodData);
    setFilteredFoods(foodData);
  }, []);
  
  // 過濾器選項
  const filters = [
    { id: 'all', label: '全部' },
    { id: 'expiring', label: '即將到期' },
    { id: 'refrigerator', label: '冷藏' },
    { id: 'freezer', label: '冷凍' },
  ];
  
  // 處理過濾器選擇
  const handleFilterSelect = (filterId) => {
    setActiveFilter(filterId);
    
    let result = [...foods];
    
    // 套用搜尋過濾
    if (searchText) {
      result = result.filter(food => 
        food.name.toLowerCase().includes(searchText.toLowerCase()) ||
        food.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 套用類別過濾
    switch (filterId) {
      case 'expiring':
        result = result.filter(food => {
          const daysRemaining = getDaysRemaining(food.expiryDate);
          return daysRemaining >= 0 && daysRemaining <= 7;
        });
        break;
      case 'refrigerator':
        result = result.filter(food => food.location === '冷藏');
        break;
      case 'freezer':
        result = result.filter(food => food.location === '冷凍');
        break;
      default:
        // 'all' 不需要額外過濾
        break;
    }
    
    setFilteredFoods(result);
  };
  
  // 處理搜尋
  const handleSearch = (text) => {
    setSearchText(text);
    
    if (!text) {
      handleFilterSelect(activeFilter);
      return;
    }
    
    const result = foods.filter(food => 
      food.name.toLowerCase().includes(text.toLowerCase()) ||
      food.category.toLowerCase().includes(text.toLowerCase())
    );
    
    setFilteredFoods(result);
  };
  
  // 處理食物卡片點選
  const handleFoodPress = (food) => {
    navigation.navigate('FoodDetail', { food });
  };
  
  // 渲染分隔線
  const renderSeparator = () => (
    <View style={styles.separator} />
  );
  
  // 渲染沒有食物的情況
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="shopping-basket" size={50} color={Colors.textLight} />
      <Text style={styles.emptyTitle}>冰箱是空的</Text>
      <Text style={styles.emptyText}>點擊下方的 + 按鈕來添加食物</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      
      <View style={styles.header}>
        <Text style={styles.title}>我的冰箱</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="cog" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={16} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜尋食物或類別..."
          placeholderTextColor={Colors.textLight}
          value={searchText}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === item.id && styles.activeFilter
              ]}
              onPress={() => handleFilterSelect(item.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.id && styles.activeFilterText
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filtersContent}
        />
      </View>
      
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodCard food={item} onPress={handleFoodPress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyList}
      />
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFood')}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={24} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  settingsButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: Colors.text,
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filtersContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundDark,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  activeFilterText: {
    color: Colors.white,
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default HomeScreen;