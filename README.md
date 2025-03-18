# Smart Fridge App

A mobile application that helps users track food items in their refrigerator and their expiration dates, designed to reduce food waste and improve food management efficiency.

## 📱 Features Overview

### Core Features
* **Food Management**: Track detailed information of all food items in your refrigerator
* **Expiration Reminders**: Receive notifications for food items approaching their expiration dates
* **Data Statistics**: Visual representation of food category distribution and consumption patterns
* **Food Details**: View detailed information for each food item, including purchase date and shelf life

### Special Features
* Color-coding system for intuitive display of food freshness status
* Smart filtering to quickly find soon-to-expire items
* Photo capture support for easy food identification
* Detailed statistical analysis to help reduce food waste

## 🖼️ App Screenshots
*[Added later]*

## 🛠 Tech Stack
* **Frontend Framework**: React Native / Expo
* **UI Components**: Custom component system
* **State Management**: React Hooks
* **Navigation**: React Navigation
* **Data Visualization**: React Native Chart Kit
* **Icons**: React Native Vector Icons

## 💻 Installation Guide

### Prerequisites
* Node.js (v14 or higher)
* npm or Yarn
* Expo CLI (for Expo version)
* iOS/Android simulator or physical device for testing

### Installation Steps

#### Using Expo (Recommended for demonstration)

```bash
# Clone the project
git clone https://github.com/zanchary/SmartFridgeApp.git
cd SmartFridgeApp

# Install dependencies
npm install

# Install specific required packages
npx expo install react-native-gesture-handler@~2.20.2 react-native-reanimated@~3.16.1 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0 react-native-image-picker @react-native-community/datetimepicker

# Start the Expo development server
npx expo start
```

#### Using standard React Native

```bash
# Clone the project
git clone https://github.com/yourusername/smart-fridge-app.git
cd smart-fridge-app

# Install dependencies
npm install

# Install specific required packages
npm install react-native-gesture-handler@~2.20.2 react-native-reanimated@~3.16.1 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0 react-native-image-picker @react-native-community/datetimepicker

# Run iOS version (requires macOS and Xcode)
npx react-native run-ios

# Run Android version
npx react-native run-android
```

## 📱 How to Use
1. **Home Screen** - View all stored food items, sorted by expiration date
2. **Add Food** - Take a photo or select an image, input food information and expiration date
3. **Food Details** - Click on a food card to view detailed information
4. **Statistics** - View food category distribution and preservation status

## 🌟 Key Features

### Intuitive User Interface
* Clear visual hierarchy
* Intuitive color-coding system
* Key information visible at a glance

### Food Tracking
* Complete food lifecycle management
* Support for multiple food categories
* Flexible filtering and search functionality

### Data Insights
* Food consumption pattern analysis
* Waste statistics and reduction suggestions
* Category and preservation status distribution charts

## 🔄 Project Structure

```
src/
├── components/      # Reusable components
│   ├── FoodCard.js
│   ├── BottomTabBar.js
│   ├── CustomButton.js
│   └── NotificationItem.js
├── screens/         # Application screens
│   ├── HomeScreen.js
│   ├── AddFoodScreen.js
│   ├── FoodDetailScreen.js
│   ├── StatsScreen.js
│   └── SettingsScreen.js
├── navigation/      # Navigation configuration
│   └── AppNavigator.js
├── utils/           # Utility functions
│   ├── dateUtils.js
│   └── foodUtils.js
├── constants/       # Constant definitions
│   └── colors.js
├── assets/          # Static resources
│   └── images/
└── App.js           # Application entry point
```

## 🧪 Testing

```bash
# Run tests
npm test
```

## 📊 Demo Data
The application includes simulated data for demonstration purposes. In actual use, this data will be replaced by the user's real food information.