import React from "react";
import { Modal } from "react-bootstrap";
import { DisciplineGridSelector } from "../discipline/DisciplineGridSelector";

export class DisciplineSelectionModal extends React.Component {
  render() {
    const { show, onHide, selectedDisciplineId, onDisciplineChange } = this.props;

    return (
      <Modal 
        show={show} 
        onHide={onHide}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Выберите направление</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DisciplineGridSelector
            selectedDisciplineId={selectedDisciplineId}
            onDisciplineChange={onDisciplineChange}
          />
        </Modal.Body>
      </Modal>
    );
  }
}