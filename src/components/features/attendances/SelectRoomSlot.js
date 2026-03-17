import { Button } from "react-bootstrap";

import { AvailableSlotsModal } from "../../shared/modals/AvailableSlotsModal";

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
      <div className="text-center">
        <Button
          variant="outline-secondary"
          onClick={onShowAvailableSlotsModal}
          size="md"
        >
          Доступные окна...
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
