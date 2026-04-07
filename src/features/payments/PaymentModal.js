import { Banknote, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { FormLabel } from "../../components/ui/FormLabel";
import { Input } from "../../components/ui/Input";
import { CloseButton } from "../../components/ui/Modals/CloseButton";
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
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
            <CreditCard size={30} className="text-success mt-2" />
            <h2 id="payment-modal-title" className="mt-2 text-[24px] font-semibold text-text-main">
              Оплата абонемента
            </h2>
          <CloseButton onClick={onHide} />
        </div>

        <div className="p-8">
          <div className="mb-4 p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-muted">К оплате</span>
              <span className="text-xl font-bold text-success">
                {toMoneyString(subscription.amountOutstanding)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <FormLabel className="block">
                Способ оплаты
              </FormLabel>
              <select
                name="paymentType"
                className="w-full rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[16px] text-text-main outline-none transition focus:border-white/20 focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
                value={formData.paymentType}
                onChange={handleInputChange}
              >
                <option value={1}>Наличные</option>
                <option value={2}>Карта / Удаленно</option>
              </select>
            </div>

            <div>
              <FormLabel className="block">
                Вносимая сумма
              </FormLabel>
              <div className="relative">
                <Input
                  name="amount"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-accent text-white py-4 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Обработка..." : "Подтвердить оплату"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
