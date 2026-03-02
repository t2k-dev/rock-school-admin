const PaymentType = {
  Cash: 1, // Наличные
  Bill: 2, // Удаленная оплата
  Card: 3, // Карта
};

export const getPaymentTypeName = (paymentType) => {
  switch (paymentType) {
    case PaymentType.Cash:
      return 'Наличные';
    case PaymentType.Bill:
      return 'Удаленная оплата';
    case PaymentType.Card:
      return 'Карта';
    default:
      return 'Неизвестно';
  }
};

export default PaymentType;