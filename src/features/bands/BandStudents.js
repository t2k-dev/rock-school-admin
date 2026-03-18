import React from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { getDisciplineName } from "../../constants/disciplines";
import { calculateAge } from "../../utils/dateTime";
import { DisciplineGridSelector } from "../disciplines/DisciplineGridSelector";
import { DisciplineIcon } from "../disciplines/DisciplineIcon";

export class BandStudents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRoleModal: false,
      selectedStudentIndex: null,
    };
  }

  handleShowRoleModal = (studentIndex) => {
    this.setState({
      showRoleModal: true,
      selectedStudentIndex: studentIndex,
    });
  };

  handleCloseRoleModal = () => {
    this.setState({
      showRoleModal: false,
      selectedStudentIndex: null,
    });
  };

  handleRoleSelect = (disciplineId) => {
    const { selectedStudentIndex } = this.state;
    const { onRoleChange } = this.props;
    
    if (onRoleChange && selectedStudentIndex !== null) {
      onRoleChange(selectedStudentIndex, disciplineId);
    }
    
    this.handleCloseRoleModal();
  };

  renderStudent = (bandMember, index) => {
    const age = calculateAge(bandMember.birthDate);
    const { onDeleteStudent } = this.props;
    
    return (
      <Card key={index} className="mb-2">
        <Card.Body className="py-2">
          <Row className="align-items-center">
            <Col md="2" className="text-center">
              <Avatar style={{ width: "30px", height: "30px" }} />
            </Col>
            <Col md="8">
              <div>
                <strong>
                  <Link to={`/student/${bandMember.studentId}`}>
                    {bandMember.firstName} {bandMember.lastName}
                  </Link>
                </strong>
                <div className="text-muted small">
                  {age} лет • {" "}
                  <span 
                    className="text-muted"
                    style={{ cursor: 'pointer'}}
                    onClick={() => this.handleShowRoleModal(index)}
                  >
                    {bandMember.bandRoleId 
                        ? <>
                            <span style={{ marginRight: "5px" }}>{getDisciplineName(bandMember.bandRoleId)}</span>
                            <DisciplineIcon disciplineId={bandMember.bandRoleId} size="20px"/> 
                        </> 
                        : "Выбрать роль"}
                  </span>
                </div>
              </div>
            </Col>
            <Col md="2" className="text-end">
              <Button
                variant="outline-danger"
                style={{ fontSize: "10px", marginLeft: "10px", borderRadius: "25px" }}
                onClick={() => onDeleteStudent(index)}
              >
                X
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  render() {
    const { bandMembers, onAddStudent, showLabel = false } = this.props;
    const { showRoleModal, selectedStudentIndex } = this.state;

    return (
      <>
      {showLabel && <strong>Участники</strong>}
      <div className="mt-2">
        {bandMembers.length > 0 ? (
          <div className="mb-3">
            {bandMembers.map((bandMember, index) => this.renderStudent(bandMember, index))}
          </div>
        ) : (
          <div className="text-center py-2 mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
            <p className="text-muted mb-0">Ученики не добавлены</p>
          </div>
        )}
        
        <div className="text-center">
          <Button 
              variant="outline-success" 
              size="sm"
              onClick={onAddStudent}
          >
              + Добавить
          </Button>
        </div>

        {/* Role Selection Modal */}
        <Modal show={showRoleModal} onHide={this.handleCloseRoleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Выберите роль ученика</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DisciplineGridSelector
              selectedDisciplineId={
                selectedStudentIndex !== null 
                  ? bandMembers[selectedStudentIndex]?.roleId 
                  : null
              }
              onDisciplineChange={this.handleRoleSelect}
              multiSelect={false}
            />
          </Modal.Body>
        </Modal>
      </div>
      </>
    );
  }
}