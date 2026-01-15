import React from "react";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getDisciplineName } from "../../../constants/disciplines";
import { calculateAge } from "../../../utils/dateTime";
import { Avatar } from "../../shared/Avatar";
import { DisciplineGridSelector } from "../../shared/discipline/DisciplineGridSelector";
import { DisciplineIcon } from "../../shared/discipline/DisciplineIcon";

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

  renderStudent = (student, index) => {
    const age = calculateAge(student.birthDate);
    const { onDeleteStudent } = this.props;
    
    return (
      <Card key={index} className="mb-2">
        <Card.Body className="py-2">
          <Row className="align-items-center">
            <Col md="1">
              <Avatar style={{ width: "30px", height: "30px" }} />
            </Col>
            <Col md="9">
              <div style={{marginLeft: "10px"}}>
                <strong>
                  <Link to={`/student/${student.studentId}`}>
                    {student.firstName} {student.lastName}
                  </Link>
                </strong>
                <div className="text-muted small">
                  {age} лет • {" "}
                  <span 
                    className="text-muted"
                    style={{ cursor: 'pointer'}}
                    onClick={() => this.handleShowRoleModal(index)}
                  >
                    {student.roleId 
                        ? <>
                            <span style={{ marginRight: "5px" }}>{getDisciplineName(student.roleId)}</span>
                            <DisciplineIcon disciplineId={student.roleId} size="20px"/> 
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
    const { students, onAddStudent } = this.props;
    const { showRoleModal, selectedStudentIndex } = this.state;

    return (
      <div className="mt-2">
        {students.length > 0 ? (
          <div className="mb-3">
            {students.map((student, index) => this.renderStudent(student, index))}
          </div>
        ) : (
          <div className="text-center py-4 mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
            <p className="text-muted mb-0">Ученики не добавлены</p>
          </div>
        )}
        
        <div className="text-end">
          <Button 
              variant="outline-success" 
              size="sm"
              onClick={onAddStudent}
          >
              + Добавить ученика
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
                  ? students[selectedStudentIndex]?.roleId 
                  : null
              }
              onDisciplineChange={this.handleRoleSelect}
              multiSelect={false}
            />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}