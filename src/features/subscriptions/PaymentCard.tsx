import React from "react";
import { CalendarIcon } from "../../components/icons";
import { HoverCard } from "../../components/ui/HoverCard";
import { getPaymentTypeName } from "../../constants/PaymentType";
import { formatDateWithLetters } from "../../utils/dateTime";
import { toMoneyString } from "../../utils/moneyUtils";

interface Payment {
  isPaid?: boolean;
  isOverdue?: boolean;
  amount: number;
  paymentType: number;
  paidOn: string;
  comment?: string;
}

interface PaymentCardProps {
  payment: Payment;
  index: number;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => {
  const getStatusBadge = () => {
    let colors = "bg-amber-100 text-amber-700";
    let statusText = "Не оплачено";

    if (payment.isPaid) {
      colors = "bg-green-100 text-green-700";
      statusText = "Оплачено";
    } else if (payment.isOverdue) {
      colors = "bg-red-100 text-red-700";
      statusText = "Просрочено";
    }

    return (
      <div
        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors}`}
      >
        {statusText}
      </div>
    );
  };

  return (
    <HoverCard className="mb-3 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-[140px]">
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-0.5">
            <CalendarIcon size="14px" />
            <span>Дата</span>
          </div>
          <div className="font-bold text-gray-800">
            {formatDateWithLetters(payment.paidOn)}
          </div>
        </div>

        <div className="min-w-[100px]">
          <div className="text-sm text-gray-500 mb-0.5">Сумма</div>
          <div className="font-bold text-gray-800 text-lg">
            {toMoneyString(payment.amount)}
          </div>
        </div>

        <div className="min-w-[120px]">
          <div className="text-sm text-gray-500 mb-0.5">Тип</div>
          <div className="font-medium text-gray-700">
            {getPaymentTypeName(payment.paymentType)}
          </div>
        </div>

        <div className="flex-1 min-w-0 md:max-w-[200px]">
          <div className="text-sm text-gray-500 mb-0.5">Комментарий</div>
          <div
            className="truncate font-medium text-gray-600"
            title={payment.comment || ""}
          >
            {payment.comment || <span className="text-gray-300">—</span>}
          </div>
        </div>

        <div className="flex md:justify-end min-w-[100px]">
          {getStatusBadge()}
        </div>
      </div>
    </HoverCard>
  );
};

export default PaymentCard;
