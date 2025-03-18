// src/components/BottomTabBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/colors';

const BottomTabBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { key: 'home', icon: 'home', label: '首頁' },
    { key: 'stats', icon: 'bar-chart', label: '統計' },
    { key: 'add', icon: 'plus-circle', label: '' },
    { key: 'recipes', icon: 'book', label: '食譜' },
    { key: 'settings', icon: 'cog', label: '設定' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabButton,
            tab.key === 'add' && styles.addButton,
            activeTab === tab.key && styles.activeTab
          ]}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          {tab.key === 'add' ? (
            <View style={styles.addButtonInner}>
              <Icon name={tab.icon} size={24} color={Colors.white} />
            </View>
          ) : (
            <>
              <Icon
                name={tab.icon}
                size={20}
                color={activeTab === tab.key ? Colors.primary : Colors.textLight}
              />
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.key && styles.activeTabLabel
                ]}
              >
                {tab.label}
              </Text>
            </>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    color: Colors.textLight,
  },
  activeTab: {
    // 活動標籤的樣式
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default BottomTabBar;