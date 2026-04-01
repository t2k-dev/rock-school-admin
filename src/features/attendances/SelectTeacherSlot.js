import { Button } from "../../components/ui";

import { AvailableTeachersModal } from "./AvailableTeachersModal";

export function SelectTeacherSlot({
  teacher,
  availableTeachers,
  showAvailableTeacherModal,
  selectedSlot,
  attendance,
  onShowAvailableSlotsModal,
  onCloseModal,
  onSlotsChange,
  onGetNextAvailableSlot,
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          onClick={onShowAvailableSlotsModal}
          className="justify-center sm:min-w-[190px]"
        >
          Доступные окна
        </Button>
        <Button
          title="Следующее по расписанию"
          type="button"
          onClick={onGetNextAvailableSlot}
          disabled={false}
          className="justify-center sm:min-w-[150px]"
        >
          Ближайший слот
        </Button>
      </div>

      <AvailableTeachersModal
        show={showAvailableTeacherModal}
        singleSelection={true}
        teachers={availableTeachers}
        onSlotsChange={onSlotsChange}
        onClose={onCloseModal}
        slotDuration={Math.floor(
          (new Date(attendance?.endDate) - new Date(attendance?.startDate)) / 60000
        )}
      />
    </>
  );
}
