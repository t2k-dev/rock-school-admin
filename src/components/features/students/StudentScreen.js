import React from "react";
import { Button, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import SubscriptionStatus from "../../../constants/SubscriptionStatus";
import SubscriptionType from "../../../constants/SubscriptionType";

import AttendanceType from "../../../constants/AttendanceType";
import { getStudentScreenDetails } from "../../../services/apiStudentService";
import { CalendarWeek } from "../../shared/calendar/CalendarWeek";
import { Loading } from "../../shared/Loading";
import { AttendanceModal } from "../../shared/modals/AttendanceModal";
import PaymentForm from "../payments/PaymentForm";
import StudentScreenCard from "./StudentScreenCard";
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
      subscriptions: [],

      showCompleted: false,

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
    try{
      this.setState({ isLoading: true });

      const details = await getStudentScreenDetails(this.props.match.params.id);

      this.setState({
        student: details.student,
        subscriptions: details.subscriptions,
        attendances: details.attendances,
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

  handleSelectEvent = (slotInfo) => {
    const newSelectedAttendance = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];
    this.setState({ showAttendanceModal: true, selectedAttendance: newSelectedAttendance });
  };

  handleCloseModal = () => {
    this.setState({ 
      showAttendanceModal: false,
      selectedAttendance: null
    });
  };

  handleEditSubscriptionClick = (subscription) => {
    this.props.history.push(`/subscription/${subscription.subscriptionId}/edit`);
  };

  handleTrialSubscriptionClick = (subscription) => {
    const selectedAttendance = this.state.attendances.find(a => a.subscriptionId === subscription.subscriptionId);

    this.setState({
      selectedAttendance: selectedAttendance,
      showAttendanceModal: true
    });
  }

  handleViewSubscriptionAttendances = async (subscription) => {
    // Navigate to the subscription attendances page
    this.props.history.push({
      pathname: `/subscription/${subscription.subscriptionId}/attendances`,
      state: {
        subscription: subscription,
        attendances: this.state.attendances?.filter(
          attendance => attendance.subscriptionId === subscription.subscriptionId
        ) || []
      }
    });
  };

  handleAttendanceClick = (attendance) => {
    // Open the attendance modal when clicking on an attendance in the list
    this.setState({
      selectedAttendance: attendance,
      showAttendanceModal: true
    });
  };

  handleAttendanceUpdate = (updatedData) => {
    const attendanceId = updatedData.attendanceId;
    
    // Update the main attendances array
    this.setState(prevState => ({
      attendances: prevState.attendances?.map(attendance => 
        attendance.attendanceId === attendanceId 
          ? { ...attendance, ...updatedData }
          : attendance
      ) || [],
      
      // Update selected attendance if it matches
      selectedAttendance: prevState.selectedAttendance?.attendanceId === attendanceId
        ? { ...prevState.selectedAttendance, ...updatedData }
        : prevState.selectedAttendance
    }));
  };

  handlePayClick = (subscription) => {
    this.setState({
      showPaymentModal: true,
      selectedSubscriptionForPayment: subscription
    });
  };

  handleClosePaymentModal = () => {
    this.setState({
      showPaymentModal: false,
      selectedSubscriptionForPayment: null
    });
  };

  handleResubscribeClick = (subscription) => {
    // Navigate to subscription form with existing subscription data for renewal/refresh
    this.props.history.push({
      pathname: `/student/${this.state.student.studentId}/subscriptionForm`,
      state: {
        isRefresh: true,
        baseSubscription: subscription,
      }
    });
  };

  handlePaymentSubmit = async (paymentData) => {
    this.setState({ isLoadingPayment: true });
    
    try {
      console.log('Payment data:', paymentData);
      
      // If payment was successful, update the subscription status to Active
      if (paymentData.success && paymentData.subscriptionId) {
        this.setState(prevState => ({
          subscriptions: prevState.subscriptions.map(subscription => 
            subscription.subscriptionId === paymentData.subscriptionId
              ? { ...subscription, status: SubscriptionStatus.ACTIVE }
              : subscription
          )
        }));
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      throw error;
    } finally {
      this.setState({ isLoadingPayment: false });
    }
  };

  // Render Methods
  renderSubscriptionsTable(subscriptions) {
    return (
      <>
        <SubscriptionList
          subscriptions={subscriptions}
          onSubscriptionClick={this.handleViewSubscriptionAttendances}
          onPayClick={this.handlePayClick}
          onResubscribeClick={this.handleResubscribeClick}
        />
        <div className="d-flex mt-2">
          <div className="flex-grow-1"></div>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Показывать завершенные"
            checked={this.state.showCompleted}
            onChange={(e) => {
              this.setState({ showCompleted: e.target.checked });
            }}
          />
        </div>
      </>
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
    )
  }

  render() {
    const { isLoading, student, subscriptions, showCompleted, attendances, selectedAttendance, showAttendanceModal } = this.state;
    
    if (isLoading) {
      return <Loading
        message="Загрузка данных ученика..."
      />
    }

    const sortedSubscriptions = subscriptions.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB - dateA; // Descending order
    });

    // Subscriptions
    let nonTrialSubscriptions = sortedSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.LESSON);
    nonTrialSubscriptions = showCompleted
      ? nonTrialSubscriptions
      : nonTrialSubscriptions.filter((s) => s.status !== SubscriptionStatus.COMPLETED);

    // Trials
    const trialSubscriptions = sortedSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.TRIAL_LESSON);

    // Rents
    const rentSubscriptions = sortedSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.RENT);

    // Events
    let events;
    if (attendances) {
      events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title: attendance.attendanceType === AttendanceType.TRIAL_LESSON ? "Пробное" : "Занятие",
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        attendanceType: attendance.attendanceType,
        disciplineId: attendance.disciplineId,
      }));
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <StudentScreenCard item={student} history={this.props.history} />
        </Row>
        <Row className="mb-3">
          <Tabs defaultActiveKey="products" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="products" title="Продукты">

                <div className="d-flex mb-2 mt-2">
                  <div className="flex-grow-1"><h3>Абонементы</h3></div>
                  <div>
                    <Button
                      as={Link}
                      to={{
                        pathname: `/student/${student.studentId}/subscriptionForm`,
                        state: { student: student },
                      }}
                      variant="outline-success"
                      type="null"
                      size="sm"
                      className="w-100"
                    >
                      + Добавить
                    </Button>
                  </div>
                </div>
                {this.renderSubscriptionsTable(nonTrialSubscriptions)}

                <div className="d-flex mb-2 mt-4">
                  <div className="flex-grow-1"><h3>Пробные занятия</h3></div>
                  <div>
                    <Button
                      as={Link}
                      to={{
                        pathname: `/student/${student.studentId}/addTrial`,
                        state: { student: student },
                      }}
                      variant="outline-success"
                      type="null"
                      size="sm"
                      className="w-100"
                    >
                      + Добавить
                    </Button>
                  </div>
                </div>
                {this.renderTrialsTable(trialSubscriptions)}  

                <div className="d-flex mb-2 mt-4">
                  <div className="flex-grow-1"><h3>Аренда комнаты</h3></div>
                  <div>
                    <Button
                      as={Link}
                      to={{
                        pathname: `/student/${student.studentId}/roomRental`,
                        state: { student: student },
                      }}
                      variant="outline-success"
                      type="null"
                      size="sm"
                      className="w-100"
                    >
                      + Добавить
                    </Button>
                  </div>
                </div>
                {this.renderRentTable(rentSubscriptions)}

                <div className="d-flex mb-2 mt-4">
                  <div className="flex-grow-1"><h3>Репетиции</h3></div>
                  <div>
                    <Button
                      as={Link}
                      to={{
                        pathname: `/student/${student.studentId}/subscriptionForm`,
                        state: { student: student },
                      }}
                      variant="outline-success"
                      type="null"
                      size="sm"
                      className="w-100"
                    >
                      + Добавить
                    </Button>
                  </div>
                </div>
                {this.renderRerehearsalTable(null)}
            </Tab>
            <Tab eventKey="calendar" title="Календарь">
              <CalendarWeek
                events={events}
                onSelectEvent={(slotInfo) => {this.handleSelectEvent(slotInfo);}}
              />
              <AttendanceModal
                attendance={selectedAttendance}
                show={showAttendanceModal}
                handleClose={this.handleCloseModal}
                onAttendanceUpdate={this.handleAttendanceUpdate}
                history={this.props.history}
              />
            </Tab>
          </Tabs>

          <PaymentForm
            show={this.state.showPaymentModal}
            onHide={this.handleClosePaymentModal}
            subscription={this.state.selectedSubscriptionForPayment}
            onPaymentSubmit={this.handlePaymentSubmit}
            isLoading={this.state.isLoadingPayment}
          />
        </Row>
        <Row>
          
        </Row>
      </Container>
    );
  }
}

export default StudentScreen;
