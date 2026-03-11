import React from "react";
import { Alert, Button, Col, Container, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { getBandFormData, updateBandSchedules } from "../../../services/apiBandService";
import { getWorkingPeriods } from "../../../services/apiTeacherService";
import { convertSlotsToSchedules } from "../../../utils/scheduleUtils";
import { AvailableTeachersModal } from "../../shared/modals/AvailableTeachersModal";
import { ScheduleEditorWithDelete } from "../../shared/schedule/ScheduleEditorWithDelete";

const ERROR_MESSAGES = {
  LOAD_FAILED: "Не удалось загрузить данные группы",
  SAVE_FAILED: "Не удалось сохранить изменения",
  NO_BAND_ID: "Не указан ID группы",
};

export class BandScheduleForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bandId: this.props.match?.params?.id,
      band: null,
      bandName: "",
      teacher: null,
      schedules: [],
      availableTeachers: [],
      availableSlots: [],
      showAvailableTeacherModal: false,

      // UI State
      isLoading: true,
      isSaving: false,
      error: null,
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleScheduleChange = this.handleScheduleChange.bind(this);
    this.showAvailableTeachersModal = this.showAvailableTeachersModal.bind(this);
    this.handleCloseAvailableTeachersModal = this.handleCloseAvailableTeachersModal.bind(this);
  }

  componentDidMount() {
    this.loadFormData();
  }

  async loadFormData() {
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

      const bandData = await getBandFormData(bandId);
      const band = bandData.band || {};

      this.setState({
        band: band,
        bandId: band.bandId,
        bandName: band.name || "",
        teacher: band.teacher || {},
        schedules: bandData.scheduleSlots || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load form data:", error);
      this.setState({
        error: ERROR_MESSAGES.LOAD_FAILED,
        isLoading: false,
      });
    }
  }

  handleScheduleChange = (schedules) => {
    this.setState({ schedules });
  };

  showAvailableTeachersModal = async (e) => {
    e.preventDefault();

    const { teacher } = this.state;

    const response = await getWorkingPeriods(teacher.teacherId);
    const teachers = response.data?.teacher ? [response.data.teacher] : [];

    this.setState({
      availableTeachers: teachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    if (!this.state.availableSlots || this.state.availableSlots.length === 0) {
      this.setState({ showAvailableTeacherModal: false });
      return;
    }

    this.setState({ showAvailableTeacherModal: false });
  };

  handleSlotsChange = (slots) => {
    const schedules = convertSlotsToSchedules(slots, { includeTeacherId: true });
    this.setState({ availableSlots: slots, schedules: schedules });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const { bandId, schedules } = this.state;

    try {
      this.setState({ isSaving: true });

      const requestBody = {
        schedules: schedules,
      };

      await updateBandSchedules(bandId, requestBody);

      this.props.history.push(`/band/${bandId}`);
    } catch (error) {
      console.error("Failed to save schedules:", error);
      this.setState({
        error: ERROR_MESSAGES.SAVE_FAILED,
        isSaving: false,
      });
    }
  };

  renderLoadingState = () => (
    <Container className="text-center" style={{ marginTop: "100px" }}>
      <Spinner animation="border" role="status" className="mb-3">
        <span className="visually-hidden">Загрузка...</span>
      </Spinner>
      <div>Загрузка данных...</div>
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
            onClick={this.loadFormData}
            variant="outline-danger"
            disabled={this.state.isLoading}
          >
            Попробовать снова
          </Button>
        </div>
      </Alert>
    </Container>
  );

  renderSelectSlotSection = () => {
    const { teacher, isSaving } = this.state;
    return (
      <>
        <div className="mb-3 mt-3"><b>Куратор</b></div>
        <Form.Group className="mb-3">
          <div className="mb-4">
            <InputGroup className="mb-3 d-flex">
              <Form.Label className="flex-grow-1">{teacher?.firstName} {teacher?.lastName}</Form.Label>
              <Button
                variant="outline-secondary"
                onClick={this.showAvailableTeachersModal}
                disabled={!teacher?.teacherId || isSaving}
              >
                Доступные окна...
              </Button>
            </InputGroup>
          </div>
        </Form.Group>
      </>
    );
  };

  render() {
    const { isLoading, isSaving, error, bandName, teacher, schedules, availableTeachers, showAvailableTeacherModal } = this.state;

    if (isLoading) {
      return this.renderLoadingState();
    }

    if (error) {
      return this.renderErrorState();
    }

    return (
      <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="mb-4 text-center">Редактировать расписание</h2>

            <Form>
              <Form.Group className="mb-3 text-center">
                <Form.Label style={{ fontSize: "18px", fontWeight: "bold" }}>
                  Группа "{bandName}"
                </Form.Label>
              </Form.Group>

              {this.renderSelectSlotSection()}

              <AvailableTeachersModal
                show={showAvailableTeacherModal}
                teachers={availableTeachers}
                onSlotsChange={this.handleSlotsChange}
                onClose={this.handleCloseAvailableTeachersModal}
                slotDuration={120}
              />

              <hr></hr>

                <ScheduleEditorWithDelete
                  schedules={schedules}
                  onChange={this.handleScheduleChange}
                />

              <hr></hr>
              <Container className="text-center">
                <Button
                  variant="primary"
                  disabled={isSaving}
                  onClick={this.handleSave}
                >
                  {isSaving ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Сохранение...
                    </>
                  ) : (
                    "Сохранить"
                  )}
                </Button>
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default BandScheduleForm;
