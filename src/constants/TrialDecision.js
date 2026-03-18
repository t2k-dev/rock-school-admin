// Constants as frozen object for immutability
const TrialDecision = Object.freeze({
  POSITIVE: 1,
  NEGATIVE: 2,
  MISSED: 3,
});

// Status names mapping
const TrialDecisionNames = {
  [TrialDecision.NEGATIVE]: "Отказался",
  [TrialDecision.POSITIVE]: "Продолжил",
  [TrialDecision.MISSED]: "Пропущено",
};

// Status colors for UI (optional)
const TrialDecisionColors = {
  [TrialDecision.NEGATIVE]: "danger",
  [TrialDecision.POSITIVE]: "success",
  [TrialDecision.MISSED]: "secondary",
};

// Helper functions
export function getTrialDecisionName(statusId) {
  if (statusId === null) {
    return "Не принято";
  }
  return TrialDecisionNames[statusId] || "Неизвестный статус";
}

export function getTrialDecisionColor(statusId) {
  if (statusId === null) {
    return "secondary";
  }
  return TrialDecisionColors[statusId] || "secondary";
}

export default TrialDecision;