import React from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { activateBand, addBandStudent, deactivateBand, getBandScreenDetails, removeBandStudent, updateBandStudentRole } from "../../../services/apiBandService";
import { NoRecords } from "../../shared/NoRecords";
import { AddStudentModal } from "../students/AddStudentModal";
import { BandScreenCard } from "./BandScreenCard";
import { BandStudents } from "./BandStudents";

const ERROR_MESSAGES = {
  LOAD_FAILED: "Не удалось загрузить данные группы",
  NO_BAND_ID: "Не указан ID группы",
  ACTIVATION_FAILED: "Не удалось изменить статус группы",
};

export class BandScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bandId: this.props.match?.params?.id,
      band: null,
      isLoading: true,
      isActivating: false,
      showAddStudentModal: false,
      error: null,
    };
  }

  componentDidMount() {
    this.loadBandData();
  }

  async loadBandData() {
    const { bandId } = this.state;

    if (!bandId) {
      this.setState({
        error: ERROR_MESSAGES.NO_BAND_ID,
        isLoading: false,
      });
      return;
    }

    try {
      this.setState({ isLoading: true, error: null });
      
      const bandData = await getBandScreenDetails(bandId);
      
      this.setState({
        band: bandData.band,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load band data:", error);
      this.setState({
        error: ERROR_MESSAGES.LOAD_FAILED,
        isLoading: false,
      });
    }
  }

  handleActivateToggle = async () => {
    const { bandId, band } = this.state;
    
    try {
      this.setState({ isActivating: true });
      
      if (band.isActive) {
        await deactivateBand(bandId);
      } else {
        await activateBand(bandId);
      }
      
      // Reload data to get updated status
      await this.loadBandData();
    } catch (error) {
      console.error("Failed to toggle band status:", error);
      this.setState({
        error: ERROR_MESSAGES.ACTIVATION_FAILED,
        isActivating: false,
      });
    }
  };

  showAddStudentModal = (e) => {
    e.preventDefault();
    this.setState({ showAddStudentModal: true });
  };

  handleCloseAddStudentModal = () => {
    this.setState({ showAddStudentModal: false });
  };

  handleAddStudent = async (student) => {
    const { bandId } = this.state;
    try {
      const response = await addBandStudent(bandId, { studentId: student.studentId });
      const newBandStudentId = response.data;
      this.setState((prevState) => ({
        band: {
          ...prevState.band,
          bandStudents: [
            ...prevState.band.bandStudents,
            {
              bandStudentId: newBandStudentId,
              studentId: student.studentId,
              roleId: null,
              student: {
                studentId: student.studentId,
                firstName: student.firstName,
                lastName: student.lastName,
                birthDate: student.birthDate,
              },
            },
          ],
        },
      }));
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  deleteStudent = async (index) => {
    const { bandId, band } = this.state;
    const bandStudent = band.bandStudents[index];
    try {
      await removeBandStudent(bandId, bandStudent.bandStudentId);
      this.setState((prevState) => {
        const updated = [...prevState.band.bandStudents];
        updated.splice(index, 1);
        return { band: { ...prevState.band, bandStudents: updated } };
      });
    } catch (error) {
      console.error("Failed to remove student:", error);
    }
  };

  handleRoleChange = async (studentIndex, disciplineId) => {
    const { bandId, band } = this.state;
    const bandStudent = band.bandStudents[studentIndex];
    try {
      await updateBandStudentRole(bandId, bandStudent.bandStudentId, disciplineId);
      this.setState((prevState) => {
        const updated = [...prevState.band.bandStudents];
        updated[studentIndex] = { ...updated[studentIndex], roleId: disciplineId };
        return { band: { ...prevState.band, bandStudents: updated } };
      });
    } catch (error) {
      console.error("Failed to update student role:", error);
    }
  };

  renderLoadingState = () => (
    <Container className="text-center" style={{ marginTop: "100px" }}>
      <Spinner animation="border" role="status" className="mb-3">
        <span className="visually-hidden">Загрузка...</span>
      </Spinner>
      <div>Загрузка данных группы...</div>
    </Container>
  );

  renderErrorState = () => (
    <Container style={{ marginTop: "40px" }}>
      <Alert variant="danger">
        <Alert.Heading>Ошибка</Alert.Heading>
        <p>{this.state.error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button 
            onClick={() => this.loadBandData()} 
            variant="outline-danger"
            disabled={this.state.isLoading}
          >
            Попробовать снова
          </Button>
        </div>
      </Alert>
    </Container>
  );
/*
  renderStudentsList = () => {
    if (!students || students.length === 0) {
      return (
        <div className="text-center py-3 text-muted">
          Ученики не добавлены
        </div>
      );
    }

    return (
      <div>
        {students.map((student, index) => (
          <div key={index} className="d-flex align-items-center mb-2 p-2 border rounded">
            <Avatar style={{ width: "40px", height: "40px", marginRight: "15px" }} />
            <div className="flex-grow-1">
              <div>
                <strong>
                  <Link to={`/student/${student.studentId}`}>
                    {student.firstName} {student.lastName}
                  </Link>
                </strong>
              </div>
              <div className="text-muted small">
                {calculateAge(student.birthDate)} лет • {student.phone}
              </div>
            </div>
            <div>
              <Badge bg="secondary">{student.level || "Начинающий"}</Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  renderSchedule = () => {
    if (!schedules || schedules.length === 0) {
      return (
        <div className="text-center py-3 text-muted">
          Расписание не настроено
        </div>
      );
    }

    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>День</th>
            <th>Время</th>
            <th>Комната</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <tr key={index}>
              <td>{getDayName(schedule.weekDay)}</td>
              <td>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</td>
              <td>Комната {schedule.roomId}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };*/

  render() {
    const { band, isLoading, isActivating, showAddStudentModal, error } = this.state;

    if (isLoading) {
      return this.renderLoadingState();
    }

    if (error) {
      return this.renderErrorState();
    }

    if (!band) {
      return (
        <Container style={{ marginTop: "40px" }}>
          <Alert variant="warning">
            <Alert.Heading>Группа не найдена</Alert.Heading>
            <p>Запрашиваемая группа не существует или была удалена.</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button as={Link} to="/bands" variant="outline-warning">
                Вернуться к списку групп
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="2"></Col>
          <Col md="8">

            {/* Status Alert */}
            {/*!band.isActive && (
              <Alert variant="warning" className="mb-4">
                <strong>Группа деактивирована</strong> - занятия не проводятся
              </Alert>
            )*/}

            {/* Band Details */}
            <BandScreenCard band={band} />

            <AddStudentModal
              show={showAddStudentModal}
              onAddStudent={this.handleAddStudent}
              handleClose={this.handleCloseAddStudentModal}
              onlyExistingStudents={true}
            />
            <Container>
              <Row>
                <Col md="6">
                  <Card>
                    <Card.Header><strong>Участники</strong></Card.Header>
                    <Card.Body>
                      <BandStudents
                        students={band.bandStudents?.map(bandStudent => ({
                          studentId: bandStudent.student?.studentId || bandStudent.studentId,
                          firstName: bandStudent.student?.firstName,
                          lastName: bandStudent.student?.lastName,
                          birthDate: bandStudent.student?.birthDate,
                          roleId: bandStudent.roleId,
                          bandStudentId: bandStudent.bandStudentId
                        })) || []}
                        onAddStudent={this.showAddStudentModal}
                        onDeleteStudent={this.deleteStudent}
                        onRoleChange={this.handleRoleChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md="6">
                  <Card>
                    <Card.Header>
                      <strong>Расписание</strong>
                    </Card.Header>
                    <Card.Body>
                      
                      <NoRecords />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}