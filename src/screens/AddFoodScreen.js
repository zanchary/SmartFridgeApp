// src/screens/AddFoodScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/colors';
import { getTodayString, addDays } from '../utils/dateUtils';
import { getFoodCategories, getStorageLocations, getDefaultExpiryDays } from '../utils/foodUtils';

const AddFoodScreen = ({ navigation }) => {
  const [foodData, setFoodData] = useState({
    name: '',
    category: getFoodCategories()[0],
    location: getStorageLocations()[0],
    purchaseDate: getTodayString(),
    expiryDate: addDays(getTodayString(), 7),
    image: null,
    notes: '',
  });
  
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  
  // 處理食物資料變更
  const handleChange = (field, value) => {
    setFoodData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 如果類別變更，自動更新到期日
    if (field === 'category') {
      const defaultDays = getDefaultExpiryDays(value);
      setFoodData(prev => ({
        ...prev,
        expiryDate: addDays(prev.purchaseDate, defaultDays)
      }));
    }
  };
  
  // 處理日期選擇
  const handleDateChange = (event, selectedDate, dateType) => {
    if (Platform.OS === 'android') {
      setShowPurchaseDatePicker(false);
      setShowExpiryDatePicker(false);
    }
    
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      
      if (dateType === 'purchase') {
        handleChange('purchaseDate', formattedDate);
        
        // 更新到期日
        const defaultDays = getDefaultExpiryDays(foodData.category);
        handleChange('expiryDate', addDays(formattedDate, defaultDays));
      } else {
        handleChange('expiryDate', formattedDate);
      }
    }
  };
  
  // 格式化日期為 YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // 顯示日期選擇器
  const showDatePicker = (dateType) => {
    if (dateType === 'purchase') {
      setShowPurchaseDatePicker(true);
    } else {
      setShowExpiryDatePicker(true);
    }
  };
  
  // 處理拍照
  const handleTakePhoto = () => {
    launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      
      if (response.error) {
        Alert.alert('錯誤', '拍照時發生錯誤');
        return;
      }
      
      if (response.assets && response.assets[0]) {
        handleChange('image', response.assets[0].uri);
      }
    });
  };
  
  // 處理從相簿選取照片
  const handleSelectPhoto = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      
      if (response.error) {
        Alert.alert('錯誤', '選取照片時發生錯誤');
        return;
      }
      
      if (response.assets && response.assets[0]) {
        handleChange('image', response.assets[0].uri);
      }
    });
  };
  
  // 處理儲存食物
  const handleSave = () => {
    if (!foodData.name.trim()) {
      Alert.alert('錯誤', '請輸入食物名稱');
      return;
    }
    
    // 這裡通常會連接到資料庫儲存食物資料
    
    // 模擬儲存成功
    Alert.alert(
      '成功',
      `${foodData.name} 已成功添加到冰箱`,
      [
        {
          text: '好的',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };
  
  // 渲染照片選擇區域
  const renderImagePicker = () => (
    <View style={styles.imagePickerContainer}>
      {foodData.image ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: foodData.image }} style={styles.imagePreview} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => handleChange('image', null)}
          >
            <Icon name="times-circle" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Icon name="camera" size={40} color={Colors.textLight} />
          <Text style={styles.imagePlaceholderText}>添加食物照片</Text>
          <View style={styles.imageButtonsContainer}>
            <CustomButton
              title="拍照"
              onPress={handleTakePhoto}
              icon="camera"
              type="outline"
              size="small"
              style={styles.imageButton}
            />
            <CustomButton
              title="從相簿選擇"
              onPress={handleSelectPhoto}
              icon="image"
              type="outline"
              size="small"
              style={styles.imageButton}
            />
          </View>
        </View>
      )}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>添加食物</Text>
          <View style={styles.headerRight} />
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderImagePicker()}
          
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>食物名稱</Text>
              <TextInput
                style={styles.input}
                placeholder="輸入食物名稱"
                value={foodData.name}
                onChangeText={(text) => handleChange('name', text)}
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>類別</Text>
                <TouchableOpacity style={styles.pickerButton}>
                  <Text style={styles.pickerButtonText}>{foodData.category}</Text>
                  <Icon name="chevron-down" size={14} color={Colors.textLight} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>存放位置</Text>
                <TouchableOpacity style={styles.pickerButton}>
                  <Text style={styles.pickerButtonText}>{foodData.location}</Text>
                  <Icon name="chevron-down" size={14} color={Colors.textLight} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>購買日期</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => showDatePicker('purchase')}
                >
                  <Text style={styles.dateButtonText}>{foodData.purchaseDate}</Text>
                  <Icon name="calendar" size={14} color={Colors.textLight} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>到期日期</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => showDatePicker('expiry')}
                >
                  <Text style={styles.dateButtonText}>{foodData.expiryDate}</Text>
                  <Icon name="calendar" size={14} color={Colors.textLight} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>備註 (選填)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="添加備註..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={foodData.notes}
                onChangeText={(text) => handleChange('notes', text)}
              />
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <CustomButton
            title="儲存"
            onPress={handleSave}
            type="primary"
            fullWidth
            size="large"
          />
        </View>
      </KeyboardAvoidingView>
      
      {showPurchaseDatePicker && (
        <DateTimePicker
          value={new Date(foodData.purchaseDate)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, 'purchase')}
        />
      )}
      
      {showExpiryDatePicker && (
        <DateTimePicker
          value={new Date(foodData.expiryDate)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, 'expiry')}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  },
  imagePickerContainer: {
    padding: 20,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: Colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 8,
    marginBottom: 16,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
  },
  imageButton: {
    marginHorizontal: 6,
  },
  imagePreviewContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  formContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formGroupHalf: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: Colors.text,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});

export default AddFoodScreen;