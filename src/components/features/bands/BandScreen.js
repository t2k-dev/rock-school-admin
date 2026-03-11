import React from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { activateBand, addBandMember, deactivateBand, getBandScreenDetails, removeBandStudent, updateBandStudentRole } from "../../../services/apiBandService";
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
      const response = await addBandMember(bandId, { studentId: student.studentId });
      const newBandStudentId = response.data;
      this.setState((prevState) => ({
        band: {
          ...prevState.band,
          bandMembers: [
            ...prevState.band.bandMembers,
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
    const bandMember = band.bandMembers[index];
    try {
      await removeBandStudent(bandId, bandMember.bandMemberId);
      this.setState((prevState) => {
        const updated = [...prevState.band.bandMembers];
        updated.splice(index, 1);
        return { band: { ...prevState.band, bandMembers: updated } };
      });
    } catch (error) {
      console.error("Failed to remove student:", error);
    }
  };

  handleRoleChange = async (studentIndex, disciplineId) => {
    const { bandId, band } = this.state;
    const bandMember = band.bandMembers[studentIndex];
    try {
      await updateBandStudentRole(bandId, bandMember.bandStudentId, disciplineId);
      this.setState((prevState) => {
        const updated = [...prevState.band.bandMembers];
        updated[studentIndex] = { ...updated[studentIndex], roleId: disciplineId };
        return { band: { ...prevState.band, bandMembers: updated } };
      });
    } catch (error) {
      console.error("Failed to update student role:", error);
    }
  };

  handleEditSchedules = (band) => {
    this.props.history.push(`/band/${band.bandId}/schedule`);
  };

  handleActivateToggle = async (band) => {
    try {
      this.setState({ isActivating: true });
      
      if (band.isActive) {
        await deactivateBand(band.bandId);
      } else {
        await activateBand(band.bandId);
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
            <BandScreenCard 
              band={band} 
              onEditSchedules={this.handleEditSchedules}
              onActivateToggle={this.handleActivateToggle}
            />

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
                        students={band.bandMembers?.map(bandMember => ({
                          studentId: bandMember.student?.studentId || bandMember.studentId,
                          firstName: bandMember.student?.firstName,
                          lastName: bandMember.student?.lastName,
                          birthDate: bandMember.student?.birthDate,
                          roleId: bandMember.roleId,
                          bandStudentId: bandMember.bandStudentId
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
                      <strong>Репетиции</strong>
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