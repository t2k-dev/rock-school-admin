import React from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CalendarIcon, GroupIcon } from "../../components/icons";
import { NoRecords } from "../../components/NoRecords";
import ScreenHeader from "../../components/screens/ScreenHeader";
import { activateBand, addBandMember, deactivateBand, generateAttendances, getBandScreenDetails, removeBandStudent, updateBandStudentRole } from "../../services/apiBandService";
import { AddStudentModal } from "../students/AddStudentModal";
import { BandAttendanceList } from "./BandAttendanceList";
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
      attendances: [],
      isLoading: true,
      isActivating: false,
      isGenerating: false,
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
        attendances: bandData.attendances || [],
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

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push(`/band/${this.state.bandId}/edit`);
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

  handleGenerateAttendances = async () => {
    try {
      this.setState({ isGenerating: true });
      await generateAttendances(this.state.bandId);
      await this.loadBandData();
    } catch (error) {
      console.error("Failed to generate attendances:", error);
    } finally {
      this.setState({ isGenerating: false });
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

  renderAttendances = () => {
    const { attendances } = this.state;

    const sortedAttendances = [...(attendances || [])].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA; // Descending order
    });

    return (
      <BandAttendanceList
        attendances={sortedAttendances}
        onAttendanceClick={() => {}}
      />
    );
  };

  render() {
    const { band, isLoading, isActivating, isGenerating, showAddStudentModal, error } = this.state;

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

            {/* Band Details */}
            <div className="mb-4">
              <ScreenHeader
                avatar={<GroupIcon size="64px" color="#E2E7F6" />}
                title={band.name}
                titleClassName="text-[24px]"
                onEdit={this.handleEditClick}
                subtitle={band.isActive ? "Активная группа" : "Неактивная группа"}
                asideClassName="w-full lg:w-auto lg:min-w-[220px]"
                aside={
                  <div className="flex w-full flex-col gap-2 lg:w-[220px]">
                    <Button
                      variant="outline-warning"
                      onClick={this.handleGenerateAttendances}
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Создание..." : "Пересоздать слоты"}
                    </Button>

                    <Button variant="secondary" onClick={() => this.handleEditSchedules(band)}>
                      <CalendarIcon color="white" />
                      Расписание
                    </Button>

                    <Button
                      variant={band.isActive ? "outline-danger" : "success"}
                      type="button"
                      onClick={() => this.handleActivateToggle(band)}
                      disabled={isActivating}
                    >
                      {isActivating
                        ? (band.isActive ? "Отключение..." : "Включение...")
                        : (band.isActive ? "Отключить" : "Включить")}
                    </Button>
                  </div>
                }
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-[#94A3B8]">Куратор</div>
                    {band.teacher ? (
                      <Link
                        to={`/teacher/${band.teacher.teacherId}`}
                        className="text-[#E2E7F6] no-underline transition-colors duration-200 hover:text-white"
                      >
                        {band.teacher.firstName} {band.teacher.lastName}
                      </Link>
                    ) : (
                      <div className="text-sm text-[#94A3B8]">Не назначен</div>
                    )}
                  </div>

                  <div className="grid gap-3 text-sm text-[#E2E7F6]">
                    <div>
                      <div className="text-[#94A3B8]">Участников</div>
                      <div>{band.bandMembers?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-[#94A3B8]">Расписание</div>
                      <div>{band.schedules?.length || 0} слотов</div>
                    </div>
                  </div>
                </div>
              </ScreenHeader>
            </div>

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
                    <Card.Header>
                      <strong>Репетиции</strong>
                    </Card.Header>
                    <Card.Body>
                      {this.renderAttendances()}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md="6">
                  <Card>
                    <Card.Header><strong>Участники</strong></Card.Header>
                    <Card.Body>
                      <BandStudents
                        bandMembers={band.bandMembers?.map(bandMember => ({
                          studentId: bandMember.student?.studentId || bandMember.studentId,
                          firstName: bandMember.student?.firstName,
                          lastName: bandMember.student?.lastName,
                          birthDate: bandMember.student?.birthDate,
                          bandRoleId: bandMember.bandRoleId,
                          bandStudentId: bandMember.bandStudentId
                        })) || []}
                        onAddStudent={this.showAddStudentModal}
                        onDeleteStudent={this.deleteStudent}
                        onRoleChange={this.handleRoleChange}
                      />
                    </Card.Body>
                  </Card>

                  <Card className="mt-3">
                    <Card.Header><strong>Трэклист</strong></Card.Header>
                    <Card.Body>
                      <NoRecords/>
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