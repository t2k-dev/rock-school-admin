const TenderType = {
  Cash: 1, // Наличные
  Bill: 2, // Удаленная оплата
  Card: 3, // Карта
};

export const getTenderTypeName = (tenderType) => {
  switch (tenderType) {
    case TenderType.Cash:
      return 'Наличные';
    case TenderType.Bill:
      return 'Удаленная оплата';
    case TenderType.Card:
      return 'Карта';
    default:
      return 'Неизвестно';
  }
};

export default TenderType;