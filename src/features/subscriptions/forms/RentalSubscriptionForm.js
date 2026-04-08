import { format } from "date-fns";
import React from "react";

import { Loading } from "../../../components/Loading";
import { ScheduleEditorWithDelete } from "../../../components/schedule/ScheduleEditorWithDelete";
import { Button, FormLabel } from "../../../components/ui";
import AttendanceType from "../../../constants/AttendanceType";
import { SectionTitle, SectionWrapper } from "../../../layout";
import { getBusySlots } from "../../../services/apiBranchService";
import { addRentalSubscription } from "../../../services/apiRentalSubscriptionService";
import { getStudent } from "../../../services/apiStudentService";
import { getTariffsByType } from "../../../services/apiTariffService";
import { toMoneyString } from "../../../utils/moneyUtils";
import { convertSlotsToSchedules } from "../../../utils/scheduleUtils";
import { AvailableSlotsModal } from "../../attendances/AvailableSlotsModal";
import { SubscriptionStudents } from "../SubscriptionStudents";

export class RentalSubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type === "New",
      isLoading: false,
      studentId: this.props.match.params.id,
      student: null,
      students: [],
      roomId: "",
      startDate: format(new Date(), "dd.MM.yyyy"),
      attendanceCount: "",
      attendanceLength: 1,
      purpose: "",
      notes: "",

      tariffs: [],
      selectedTariff: null,

      schedules: [],
      basedOnSubscriptionId: null,
      showAvailableSlotsModal: false,
      rooms: [],
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    this.setState({ isLoading: true });

    try {
      if (this.state.studentId) {
        const student = await getStudent(this.state.studentId);
        const students = student ? [student] : [];

        this.setState({
          student: student,
          students: students,
          isLoading: false,
        });

        // Load tariffs for room rental
        this.loadTariffs();
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to load student data:", error);
      this.setState({ isLoading: false });
    }
  }

  loadTariffs = async () => {
    try {
      // Load all tariffs for room rental
      const tariffs = await getTariffsByType(AttendanceType.RENT);
      this.setState({ tariffs: tariffs || [] });
    } catch (error) {
      console.error("Error loading tariffs:", error);
    }
  };

  handleTariffChange = (tariffId) => {
    const selectedTariff = this.state.tariffs.find(
      (tariff) => tariff.tariffId === tariffId,
    );
    if (selectedTariff) {
      this.setState({
        selectedTariff: selectedTariff,
        attendanceCount: selectedTariff.attendanceCount,
        attendanceLength: selectedTariff.attendanceLength,
      });
    }
  };

  showAvailableSlotsModal = async (e) => {
    e.preventDefault();

    const responseData = await getBusySlots(1); // BranchId

    this.setState({
      rooms: responseData,
      showAvailableSlotsModal: true,
    });
  };

  handleCloseAvailableSlotsModal = () => {
    this.setState({ showAvailableSlotsModal: false });
  };

  handleSlotsChange = (availableSlots) => {
    // Convert available slots to schedules format (without teacherId for room rental)
    const periods = convertSlotsToSchedules(availableSlots, {
      includeTeacherId: false,
    });
    this.setState({ schedules: periods });
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  onChange = (periods) => {
    this.setState({ schedules: periods });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
      subscriptionDetails: {
        startDate: this.state.startDate,
        attendanceCount: this.state.attendanceCount,
        attendanceLength: this.state.attendanceLength,
        branchId: 1,
        studentId: this.state.studentId,

        tariffId: this.state.selectedTariff?.tariffId,
        price: this.state.selectedTariff?.amount,
        amountOutstanding: this.state.selectedTariff?.amount,
        finalPrice: this.state.selectedTariff?.amount,
      },
      schedules: this.state.schedules,
    };

    try {
      await addRentalSubscription(requestBody);

      this.props.history.push(`/student/${this.state.studentId}`);
    } catch (error) {
      console.error("Failed to save room rental:", error);
      alert("Ошибка при оформлении аренды комнаты");
    }
  };

  render() {
    const {
      isNew,
      isLoading,
      students,
      attendanceCount,
      attendanceLength,
      startDate,
      schedules,
      rooms,
      basedOnSubscriptionId,
      showAvailableSlotsModal,
      tariffs,
      selectedTariff,
    } = this.state;

    if (isLoading) {
      return <Loading message="Загрузка данных..." />;
    }

    return (
      <SectionWrapper>
        <SectionTitle className="text-center">
          {isNew ? "Аренда комнаты" : "Редактировать аренду"}
        </SectionTitle>
        
        <div className="container mx-auto px-4 pb-12 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            <div
              className="w-full md:w-1/2 bg-card-bg p-6 rounded-2xl shadow-xl "
              style={{ border: "none" }}
            >
              <form onSubmit={(e) => e.preventDefault()}>
                <div
                  className="mb-6"
                  style={{ border: "none" }}
                >
                  <SubscriptionStudents
                    students={students}
                    allowRemove={false}
                    allowAdd={false}
                  />
                </div>

                <div className="mb-4">
                  <FormLabel as="div">
                    Дата начала
                  </FormLabel>
                    <input
                      type="date"
                      className="w-full bg-input-bg  rounded-xl px-4 py-2 text-text-main outline-none focus:border-accent transition-all [color-scheme:dark]"
                      style={{ border: "none", outline: "none" }}
                      value={startDate || ""}
                      onChange={(e) =>
                        this.setState({ startDate: e.target.value })
                      }
                    />
                </div>

                <div className="mb-6">
                  <FormLabel as="div">
                    Тариф
                  </FormLabel>
                  <div>
                    <select
                      className="w-full bg-input-bg rounded-xl px-4 py-3 text-text-main outline-none focus:border-accent transition-all appearance-none disabled:opacity-40"
                      style={{ border: "none", outline: "none" }}
                      value={selectedTariff?.tariffId || ""}
                      onChange={(e) => this.handleTariffChange(e.target.value)}
                      disabled={tariffs.length === 0}
                    >
                      <option value="">выберите тариф...</option>
                      {tariffs.map((tariff) => (
                        <option
                          key={tariff.tariffId}
                          value={tariff.tariffId}
                          className="bg-card-bg"
                        >
                          {tariff.attendanceCount} сеансов,{" "}
                          {tariff.attendanceLength === 1
                            ? "час"
                            : "полтора часа"}{" "}
                          — {toMoneyString(tariff.amount)}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <hr
                  className="border-secondary/10 my-6"
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(149, 158, 183, 0.1)",
                  }}
                />

                <div className="text-center">
                  <Button
                    type="button"
                    className="w-full sm:w-auto bg-secondary/10 hover:bg-secondary/40 text-secondary  px-6 py-2 rounded-xl transition-all mb-6 font-medium"
                    onClick={this.showAvailableSlotsModal}
                    style={{ border: "none" }}
                  >
                    Доступные окна...
                  </Button>


                </div>


                <div className="bg-inner-bg/50 p-2">
                  <ScheduleEditorWithDelete
                    schedules={schedules}
                    onChange={this.onChange}
                    attendanceLength={attendanceLength}
                  />
                </div>

                <hr
                  className="border-secondary/10"
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(149, 158, 183, 0.1)",
                  }}
                />

                <div className="text-center">
                  <button
                    type="button"
                    className="bg-accent hover:bg-accent/80 text-white px-12 py-3 rounded-full font-bold transition-all shadow-lg shadow-accent/20 active:scale-95"
                    style={{ border: "none" }}
                    onClick={this.handleSave}
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>

          <AvailableSlotsModal
            show={showAvailableSlotsModal}
            rooms={rooms}
            onSlotsChange={this.handleSlotsChange}
            onClose={this.handleCloseAvailableSlotsModal}
            singleSelection={false}
          />
        </div>
      </SectionWrapper>
    );
  }
}
