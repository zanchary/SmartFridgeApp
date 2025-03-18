// src/components/FoodCard.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/colors';
import { getDaysRemaining, getExpiryStatusColor, formatDate } from '../utils/dateUtils';
import { getLocationIcon } from '../utils/foodUtils';

const FoodCard = ({ food, onPress }) => {
  const daysRemaining = getDaysRemaining(food.expiryDate);
  const statusColor = getExpiryStatusColor(daysRemaining);
  const locationIcon = getLocationIcon(food.location);
  
  // 預設的佔位圖片
  const placeholderImage = require('../assets/images/food1.jpg');
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(food)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {food.image ? (
          <Image source={{ uri: food.image }} style={styles.image} />
        ) : (
          <Image source={placeholderImage} style={styles.image} />
        )}
        <View style={[styles.statusIndicator, { backgroundColor: Colors[statusColor] }]} />
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{food.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{food.category}</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Icon name="calendar" size={12} color={Colors.textLight} />
            <Text style={styles.detailText}>
              購買: {formatDate(food.purchaseDate)}
            </Text>
          </View>
          
          <View style={styles.detail}>
            <Icon name={locationIcon} size={12} color={Colors.textLight} />
            <Text style={styles.detailText}>{food.location}</Text>
          </View>
        </View>
        
        <View style={styles.expiryContainer}>
          {daysRemaining < 0 ? (
            <Text style={[styles.expiryText, styles.expiredText]}>
              已過期 {Math.abs(daysRemaining)} 天
            </Text>
          ) : (
            <Text style={styles.expiryText}>
              {daysRemaining} 天後到期
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 10,
    color: Colors.textLight,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  expiryContainer: {
    marginTop: 'auto',
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
  },
  expiredText: {
    color: Colors.expired,
  },
});

export default FoodCard;