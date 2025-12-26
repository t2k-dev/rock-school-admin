import { format } from "date-fns";
import React from "react";
import { Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getDisciplineName } from "../../../constants/disciplines";
import { getSubscriptionStatusName, getTrialSubscriptionStatusName } from "../../../constants/subscriptions";
import SubscriptionStatus from "../../../constants/SubscriptionStatus";
import { getStudentScreenDetails } from "../../../services/apiStudentService";
import { DisciplineIcon } from "../../common/DisciplineIcon";
import { CalendarWeek } from "../../shared/calendar/CalendarWeek";
import { Loading } from "../../shared/Loading";

import { CoinsIcon } from "../../shared/icons/CoinsIcon";
import { NextIcon } from "../../shared/icons/NextIcon";
import { RefreshIcon } from "../../shared/icons/RefreshIcon";
import SubscriptionAttendancesModal from "../../shared/modals/SubscriptionAttendancesModal";
import { AttendanceModal } from "../../shared/slots/AttendanceModal";
import PaymentForm from "../payments/PaymentForm";
import StudentScreenCard from "./StudentScreenCard";

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
      showAttendanceDetailsModal: false,
      selectedAttendance: null,
      
      // Subscription Attendances Modal
      showSubscriptionAttendancesModal: false,
      selectedSubscription: null,
      subscriptionAttendances: [],
      isLoadingAttendances: false,

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
    console.log(slotInfo);
    const newSelectedAttendance = this.state.attendances.filter((a) => a.attendanceId === slotInfo.id)[0];
    this.setState({ showAttendanceDetailsModal: true, selectedAttendance: newSelectedAttendance });
  };

  handleCloseModal = () => {
    this.setState({ 
      showAttendanceDetailsModal: false,
      selectedAttendance: null
    });
  };

  handleEditSubscriptionClick = (subscription) => {
    this.props.history.push(`/subscription/${subscription.subscriptionId}/edit`);
  };

  handleViewSubscriptionAttendances = async (subscription) => {
    this.setState({
      showSubscriptionAttendancesModal: true,
      selectedSubscription: subscription,
      isLoadingAttendances: true,
      subscriptionAttendances: []
    });

    try {
      // You'll need to implement this API call
      // const attendances = await getSubscriptionAttendances(subscription.subscriptionId);
      
      // For now, filter from existing attendances (you can improve this later)
      const filteredAttendances = this.state.attendances?.filter(
        attendance => attendance.subscriptionId === subscription.subscriptionId
      ) || [];
      
      this.setState({
        subscriptionAttendances: filteredAttendances,
        isLoadingAttendances: false
      });
    } catch (error) {
      console.error('Failed to load subscription attendances:', error);
      this.setState({
        isLoadingAttendances: false,
        subscriptionAttendances: []
      });
    }
  };

  handleCloseSubscriptionAttendancesModal = () => {
    this.setState({
      showSubscriptionAttendancesModal: false,
      selectedSubscription: null,
      subscriptionAttendances: [],
      isLoadingAttendances: false
    });
  };

  handleAttendanceClick = (attendance) => {
    // Open the attendance modal when clicking on an attendance in the list
    this.setState({
      selectedAttendance: attendance,
      showAttendanceDetailsModal: true
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
      
      // Update subscription attendances if they're currently displayed
      subscriptionAttendances: prevState.subscriptionAttendances.map(attendance => 
        attendance.attendanceId === attendanceId 
          ? { ...attendance, ...updatedData }
          : attendance
      ),
      
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
      // TODO: Add API call to submit payment
      console.log('Payment data:', paymentData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just log the payment data
      // In the future, this would call an API service:
      // await ApiPaymentService.createPayment(paymentData);
      
      // Optionally reload student data to reflect payment
      // await this.loadStudentData();
      
      alert('Платеж успешно обработан!');
    } catch (error) {
      console.error('Payment submission error:', error);
      throw error;
    } finally {
      this.setState({ isLoadingPayment: false });
    }
  };

  // Render Methods
  renderSubscriptionsTable(subscriptions) {
    let subscriptionsTable;

    if (subscriptions && subscriptions.length > 0) {
      subscriptionsTable = (
        subscriptions.map((item, index) => (
          <tr 
            key={index}
            onClick={() => this.handleViewSubscriptionAttendances(item)}
            style={{ 
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            <td style={{width: "120px"}}>{format(item.startDate, "yyyy-MM-dd")}</td>
            <td>
              <DisciplineIcon disciplineId={item.disciplineId} />
              <span style={{ marginLeft: "10px" }}>{getDisciplineName(item.disciplineId)}</span>
            </td>
            <td>
              <Link 
                to={`/teacher/${item.teacher.teacherId}`}
                onClick={(e) => e.stopPropagation()}
              >
                {item.teacher.firstName} {item.teacher.lastName}
              </Link>
            </td>
            <td>{item.attendancesLeft} из {item.attendanceCount}</td>
            <td>{getSubscriptionStatusName(item.status)}</td>
            <td>
              <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                {item.status === SubscriptionStatus.DRAFT && (
                  <CoinsIcon
                    size="20px"
                    title="Оплатить"
                    onIconClick={() => this.handlePayClick(item)}
                  />
                )}
                <RefreshIcon
                  size="20px"
                  title="Продлить"
                  onIconClick={() => this.handleResubscribeClick(item)}
                />
              </div>
            </td>
          </tr>
        ))
      );
    } else {
      subscriptionsTable = (
          <tr key={1}>
            <td colSpan="6" style={{ textAlign: "center" }}>
              Нет записей
            </td>
          </tr>
      );
    }

    return (
      <>
        <Table striped bordered hover>
            <thead>
              <tr>
                <th>Дата начала</th>
                <th>Направление</th>
                <th>Преподаватель</th>
                <th>Занятий осталось</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscriptionsTable}
            </tbody>
        </Table>
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
            className=""
          />
        </div>
      </>
    )
  }

  renderTrialsTable(subscriptions) {
    let trialsTable;

    if (subscriptions && subscriptions.length > 0) {
      trialsTable = (
        subscriptions.map((item, index) => (
          <tr key={index}>
            <td>{format(item.startDate, "yyyy-MM-dd")}</td>
            <td>
              <DisciplineIcon disciplineId={item.disciplineId} />
              <span style={{ marginLeft: "10px" }}>{getDisciplineName(item.disciplineId)}</span>
            </td>
            <td>
              <Link to={`/teacher/${item.teacher.teacherId}`}>
                {item.teacher.firstName} {item.teacher.lastName}
              </Link>
            </td>
            <td>{getTrialSubscriptionStatusName(item.trialStatus)}</td>
            <td>
                <NextIcon 
                  size="20px"
                  onIconClick={() => this.handleResubscribeClick(item)}
                />

            </td>
          </tr>
      )));
    } else {
      trialsTable = (
          <tr key={1}>
            <td colSpan="4" style={{ textAlign: "center" }}>
              Нет записей
            </td>
          </tr>
      );
    }

    return(
      <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "100px" }}>Дата</th>
              <th>Направление</th>
              <th>Преподаватель</th>
              <th>Результат</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{trialsTable}</tbody>
      </Table>
    )
  }

  render() {
    const { isLoading, student, subscriptions, showCompleted, attendances, selectedAttendance, showAttendanceDetailsModal } = this.state;
    
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
    let nonTrialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus === null);
    nonTrialSubscriptions = showCompleted
      ? nonTrialSubscriptions
      : nonTrialSubscriptions.filter((s) => s.status !== SubscriptionStatus.COMPLETED);

    // Trials
    const trialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus !== null);

    // Events
    let events;
    if (attendances) {
      events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title: attendance.isTrial ? "Пробное занятие" : "Занятие",
        start: new Date(attendance.startDate),
        end: new Date(attendance.endDate),
        resourceId: attendance.roomId,
        status: attendance.status,
        isTrial: attendance.isTrial,
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
                <h3>Абонементы</h3>
                {this.renderSubscriptionsTable(nonTrialSubscriptions)}

                <h3>Пробные занятия</h3>
                {this.renderTrialsTable(trialSubscriptions)}  

                <h3>Репетиции</h3>
                  Нет записей

            </Tab>
            <Tab eventKey="calendar" title="Календарь">
              <CalendarWeek
                events={events}
                onSelectEvent={(slotInfo) => {
                  this.handleSelectEvent(slotInfo);
                }}
              />
              <AttendanceModal
                attendance={selectedAttendance}
                show={showAttendanceDetailsModal}
                handleClose={this.handleCloseModal}
                onAttendanceUpdate={this.handleAttendanceUpdate}
              />
            </Tab>
          </Tabs>

          <SubscriptionAttendancesModal
            show={this.state.showSubscriptionAttendancesModal}
            onHide={this.handleCloseSubscriptionAttendancesModal}
            subscription={this.state.selectedSubscription}
            attendances={this.state.subscriptionAttendances}
            isLoading={this.state.isLoadingAttendances}
            onAttendanceClick={this.handleAttendanceClick}
            onEditSchedules={this.handleEditSubscriptionClick}
          />

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
