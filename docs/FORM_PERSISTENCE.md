# Form Persistence Guide

This guide explains how to persist form data across page navigation in Next.js 15 App Router.

## Two Approaches

### 1. **useFormPersistence Hook** (Recommended for Single Pages)
Simple LocalStorage-based persistence hook. Best for individual pages.

### 2. **FormContext Provider** (Recommended for Multi-Page Flows)
React Context with LocalStorage backup. Best for multi-step forms across multiple pages.

---

## Approach 1: useFormPersistence Hook

### Basic Usage

```jsx
"use client";

import { useFormPersistence } from "@/hooks/use-form-persistence";

export default function MyFormPage() {
  // Initialize with default values
  const [formData, updateFormData, clearFormData] = useFormPersistence(
    "my-form-key", // Unique storage key
    {
      name: "",
      email: "",
      message: "",
    }
  );

  // Update form data
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  // Clear all data
  const handleSubmit = () => {
    // ... submit logic
    clearFormData(); // Clear after successful submission
  };

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      {/* ... other fields */}
    </form>
  );
}
```

### With React Hook Form

```jsx
"use client";

import { useForm } from "react-hook-form";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { useEffect } from "react";

export default function MyFormPage() {
  const [persistedData, updatePersistedData, clearPersistedData] = useFormPersistence(
    "my-form-key",
    { name: "", email: "" }
  );

  const { register, watch, setValue, reset } = useForm({
    defaultValues: persistedData,
  });

  const name = watch("name");
  const email = watch("email");

  // Save to persistence on change
  useEffect(() => {
    updatePersistedData({ name, email });
  }, [name, email, updatePersistedData]);

  const handleSubmit = () => {
    // ... submit logic
    clearPersistedData();
    reset();
  };

  return (
    <form>
      <input {...register("name")} />
      <input {...register("email")} />
    </form>
  );
}
```

---

## Approach 2: FormContext Provider

### Setup Provider

Wrap your app or layout with `FormProvider`:

```jsx
// app/(main)/layout.js
import { FormProvider } from "@/contexts/form-context";

export default function MainLayout({ children }) {
  return (
    <FormProvider storageKey="my-app-form-state">
      {children}
    </FormProvider>
  );
}
```

### Use in Pages

```jsx
"use client";

import { useFormContext } from "@/contexts/form-context";
import { useEffect } from "react";

export default function Page1() {
  const { formData, updateFormData, getFieldValue } = useFormContext();

  const handleChange = (field, value) => {
    updateFormData(field, value);
  };

  return (
    <div>
      <input
        value={getFieldValue("name", "")}
        onChange={(e) => handleChange("name", e.target.value)}
      />
    </div>
  );
}

// Page 2 - Same context, different page
export default function Page2() {
  const { formData, clearFormData } = useFormContext();

  // Access data from Page1
  const name = formData.name;

  const handleSubmit = () => {
    // ... submit
    clearFormData();
  };

  return <div>Hello {name}</div>;
}
```

---

## Features

### ✅ Automatic Persistence
- Data saves automatically on every change
- Data restores automatically on page load
- Works across page refreshes

### ✅ Cross-Page Navigation
- Data persists when using `Link` or `router.push()`
- Works with browser back/forward buttons
- Survives page reloads

### ✅ Easy Cleanup
- `clearFormData()` removes all stored data
- Call after successful submission
- Or provide a "Clear Form" button

---

## Best Practices

1. **Use unique storage keys** to avoid conflicts:
   ```jsx
   useFormPersistence("split-expense-form", ...)
   useFormPersistence("transaction-form", ...)
   ```

2. **Clear data after submission**:
   ```jsx
   const handleSubmit = async (data) => {
     await submitForm(data);
     clearFormData(); // Clear after success
   };
   ```

3. **Merge with default values** to handle new fields:
   ```jsx
   const [data, updateData] = useFormPersistence("key", {
     field1: "",
     field2: "", // New fields automatically added
   });
   ```

4. **Use Context for multi-page flows**:
   - Dashboard → Form Page 1 → Form Page 2
   - All pages share the same form state

5. **Use Hook for single pages**:
   - Simple, no provider setup needed
   - Perfect for individual forms

---

## Example: Split Expense Page

See `app/(main)/split/page.jsx` for a complete implementation example.

Key points:
- Uses `useFormPersistence` hook
- Persists all form fields and participants
- Auto-saves on every change
- Auto-restores on page load
- "Clear Form" button for manual reset
