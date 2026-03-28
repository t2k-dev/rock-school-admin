import { useState } from "react";
import { format } from "date-fns";
import { createTariff } from "../../../../services/apiTariffService";
import SubscriptionType, {
  getSubscriptionTypeName,
} from "../../../../constants/SubscriptionType";

interface newErrors {
  amount?: string;
  startDate?: string;
  endDate?: string;
  attendanceLength?: string;
  attendanceCount?: string;
  subscriptionType?: string;
  disciplineId?: string;
}

export const useTariffForm = (history: any, type: string) => {
  const [formData, setFormData] = useState({
    tariffId: "",
    amount: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    disciplineId: [],
    attendanceLength: "",
    attendanceCount: "",
    subscriptionType: "",
  });

  const [errors, setErrors] = useState<newErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subscriptionTypeOptions = Object.keys(SubscriptionType).map((key) => ({
    value: SubscriptionType[key].toString(),
    label: getSubscriptionTypeName(SubscriptionType[key]),
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof newErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCustomChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Array.isArray(value) ? value : value.toString(),
    }));
    if (errors[name as keyof newErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Сумма должна быть больше 0";
    if (!formData.startDate) newErrors.startDate = "Дата начала обязательна";
    if (!formData.endDate) newErrors.endDate = "Дата окончания обязательна";
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = "Дата окончания должна быть позже даты начала";
    }
    if (!formData.attendanceLength)
      newErrors.attendanceLength = "Длительность обязательна";
    if (!formData.attendanceCount)
      newErrors.attendanceCount = "Количество обязательно";
    if (!formData.subscriptionType)
      newErrors.subscriptionType = "Тип подписки обязателен";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setSubmitError("");

    try {
      const tariffData = {
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        disciplineIds: formData.disciplineId.map((id: any) => parseInt(id)),
        attendanceLength: parseInt(formData.attendanceLength),
        attendanceCount: parseInt(formData.attendanceCount),
        subscriptionType: parseInt(formData.subscriptionType),
      };

      await createTariff(tariffData);
      history.push("/tariffList");
    } catch (error: any) {
      setSubmitError(error.message || "Ошибка при создании тарифа");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData,
    errors,
    isSaving,
    submitError,
    subscriptionTypeOptions,
    handleInputChange,
    handleCustomChange,
    handleSubmit,
  };
};
