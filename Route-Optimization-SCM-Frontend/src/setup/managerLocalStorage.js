export const managerStorage = {
  save: (planId, deliveryPlan) => {
    try {
      // Get existing data
      const existingData = JSON.parse(localStorage.getItem("manager") || "{}");

      // Add/Update plan
      existingData[planId] = {
        savedAt: new Date().toISOString(),
        deliveryPlan,
      };

      // Save back to localStorage
      localStorage.setItem("manager", JSON.stringify(existingData));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  get: (planId) => {
    try {
      const data = JSON.parse(localStorage.getItem("manager") || "{}");
      return data[planId]?.deliveryPlan || null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  getAll: () => {
    try {
      return JSON.parse(localStorage.getItem("manager") || "{}");
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return {};
    }
  },
};
