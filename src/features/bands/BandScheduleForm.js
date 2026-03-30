import React from "react";
import { Loading } from "../../components/Loading";
import { ScheduleEditorWithDelete } from "../../components/schedule/ScheduleEditorWithDelete";
import { Button, FormWrapper } from "../../components/ui";
import { SectionTitle, SectionWrapper } from "../../layout";
import { getBandFormData, updateBandSchedules } from "../../services/apiBandService";
import { getWorkingPeriods } from "../../services/apiTeacherService";
import { convertSlotsToSchedules } from "../../utils/scheduleUtils";
import { AvailableTeachersModal } from "../attendances/AvailableTeachersModal";

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

      const formData = await getBandFormData(bandId);
      const band = formData.band || {};

      this.setState({
        band: band,
        bandId: band.bandId,
        bandName: band.name || "",
        teacher: band.teacher || {},
        schedules: band.scheduleSlots || [],
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
    <Loading message="Загрузка данных..." />
  );

  renderErrorState = () => (
    <SectionWrapper>
      <div className="mx-auto max-w-3xl rounded-[32px] border border-danger/40 bg-danger/10 p-6 shadow-2xl sm:p-8">
        <div className="mb-3 text-[24px] font-semibold text-text-main">Ошибка</div>
        <p className="m-0 text-[15px] text-text-muted">{this.state.error}</p>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => this.loadFormData()}
            variant="outlineDanger"
            disabled={this.state.isLoading}
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );

  renderSelectSlotSection = () => {
    const { teacher, isSaving } = this.state;
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="flex flex-col gap-3">
          <span className="text-text-main">Куратор</span>
          <div className="rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[16px] text-text-main">
            {teacher?.firstName} {teacher?.lastName}
          </div>
        </div>
        <Button
          type="button"
          onClick={this.showAvailableTeachersModal}
          disabled={!teacher?.teacherId || isSaving}
          className="lg:min-w-[220px]"
        >
          Доступные окна...
        </Button>
      </div>
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
      <SectionWrapper>
        <SectionTitle className="text-center">Редактировать расписание</SectionTitle>

        <FormWrapper>
          <form onSubmit={this.handleSave} className="flex flex-col gap-8">
            <div className="text-center text-[18px] font-semibold text-text-main">
              Группа "{bandName}"
            </div>

            {this.renderSelectSlotSection()}

            <AvailableTeachersModal
              show={showAvailableTeacherModal}
              teachers={availableTeachers}
              onSlotsChange={this.handleSlotsChange}
              onClose={this.handleCloseAvailableTeachersModal}
              slotDuration={120}
            />

            <div className="h-px bg-white/10" />

            <ScheduleEditorWithDelete
              schedules={schedules}
              onChange={this.handleScheduleChange}
            />

            <div className="h-px bg-white/10" />

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="min-w-[220px]"
                disabled={isSaving}
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        </FormWrapper>
      </SectionWrapper>
    );
  }
}

export default BandScheduleForm;
