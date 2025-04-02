export function getSubscriptionStatusName(statusId) {
    const subscriptionStatusRu = [
      { id: 0, name: "Драфт" },
      { id: 1, name: "Активный" },
      { id: 2, name: "Завершенный" },
      { id: 3, name: "Отмененный" },
    ];
  
    return subscriptionStatusRu.find((status) => status.id === statusId).name;
  }