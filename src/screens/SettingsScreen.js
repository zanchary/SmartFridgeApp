// src/screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/colors';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [expiryNotificationDays, setExpiryNotificationDays] = useState([1, 3, 7]);
  const [darkMode, setDarkMode] = useState(false);
  const [defaultSort, setDefaultSort] = useState('expiry');
  
  // 處理切換通知
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  // 處理切換深色模式
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // 在實際應用中，這裡會切換整個應用的主題
  };
  
  // 處理更改默認排序
  const handleSortChange = (sort) => {
    setDefaultSort(sort);
  };
  
  // 處理清除資料
  const handleClearData = () => {
    Alert.alert(
      '確認清除資料',
      '確定要清除所有食物資料嗎？此操作無法復原。',
      [
        {
          text: '取消',
          style: 'cancel'
        },
        {
          text: '清除',
          style: 'destructive',
          onPress: () => {
            // 在實際應用中，這裡會清除數據庫
            Alert.alert('已清除', '所有食物資料已清除');
          }
        }
      ]
    );
  };
  
  // 渲染設置項
  const renderSettingItem = (icon, title, value, onPress, type = 'navigate') => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        <Icon name={icon} size={20} color={Colors.primary} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        
        {type === 'navigate' && (
          <Icon name="chevron-right" size={16} color={Colors.textLight} />
        )}
        
        {type === 'toggle' && (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: Colors.border, true: `${Colors.primary}80` }}
            thumbColor={value ? Colors.primary : Colors.backgroundDark}
          />
        )}
        
        {type === 'select' && (
          <Text style={styles.settingValue}>{value}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
  
  // 渲染設置組
  const renderSettingGroup = (title, children) => (
    <View style={styles.settingGroup}>
      <Text style={styles.settingGroupTitle}>{title}</Text>
      <View style={styles.settingGroupContent}>
        {children}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>設定</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView style={styles.content}>
        {renderSettingGroup('通知設定', 
          <>
            {renderSettingItem(
              'bell',
              '啟用通知',
              notificationsEnabled,
              toggleNotifications,
              'toggle'
            )}
            
            {notificationsEnabled && renderSettingItem(
              'clock-o',
              '到期提醒時間',
              expiryNotificationDays.join(', ') + ' 天前',
              () => navigation.navigate('NotificationSettings'),
              'navigate'
            )}
          </>
        )}
        
        {renderSettingGroup('應用設定',
          <>
            {renderSettingItem(
              'sort-amount-desc',
              '默認排序方式',
              defaultSort === 'expiry' ? '到期日期' : 
              defaultSort === 'purchase' ? '購買日期' : 
              defaultSort === 'category' ? '類別' : '名稱',
              () => navigation.navigate('SortSettings', { defaultSort, handleSortChange }),
              'navigate'
            )}
            
            {renderSettingItem(
              'moon-o',
              '深色模式',
              darkMode,
              toggleDarkMode,
              'toggle'
            )}
          </>
        )}
        
        {renderSettingGroup('數據管理',
          <>
            {renderSettingItem(
              'download',
              '導出數據',
              null,
              () => {
                // 在實際應用中，這裡會處理導出數據
                Alert.alert('導出成功', '數據已成功導出');
              },
              'navigate'
            )}
            
            {renderSettingItem(
              'upload',
              '導入數據',
              null,
              () => {
                // 在實際應用中，這裡會處理導入數據
                Alert.alert('導入成功', '數據已成功導入');
              },
              'navigate'
            )}
            
            {renderSettingItem(
              'trash',
              '清除所有資料',
              null,
              handleClearData,
              'navigate'
            )}
          </>
        )}
        
        {renderSettingGroup('關於',
          <>
            {renderSettingItem(
              'info-circle',
              '版本',
              'v1.0.0',
              null,
              'select'
            )}
            
            {renderSettingItem(
              'question-circle',
              '幫助與支援',
              null,
              () => {
                // 在實際應用中，這裡會跳轉到幫助頁面
              },
              'navigate'
            )}
            
            {renderSettingItem(
              'star',
              '評分應用',
              null,
              () => {
                // 在實際應用中，這裡會跳轉到應用商店
              },
              'navigate'
            )}
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  settingGroup: {
    marginBottom: 24,
  },
  settingGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  settingGroupContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textLight,
  },
});

export default SettingsScreen;