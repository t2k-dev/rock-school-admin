import { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { getStudentScreenDetails } from '../../../services/apiStudentService';
import { cancelSubscription, getSubscription } from '../../../services/apiSubscriptionService';
import { AttendanceModal } from '../../shared/modals/AttendanceModal';
import PaymentForm from '../payments/PaymentForm';
import CancelSubscriptionModal from './CancelSubscriptionModal';
import SubscriptionScreen from './SubscriptionScreen';

class SubscriptionScreenContainer extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      subscription: null,
      attendances: [],
      isLoading: true,
      error: null,
      
      // Attendance Modal
      showAttendanceModal: false,
      selectedAttendance: null,
      
      // Payment Modal
      showPaymentModal: false,
      isLoadingPayment: false,
      
      // Cancel Subscription Modal
      showCancelModal: false,
      isLoadingCancel: false,
    };
  }

  async componentDidMount() {
    await this.loadSubscriptionData();
  }

  loadSubscriptionData = async () => {
    try {
      this.setState({ isLoading: true });
      
      const subscriptionId = this.props.match.params.subscriptionId;
      
      // Check if data was passed via location state first
      if (this.props.location.state) {
        const { subscription, attendances } = this.props.location.state;
        this.setState({
          subscription: subscription,
          attendances: attendances || [],
          isLoading: false
        });
        return;
      }
      
      // If no state passed, fetch data from API
      const subscription = await getSubscription(subscriptionId);
      
      // Get student details to get attendances for this subscription
      const studentDetails = await getStudentScreenDetails(subscription.studentId);
      const filteredAttendances = studentDetails.attendances?.filter(
        attendance => attendance.subscriptionId === parseInt(subscriptionId)
      ) || [];
      
      this.setState({
        subscription: subscription,
        attendances: filteredAttendances,
        isLoading: false
      });
      
    } catch (error) {
      console.error('Failed to load subscription data:', error);
      this.setState({
        error: error.message,
        isLoading: false
      });
    }
  };

  handleAttendanceClick = (attendance) => {
    this.setState({
      selectedAttendance: attendance,
      showAttendanceModal: true
    });
  };

  handleCloseAttendanceModal = () => {
    this.setState({
      showAttendanceModal: false,
      selectedAttendance: null
    });
  };

  handleEditSchedules = (subscription) => {
    this.props.history.push(`/subscription/${subscription.subscriptionId}/edit`);
  };

  handlePayClick = (subscription) => {
    this.setState({
      showPaymentModal: true
    });
  };
  
  handleCancelSubscription = async (subscription) => {
    // Open the cancel modal instead of directly canceling
    this.setState({
      showCancelModal: true
    });
  }

  handleCancelConfirm = async (cancelData) => {
    this.setState({ isLoadingCancel: true });
    
    try {
      await cancelSubscription(cancelData.subscriptionId, {
        cancelDate: cancelData.cancelDate,
        cancelReason: cancelData.cancelReason
      });
      
      alert('Абонемент успешно отменён!');
      
      // Reload data to reflect the cancellation
      await this.loadSubscriptionData();
      
      this.setState({ showCancelModal: false });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error; // Re-throw to let modal handle the error
    } finally {
      this.setState({ isLoadingCancel: false });
    }
  }

  handleCloseCancelModal = () => {
    this.setState({
      showCancelModal: false
    });
  }

  handleClosePaymentModal = () => {
    this.setState({
      showPaymentModal: false
    });
  };

  handlePaymentSubmit = async (paymentData) => {
    this.setState({ isLoadingPayment: true });
    
    try {
      // TODO: Add API call to submit payment
      console.log('Payment data:', paymentData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Платеж успешно обработан!');
      
      // Optionally reload data to reflect payment
      // await this.loadSubscriptionData();
      
    } catch (error) {
      console.error('Payment submission error:', error);
      throw error;
    } finally {
      this.setState({ isLoadingPayment: false });
    }
  };

  handleAttendanceUpdate = (updatedData) => {
    const attendanceId = updatedData.attendanceId;
    
    this.setState(prevState => ({
      attendances: prevState.attendances.map(attendance => 
        attendance.attendanceId === attendanceId 
          ? { ...attendance, ...updatedData }
          : attendance
      ),
      selectedAttendance: prevState.selectedAttendance?.attendanceId === attendanceId
        ? { ...prevState.selectedAttendance, ...updatedData }
        : prevState.selectedAttendance
    }));
  };

  render() {
    const { subscription, attendances, isLoading, error } = this.state;

    if (error) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4>Ошибка загрузки данных</h4>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <SubscriptionScreen
          subscription={subscription}
          attendances={attendances}
          isLoading={isLoading}
          onAttendanceClick={this.handleAttendanceClick}
          onEditSchedules={this.handleEditSchedules}
          onPayClick={this.handlePayClick}
          onCancelClick={this.handleCancelSubscription}
        />

        <AttendanceModal
          attendance={this.state.selectedAttendance}
          show={this.state.showAttendanceModal}
          handleClose={this.handleCloseAttendanceModal}
          onAttendanceUpdate={this.handleAttendanceUpdate}
          history={this.props.history}
        />

        <PaymentForm
          show={this.state.showPaymentModal}
          onHide={this.handleClosePaymentModal}
          subscription={subscription}
          onPaymentSubmit={this.handlePaymentSubmit}
          isLoading={this.state.isLoadingPayment}
        />

        <CancelSubscriptionModal
          show={this.state.showCancelModal}
          onHide={this.handleCloseCancelModal}
          subscription={subscription}
          onConfirm={this.handleCancelConfirm}
          isLoading={this.state.isLoadingCancel}
        />
      </>
    );
  }
}

export default withRouter(SubscriptionScreenContainer);