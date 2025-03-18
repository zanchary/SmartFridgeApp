// src/screens/FoodDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/colors';
import { getDaysRemaining, getExpiryStatusColor, formatDate } from '../utils/dateUtils';

const FoodDetailScreen = ({ route, navigation }) => {
  const { food } = route.params;
  const [consumed, setConsumed] = useState(false);
  
  const daysRemaining = getDaysRemaining(food.expiryDate);
  const statusColor = getExpiryStatusColor(daysRemaining);
  
  // 預設的佔位圖片
  const placeholderImage = require('../assets/images/food1.jpg');
  
  // 處理消費食物
  const handleConsume = () => {
    Alert.alert(
      '確認消費',
      `確定你已經消費了 ${food.name} 嗎？`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確認',
          onPress: () => {
            setConsumed(true);
            // 在實際應用中，這裡會更新數據庫
            setTimeout(() => {
              navigation.goBack();
            }, 1500);
          },
        },
      ]
    );
  };
  
  // 處理刪除食物
  const handleDelete = () => {
    Alert.alert(
      '確認刪除',
      `確定要刪除 ${food.name} 嗎？`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '刪除',
          style: 'destructive',
          onPress: () => {
            // 在實際應用中，這裡會從數據庫刪除
            navigation.goBack();
          },
        },
      ]
    );
  };
  
  // 渲染到期狀態
  const renderExpiryStatus = () => {
    let statusText = '';
    
    if (daysRemaining < 0) {
      statusText = `已過期 ${Math.abs(daysRemaining)} 天`;
    } else if (daysRemaining === 0) {
      statusText = '今天到期';
    } else {
      statusText = `還有 ${daysRemaining} 天到期`;
    }
    
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>保存狀態</Text>
        <View style={styles.statusContent}>
          <View style={[styles.statusIndicator, { backgroundColor: Colors[statusColor] }]} />
          <Text style={[styles.statusText, daysRemaining < 0 && styles.expiredText]}>
            {statusText}
          </Text>
        </View>
        
        {/* 進度條 */}
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: Colors[statusColor],
                width: `${Math.max(0, Math.min(100, (daysRemaining / 30) * 100))}%` 
              }
            ]} 
          />
        </View>
      </View>
    );
  };
  
  // 渲染食物資訊卡
  const renderInfoCard = () => (
    <View style={styles.infoCard}>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>類別</Text>
          <Text style={styles.infoValue}>{food.category}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>存放位置</Text>
          <Text style={styles.infoValue}>{food.location}</Text>
        </View>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>購買日期</Text>
          <Text style={styles.infoValue}>{formatDate(food.purchaseDate)}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>到期日期</Text>
          <Text style={styles.infoValue}>{formatDate(food.expiryDate)}</Text>
        </View>
      </View>
      
      {food.notes && (
        <>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>備註</Text>
              <Text style={styles.infoValue}>{food.notes}</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {consumed && (
        <View style={styles.consumedOverlay}>
          <Icon name="check-circle" size={60} color={Colors.success} />
          <Text style={styles.consumedText}>已標記為消費</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>食物詳情</Text>
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => {
            // 這裡可以實現更多選項菜單
          }}
        >
          <Icon name="ellipsis-v" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {food.image ? (
            <Image source={{ uri: food.image }} style={styles.image} />
          ) : (
            <Image source={placeholderImage} style={styles.image} />
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{food.name}</Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigation.navigate('EditFood', { food })}
            >
              <Icon name="pencil" size={16} color={Colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Icon name="trash" size={16} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
        
        {renderExpiryStatus()}
        {renderInfoCard()}
        
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>相關建議</Text>
          
          {daysRemaining < 0 ? (
            <View style={styles.warningCard}>
              <Icon name="exclamation-triangle" size={20} color={Colors.danger} />
              <Text style={styles.warningText}>
                此食物已過期，請謹慎評估後再食用。請檢查是否有異味、變質或發霉的跡象。
              </Text>
            </View>
          ) : daysRemaining <= 2 ? (
            <View style={styles.warningCard}>
              <Icon name="exclamation-circle" size={20} color={Colors.alert} />
              <Text style={styles.warningText}>
                此食物即將到期，建議優先食用。
              </Text>
            </View>
          ) : null}
          
          <TouchableOpacity style={styles.suggestionCard}>
            <View style={styles.suggestionIconContainer}>
              <Icon name="book" size={20} color={Colors.white} />
            </View>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionTitle}>查看相關食譜</Text>
              <Text style={styles.suggestionText}>
                查看使用{food.name}的食譜建議
              </Text>
            </View>
            <Icon name="chevron-right" size={16} color={Colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.suggestionCard}>
            <View style={styles.suggestionIconContainer2}>
              <Icon name="archive" size={20} color={Colors.white} />
            </View>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionTitle}>保存技巧</Text>
              <Text style={styles.suggestionText}>
                了解如何延長{food.name}的保鮮期
              </Text>
            </View>
            <Icon name="chevron-right" size={16} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <CustomButton
          title="標記為已消費"
          onPress={handleConsume}
          type="primary"
          fullWidth
          size="large"
          icon="check"
        />
      </View>
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
  moreButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    backgroundColor: Colors.white,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: Colors.text,
  },
  expiredText: {
    color: Colors.danger,
    fontWeight: '500',
  },
  progressContainer: {
    height: 8,
    backgroundColor: Colors.backgroundDark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  infoCard: {
    padding: 20,
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 15,
  },
  suggestionsContainer: {
    padding: 20,
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 15,
  },
  warningCard: {
    padding: 15,
    backgroundColor: Colors.backgroundDark,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  warningText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 10,
    flex: 1,
  },
  suggestionCard: {
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  suggestionIconContainer2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  consumedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  consumedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success,
    marginTop: 16,
  },
});

export default FoodDetailScreen;