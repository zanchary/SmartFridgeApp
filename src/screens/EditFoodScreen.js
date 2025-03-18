import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../components/CustomButton';
import { TextInput } from 'react-native-gesture-handler';
import Colors from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFoodContext } from '../context/FoodContext';


const EditFoodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { food } = route.params;
  const { updateFood } = useFoodContext();

  // Ensure dates are properly converted to Date objects
  const parsePurchaseDate = () => {
    try {
      return new Date(food.purchaseDate);
    } catch (e) {
      console.error("Error parsing purchase date:", e);
      return new Date(); // Fallback to current date
    }
  };

  const parseExpiryDate = () => {
    try {
      return new Date(food.expiryDate);
    } catch (e) {
      console.error("Error parsing expiry date:", e);
      return new Date(); // Fallback to current date
    }
  };

  // State variables
  const [name, setName] = useState(food.name);
  const [category, setCategory] = useState(food.category);
  const [location, setLocation] = useState(food.location);
  const [purchaseDate, setPurchaseDate] = useState(parsePurchaseDate());
  const [expiryDate, setExpiryDate] = useState(parseExpiryDate());
  const [image, setImage] = useState(food.image);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

  // Category options
  const categories = ['肉類', '蔬菜', '水果', '海鮮', '冷凍食品', '飲料', '其他'];
  
  // Location options
  const locations = ['冷藏', '冷凍', '常溫'];

  // Handle image selection
  const handleSelectImage = () => {
    const options = {
      title: 'Select Food Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  // Handle camera
  const handleTakePhoto = () => {
    const options = {
      title: 'Take Food Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  // Date picker handlers
  const onPurchaseDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || purchaseDate;
    setShowPurchaseDatePicker(Platform.OS === 'ios');
    setPurchaseDate(currentDate);
  };

  const onExpiryDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setShowExpiryDatePicker(Platform.OS === 'ios');
      setExpiryDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    // Make sure we have a valid date
    if (!(date instanceof Date) || isNaN(date)) {
      console.error("Invalid date value:", date);
      return "Invalid Date";
    }
    return date.toISOString().split('T')[0];
  };

  // Save updated food
  const handleSave = () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert('錯誤', '請輸入食物名稱');
      return;
    }

    // Create updated food object
    const updatedFood = {
      ...food,
      name,
      category,
      location,
      purchaseDate: formatDate(purchaseDate),
      expiryDate: formatDate(expiryDate),
      image,
    };

    // Navigate back to detail screen with updated food and a flag
    /*
    navigation.navigate('FoodDetail', { 
      food: updatedFood, 
      updated: true 
    });
    */
   updateFood(updatedFood);
   navigation.navigate('HomeMain');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>編輯食物</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.foodImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Icon name="image" size={80} color="#CCC" />
          </View>
        )}
        <View style={styles.imageButtonContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
            <Icon name="camera" size={16} color={Colors.text} style={styles.buttonIcon} />
            <Text style={styles.imageButtonText}>拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
            <Icon name="image" size={16} color={Colors.text} style={styles.buttonIcon} />
            <Text style={styles.imageButtonText}>選擇圖片</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Food Details Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>名稱</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="輸入食物名稱"
        />

        <Text style={styles.label}>類別</Text>
        <View style={styles.optionsContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.optionButton,
                category === cat && styles.selectedOption,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.optionText,
                  category === cat && styles.selectedOptionText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>儲存位置</Text>
        <View style={styles.optionsContainer}>
          {locations.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[
                styles.optionButton,
                location === loc && styles.selectedOption,
              ]}
              onPress={() => setLocation(loc)}
            >
              <Text
                style={[
                  styles.optionText,
                  location === loc && styles.selectedOptionText,
                ]}
              >
                {loc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>購買日期</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPurchaseDatePicker(true)}
        >
          <Icon name="calendar" size={16} color={Colors.textLight} style={styles.dateIcon} />
          <Text style={styles.dateButtonText}>{formatDate(purchaseDate)}</Text>
        </TouchableOpacity>
        {showPurchaseDatePicker && (
          <DateTimePicker
            testID="purchaseDatePicker"
            value={purchaseDate}
            mode="date"
            display="default"
            onChange={onPurchaseDateChange}
          />
        )}

        <Text style={styles.label}>保存期限</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowExpiryDatePicker(true)}
        >
          <Icon name="calendar" size={16} color={Colors.textLight} style={styles.dateIcon} />
          <Text style={styles.dateButtonText}>{formatDate(expiryDate)}</Text>
        </TouchableOpacity>
        {showExpiryDatePicker && (
          <DateTimePicker
            testID="expiryDatePicker"
            value={expiryDate}
            mode="date"
            display="default"
            onChange={onExpiryDateChange}
          />
        )}

        <View style={styles.buttonContainer}>
          <CustomButton
            title="取消"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          />
          <CustomButton
            title="儲存變更"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </View>
    </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: Colors.white,
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  imageButton: {
    backgroundColor: Colors.backgroundDark,
    padding: 12,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  imageButtonText: {
    color: Colors.text,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: Colors.backgroundDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 4,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    color: Colors.textLight,
  },
  selectedOptionText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateButtonText: {
    color: Colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: Colors.textLight,
  },
});

export default EditFoodScreen;