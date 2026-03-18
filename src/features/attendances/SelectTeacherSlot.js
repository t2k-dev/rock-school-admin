import { Button } from "react-bootstrap";

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

      <div className="text-center">

        
          <Button
            variant="outline-secondary"
            onClick={onShowAvailableSlotsModal}
            size="md"
          >
            Доступные окна...
          </Button>
          <Button
            title="Следующее по расписанию"
            variant="outline-secondary"
            type="null"
            size="md"
            onClick={onGetNextAvailableSlot}
            disabled={false}
          >
            {">>"}
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
