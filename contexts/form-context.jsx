"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

/**
 * React Context for multi-page form state management
 * Provides in-memory state with LocalStorage backup
 */
const FormContext = createContext(null);

/**
 * Form State Provider
 * Wraps your app/pages to provide shared form state
 */
export function FormProvider({ children, storageKey = "form-state" }) {
  // Initialize state from LocalStorage
  const [formData, setFormData] = useState(() => {
    if (typeof window === "undefined") return {};
    
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading form state:", error);
      return {};
    }
  });

  // Save to LocalStorage on every change
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving form state:", error);
    }
  }, [formData, storageKey]);

  // Update form data
  const updateFormData = useCallback((key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Update multiple fields at once
  const updateMultipleFields = useCallback((updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Clear all form data
  const clearFormData = useCallback(() => {
    setFormData({});
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        console.error("Error clearing form state:", error);
      }
    }
  }, [storageKey]);

  // Get specific field value
  const getFieldValue = useCallback((key, defaultValue = null) => {
    return formData[key] ?? defaultValue;
  }, [formData]);

  const value = {
    formData,
    updateFormData,
    updateMultipleFields,
    clearFormData,
    getFieldValue,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

/**
 * Hook to use form context
 */
export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider");
  }
  return context;
}
