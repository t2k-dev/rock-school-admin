import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../../components/Avatar";
import { Button, Tabs } from "../../../components/ui";
import SubscriptionStatus from "../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../constants/SubscriptionType";
import { CalendarWeek } from "../../../components/calendar/CalendarWeek";
import { CalendarIcon, InstagramIcon } from "../../../components/icons";
import { Loading } from "../../../components/Loading";
import ScreenHeader from "../../../components/screens/ScreenHeader";
import AttendanceType from "../../../constants/AttendanceType";
import { SectionTitle, SectionWrapper } from "../../../layout";
import { getStudentScreenDetails } from "../../../services/apiStudentService";
import { AttendanceModal } from "../../attendances/AttendanceModal/AttendanceModal";
import PaymentModal from "../../payments/PaymentModal";
import BandList from "../BandList";
import { SubscriptionList } from "./SubscriptionList";

interface Student {
  studentId: string | number;
  firstName: string;
  lastName: string;
  phone: string;
  level: string;
}

interface StudentScreenProps {
  match: {
    params: {
      id: string;
    };
  };
  history: any;
}

interface StudentScreenState {
  student: Student;
  activeTab: string;
  subscriptions: any[];
  attendances: any[];
  bands: any[];
  showAll: boolean;
  showAttendanceModal: boolean;
  selectedAttendance: any;
  showPaymentModal: boolean;
  selectedSubscriptionForPayment: any;
  isLoadingPayment: boolean;
  isLoading: boolean;
}

class StudentScreen extends React.Component<
  StudentScreenProps,
  StudentScreenState
> {
  constructor(props: StudentScreenProps) {
    super(props);
    this.state = {
      student: {
        studentId: "",
        firstName: "",
        lastName: "",
        phone: "",
        level: "Начинающий",
      },
      activeTab: "products",
      subscriptions: [],
      attendances: [],
      bands: [],
      showAll: false,
      showAttendanceModal: false,
      selectedAttendance: null,
      showPaymentModal: false,
      selectedSubscriptionForPayment: null,
      isLoadingPayment: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    this.loadStudentData();
  }

  async loadStudentData() {
    try {
      this.setState({ isLoading: true });
      const details = await getStudentScreenDetails(this.props.match.params.id);
      this.setState({
        student: details.student,
        subscriptions: details.subscriptions,
        attendances: details.attendances,
        bands: details.bands,
        isLoading: false,
      });
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      this.setState({ isLoading: false });
    }
  }

  handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.history.push(`/student/edit/${this.props.match.params.id}`);
  };

  handleTabChange = (activeTab: string) => {
    this.setState({ activeTab });
  };

  handleSelectEvent = (slotInfo: any) => {
    const selected = this.state.attendances.find(
      (a) => a.attendanceId === slotInfo.id,
    );
    this.setState({ showAttendanceModal: true, selectedAttendance: selected });
  };

  handleCloseModal = () => {
    this.setState({ showAttendanceModal: false, selectedAttendance: null });
  };

  handleViewSubscriptionAttendances = (subscription: any) => {
    this.props.history.push({
      pathname: `/subscription/${subscription.subscriptionId}/attendances`,
      state: {
        subscription,
        attendances:
          this.state.attendances?.filter(
            (a) => a.subscriptionId === subscription.subscriptionId,
          ) || [],
      },
    });
  };

  handleTrialSubscriptionClick = (subscription: any) => {
    const selected = this.state.attendances.find(
      (a) => a.subscriptionId === subscription.subscriptionId,
    );
    this.setState({ selectedAttendance: selected, showAttendanceModal: true });
  };

  handlePayClick = (subscription: any) => {
    this.setState({
      showPaymentModal: true,
      selectedSubscriptionForPayment: subscription,
    });
  };

  handleResubscribeClick = (subscription: any) => {
    this.props.history.push({
      pathname: `/student/${this.state.student.studentId}/subscriptionForm`,
      state: { isRefresh: true, baseSubscription: subscription },
    });
  };

  handlePaymentSubmit = async (paymentData: any) => {
    this.setState({ isLoadingPayment: true });
    try {
      if (paymentData.success && paymentData.subscriptionId) {
        this.setState((prevState) => ({
          subscriptions: prevState.subscriptions.map((s) =>
            s.subscriptionId === paymentData.subscriptionId
              ? { ...s, status: SubscriptionStatus.ACTIVE }
              : s,
          ),
        }));
      }
    } finally {
      this.setState({ isLoadingPayment: false });
    }
  };

  renderTabAction = (path: string) => (
    <div className="flex justify-end mb-4">
      <Button
        as={Link}
        to={{
          pathname: `/student/${this.state.student.studentId}/${path}`,
          state: { student: this.state.student },
        }}
        variant="primary"
        size="sm"
      >
        + Добавить
      </Button>
    </div>
  );

  render() {
    const {
      activeTab,
      isLoading,
      student,
      bands,
      subscriptions,
      showAll,
      attendances,
      selectedAttendance,
      showAttendanceModal,
    } = this.state;

    if (isLoading) return <Loading message="Загрузка данных ученика..." />;

    const sorted = [...subscriptions].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

    const filterSubs = (types: (string | number)[], checkStatus = true) => {
      let filtered = sorted.filter((s) => types.includes(s.subscriptionType));
      if (checkStatus && !showAll) {
        filtered = filtered.filter(
          (s) =>
            s.status === SubscriptionStatus.ACTIVE ||
            s.status === SubscriptionStatus.DRAFT,
        );
      }
      return filtered;
    };

    const lessonSubs = filterSubs([
      SubscriptionType.LESSON,
      SubscriptionType.GROUP_LESSON,
    ]);
    const trialSubs = filterSubs([SubscriptionType.TRIAL_LESSON], false);
    const rentSubs = filterSubs([SubscriptionType.RENT], false);
    const rehearsalSubs = filterSubs([SubscriptionType.REHEARSAL], false);

    const events = attendances?.map((a) => ({
      id: a.attendanceId,
      title:
        a.attendanceType === AttendanceType.TRIAL_LESSON ? "Пробный" : "Урок",
      start: new Date(a.startDate),
      end: new Date(a.endDate),
      resourceId: a.roomId,
      status: a.status,
      attendanceType: a.attendanceType,
      disciplineId: a.disciplineId,
    }));

    const tabsData = [
      {
        id: "products",
        title: "Уроки",
        content: (
          <div className="mt-4">
            {this.renderTabAction("subscriptionForm")}
            <SubscriptionList
              subscriptions={lessonSubs}
              onSubscriptionClick={this.handleViewSubscriptionAttendances}
              onPayClick={this.handlePayClick}
              onResubscribeClick={this.handleResubscribeClick}
            />
            <div className="flex justify-end mt-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={(e) => this.setState({ showAll: e.target.checked })}
                  className="rounded bg-transparent border-white/20 text-accent"
                />
                <span>Показывать все</span>
              </label>
            </div>
          </div>
        ),
      },
      {
        id: "trials",
        title: "Пробные",
        content: (
          <div className="mt-4">
            {this.renderTabAction("addTrial")}
            <SubscriptionList
              subscriptions={trialSubs}
              onSubscriptionClick={this.handleTrialSubscriptionClick}
              onPayClick={this.handlePayClick}
              onResubscribeClick={this.handleResubscribeClick}
            />
          </div>
        ),
      },
      {
        id: "rents",
        title: "Аренда",
        content: (
          <div className="mt-4">
            {this.renderTabAction("roomRental")}
            <SubscriptionList
              subscriptions={rentSubs}
              onSubscriptionClick={this.handleViewSubscriptionAttendances}
              onPayClick={this.handlePayClick}
              onResubscribeClick={this.handleResubscribeClick}
            />
          </div>
        ),
      },
      {
        id: "rehearsals",
        title: "Репетиции",
        content: (
          <div className="mt-4">
            {this.renderTabAction("rehearsal")}
            <SubscriptionList
              subscriptions={rehearsalSubs}
              onSubscriptionClick={this.handleTrialSubscriptionClick}
              onResubscribeClick={this.handleResubscribeClick}
            />
          </div>
        ),
      },
      {
        id: "calendar",
        title: "Календарь",
        content: (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-text-main">
              <CalendarIcon />
              <span>Расписание</span>
            </div>
            <div className="rounded-[20px] bg-inner-bg p-5 border border-white/5">
              <CalendarWeek
                events={events}
                onSelectEvent={this.handleSelectEvent}
              />
            </div>
          </div>
        ),
      },
    ];

    return (
      <SectionWrapper>
        <SectionTitle>Ученик</SectionTitle>
        <ScreenHeader
          className="mb-8"
          avatar={<Avatar size="90px" type="student" />}
          title={`${student.firstName} ${student.lastName}`}
          titleClassName="text-[24px]"
          onEdit={this.handleEditClick}
          meta={<InstagramIcon size="20px" />}
          aside={<BandList bands={bands} />}
        />

        <Tabs tabs={tabsData} defaultTabId={activeTab} />

        <AttendanceModal
          attendance={selectedAttendance}
          show={showAttendanceModal}
          handleClose={this.handleCloseModal}
          onAttendanceUpdate={(data: any) => {
            this.setState((prev) => ({
              attendances: prev.attendances.map((a) =>
                a.attendanceId === data.attendanceId ? { ...a, ...data } : a,
              ),
            }));
          }}
          history={this.props.history}
        />

        <PaymentModal
          show={this.state.showPaymentModal}
          onHide={() => this.setState({ showPaymentModal: false })}
          subscription={this.state.selectedSubscriptionForPayment}
          onPaymentSubmit={this.handlePaymentSubmit}
          isLoading={this.state.isLoadingPayment}
        />
      </SectionWrapper>
    );
  }
}

export default StudentScreen;
