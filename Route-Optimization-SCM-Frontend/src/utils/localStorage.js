export const managerStorage = {
  save: (planId, selectedPlan) => {
    try {
      const existingData = JSON.parse(localStorage.getItem("manager") || "{}");

      // Format the delivery plan based on the selected plan's data
      const formattedDeliveryPlan = {
        title: selectedPlan.title,
        algorithm: selectedPlan.algorithm,
        totalRoutes: selectedPlan.data.totalRoutes,
        totalAmount: selectedPlan.data.totalAmount,
        routes: selectedPlan.data.routes.map((route, index) => ({
          routeNumber: `Route ${index + 1}`,
          routeId: route.id,
          vehicle: route.vehicle,
          weight: route.weight,
          from: route.from,
          to: route.to,
          travelDistance: route.travel_kms,
          travelTime: route.travel_hours,
          fuel_cost: route.fuel_cost,
          goods_cost: route.goods_cost,
          total_cost: route.total_cost,
        })),
      };

      existingData[planId] = {
        savedAt: new Date().toISOString(),
        deliveryPlan: formattedDeliveryPlan,
      };

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

  remove: (planId) => {
    try {
      const data = JSON.parse(localStorage.getItem("manager") || "{}");
      delete data[planId];
      localStorage.setItem("manager", JSON.stringify(data));
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem("manager");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};
