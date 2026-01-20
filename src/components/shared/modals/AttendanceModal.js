import PropTypes from 'prop-types';
import React from "react";
import { Alert, Button, Container, Form, Modal, Row, Spinner, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import { DisciplineIcon } from "../discipline/DisciplineIcon";
import { isCancelledAttendanceStatus } from "./attendanceHelper";

import { Avatar } from "../Avatar";
import { Loading } from "../Loading";
import { AttendanceDateAndRoom } from "./AttendanceDateAndRoom";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";

import AttendanceStatus from "../../../constants/AttendanceStatus";
import { getDisciplineName } from "../../../constants/disciplines";

import SubscriptionType from '../../../constants/SubscriptionType';
import { acceptTrial, declineTrial, missedTrial, submit, updateComment } from "../../../services/apiAttendanceService";

// Constants
const ERROR_MESSAGES = {
  SAVE_FAILED: "Не удалось сохранить изменения",
  ACCEPT_TRIAL_FAILED: "Не удалось подтвердить пробное занятие",
  DECLINE_TRIAL_FAILED: "Не удалось отклонить пробное занятие",
  MARK_MISSED_FAILED: "Не удалось отметить как пропущенное",
  UPDATE_STATUS_FAILED: "Не удалось обновить статус занятия",
  NETWORK_ERROR: "Проверьте подключение к интернету",
  VALIDATION_FAILED: "Заполните все обязательные поля",
};

const TRIAL_ACTIONS = {
  ACCEPT: 'accept',
  DECLINE: 'decline',
  MISSED: 'missed',
};

const REGULAR_ACTIONS = {
  ATTENDED: 'attended',
  MISSED: 'missed',
};

export class AttendanceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attendance: null,

      status: 0,
      trialStatus: 0,
      comment: "",
      statusReason: "",

      isSaving: false,
      isProcessingTrial: false,
      error: null,
      validationError: null,
      currentAction: null,
    };

    this.handleSave = this.handleSave.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.attendance && this.props.attendance !== prevProps.attendance) {
      const attendance = this.props.attendance;
      
      if (!attendance) {
        return;
      }

      this.setState(
        {
          attendance: attendance,
          status: attendance.status,
          attendanceId: attendance.attendanceId,
          comment: attendance.comment || "",
          statusReason: attendance.statusReason || "",
         }
      );
    }
  }

  // Event handlers
  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleSave = async () => {
    const { attendance, comment } = this.state;

    // Completed attendance
    await updateComment(attendance.attendanceId, comment);
    
    // Update parent component with new comment
    this.handleSuccess({ 
      comment: comment 
    });
  }

  handleError = (message, error) => {
    console.error(message, error);
    
    let errorMessage = message;
    if (error?.name === 'NetworkError' || error?.message?.includes('fetch')) {
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }

    this.setState({ 
      error: errorMessage,
      isSaving: false,
      isProcessingTrial: false,
      currentAction: null,
    });
  };

  handleSuccess = (updatedData = null) => {
    // Notify parent component about the update
    if (this.props.onAttendanceUpdate && updatedData && this.state.attendance) {
      this.props.onAttendanceUpdate({
        ...updatedData,
        attendanceId: this.state.attendance.attendanceId
      });
    }

    this.setState({
      isSaving: false,
      isProcessingTrial: false,
      currentAction: null,
      error: null,
      validationError: null,
    });

    this.props.handleClose();
  };

  handleConfirmAndSubscribe = async (e) => {
    e.preventDefault();

    try{
      this.setState({ 
        isProcessingTrial: true,
        currentAction: TRIAL_ACTIONS.ACCEPT,
        error: null,
        validationError: null,
      });

      const request = {
          comment: this.state.comment,
      }
      const attendance = this.state.attendance;
      
      await acceptTrial(attendance.attendanceId, request);

      // Redirect to subscription form
      if (this.props.history && attendance.student) {
        this.props.history.push({
          pathname: `/student/${attendance.student.studentId}/subscriptionForm`,
          state: {
            studentId: attendance.student.studentId,
            baseSubscription: {
              subscriptionId: attendance.subscriptionId,
              disciplineId: attendance.disciplineId,
              teacher: attendance.teacher,
              isTrial: attendance.isTrial,
            },
          }
        });
      }

      this.handleSuccess({ 
        status: AttendanceStatus.ATTENDED, 
        comment: this.state.comment,
        isCompleted: true 
      });

    } catch(error){
      console.log("suda")
      this.handleError(ERROR_MESSAGES.ACCEPT_TRIAL_FAILED, error);
    }
  };

  handleDeclineTrial = async (e) =>{
    e.preventDefault();
    try{
      this.setState({ 
        isProcessingTrial: true,
        currentAction: TRIAL_ACTIONS.DECLINE,
        error: null,
        validationError: null,
      });
      
      const request = {
        statusReason: this.state.statusReason,
        comment: this.state.comment,
      }

      await declineTrial(this.state.attendance.attendanceId, request);
      this.handleSuccess({ 
        status: AttendanceStatus.MISSED, 
        statusReason: this.state.statusReason,
        comment: this.state.comment,
        isCompleted: true 
      });

    } catch(error){
      this.handleError(ERROR_MESSAGES.DECLINE_TRIAL_FAILED, error);
    }
  }

  handleMissedTrial = async (e) =>{
    e.preventDefault();
    try{
      this.setState({ 
        isProcessingTrial: true,
        currentAction: TRIAL_ACTIONS.MISSED,
        error: null,
        validationError: null,
      });

      const request = {
          statusReason: this.state.statusReason,
          comment: this.state.comment,
      }

      await missedTrial(this.state.attendance.attendanceId, request);
      this.handleSuccess({ 
        status: AttendanceStatus.MISSED,
        statusReason: this.state.statusReason,
        comment: this.state.comment,
        isCompleted: true 
      });

    } catch(error){
      this.handleError(ERROR_MESSAGES.MARK_MISSED_FAILED, error);
    }
  };

  handleCompleted = async (e, status) =>{
    e.preventDefault();

    try{
      this.setState({ 
        isSaving: true,
        currentAction: status === AttendanceStatus.ATTENDED 
          ? REGULAR_ACTIONS.ATTENDED 
          : REGULAR_ACTIONS.MISSED,
        error: null,
        validationError: null,
      });
      
      const { attendance, comment } = this.state;

      const submitRequest = {
        status: status,
        comment: comment,
      };
      await submit(attendance.attendanceId, submitRequest);

      this.handleSuccess({ 
        status: status, 
        comment: comment,
        isCompleted: true 
      });

    } catch(error){
      this.handleError(ERROR_MESSAGES.UPDATE_STATUS_FAILED, error);
    }
  }

  handleClose = () => {
    // Reset state when closing
    this.setState({
      attendance: null,
      error: null,
      validationError: null,
      isSaving: false,
      isProcessingTrial: false,
      currentAction: null,
      comment: "",
    });

    this.props.handleClose();
  };

  // Rendering

  renderLoadingOverlay = () => {
    const { isSaving, isProcessingTrial, currentAction } = this.state;

    if (!isSaving && !isProcessingTrial) return null;

    let message = "Сохранение...";
    
    if (isProcessingTrial) {
      switch (currentAction) {
        case TRIAL_ACTIONS.ACCEPT:
          message = "Подтверждение пробного занятия...";
          break;
        case TRIAL_ACTIONS.DECLINE:
          message = "Отклонение пробного занятия...";
          break;
        case TRIAL_ACTIONS.MISSED:
          message = "Отметка о пропуске...";
          break;
        default:
          message = "Обработка...";
      }
    }

    return (
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          borderRadius: '0.375rem',
        }}
      >
        <Loading
          message={message}
          containerStyle={{ backgroundColor: 'transparent' }}
        />
      </div>
    );
  };

  renderErrorAlert = () => {
    const { error, validationError } = this.state;

    if (!error && !validationError) return null;

    return (
      <Alert 
        variant={validationError ? "warning" : "danger"} 
        className="mb-3"
        dismissible
        onClose={() => this.setState({ error: null, validationError: null })}
      >
        {validationError || error}
      </Alert>
    );
  };

  renderTrialButtons = () => {
    const { isProcessingTrial, currentAction } = this.state;

    return (
      <>
        <Button 
          onClick={this.handleMissedTrial}
          variant="outline-danger"
          disabled={isProcessingTrial}
        >
          {isProcessingTrial && currentAction === TRIAL_ACTIONS.MISSED ? (
            <>
              <Spinner size="sm" className="me-1" />
              Обработка...
            </>
          ) : (
            'Пропущено'
          )}
        </Button>
        
        <Button 
          onClick={this.handleDeclineTrial}
          variant="outline-secondary"
          disabled={isProcessingTrial}
        >
          {isProcessingTrial && currentAction === TRIAL_ACTIONS.DECLINE ? (
            <>
              <Spinner size="sm" className="me-1" />
              Обработка...
            </>
          ) : (
            'Отказался'
          )}
        </Button>
        
        <Button 
          onClick={this.handleConfirmAndSubscribe}
          variant="outline-success"
          disabled={isProcessingTrial}
          style={{ marginLeft: "10px" }}
        >
          {isProcessingTrial && currentAction === TRIAL_ACTIONS.ACCEPT ? (
            <>
              <Spinner size="sm" className="me-1" />
              Оформление...
            </>
          ) : (
            'Решил продолжить'
          )}
        </Button>
      </>
    );
  };

  renderRegularButtons = () => {
    const { isSaving, currentAction } = this.state;

    return (
      <>
        <Button 
          onClick={(e) => this.handleCompleted(e, AttendanceStatus.ATTENDED)}
          variant="outline-success"
          disabled={isSaving}
        >
          {isSaving && currentAction === REGULAR_ACTIONS.ATTENDED ? (
            <>
              <Spinner size="sm" className="me-1" />
              Сохранение...
            </>
          ) : (
            'Посещено'
          )}
        </Button>
        
        <Button 
          onClick={(e) => this.handleCompleted(e, AttendanceStatus.MISSED)}
          variant="outline-danger"
          disabled={isSaving}
          style={{ marginLeft: "10px" }}
        >
          {isSaving && currentAction === REGULAR_ACTIONS.MISSED ? (
            <>
              <Spinner size="sm" className="me-1" />
              Сохранение...
            </>
          ) : (
            'Пропущено'
          )}
        </Button>
      </>
    );
  };

  renderFooterButtons = () => {
    const { isSaving } = this.state;
    const { isCompleted, isTrial, status } = this.props.attendance;

    if (!isCompleted) {
      if (isCancelledAttendanceStatus(status)){
        return <Button variant="outline-primary" onClick={this.handleCancel}>Сохранить</Button>;
      }

      return isTrial ? this.renderTrialButtons() : this.renderRegularButtons();
    }

    return (
      <Button 
        variant="primary" 
        onClick={this.handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Spinner size="sm" className="me-1" />
            Сохранение...
          </>
        ) : (
          'Сохранить'
        )}
      </Button>
    );
  };

  renderSubscriptionInfo = () => {
    const { teacher, disciplineId, subscription } = this.state.attendance;
    switch (subscription?.subscriptionType) {
      case SubscriptionType.LESSON:  
      case SubscriptionType.TRIAL_LESSON:
          return(
            <div className="d-flex mb-3 text-center">
              <div style={{ marginRight: "10px" }}>
                <DisciplineIcon disciplineId={disciplineId} size="40px" />
                </div>
            <Stack direction="vertical" gap={0} className="mb-2">
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>{getDisciplineName(disciplineId)}</div>
              <div>
                <Link to={"/teacher/" + teacher.teacherId}>{teacher.firstName}</Link>
              </div>
            </Stack>
          </div>
      )
      case SubscriptionType.RENT:
          return(
            <div className="d-flex mb-3 text-center">
              Аренда Комнаты
            </div>
          )
    }
  }

  render() {
    
    if (!this.props.show || !this.state.attendance) {
      return null;
    }

    const { student, isTrial, status } = this.state.attendance;
    const { comment } = this.state;

    // Add null check for student
    if (!student) {
      return (
        <Modal show={this.props.show} onHide={this.handleClose} size="md" backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Ошибка</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="alert alert-warning">
              Информация о студенте недоступна
            </div>
          </Modal.Body>
        </Modal>
      );
    }

    return (
      <>
        <Modal show={this.props.show} onHide={this.handleClose} size="md" backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>
              {isTrial ? "Пробное занятие" : "Занятие"}
              <span style={{ marginLeft: "10px", fontSize: "16px" }}>
                <AttendanceStatusBadge 
                  status={status}
                  style={{ fontSize: "14px", transform: "translateY(-2px)", display: "inline-block" }}
                />
              </span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mb-3">
              <Row>
                <div className="d-flex" style={{ padding: "0 50px" }}>
                  <Container style={{ width: "100px", padding: "0" }}>
                    <Avatar style={{ width: "100px", height: "100px" }} />
                    <div className="text-center mt-1">
                      <Link to={`/student/${student.studentId}`}>{student.firstName} {student.lastName}</Link>
                    </div>
                  </Container>
                  <Container className="mt-1" style={{ fontSize: "14px", marginLeft: "60px" }}>
                    {this.renderSubscriptionInfo()}
                    <AttendanceDateAndRoom 
                      {...this.props.attendance}
                      attendance={this.props.attendance}
                    />
                  </Container>
                </div>
              </Row>
            </Container>
            <hr></hr>
            <Form.Group className="mb-3" controlId="comment">
              <Form.Label>Комментарий</Form.Label>
              <Form.Control 
                as="textarea" 
                onChange={this.handleChange} 
                value={comment} 
                placeholder="введите..." 
                autoComplete="off"
              />
            </Form.Group>

            {this.renderErrorAlert()}
          </Modal.Body>
          <Modal.Footer>
            {this.renderFooterButtons()}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

AttendanceModal.propTypes = {
  show: PropTypes.bool.isRequired,
  attendance: PropTypes.object,
  history: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  onAttendanceUpdate: PropTypes.func, // Callback when attendance is updated
};

AttendanceModal.defaultProps = {
  attendance: null,
  onAttendanceUpdate: null,
};
