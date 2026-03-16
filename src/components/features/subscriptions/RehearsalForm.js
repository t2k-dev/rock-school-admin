import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

import SubscriptionType from "../../../constants/SubscriptionType";
import { getActiveBands } from "../../../services/apiBranchService";
import { getStudent } from "../../../services/apiStudentService";
import { addRehearsalSubscription } from "../../../services/apiSubscriptionService";
import { getTariffByType } from "../../../services/apiTariffService";
import { Loading } from "../../shared/Loading";
import TariffCard from "../tariffs/TariffCard";
import { SubscriptionStudents } from "./SubscriptionStudents";

export class RehearsalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: null,
      bands: [],
      selectedBandId: null,
      tariff: null,
      rehearsalTariffAmount: 0,
      isLoading: false,
      isSaving: false,
      error: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.loadStudent();
    this.loadBands();
    this.loadRehearsalTariff();
  }

  loadStudent = async () => {
    try {
      const studentId = this.props.match?.params?.id;
      if (studentId) {
        const student = await getStudent(studentId);
        this.setState({ student: student });
      }
    } catch (error) {
      console.error('Error loading student:', error);
      this.setState({ error: 'Не удалось загрузить информацию ученика' });
    }
  };

  loadBands = async () => {
    try {
      this.setState({ isLoading: true });
      const bands = await getActiveBands(1); //DEV
      this.setState({ 
        bands: bands || [],
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading bands:', error);
      this.setState({ 
        error: 'Не удалось загрузить список групп',
        isLoading: false,
      });
    }
  };

  loadRehearsalTariff = async () => {
    try {
      const tariff = await getTariffByType(SubscriptionType.REHEARSAL, null);
      this.setState({ 
        tariff: tariff, 
        rehearsalTariffAmount: tariff?.amount || 0 
      });
    } catch (error) {
      console.error('Error loading rehearsal tariff:', error);
    }
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const { selectedBandId, student } = this.state;

    if (!selectedBandId || !student) {
      this.setState({ error: 'Пожалуйста, выберите группу' });
      return;
    }

    try {
      this.setState({ isSaving: true });
      const requestData = {
        studentId: student.studentId,
        bandId: selectedBandId,
        tariffId: this.state.tariff?.tariffId,
      };

      await addRehearsalSubscription(requestData);

      this.props.history.push(`/student/${student.studentId}`);
    } catch (error) {
      console.error('Error saving rehearsal:', error);
      this.setState({ 
        error: 'Не удалось сохранить',
        isSaving: false,
      });
    }
  };

  render() {
    const {
      student,
      bands,
      selectedBandId,
      tariff,
      rehearsalTariffAmount,
      isLoading,
      isSaving,
      error,
    } = this.state;

    if (isLoading) {
      return <Loading message="Загрузка данных..." />;
    }

    const students = student ? [student] : [];

    let bandsList;
    if (bands && bands.length > 0) {
      bandsList = bands.map((item, index) => (
        <option key={index} value={item.bandId}>
          {item.name}
        </option>
      ));
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="4"></Col>
          <Col md="4">
            <h2 className="text-center mb-4">Репетиции</h2>
            <Form>
              {error && (
                <div className="alert alert-danger mb-3">
                  {error}
                </div>
              )}

              {/* Student */}
              <Form.Group className="mb-3" controlId="students">
                <SubscriptionStudents
                  students={students}
                  allowRemove={false}
                  allowAdd={false}
                />
              </Form.Group>

              {/* Band Selection */}
              <label htmlFor="BandSelect">
                <strong>Группа</strong>
              </label>
              <InputGroup className="mb-3 mt-2" controlId="BandSelect">
                <Form.Select
                  id="selectedBandId"
                  aria-label="Выберите группу..."
                  value={selectedBandId || ""}
                  onChange={(e) => this.setState({ selectedBandId: e.target.value })}
                  disabled={bands.length === 0}
                >
                  <option value="">Выберите группу...</option>
                  {bandsList}
                </Form.Select>
              </InputGroup>

              <hr></hr>
              <div className="text-center">
                <Button 
                  variant="success" 
                  type="button" 
                  onClick={this.handleSave}
                  disabled={isSaving || !selectedBandId}
                >
                  {isSaving ? "Сохранение..." : "Добавить"}
                </Button>
              </div>
            </Form>
          </Col>
          <Col md="4">
            {tariff && (
              <TariffCard
                title="Тариф"
                description="Участие в репетициях"
                amount={rehearsalTariffAmount}
                style={{ marginTop: '50px' }}
                showIcon={false}
              />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RehearsalForm;
