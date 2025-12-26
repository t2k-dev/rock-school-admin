import SubscriptionTrialStatus from "./SubscriptionTrialStatus";

export function getSubscriptionStatusName(statusId) {
    const subscriptionStatusRu = [
      { id: 0, name: "Драфт" },
      { id: 1, name: "Активный" },
      { id: 2, name: "Завершенный" },
      { id: 3, name: "Отмененный" },
    ];
  
    return subscriptionStatusRu.find((status) => status.id === statusId).name;
  }

export function getTrialSubscriptionStatusName(statusId) {
    if (statusId === null){
      return "none";
    }
    const subscriptionStatusRu = [
      { id: SubscriptionTrialStatus.CREATED, name: "Создано" },
      { id: SubscriptionTrialStatus.PENDINGFEEDBACK, name: "Ожидает решения" },
      { id: SubscriptionTrialStatus.NEGATIVE, name: "Отказ" },
      { id: SubscriptionTrialStatus.POSITIVE, name: "Продолжил" },
    ];
  
    return subscriptionStatusRu.find((status) => status.id === statusId).name;
  }