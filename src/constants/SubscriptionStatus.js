// Constants as frozen object for immutability
const SubscriptionStatus = Object.freeze({
  DRAFT: 0,
  ACTIVE: 1,
  COMPLETED: 2,
  CANCELED: 3,
});

// Status names mapping
const SubscriptionStatusNames = {
  [SubscriptionStatus.DRAFT]: "Не оплачен",
  [SubscriptionStatus.ACTIVE]: "Активный", 
  [SubscriptionStatus.COMPLETED]: "Завершен",
  [SubscriptionStatus.CANCELED]: "Отменен",
};

// Status colors for UI (optional)
const SubscriptionStatusColors = {
  [SubscriptionStatus.DRAFT]: "warning",
  [SubscriptionStatus.ACTIVE]: "success",
  [SubscriptionStatus.COMPLETED]: "secondary", 
  [SubscriptionStatus.CANCELED]: "danger",
};

// Helper functions
export function getSubscriptionStatusName(statusId) {
  return SubscriptionStatusNames[statusId] || "Неизвестный статус";
}

export function getSubscriptionStatusColor(statusId) {
  return SubscriptionStatusColors[statusId] || "secondary";
}

export function isActiveStatus(statusId) {
  return statusId === SubscriptionStatus.ACTIVE;
}

export function isDraftStatus(statusId) {
  return statusId === SubscriptionStatus.DRAFT;
}

export function isCompletedStatus(statusId) {
  return statusId === SubscriptionStatus.COMPLETED;
}

export function isCanceledStatus(statusId) {
  return statusId === SubscriptionStatus.CANCELED;
}

// Get all statuses as array (useful for dropdowns)
export function getAllStatuses() {
  return Object.entries(SubscriptionStatusNames).map(([id, name]) => ({
    id: parseInt(id),
    name
  }));
}

export default SubscriptionStatus;