import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, CreditCard, User, BookOpen, Banknote } from "lucide-react";
import { getDisciplineName } from "../../constants/disciplines";
import { pay } from "../../services/apiSubscriptionService";
import DateTimeHelper from "../../utils/DateTimeHelper";
import { toMoneyString } from "../../utils/moneyUtils";

const PaymentModal = ({
  show,
  onHide,
  subscription,
  onPaymentSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    paidOn: DateTimeHelper.getCurrentDateTime(),
    paymentType: 1,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // КРИТИЧЕСКИЙ ФИКС: обновление данных формы при смене подписки
  useEffect(() => {
    if (show && subscription) {
      setFormData({
        amount: subscription.amountOutstanding || "",
        paidOn: DateTimeHelper.getCurrentDateTime(),
        paymentType: 1,
      });
      setErrors({});
      setSubmitError("");
    }
  }, [show, subscription]);

  if (!show || !subscription) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setErrors({ amount: "Введите корректную сумму" });
      return;
    }

    try {
      const paymentData = {
        subscriptionId: subscription.subscriptionId,
        amount: parseFloat(formData.amount),
        paidOn: formData.paidOn,
        paymentType: parseInt(formData.paymentType),
      };

      await pay(subscription.subscriptionId, paymentData);
      onPaymentSubmit({ ...paymentData, success: true });
      onHide();
    } catch (error) {
      setSubmitError(error.message || "Ошибка при обработке платежа");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-main-bg/60 backdrop-blur-sm">
      <div className="w-full max-w-[500px] bg-card-bg rounded-[32px] shadow-2xl border border-secondary/20 flex flex-col overflow-hidden text-text-main">
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-secondary/10 bg-inner-bg/30">
          <div className="flex items-center gap-3">
            <CreditCard size={22} className="text-success" />
            <h2 className="text-[20px] font-bold">Оплата абонемента</h2>
          </div>
          <button
            onClick={onHide}
            className="p-2 hover:bg-inner-bg rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6 p-5 bg-inner-bg/50 rounded-[24px] border border-secondary/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-muted text-sm">К оплате:</span>
              <span className="text-xl font-bold text-success">
                {toMoneyString(subscription.amountOutstanding)}
              </span>
            </div>
            <div className="text-sm text-text-muted">
              {getDisciplineName(subscription.disciplineId)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[12px] font-bold uppercase mb-2 ml-1 opacity-60">
                Сумма
              </label>
              <div className="relative">
                <input
                  name="amount"
                  type="number"
                  className="w-full bg-inner-bg border border-secondary/20 rounded-2xl py-3 px-4 outline-none focus:border-accent"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
                <Banknote
                  className="absolute right-4 top-3.5 opacity-20"
                  size={20}
                />
              </div>
              {errors.amount && (
                <span className="text-danger text-xs mt-1">
                  {errors.amount}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-bold uppercase mb-2 ml-1 opacity-60">
                Способ оплаты
              </label>
              <select
                name="paymentType"
                className="w-full bg-inner-bg border border-secondary/20 rounded-2xl py-3 px-4 outline-none appearance-none"
                value={formData.paymentType}
                onChange={handleInputChange}
              >
                <option value={1}>Наличные</option>
                <option value={2}>Карта / Удаленно</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-accent text-white py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Обработка..." : "Подтвердить оплату"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
