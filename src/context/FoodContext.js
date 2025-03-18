// src/context/FoodContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMockFoodData } from '../utils/foodUtils';

// Create the context
const FoodContext = createContext();

// Provider component
export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load foods from storage on mount
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const storedFoods = await AsyncStorage.getItem('foods');
        if (storedFoods) {
          setFoods(JSON.parse(storedFoods));
        } else {
          // If no stored foods, generate mock data
          const mockFoods = generateMockFoodData(15);
          setFoods(mockFoods);
        }
      } catch (error) {
        console.error('Error loading foods:', error);
        // Fallback to mock data if there's an error
        const mockFoods = generateMockFoodData(15);
        setFoods(mockFoods);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  // Save foods to storage whenever they change
  useEffect(() => {
    const saveFoods = async () => {
      try {
        await AsyncStorage.setItem('foods', JSON.stringify(foods));
        console.log('Foods saved to storage');
      } catch (error) {
        console.error('Error saving foods:', error);
      }
    };

    // Only save if not in initial loading state
    if (!loading) {
      saveFoods();
    }
  }, [foods, loading]);

  // Add a new food
  const addFood = (newFood) => {
    // Generate an ID if none exists
    if (!newFood.id) {
      newFood.id = Date.now().toString();
    }
    
    setFoods(currentFoods => [...currentFoods, newFood]);
    return newFood;
  };

  // Update a food
  const updateFood = (updatedFood) => {
    console.log('Updating food in context:', updatedFood);
    setFoods(currentFoods => 
      currentFoods.map(food => 
        food.id === updatedFood.id ? updatedFood : food
      )
    );
  };

  // Delete a food
  const deleteFood = (foodId) => {
    setFoods(currentFoods => 
      currentFoods.filter(food => food.id !== foodId)
    );
  };

  return (
    <FoodContext.Provider
      value={{
        foods,
        loading,
        addFood,
        updateFood,
        deleteFood,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

// Custom hook to use the context
export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext must be used within a FoodProvider');
  }
  return context;
};