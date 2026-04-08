import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Avatar } from "../../../components/Avatar";
import { Button } from "../../../components/ui";
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

class StudentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: {
        firstName: "",
        phone: "",
        level: "Начинающий",
      },
      activeTab: "products",
      subscriptions: [],

      showAll: false,

      // Attendance Details
      showAttendanceModal: false,
      selectedAttendance: null,

      // Payment Modal
      showPaymentModal: false,
      selectedSubscriptionForPayment: null,
      isLoadingPayment: false,

      isLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
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
      console.error("Failed to load student data:", error);
      this.setState({ isLoading: false });
    }
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push(`/student/edit/${this.props.match.params.id}`);
  };

  handleTabChange = (activeTab) => {
    this.setState({ activeTab });
  };

  handleSelectEvent = (slotInfo) => {
    const newSelectedAttendance = this.state.attendances.filter(
      (a) => a.attendanceId === slotInfo.id,
    )[0];
    this.setState({
      showAttendanceModal: true,
      selectedAttendance: newSelectedAttendance,
    });
  };

  handleCloseModal = () => {
    this.setState({
      showAttendanceModal: false,
      selectedAttendance: null,
    });
  };

  handleEditSubscriptionClick = (subscription) => {
    this.props.history.push(
      `/subscription/${subscription.subscriptionId}/schedule`,
    );
  };

  handleTrialSubscriptionClick = (subscription) => {
    const selectedAttendance = this.state.attendances.find(
      (a) => a.subscriptionId === subscription.subscriptionId,
    );

    this.setState({
      selectedAttendance: selectedAttendance,
      showAttendanceModal: true,
    });
  };

  handleViewSubscriptionAttendances = async (subscription) => {
    // Navigate to the subscription attendances page
    this.props.history.push({
      pathname: `/subscription/${subscription.subscriptionId}/attendances`,
      state: {
        subscription: subscription,
        attendances:
          this.state.attendances?.filter(
            (attendance) =>
              attendance.subscriptionId === subscription.subscriptionId,
          ) || [],
      },
    });
  };

  handleAttendanceClick = (attendance) => {
    // Open the attendance modal when clicking on an attendance in the list
    this.setState({
      selectedAttendance: attendance,
      showAttendanceModal: true,
    });
  };

  handleAttendanceUpdate = (updatedData) => {
    const attendanceId = updatedData.attendanceId;

    // Update the main attendances array
    this.setState((prevState) => ({
      attendances:
        prevState.attendances?.map((attendance) =>
          attendance.attendanceId === attendanceId
            ? { ...attendance, ...updatedData }
            : attendance,
        ) || [],

      // Update selected attendance if it matches
      selectedAttendance:
        prevState.selectedAttendance?.attendanceId === attendanceId
          ? { ...prevState.selectedAttendance, ...updatedData }
          : prevState.selectedAttendance,
    }));
  };

  handlePayClick = (subscription) => {
    this.setState({
      showPaymentModal: true,
      selectedSubscriptionForPayment: subscription,
    });
  };

  handleClosePaymentModal = () => {
    this.setState({
      showPaymentModal: false,
      selectedSubscriptionForPayment: null,
    });
  };

  handleResubscribeClick = (subscription) => {
    // Navigate to subscription form with existing subscription data for renewal/refresh
    this.props.history.push({
      pathname: `/student/${this.state.student.studentId}/subscriptionForm`,
      state: {
        isRefresh: true,
        baseSubscription: subscription,
      },
    });
  };

  handlePaymentSubmit = async (paymentData) => {
    this.setState({ isLoadingPayment: true });

    try {
      console.log("Payment data:", paymentData);

      // If payment was successful, update the subscription status to Active
      if (paymentData.success && paymentData.subscriptionId) {
        this.setState((prevState) => ({
          subscriptions: prevState.subscriptions.map((subscription) =>
            subscription.subscriptionId === paymentData.subscriptionId
              ? { ...subscription, status: SubscriptionStatus.ACTIVE }
              : subscription,
          ),
        }));
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      throw error;
    } finally {
      this.setState({ isLoadingPayment: false });
    }
  };

  // Render Methods
  renderSubscriptionsTable(subscriptions) {
    return (
      <div className="flex flex-col gap-4">
        <SubscriptionList
          subscriptions={subscriptions}
          onSubscriptionClick={this.handleViewSubscriptionAttendances}
          onPayClick={this.handlePayClick}
          onResubscribeClick={this.handleResubscribeClick}
        />
        <div className="flex justify-end">
          <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-inner-bg px-4 py-2 text-[14px] text-text-main">
            <input
              type="checkbox"
              checked={this.state.showAll}
              onChange={(e) => {
                this.setState({ showAll: e.target.checked });
              }}
              className="h-4 w-4 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
            />
            <span>Показывать все</span>
          </label>
        </div>
      </div>
    );
  }

  renderTrialsTable(subscriptions) {
    return (
      <SubscriptionList
        subscriptions={subscriptions}
        onSubscriptionClick={this.handleTrialSubscriptionClick}
        onPayClick={this.handlePayClick}
        onResubscribeClick={this.handleResubscribeClick}
      />
    );
  }

  renderRentTable(subscriptions) {
    return (
      <SubscriptionList
        subscriptions={subscriptions}
        onSubscriptionClick={this.handleViewSubscriptionAttendances}
        onPayClick={this.handlePayClick}
        onResubscribeClick={this.handleResubscribeClick}
      />
    );
  }
  renderRerehearsalTable(subscriptions) {
    return (
      <SubscriptionList
        subscriptions={subscriptions}
        onSubscriptionClick={this.handleTrialSubscriptionClick}
        onResubscribeClick={this.handleResubscribeClick}
      />
    );
  }

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

    if (isLoading) {
      return <Loading message="Загрузка данных ученика..." />;
    }

    const sortedSubscriptions = [...subscriptions].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA; // Descending order
    });

    // Subscriptions
    let nonTrialSubscriptions = sortedSubscriptions.filter(
      (s) =>
        s.subscriptionType === SubscriptionType.LESSON ||
        s.subscriptionType === SubscriptionType.GROUP_LESSON,
    );
    nonTrialSubscriptions = showAll
      ? nonTrialSubscriptions
      : nonTrialSubscriptions.filter(
          (s) =>
            s.status === SubscriptionStatus.ACTIVE ||
            s.status === SubscriptionStatus.DRAFT,
        );

    // Trials
    const trialSubscriptions = sortedSubscriptions.filter(
      (s) => s.subscriptionType === SubscriptionType.TRIAL_LESSON,
    );

    // Rents
    const rentSubscriptions = sortedSubscriptions.filter(
      (s) => s.subscriptionType === SubscriptionType.RENT,
    );

    // Rehearsals
    const rehearsalSubscriptions = sortedSubscriptions.filter(
      (s) => s.subscriptionType === SubscriptionType.REHEARSAL,
    );

    // Events
    let events;
    if (attendances) {
      events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title:
          attendance.attendanceType === AttendanceType.TRIAL_LESSON
            ? "Пробный"
            : "Урок",
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        attendanceType: attendance.attendanceType,
        disciplineId: attendance.disciplineId,
      }));
    }

    return (
      <SectionWrapper>
        <SectionTitle>Ученик</SectionTitle>
        <ScreenHeader
          className="mb-4"
          avatar={<Avatar size="90px"/>}
          title={`${student.firstName} ${student.lastName}`}
          titleClassName="text-[24px]"
          onEdit={this.handleEditClick}
          meta={<InstagramIcon size="20px" title="Instagram" />}
          aside={<BandList bands={bands} />}
        />

        <div>
          <Tabs
            activeKey={activeTab}
            onSelect={(key) => {
              if (key) {
                this.handleTabChange(key);
              }
            }}
            id="student-screen-tabs"
          >
            <Tab eventKey="products" title="Уроки">
              <div className="flex justify-end mb-4">
                <Button
                  as={Link}
                  to={{
                    pathname: `/student/${student.studentId}/subscriptionForm`,
                    state: { student },
                  }}
                  variant="primary"
                >
                  + Добавить
                </Button>
              </div>
              <div className="">
                {this.renderSubscriptionsTable(nonTrialSubscriptions)}
              </div>
            </Tab>

            <Tab eventKey="trials" title="Пробные">
              <div className="mt-4 flex justify-end">
                <Button
                  as={Link}
                  to={{
                    pathname: `/student/${student.studentId}/addTrial`,
                    state: { student },
                  }}
                  variant="primary"
                  size="sm"
                >
                  + Добавить
                </Button>
              </div>
              <div className="mt-4">
                {this.renderTrialsTable(trialSubscriptions)}
              </div>
            </Tab>

            <Tab eventKey="rents" title="Аренда комнаты">
              <div className="mt-4 flex justify-end">
                <Button
                  as={Link}
                  to={{
                    pathname: `/student/${student.studentId}/roomRental`,
                    state: { student },
                  }}
                  variant="primary"
                  size="sm"
                >
                  + Добавить
                </Button>
              </div>
              <div className="mt-4">
                {this.renderRentTable(rentSubscriptions)}
              </div>
            </Tab>

            <Tab eventKey="rehearsals" title="Репетиции">
              <div className="mt-4 flex justify-end">
                <Button
                  as={Link}
                  to={{
                    pathname: `/student/${student.studentId}/rehearsal`,
                    state: { student },
                  }}
                  variant="primary"
                  size="sm"
                >
                  + Добавить
                </Button>
              </div>
              <div className="mt-4">
                {this.renderRerehearsalTable(rehearsalSubscriptions)}
              </div>
            </Tab>

            <Tab eventKey="calendar" title="Календарь">
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-[18px] font-semibold text-text-main">
                  <CalendarIcon />
                  <span>Календарь</span>
                </div>
                <div className="rounded-[20px] bg-inner-bg p-5">
                  <CalendarWeek
                    events={events}
                    onSelectEvent={(slotInfo) => {
                      this.handleSelectEvent(slotInfo);
                    }}
                  />
                </div>
                <AttendanceModal
                  attendance={selectedAttendance}
                  show={showAttendanceModal}
                  handleClose={this.handleCloseModal}
                  onAttendanceUpdate={this.handleAttendanceUpdate}
                  history={this.props.history}
                />
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <PaymentModal
            show={this.state.showPaymentModal}
            onHide={this.handleClosePaymentModal}
            subscription={this.state.selectedSubscriptionForPayment}
            onPaymentSubmit={this.handlePaymentSubmit}
            isLoading={this.state.isLoadingPayment}
          />
        </div>
      </SectionWrapper>
    );
  }
}

export default StudentScreen;
