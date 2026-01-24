// Constants as frozen object for immutability
const SubscriptionTrialStatus = Object.freeze({
  CREATED: 0,
  PENDINGFEEDBACK: 1,
  NEGATIVE: 2,
  POSITIVE: 3,
  MISSED: 4,
});

// Status names mapping
const TrialStatusNames = {
  [SubscriptionTrialStatus.CREATED]: "Записался",
  [SubscriptionTrialStatus.PENDINGFEEDBACK]: "Ожидает решения",
  [SubscriptionTrialStatus.NEGATIVE]: "Отказался",
  [SubscriptionTrialStatus.POSITIVE]: "Продолжил",
  [SubscriptionTrialStatus.MISSED]: "Пропущено",
};

// Status colors for UI (optional)
const TrialStatusColors = {
  [SubscriptionTrialStatus.CREATED]: "primary",
  [SubscriptionTrialStatus.PENDINGFEEDBACK]: "warning",
  [SubscriptionTrialStatus.NEGATIVE]: "danger",
  [SubscriptionTrialStatus.POSITIVE]: "success",
  [SubscriptionTrialStatus.MISSED]: "secondary",
};

// Helper functions
export function getTrialSubscriptionStatusName(statusId) {
  if (statusId === null) {
    return "none";
  }
  return TrialStatusNames[statusId] || "Неизвестный статус";
}

export function getTrialStatusColor(statusId) {
  if (statusId === null) {
    return "secondary";
  }
  return TrialStatusColors[statusId] || "secondary";
}

export function isCreatedStatus(statusId) {
  return statusId === SubscriptionTrialStatus.CREATED;
}

export function isPendingFeedbackStatus(statusId) {
  return statusId === SubscriptionTrialStatus.PENDINGFEEDBACK;
}

export function isNegativeStatus(statusId) {
  return statusId === SubscriptionTrialStatus.NEGATIVE;
}

export function isPositiveStatus(statusId) {
  return statusId === SubscriptionTrialStatus.POSITIVE;
}

export function isCompleted(statusId) {
  return statusId === SubscriptionTrialStatus.NEGATIVE || statusId === SubscriptionTrialStatus.POSITIVE;
}

export function isPending(statusId) {
  return statusId === SubscriptionTrialStatus.CREATED || statusId === SubscriptionTrialStatus.PENDINGFEEDBACK;
}

// Get all trial statuses as array (useful for dropdowns)
export function getAllTrialStatuses() {
  return Object.entries(TrialStatusNames).map(([id, name]) => ({
    id: parseInt(id),
    name
  }));
}

export default SubscriptionTrialStatus;