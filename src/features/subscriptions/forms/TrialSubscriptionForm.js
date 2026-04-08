import React from "react";

import { CalendarIcon } from "../../../components/icons";
import { Button, FormLabel } from "../../../components/ui";
import SubscriptionType from "../../../constants/SubscriptionType";
import { SectionTitle, SectionWrapper } from "../../../layout";
import { getStudent } from "../../../services/apiStudentService";
import { addTrialSubscription } from "../../../services/apiSubscriptionService";
import { getTariffByType } from "../../../services/apiTariffService";
import { getAvailableTeachers } from "../../../services/apiTeacherService";
import { AvailableTeachersModal } from "../../attendances/AvailableTeachersModal";
import { DisciplinePlate } from "../../disciplines/DisciplinePlate";
import { DisciplineSelectionModal } from "../../disciplines/DisciplineSelectionModal";
import TariffCard from "../../tariffs/TariffCard";
import { SubscriptionStudents } from "../SubscriptionStudents";

export class TrialSubscriptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExistingStudent: false,

      branchId: 0,
      disciplineId: null,
      student: null, // Add student to state as fallback
      tariff: null,
      trialTariffAmount: 0,

      backgroundEvents: [],
      availableTeachers: [],
      availableSlots: [],
      showAvailableTeacherModal: false,
      showDisciplineModal: false,
      selectedSlotId: 0,
    };

    this.handleCloseAvailableTeachersModal =
      this.handleCloseAvailableTeachersModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.showDisciplineModal = this.showDisciplineModal.bind(this);
    this.handleCloseDisciplineModal =
      this.handleCloseDisciplineModal.bind(this);
  }

  componentDidMount() {
    // Load student if not provided in props
    if (!this.props.student && !this.props.location?.state?.student) {
      this.loadStudent();
    }
    // Load trial tariff
    this.loadTrialTariff();
  }

  loadStudent = async () => {
    try {
      const studentId = this.props.match?.params?.id;
      if (studentId) {
        const student = await getStudent(studentId);
        this.setState({ student: student });
      }
    } catch (error) {
      console.error("Error loading student:", error);
    }
  };

  loadTrialTariff = async () => {
    try {
      const { disciplineId } = this.state;
      const tariff = await getTariffByType(
        SubscriptionType.TRIAL_LESSON,
        disciplineId,
      );
      this.setState({ tariff: tariff, trialTariffAmount: tariff.amount });
    } catch (error) {
      console.error("Error loading trial tariff:", error);
      // Keep default amount if API call fails
    }
  };

  // AvailableTeachersModal
  generateAvailablePeriods = async (e) => {
    e.preventDefault();
    const response = await getAvailableTeachers(
      this.state.disciplineId,
      this.state.age,
      1,
    );
    this.setState({
      availableTeachers: response.data.availableTeachers,
      showAvailableTeacherModal: true,
    });
  };

  handleCloseAvailableTeachersModal = () => {
    const { selectedSlotId, availableSlots } = this.state;
    const newSelectedSlotId =
      selectedSlotId === 0 && availableSlots.length > 0 && availableSlots[0].id;
    this.setState({
      showAvailableTeacherModal: false,
      selectedSlotId: newSelectedSlotId,
    });
  };

  handleSlotsChange = (availableSlots) => {
    this.setState({
      availableSlots: availableSlots,
      selectedSlotId: availableSlots[0]?.id,
    });
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleDisciplineChange = (disciplineId) => {
    this.setState(
      {
        disciplineId: disciplineId,
        availableSlots: [],
        selectedSlotId: 0,
        showDisciplineModal: false,
      },
      () => {
        // Reload tariff when discipline changes
        this.loadTrialTariff();
      },
    );
  };

  // Discipline Modal methods
  showDisciplineModal = () => {
    this.setState({ showDisciplineModal: true });
  };

  handleCloseDisciplineModal = () => {
    this.setState({ showDisciplineModal: false });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const selectedSlot = this.state.availableSlots.filter(
      (s) => s.id === this.state.selectedSlotId,
    )[0];
    const requestBody = {
      disciplineId: this.state.disciplineId,
      branchId: 1, // DEV: map after clarification
      teacherId: selectedSlot.teacherId,
      trialDate: selectedSlot.start,
      roomId: selectedSlot.roomId,
      tariffId: this.state.tariff ? this.state.tariff.tariffId : null,
      student: {
        studentId: this.props.match.params.id,
      },
    };

    const response = await addTrialSubscription(requestBody);
    const newStudentId = response.data;

    this.props.history.push(`/student/${newStudentId}`);
  };

  render() {
    const {
      disciplineId,
      showAvailableTeacherModal,
      showDisciplineModal,
      availableTeachers,
      availableSlots,
      selectedSlotId,
      student,
      trialTariffAmount,
    } = this.state;

    // Debug: Check what props are available
    console.log("TrialSubscriptionForm props:", this.props);
    console.log("Student from props:", this.props.student);
    console.log("Student from state:", student);
    console.log("Match params:", this.props.match?.params);

    // Try multiple sources for student data
    const currentStudent =
      this.props.student || this.props.location?.state?.student || student;

    const students = currentStudent ? [currentStudent] : [];

    let availableSlotsList;
    if (availableSlots && availableSlots.length > 0) {
      availableSlotsList = availableSlots.map((item, index) => (
        <option key={index} value={item.id}>
          {item.description}
        </option>
      ));
    }

    return (
      <SectionWrapper>
        <SectionTitle className="text-center">
          Пробный урок
        </SectionTitle>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            <div className="hidden md:block md:w-1/4"></div>

            <div className="w-full md:w-1/2 bg-card-bg p-6 rounded-xl shadow-lg border border-secondary/20">

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-6" style={{ background: "none" }}>
                  <div
                    className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] bg-main-bg"
                    onClick={this.showDisciplineModal}
                  >
                    <DisciplinePlate disciplineId={disciplineId} size="fill" />
                  </div>
                </div>

                <div className="mb-6">
                  <SubscriptionStudents
                    students={students}
                    allowRemove={false}
                    allowAdd={false}
                  />
                </div>

                <div className="mb-6">
                  <FormLabel
                    htmlFor="GenerteSchedule"
                    className="flex items-center gap-2 mb-2 text-text-muted"
                  >
                    <CalendarIcon color="var(--text-muted)" />
                    <span className="font-medium">Расписание</span>
                  </FormLabel>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      id="GenerteSchedule"
                      className="flex-1 bg-input-bg border border-secondary/20 rounded-lg px-2 py-2 text-text-main outline-none focus:border-accent transition-colors disabled:opacity-50"
                      value={selectedSlotId}
                      onChange={(e) =>
                        this.setState({ selectedSlotId: e.target.value })
                      }
                      disabled={availableSlots.length === 0}
                    >
                      <option value="">выберите...</option>
                      {availableSlotsList}
                    </select>

                    <Button
                      type="button"
                      onClick={(e) => this.generateAvailablePeriods(e)}
                      disabled={!disciplineId}
                    >
                      Доступные окна
                    </Button>
                  </div>
                </div>

                <hr className="border-secondary/20 my-6" />

                <div className="text-center">
                  <button
                    type="button"
                    className="bg-success text-white px-10 py-3 rounded-full font-bold hover:bg-success/70 transition-all shadow-md active:scale-95"
                    onClick={this.handleSave}
                  >
                    Записать
                  </button>
                </div>
              </form>
            </div>

            <div className="w-full md:w-1/4">
              <div className="rounded-xl p-1 overflow-hidden">
                <TariffCard
                  title="Тариф"
                  description="Пробный урок"
                  amount={trialTariffAmount}
                  className="bg-transparent"
                  showIcon={false}
                />
              </div>
            </div>
          </div>

          <AvailableTeachersModal
            show={showAvailableTeacherModal}
            teachers={availableTeachers}
            onSlotsChange={this.handleSlotsChange}
            onClose={this.handleCloseAvailableTeachersModal}
          />

          <DisciplineSelectionModal
            show={showDisciplineModal}
            onHide={this.handleCloseDisciplineModal}
            selectedDisciplineId={disciplineId}
            onDisciplineChange={this.handleDisciplineChange}
          />
        </div>
      </SectionWrapper>
    );
  }
}
