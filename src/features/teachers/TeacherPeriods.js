import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ScheduleEditor } from "../../components/schedule/ScheduleEditor";
import { getTeacher, saveWorkingPeriods } from "../../services/apiTeacherService";

export class TeacherPeriods extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherId: null,
      teacherName: "",
      workingPeriods: [],
      periodsChanged: false,
      isLoading: true,
    };

    this.handlePeriodsChange = this.handlePeriodsChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const teacherId = this.props.match.params.id;
    
    this.setState({ isLoading: true });
    try {
      const [teacher] = await Promise.all([
        getTeacher(teacherId),
      ]);

      this.setState({
        teacherId,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        workingPeriods: teacher.workingPeriods || [],
        periodsChanged: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading data:", error);
      this.setState({ isLoading: false });
    }
  }

  handlePeriodsChange = (periods) => {
    this.setState({ workingPeriods: periods, periodsChanged: true });
  };

  handleSave = async () => {
    const { teacherId, workingPeriods } = this.state;

    try {
      await saveWorkingPeriods(teacherId, workingPeriods);
      this.props.history.push(`/teacher/${teacherId}`);
    } catch (error) {
      console.error("Error saving working periods:", error);
    }
  };

  render() {
    const { teacherName, workingPeriods, periodsChanged, isLoading } = this.state;

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="3"></Col>
          <Col md="6">
            <h2 className="mb-4 text-center">Расписание: {teacherName}</h2>
            
            {isLoading ? (
              <div className="text-center">Загрузка...</div>
            ) : (
              <>
                <ScheduleEditor
                  periods={workingPeriods}
                  handlePeriodsChange={this.handlePeriodsChange}
                />

                <hr />
                <div className="mb-3 text-center">
                  <Button
                    variant="primary"
                    onClick={this.handleSave}
                    disabled={!periodsChanged}
                  >
                    Сохранить
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default TeacherPeriods;
