import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  deleteTariff,
  getTariffs,
} from "../../../../services/apiTariffService";

export const useTariffList = () => {
  const [tariffs, setTariffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortByMarker, setSortByMarker] = useState("");
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    loadTariffs();
  }, []);

  const loadTariffs = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getTariffs();
      setTariffs(data || []);
      setOriginalData(data || []);
    } catch (error) {
      console.error("Error loading tariffs:", error);
      setError("Ошибка при загрузке тарифов");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот тариф?")) {
      try {
        await deleteTariff(id);
        setTariffs((prev) => prev.filter((tariff) => tariff.tariffId !== id));
      } catch (error) {
        console.error("Error deleting tariff:", error);
        setError("Ошибка при удалении тарифа");
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy");
    } catch {
      return dateString;
    }
  };

  const handleSorting = (sortBy: string) => {
    if (sortBy === "none") {
      setTariffs([...originalData]);
      setSortByMarker("");
    } else {
      setTariffs(
        [...tariffs].sort((a, b) => {
          return b[sortBy] - a[sortBy];
        }),
      );
      setSortByMarker(sortBy);
    }
  };

  return {
    loadTariffs,
    handleDelete,
    formatDate,
    isLoading,
    tariffs,
    handleSorting,
    sortByMarker,
  };
};
