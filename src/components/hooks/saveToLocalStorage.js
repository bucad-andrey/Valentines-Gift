// ------------------------------
// localStorage Helper Utilities
// ------------------------------

// Base key for your app storage
const STORAGE_KEY = "app_data";

// ----------------------------------
// Draft localStorage Helper
// ----------------------------------

const DRAFT_KEY = "sharePage_draft";
const INVITE_DRAFT_KEY = "invitePage_draft";

// ------------------------------
// Load saved draft
// ------------------------------
export const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to load draft:", err);
    return null;
  }
};

// ------------------------------
// Save draft
// ------------------------------
export const saveDraft = (data) => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save draft:", err);
  }
};

// ------------------------------
// Clear saved draft
// ------------------------------
export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.error("Failed to clear draft:", err);
  }
};

// ------------------------------
// InvitePage draft localStorage Helper
// ------------------------------
export const loadInviteDraft = () => {
  try {
    const raw = localStorage.getItem(INVITE_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to load invite draft:", err);
    return null;
  }
};

export const saveInviteDraft = (data) => {
  try {
    localStorage.setItem(INVITE_DRAFT_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save invite draft:", err);
  }
};

export const clearInviteDraft = () => {
  try {
    localStorage.removeItem(INVITE_DRAFT_KEY);
  } catch (err) {
    console.error("Failed to clear invite draft:", err);
  }
};



// ------------------------------
// Get full stored object
// ------------------------------
export const getLocalData = () => {
  try {
    // Retrieve raw data from localStorage
    const raw = localStorage.getItem(STORAGE_KEY);

    // If nothing stored yet, return empty object
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("localStorage get error:", err);
    return {};
  }
};


// ------------------------------
// Save full object
// ------------------------------
export const setLocalData = (data) => {
  try {
    // Convert object → JSON string → save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("localStorage set error:", err);
  }
};


// ------------------------------
// Update partial fields safely
// ------------------------------
// This allows merging new data without overwriting old ones
export const updateLocalData = (partialData) => {
  try {
    // Get current stored data
    const current = getLocalData();

    // Merge old + new
    const updated = {
      ...current,
      ...partialData
    };

    // Save merged result
    setLocalData(updated);

    return updated;
  } catch (err) {
    console.error("localStorage update error:", err);
  }
};


// ------------------------------
// Remove a single key
// ------------------------------
export const removeLocalKey = (key) => {
  try {
    const current = getLocalData();
    delete current[key];
    setLocalData(current);
  } catch (err) {
    console.error("localStorage remove key error:", err);
  }
};


// ------------------------------
// Clear all app local storage
// ------------------------------
export const clearLocalData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("localStorage clear error:", err);
  }
};
