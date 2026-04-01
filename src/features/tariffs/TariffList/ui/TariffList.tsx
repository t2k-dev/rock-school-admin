import { Link } from "react-router-dom";
import { Loading } from "../../../../components/Loading";
import { NoRecords } from "../../../../components/NoRecords";
import { getDisciplineName } from "../../../../constants/disciplines";
import { getSubscriptionTypeName } from "../../../../constants/SubscriptionType";
import { useTariffList } from "../model/useTariffList";
import { Sorting } from "./Sorting";

export const TariffList = () => {
  const {
    handleDelete,
    formatDate,
    isLoading,
    tariffs,
    handleSorting,
    sortByMarker,
  } = useTariffList();

  if (isLoading) {
    return <Loading message="Загрузка тарифов..." />;
  }

  return (
    <div className="w-full min-h-screen p-8 md:p-16 text-text-main font-sans bg-main-bg">
      <h1 className="text-3xl font-bold mb-8 ml-2">Список тарифов</h1>

      <div className="bg-card-bg p-4 rounded-t-2xl flex flex-col md:flex-row items-center gap-4">
        <div className="px-4 py-3 rounded-2xl flex justify-between w-full bg-main-bg">
          <Sorting handleSorting={handleSorting} sortByMarker={sortByMarker} />

          <Link
            to="/tariffForm"
            className="w-full md:w-auto bg-success/40 text-text-main hover:bg-success/70 px-6 py-2.5 rounded-xl 
          text-sm font-semibold transition-colors 
          flex items-center justify-center gap-2"
          >
            <span>+ Добавить тариф</span>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-b-2xl border-x border-b border-input-bg">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-card-bg text-text-muted text-[13px] uppercase tracking-wider font-semibold">
              <th className="py-4 px-1.5 border-r border-secondary/20 w-[15%]">
                Период
              </th>
              <th className="py-4 px-1.5 border-r border-secondary/20 w-[12%]">
                Тип
              </th>
              <th className="py-4 px-1.5 border-r border-secondary/20">
                Дисциплина
              </th>
              <th className="py-4 px-1.5 border-r border-secondary/20 w-[10%]">
                Занятий
              </th>
              <th className="py-4 px-1.5 border-r border-secondary/20 w-[15%]">
                Длительность
              </th>
              <th className="py-4 px-1.5 border-r border-secondary/20 w-[12%]">
                Сумма
              </th>
              <th className="py-4 px-1.5 w-[12%]">Действия</th>
            </tr>
          </thead>
          <tbody>
            {tariffs.length === 0 ? (
              <tr>
                <td colSpan={7} className="bg-card-bg py-10">
                  <NoRecords />
                </td>
              </tr>
            ) : (
              tariffs.map((tariff, idx) => (
                <tr
                  key={tariff.tariffId}
                  className={`${
                    idx % 2 === 0 ? "bg-inner-bg" : "bg-card-bg"
                  } text-text-main text-sm hover:bg-accent/40 transition-colors`}
                >
                  <td className="py-4 px-1.5 border-r border-secondary/20">
                    {formatDate(tariff.startDate)} -{" "}
                    {formatDate(tariff.endDate)}
                  </td>
                  <td className="py-4 px-1.5 border-r border-secondary/20">
                    {getSubscriptionTypeName(tariff.subscriptionType)}
                  </td>
                  <td className="py-4 px-1.5 border-r border-secondary/20">
                    {tariff.disciplineId
                      ? getDisciplineName(tariff.disciplineId)
                      : "Любая"}
                  </td>
                  <td className="py-4 px-1.5 border-r border-secondary/20">
                    {tariff.attendanceCount}
                  </td>
                  <td className="py-4 px-1.5 border-r border-secondary/20">
                    {tariff.attendanceLength} мин
                  </td>
                  <td className="py-4 px-1.5 border-r border-secondary/20 font-semibold">
                    {Number(tariff.amount).toLocaleString()} тг
                  </td>
                  <td className="py-4 px-1.5">
                    <button
                      onClick={() => handleDelete(tariff.tariffId)}
                      className="bg-danger/40 text-text-main hover:bg-danger/70 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{ border: "none" }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TariffList;
