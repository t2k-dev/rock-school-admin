import { Button } from "../../components/ui";

import { AvailableSlotsModal } from "./AvailableSlotsModal";

export function SelectRoomSlot({
  rooms,
  showAvailableSlotsModal,
  attendance,
  onShowAvailableSlotsModal,
  onCloseModal,
  onSlotsChange,
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="ghost"
          onClick={onShowAvailableSlotsModal}
          className="justify-center sm:min-w-[190px]"
        >
          Доступные окна
        </Button>
      </div>

      <AvailableSlotsModal
        show={showAvailableSlotsModal}
        rooms={rooms}
        onSlotsChange={onSlotsChange}
        onClose={onCloseModal}
        singleSelection={true}
      />
    </>
  );
}
