import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, EditIcon, GroupIcon } from "../../components/icons";
import { generateAttendances } from "../../services/apiBandService";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";

export const BandScreenCard = ({ band, onActivateToggle, onEditSchedules }) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleActivateToggle = async () => {
    try {
      setIsActivating(true);
      if (onActivateToggle) {
        await onActivateToggle(band);
      }
    } catch (error) {
      console.error("Failed to toggle band status:", error);
    } finally {
      setIsActivating(false);
    }
  };

  const handleGenerateAttendances = async () => {
    try {
      setIsGenerating(true);
      await generateAttendances(band.bandId);
    } catch (error) {
      console.error("Failed to generate attendances:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const { name, teacher, isActive } = band;

  return (
    <div className="mb-4">
      <Container className="p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-[160px] h-[100px] flex items-center justify-center bg-inner-bg rounded-2xl">
              <GroupIcon size="100px" color="var(--text-main)" />
            </div>
          </div>

          <div className="flex-grow flex flex-col md:flex-row gap-6">
            <div className="flex-1 mt-4">
              <div className="flex items-center gap-2 text-[24px] font-bold text-text-main">
                {name}
                <EditIcon />
              </div>
            </div>

            <div className="flex-1">
              {teacher && (
                <div className="mt-3">
                  <div className="text-text-muted text-sm mb-1">Куратор</div>
                  <Link
                    to={`/teacher/${teacher.teacherId}`}
                    className="text-accent hover:underline transition-all"
                  >
                    {teacher.firstName} {teacher.lastName}
                  </Link>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex justify-end">
              <div className="flex flex-col gap-2 w-[200px]">
                <Button
                  variant="secondary"
                  className="bg-warning/10 border border-warning/40 text-warning hover:bg-warning/20"
                  onClick={handleGenerateAttendances}
                  disabled={isGenerating}
                  size="sm"
                >
                  {isGenerating ? "Создание..." : "Пересоздать слоты"}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => onEditSchedules && onEditSchedules(band)}
                  size="sm"
                  className="gap-2"
                >
                  <CalendarIcon color="white" />
                  Расписание
                </Button>

                <Button
                  variant={isActive ? "outlineDanger" : "success"}
                  onClick={handleActivateToggle}
                  disabled={isActivating}
                  size="sm"
                >
                  {isActivating
                    ? isActive
                      ? "Отключение..."
                      : "Включение..."
                    : isActive
                      ? "Отключить"
                      : "Включить"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
