import { format } from "date-fns";
import React from "react";
import { Badge, Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getDisciplineName } from "../../../constants/disciplines";
import MyDateFormat from "../../../constants/formats";
import SubscriptionStatus, { getSubscriptionStatusName } from "../../../constants/SubscriptionStatus";
import { getTrialSubscriptionStatusName } from "../../../constants/SubscriptionTrialStatus";
import SubscriptionType from "../../../constants/SubscriptionType";

import { getStudentScreenDetails } from "../../../services/apiStudentService";
import { CalendarWeek } from "../../shared/calendar/CalendarWeek";
import { DisciplineIcon } from "../../shared/discipline/DisciplineIcon";
import { CoinsIcon } from "../../shared/icons/CoinsIcon";
import { NextIcon } from "../../shared/icons/NextIcon";
import { Loading } from "../../shared/Loading";
import { AttendanceModal } from "../../shared/modals/AttendanceModal";
import { NoRecords } from "../../shared/NoRecords";
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

    if (subscriptions && subscriptions.length > 0) {
      return (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="date-column">Дата начала</th>
                <th className="discipline-column">Направление</th>
                <th>Преподаватель</th>
                <th>Занятий осталось</th>
                <th>Статус</th>
                <th style={{ width: "50px" }}></th>
              </tr>
            </thead>
            <tbody>{
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
                <td>{format(item.startDate, MyDateFormat)}</td>
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
                    {item.status === SubscriptionStatus.COMPLETED || item.status === SubscriptionStatus.ACTIVE && 
                    <NextIcon
                      size="20px"
                      title="Продлить"
                      onIconClick={() => this.handleResubscribeClick(item)}
                    />
                    }
                  </div>
                </td>
              </tr>
              ))}
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
          />
        </div>
      </>);
    }

    return (
      <NoRecords/>
    );
  }

  renderTrialsTable(subscriptions) {

    if (subscriptions && subscriptions.length > 0) {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="date-column">Дата</th>
              <th className="discipline-column">Направление</th>
              <th>Преподаватель</th>
              <th>Результат</th>
              <th style={{ width: "50px" }}></th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((item, index) => (
            <tr 
              key={index}
              onClick={() => this.handleTrialSubscriptionClick(item)}
              >
              <td>{format(item.startDate, MyDateFormat)}</td>
              <td>
                <DisciplineIcon disciplineId={item.disciplineId} />
                <span style={{ marginLeft: "10px" }}>{getDisciplineName(item.disciplineId)}</span>
              </td>
              <td>
                <Link to={`/teacher/${item.teacher.teacherId}`}>
                  {item.teacher.firstName} {item.teacher.lastName}
                </Link>
              </td>
              <td><Badge className="bg-secondary">{getTrialSubscriptionStatusName(item.trialStatus)}</Badge></td>
              <td>
                  <NextIcon 
                    size="20px"
                    onIconClick={() => this.handleResubscribeClick(item)}
                  />
              </td>
            </tr>
            ))}
          </tbody>
        </Table>
      );
    } 
    
    return (
      <NoRecords/>
    );
  }

  renderRentTable(subscriptions) {

    if (subscriptions && subscriptions.length > 0) {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="date-column">Дата</th>
              <th>Занятий осталось</th>
              <th>Статус</th>
              <th style={{ width: "50px" }}></th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((item, index) => (
            <tr 
              key={index}
              onClick={() => this.handleViewSubscriptionAttendances(item)}
              >
              <td>{format(item.startDate, MyDateFormat)}</td>
              <td>{item.attendancesLeft} из {item.attendanceCount}</td>
              <td>{getSubscriptionStatusName(item.status)}</td>
              <td>
                  <NextIcon 
                    size="20px"
                    onIconClick={() => this.handleResubscribeClick(item)}
                  />
              </td>
            </tr>
            ))}
          </tbody>
        </Table>
      );
    } 
    
    return (
      <NoRecords/>
    );
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
    let nonTrialSubscriptions = sortedSubscriptions.filter((s) => s.trialStatus === null);
    nonTrialSubscriptions = showCompleted
      ? nonTrialSubscriptions
      : nonTrialSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.LESSON && s.status !== SubscriptionStatus.COMPLETED);

    // Trials
    const trialSubscriptions = sortedSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.TRIAL_LESSON && s.trialStatus !== null);

    // Rents
    const rentSubscriptions = sortedSubscriptions.filter((s) => s.subscriptionType === SubscriptionType.RENT);

    // Events
    let events;
    if (attendances) {
      events = attendances.map((attendance) => ({
        id: attendance.attendanceId,
        title: attendance.isTrial ? "Пробное" : "Занятие",
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
                {this.renderRentTable(rentSubscriptions)}

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
