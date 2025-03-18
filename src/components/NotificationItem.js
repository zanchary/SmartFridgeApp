// src/components/NotificationItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/colors';

const NotificationItem = ({ 
  title, 
  message, 
  icon,
  iconColor,
  time,
  onPress,
  onDismiss,
  type = 'info' // 'info', 'warning', 'danger', 'success'
}) => {
  // 根據通知類型設置顏色
  const getTypeColor = () => {
    switch (type) {
      case 'info':
        return Colors.primary;
      case 'warning':
        return Colors.warning;
      case 'danger':
        return Colors.danger;
      case 'success':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  // 根據通知類型設置圖標
  const getTypeIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'info':
        return 'info-circle';
      case 'warning':
        return 'exclamation-circle';
      case 'danger':
        return 'exclamation-triangle';
      case 'success':
        return 'check-circle';
      default:
        return 'bell';
    }
  };

  const color = iconColor || getTypeColor();
  const typeIcon = getTypeIcon();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Icon name={typeIcon} size={20} color={color} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {time && <Text style={styles.time}>{time}</Text>}
        </View>
        
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
      
      {onDismiss && (
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={onDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="times" size={16} color={Colors.textLight} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  dismissButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default NotificationItem;