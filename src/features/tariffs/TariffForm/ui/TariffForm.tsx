import { withRouter } from "react-router-dom";
import { Loading } from "../../../../components/Loading";
import {
  attendanceLengths,
  attendanceCounts,
  Instruments,
} from "../model/constants";
import { Select } from "../../../../components/ui/Select";
import { Input } from "../../../../components/ui/Input";
import { TariffDates } from "./TariffDates";
import { DisciplineSelect } from "../../../../components/disciplines/DisciplineSelect";
import { useTariffForm } from "../model/useTariffFrom";

const TariffForm = ({ history, type = "New" }) => {
  const {
    formData,
    errors,
    isSaving,
    submitError,
    subscriptionTypeOptions,
    handleInputChange,
    handleCustomChange,
    handleSubmit,
  } = useTariffForm(history, type);

  const isNew = type === "New";

  if (isSaving) return <Loading message="Сохранение..." />;

  return (
    <div className="bg-main-bg py-10 px-4 text-text-main">
      <div className="w-[440px] mx-auto bg-card-bg p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {isNew ? "Новый тариф" : "Редактировать тариф"}
        </h2>

        {submitError && (
          <div className="mb-6 p-4 bg-danger/10 text-danger rounded-xl text-sm border border-danger/20">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <Select
            label="Тип подписки"
            name="subscriptionType"
            value={formData.subscriptionType}
            options={subscriptionTypeOptions}
            onChange={handleCustomChange}
            error={errors.subscriptionType}
          />

          <Select
            label="Количество уроков"
            name="attendanceCount"
            value={formData.attendanceCount}
            options={attendanceCounts}
            onChange={handleCustomChange}
            error={errors.attendanceCount}
          />

          <Select
            label="Длительность урока"
            name="attendanceLength"
            value={formData.attendanceLength}
            options={attendanceLengths}
            onChange={handleCustomChange}
            error={errors.attendanceLength}
          />

          <DisciplineSelect
            label="Дисциплина"
            name="disciplineId"
            value={formData.disciplineId}
            instruments={Instruments}
            onChange={handleCustomChange}
            error={errors.disciplineId}
          />

          <div className="flex justify-between my-2">
            <TariffDates
              label="Дата начала"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              error={errors.startDate}
              isEnd={false}
            />

            <TariffDates
              label="Дата окончания"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              error={errors.endDate}
              isEnd={true}
            />
          </div>

          <Input
            label="Сумма"
            type="number"
            name="amount"
            step="0.01"
            value={formData.amount}
            placeholder="Введите сумму"
            onChange={handleInputChange}
            error={errors.amount}
          />

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-success/40 hover:bg-success/70 text-text-main font-bold py-4 rounded-2xl transition-all active:scale-95 outline-none appearance-none border-none shadow-none"
            >
              {isSaving
                ? "Сохранение..."
                : isNew
                  ? "Создать тариф"
                  : "Сохранить изменения"}
            </button>

            <button
              type="button"
              onClick={() => history.goBack()}
              className="w-full bg-transparent hover:bg-inner-bg text-text-muted py-3 rounded-2xl transition-all outline-none appearance-none border-none shadow-none"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withRouter(TariffForm);
