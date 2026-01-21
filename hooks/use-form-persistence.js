"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for persisting form data to LocalStorage
 * Automatically saves on changes and restores on mount
 * 
 * @param {string} storageKey - Unique key for LocalStorage
 * @param {object} initialData - Default form data
 * @returns {[object, function, function]} - [data, updateData, clearData]
 */
export function useFormPersistence(storageKey, initialData = {}) {
  // Initialize state from LocalStorage or use initial data
  const [data, setData] = useState(() => {
    if (typeof window === "undefined") return initialData;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with initialData to handle new fields
        return { ...initialData, ...parsed };
      }
    } catch (error) {
      console.error(`Error loading from LocalStorage (${storageKey}):`, error);
    }
    return initialData;
  });

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to LocalStorage (${storageKey}):`, error);
    }
  }, [data, storageKey]);

  // Update data function
  const updateData = useCallback((newData) => {
    setData((prev) => {
      if (typeof newData === "function") {
        return newData(prev);
      }
      return { ...prev, ...newData };
    });
  }, []);

  // Clear all stored data
  const clearData = useCallback(() => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.removeItem(storageKey);
      setData(initialData);
    } catch (error) {
      console.error(`Error clearing LocalStorage (${storageKey}):`, error);
    }
  }, [storageKey, initialData]);

  return [data, updateData, clearData];
}
