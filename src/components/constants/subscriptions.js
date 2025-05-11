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
      { id: 0, name: "Создан" },
      { id: 1, name: "Ожидает решения" },
      { id: 2, name: "Отказ" },
      { id: 3, name: "Оформился" },
    ];
  
    return subscriptionStatusRu.find((status) => status.id === statusId).name;
  }