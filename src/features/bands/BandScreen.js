import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, GroupIcon } from "../../components/icons";
import { Loading } from "../../components/Loading";
import { NoRecords } from "../../components/NoRecords";
import ScreenHeader from "../../components/screens/ScreenHeader";
import { Button, Container } from "../../components/ui";
import { SectionWrapper } from "../../layout";
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
    <Loading message="Загрузка данных группы..." />
  );

  renderErrorState = () => (
    <SectionWrapper>
      <div className="mx-auto max-w-3xl rounded-[32px] border border-danger/40 bg-danger/10 p-6 shadow-2xl sm:p-8">
        <div className="mb-3 text-[24px] font-semibold text-text-main">Ошибка</div>
        <p className="m-0 text-[15px] text-text-muted">{this.state.error}</p>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => this.loadBandData()}
            variant="outlineDanger"
            disabled={this.state.isLoading}
          >
            Попробовать снова
          </Button>
        </div>
      </div>
    </SectionWrapper>
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
        <SectionWrapper>
          <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-card-bg p-6 shadow-2xl sm:p-8">
            <div className="mb-3 text-[24px] font-semibold text-text-main">Группа не найдена</div>
            <p className="m-0 text-[15px] text-text-muted">
              Запрашиваемая группа не существует или была удалена.
            </p>
            <div className="mt-6 flex justify-end">
              <Button as={Link} to="/bands" variant="ghost">
                Вернуться к списку групп
              </Button>
            </div>
          </div>
        </SectionWrapper>
      );
    }

    return (
      <SectionWrapper>
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <ScreenHeader
            className="mb-4"
            avatar={<GroupIcon size="64px" color="#E2E7F6" />}
            title={band.name}
            titleClassName="text-[24px]"
            onEdit={this.handleEditClick}
            subtitle={band.isActive ? "Активная группа" : "Неактивная группа"}
            asideClassName="w-full lg:w-auto lg:min-w-[240px]"
            aside={
              <div className="flex w-full flex-col gap-3 lg:w-[240px]">
                <Button
                  variant="secondary"
                  onClick={this.handleGenerateAttendances}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Создание..." : "Пересоздать слоты"}
                </Button>

                <Button onClick={() => this.handleEditSchedules(band)}>
                  <span className="inline-flex items-center gap-2">
                    <CalendarIcon color="currentColor" />
                    <span>Расписание</span>
                  </span>
                </Button>

                <Button
                  variant={band.isActive ? "outlineDanger" : "outlineSuccess"}
                  type="button"
                  onClick={() => this.handleActivateToggle(band)}
                  disabled={isActivating}
                >
                  {isActivating
                    ? band.isActive
                      ? "Отключение..."
                      : "Включение..."
                    : band.isActive
                      ? "Отключить"
                      : "Включить"}
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

          <AddStudentModal
            show={showAddStudentModal}
            onAddStudent={this.handleAddStudent}
            handleClose={this.handleCloseAddStudentModal}
            onlyExistingStudents={true}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <Container className="rounded-[32px] p-6 shadow-2xl sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="text-[20px] font-semibold text-text-main">Репетиции</div>
              </div>
              {this.renderAttendances()}
            </Container>

            <div className="flex flex-col gap-6">
              <Container className="rounded-[32px] p-6 shadow-2xl sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="text-[20px] font-semibold text-text-main">Участники</div>
                </div>
                <BandStudents
                  bandMembers={band.bandMembers?.map((bandMember) => ({
                    studentId: bandMember.student?.studentId || bandMember.studentId,
                    firstName: bandMember.student?.firstName,
                    lastName: bandMember.student?.lastName,
                    birthDate: bandMember.student?.birthDate,
                    bandRoleId: bandMember.bandRoleId,
                    bandStudentId: bandMember.bandStudentId,
                  })) || []}
                  onAddStudent={this.showAddStudentModal}
                  onDeleteStudent={this.deleteStudent}
                  onRoleChange={this.handleRoleChange}
                />
              </Container>

              <Container className="rounded-[32px] p-6 shadow-2xl sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="text-[20px] font-semibold text-text-main">Трэклист</div>
                </div>
                <NoRecords />
              </Container>
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }
}