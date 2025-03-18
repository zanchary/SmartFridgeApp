// src/screens/StatsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/colors';
import { generateMockFoodData } from '../utils/foodUtils';
import { getDaysRemaining } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

const StatsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [foods, setFoods] = useState([]);
  const [foodsByCategory, setFoodsByCategory] = useState([]);
  const [foodsByExpiryStatus, setFoodsByExpiryStatus] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  
  useEffect(() => {
    // 模擬從資料庫載入食物資料
    const foodData = generateMockFoodData(20);
    setFoods(foodData);
    
    // 整理類別統計資料
    processDataByCategory(foodData);
    
    // 整理到期統計資料
    processDataByExpiryStatus(foodData);
    
    // 模擬浪費資料
    generateMockWasteData();
  }, []);
  
  // 處理類別統計資料
  const processDataByCategory = (foodData) => {
    const categories = {};
    
    foodData.forEach(food => {
      if (!categories[food.category]) {
        categories[food.category] = {
          count: 0,
          color: getCategoryColor(food.category)
        };
      }
      
      categories[food.category].count += 1;
    });
    
    const result = Object.keys(categories).map(category => ({
      name: category,
      count: categories[category].count,
      color: categories[category].color,
      legendFontColor: Colors.text,
      legendFontSize: 12
    }));
    
    setFoodsByCategory(result);
  };
  
  // 處理到期狀態統計資料
  const processDataByExpiryStatus = (foodData) => {
    const statuses = {
      expired: { count: 0, color: Colors.expired },
      urgent: { count: 0, color: Colors.urgent },
      warning: { count: 0, color: Colors.warning },
      fresh: { count: 0, color: Colors.fresh }
    };
    
    foodData.forEach(food => {
      const daysRemaining = getDaysRemaining(food.expiryDate);
      
      if (daysRemaining < 0) {
        statuses.expired.count += 1;
      } else if (daysRemaining <= 2) {
        statuses.urgent.count += 1;
      } else if (daysRemaining <= 7) {
        statuses.warning.count += 1;
      } else {
        statuses.fresh.count += 1;
      }
    });
    
    const result = [
      {
        name: '已過期',
        count: statuses.expired.count,
        color: statuses.expired.color,
        legendFontColor: Colors.text,
        legendFontSize: 12
      },
      {
        name: '緊急(1-2天)',
        count: statuses.urgent.count,
        color: statuses.urgent.color,
        legendFontColor: Colors.text,
        legendFontSize: 12
      },
      {
        name: '警告(3-7天)',
        count: statuses.warning.count,
        color: statuses.warning.color,
        legendFontColor: Colors.text,
        legendFontSize: 12
      },
      {
        name: '新鮮(>7天)',
        count: statuses.fresh.count,
        color: statuses.fresh.color,
        legendFontColor: Colors.text,
        legendFontSize: 12
      }
    ];
    
    setFoodsByExpiryStatus(result);
  };
  
  // 根據類別取得顏色
  const getCategoryColor = (category) => {
    const colorMap = {
      '肉類': '#f44336',
      '蔬菜': '#4caf50',
      '水果': '#ffca28',
      '乳製品': '#42a5f5',
      '海鮮': '#26c6da',
      '熟食': '#ec407a',
      '其他': '#9e9e9e'
    };
    
    return colorMap[category] || Colors.primary;
  };
  
  // 產生模擬浪費資料
  const generateMockWasteData = () => {
    // 模擬過去6個月的浪費數據
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const values = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10) + 1);
    
    setWasteData({
      labels: months,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
          strokeWidth: 2
        }
      ]
    });
  };
  
  // 渲染概要tab
  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.statCard}>
        <Text style={styles.statCardTitle}>食物總數</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{foods.length}</Text>
            <Text style={styles.statLabel}>項目</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {foodsByExpiryStatus.find(item => item.name === '已過期')?.count || 0}
            </Text>
            <Text style={styles.statLabel}>已過期</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {foodsByExpiryStatus.find(item => item.name === '緊急(1-2天)')?.count || 0}
            </Text>
            <Text style={styles.statLabel}>即將到期</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>食物類別分佈</Text>
        <View style={styles.chartContainer}>
          {foodsByCategory.length > 0 && (
            <PieChart
              data={foodsByCategory}
              width={width - 64}
              height={180}
              chartConfig={{
                backgroundColor: Colors.white,
                backgroundGradientFrom: Colors.white,
                backgroundGradientTo: Colors.white,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          )}
        </View>
      </View>
      
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>保存狀態分佈</Text>
        <View style={styles.chartContainer}>
          {foodsByExpiryStatus.length > 0 && (
            <PieChart
              data={foodsByExpiryStatus}
              width={width - 64}
              height={180}
              chartConfig={{
                backgroundColor: Colors.white,
                backgroundGradientFrom: Colors.white,
                backgroundGradientTo: Colors.white,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          )}
        </View>
      </View>
    </View>
  );
  
  // 渲染消費tab
  const renderConsumptionTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>月度食物浪費趨勢</Text>
        <View style={styles.chartContainer}>
          {wasteData.labels && (
            <LineChart
              data={wasteData}
              width={width - 64}
              height={220}
              chartConfig={{
                backgroundColor: Colors.white,
                backgroundGradientFrom: Colors.white,
                backgroundGradientTo: Colors.white,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(66, 135, 245, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: Colors.primary
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}
        </View>
        <Text style={styles.chartSubtitle}>過去6個月食物浪費數量</Text>
      </View>
      
      <View style={styles.statCard}>
        <Text style={styles.statCardTitle}>消費統計</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>食用率</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15%</Text>
            <Text style={styles.statLabel}>浪費率</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>本月消費</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.tipCard}>
        <Icon name="lightbulb-o" size={20} color={Colors.warning} style={styles.tipIcon} />
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>減少浪費的小提示</Text>
          <Text style={styles.tipText}>
            統計顯示，您最常浪費的是蔬菜類食物。建議減少一次性購買量，並優先使用冰箱中即將到期的食材。
          </Text>
        </View>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>統計分析</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'overview' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('overview')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'overview' && styles.activeTabText
            ]}
          >
            總覽
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'consumption' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('consumption')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'consumption' && styles.activeTabText
            ]}
          >
            消費與浪費
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' ? renderOverviewTab() : renderConsumptionTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: `${Colors.primary}15`,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartSubtitle: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 8,
  },
  tipCard: {
    backgroundColor: `${Colors.warning}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 18,
  },
});

export default StatsScreen;