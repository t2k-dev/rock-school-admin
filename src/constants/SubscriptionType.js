// Constants as frozen object for immutability
const SubscriptionType = Object.freeze({
  LESSON: 0,
  TRIAL_LESSON: 1,
  GROUP_LESSON: 2,
  RENT: 3,
  REHEARSAL: 4,
});

// Status names mapping
const SubscriptionTypeNames = {
  [SubscriptionType.LESSON]: "Урок",
  [SubscriptionType.TRIAL_LESSON]: "Пробный урок",
  [SubscriptionType.GROUP_LESSON]: "Групповой урок",
  [SubscriptionType.RENT]: "Аренда",
  [SubscriptionType.REHEARSAL]: "Репетиция",
};

// Helper functions
export function getSubscriptionTypeName(typeId) {
  return SubscriptionTypeNames[typeId] || "Неизвестный тип";
}

export default SubscriptionType;