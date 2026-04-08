import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, GroupIcon } from "../../components/icons";
import { Loading } from "../../components/Loading";
import { NoRecords } from "../../components/NoRecords";
import ScreenHeader from "../../components/screens/ScreenHeader";
import { Button, Container } from "../../components/ui";
import { SectionWrapper } from "../../layout";
import {
  activateBand,
  addBandMember,
  deactivateBand,
  generateAttendances,
  getBandScreenDetails,
  removeBandStudent,
  updateBandStudentRole,
} from "../../services/apiBandService";
import { AddStudentModal } from "../students/AddStudentModal";
import { BandAttendanceList } from "./BandAttendanceList";
import { BandStudents } from "./BandStudents";

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
    if (!bandId)
      return this.setState({ error: "Не указан ID группы", isLoading: false });
    try {
      this.setState({ isLoading: true, error: null });
      const data = await getBandScreenDetails(bandId);
      this.setState({
        band: data.band,
        attendances: data.attendances || [],
        isLoading: false,
      });
    } catch (e) {
      this.setState({ error: "Не удалось загрузить данные", isLoading: false });
    }
  }

  showAddStudentModal = (e) => {
    e.preventDefault();
    this.setState({ showAddStudentModal: true });
  };
  handleCloseAddStudentModal = () =>
    this.setState({ showAddStudentModal: false });

  handleAddStudent = async (student) => {
    try {
      const response = await addBandMember(this.state.bandId, {
        studentId: student.studentId,
      });
      await this.loadBandData();
      this.handleCloseAddStudentModal();
    } catch (e) {
      console.error(e);
    }
  };

  deleteStudent = async (index) => {
    const member = this.state.band.bandMembers[index];
    try {
      await removeBandStudent(
        this.state.bandId,
        member.bandMemberId || member.bandStudentId,
      );
      await this.loadBandData();
    } catch (e) {
      console.error(e);
    }
  };

  handleRoleChange = async (index, roleId) => {
    const member = this.state.band.bandMembers[index];

    console.log("Changing role for member:", member);
    try {
      await updateBandStudentRole(
        this.state.bandId,
        member.bandMemberId,
        roleId,
      );
      await this.loadBandData();
    } catch (e) {
      console.error(e);
    }
  };

  handleEditSchedules = () =>
    this.props.history.push(`/band/${this.state.bandId}/schedule`);
  handleEditClick = () =>
    this.props.history.push(`/band/${this.state.bandId}/edit`);

  handleActivateToggle = async (band) => {
    this.setState({ isActivating: true });
    try {
      band.isActive
        ? await deactivateBand(band.bandId)
        : await activateBand(band.bandId);
      await this.loadBandData();
    } finally {
      this.setState({ isActivating: false });
    }
  };

  handleGenerateAttendances = async () => {
    this.setState({ isGenerating: true });
    try {
      await generateAttendances(this.state.bandId);
      await this.loadBandData();
    } finally {
      this.setState({ isGenerating: false });
    }
  };

  render() {
    const {
      band,
      isLoading,
      isActivating,
      isGenerating,
      showAddStudentModal,
      error,
      attendances,
    } = this.state;
    if (isLoading) return <Loading />;
    if (error || !band)
      return (
        <SectionWrapper>
          <div className="text-center text-text-muted">
            {error || "Группа не найдена"}
          </div>
        </SectionWrapper>
      );

    return (
      <SectionWrapper>
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <ScreenHeader
            avatar={<GroupIcon size="64px" color="#E2E7F6" />}
            title={band.name}
            onEdit={this.handleEditClick}
            aside={
              <div className="flex w-full flex-col gap-3 lg:w-[240px]">
                <Button
                  variant="secondary"
                  onClick={this.handleGenerateAttendances}
                  disabled={isGenerating}
                  style={{ background: "transparent" }}
                >
                  {isGenerating ? "Создание..." : "Пересоздать слоты"}
                </Button>
                <Button
                  onClick={this.handleEditSchedules}
                  style={{ background: "transparent" }}
                >
                  <CalendarIcon color="currentColor" className="mr-2" />
                  Расписание
                </Button>
                <Button
                  variant={band.isActive ? "outlineDanger" : "outlineSuccess"}
                  onClick={() => this.handleActivateToggle(band)}
                  disabled={isActivating}
                  style={{ background: "transparent" }}
                >
                  {isActivating
                    ? "Ждите..."
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
                    className="text-[#E2E7F6] no-underline hover:text-white"
                    style={{ background: "transparent" }}
                  >
                    {band.teacher.firstName} {band.teacher.lastName}
                  </Link>
                ) : (
                  "Не назначен"
                )}
              </div>
              <div className="flex gap-8 text-sm text-[#E2E7F6]">
                <div>
                  <div className="text-[#94A3B8]">Участников</div>
                  {band.bandMembers?.length || 0}
                </div>
                <div>
                  <div className="text-[#94A3B8]">Расписание</div>
                  {band.schedules?.length || 0} слотов
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
              <div className="mb-5 text-[20px] font-semibold text-text-main">
                Репетиции
              </div>
              <BandAttendanceList
                attendances={attendances}
                onAttendanceClick={() => {}}
              />
            </Container>
            <div className="flex flex-col gap-6">
              <Container className="rounded-[32px] p-6 shadow-2xl sm:p-8">
                <div className="mb-5 text-[20px] font-semibold text-text-main">
                  Участники
                </div>
                <BandStudents
                  bandMembers={
                    band.bandMembers?.map((m) => ({
                      studentId: m.student?.studentId || m.studentId,
                      firstName: m.student?.firstName,
                      lastName: m.student?.lastName,
                      birthDate: m.student?.birthDate,
                      bandRoleId: m.bandRoleId,
                      bandStudentId: m.bandStudentId,
                    })) || []
                  }
                  onAddStudent={this.showAddStudentModal}
                  onDeleteStudent={this.deleteStudent}
                  onRoleChange={this.handleRoleChange}
                />
              </Container>
              <Container className="rounded-[32px] p-6 shadow-2xl sm:p-8">
                <div className="mb-5 text-[20px] font-semibold text-text-main">
                  Трэклист
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
