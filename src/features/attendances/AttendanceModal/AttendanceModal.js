import React from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";

import AttendanceType, { getAttendanceTypeName } from "../../../constants/AttendanceType";
import { acceptTrial, declineTrial, missedTrial, updateAttendeeStatus } from "../../../services/apiAttendanceService";
import { AttendanceStatusBadge } from "../AttendanceStatusBadge";
import { AttendanceDateAndRoom } from "./AttendanceDateAndRoom";
import { AttendanceHeaderInfo } from "./AttendanceHeaderInfo";
import { AttendeesList } from "./AttendeesList";



export class AttendanceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.show,

      status: 0,
      comment: "",
      statusReason: "",
      showDeclineConfirmation: false,
      isSubmittingDecline: false,
      attendance: null,
      attendees: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this); 
  }

  componentDidUpdate(prevProps) {
    if (this.props.attendance && this.props.attendance !== prevProps.attendance) {
      const attendance = this.props.attendance;
      
      if (!attendance) {
        return;
      }

      this.setState({ 
        attendance: attendance,
        status: attendance.status,
        comment: attendance.comment || "",
        statusReason: "",
        showDeclineConfirmation: false,
        isSubmittingDecline: false,
      });
    }
  }

  handleClose() {
    this.setState({
      show: false,
      attendance: null,
      attendees: [],
      comment: "",
      statusReason: "",
      showDeclineConfirmation: false,
      isSubmittingDecline: false,
    });

    if (this.props.handleClose) {
      this.props.handleClose();
    }
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ 
      comment: value
    });
  };

  handleStatusReasonChange = (e) => {
    const { value } = e.target;
    this.setState({
      statusReason: value
    });
  };

  async handleAttendeeStatusChange(attendanceId, attendeeId, status) {
    const request ={
        attendeeId: attendeeId,
        attendeeStatus: status
    }
    await updateAttendeeStatus(attendanceId, request);
  }

  handleAcceptTrial = async () => {
    try {
      await acceptTrial(this.props.attendance.attendanceId, {});
      this.handleClose();
    } catch (error) {
      console.error('Error accepting trial:', error);
    }
  };

  handleDeclineTrial = () => {
    this.setState({
      showDeclineConfirmation: true,
      statusReason: "",
    });
  };

  handleCancelDeclineTrial = () => {
    this.setState({
      showDeclineConfirmation: false,
      statusReason: "",
    });
  };

  handleConfirmCancelation = async () => {
    const statusReason = this.state.statusReason.trim();

    if (!statusReason) {
      return;
    }

    try {
      this.setState({ isSubmittingDecline: true });

      await declineTrial(this.props.attendance.attendanceId, {
        subscriptionId:this.props.attendance.attendees[0].subscriptionId,
        statusReason,
      });
      
      this.handleClose();
    } catch (error) {
      console.error('Error declining trial:', error);
    } finally {
      this.setState({ isSubmittingDecline: false });
    }
  };

  handleMissedTrial = async () => {
    try {
      await missedTrial(this.props.attendance.attendanceId, {});
      this.props.handleClose();
    } catch (error) {
      console.error('Error recording missed trial:', error);
    }
  };

  render() {
    if (!this.props.show || !this.props.attendance) {
      return null;
    }

    const { status, attendanceType, isCompleted } = this.props.attendance;
    const { comment, statusReason, showDeclineConfirmation, isSubmittingDecline } = this.state;

    return (
        <Modal show={this.props.show} onHide={this.handleClose} size="md" backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>
              <span style={{ marginRight: "10px" }}>{getAttendanceTypeName(attendanceType)}</span>
              <AttendanceStatusBadge 
                status={status}
                style={{ fontSize: "14px" }}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="mt-2 text-center" style={{ fontSize: "14px" }}>
              <Row>
                <Col size="6">
                  <AttendanceHeaderInfo attendance={this.props.attendance} />
                </Col>
                <Col size="6" className="text-end">
                  <AttendanceDateAndRoom 
                    {...this.props.attendance}
                    attendance={this.props.attendance}
                    className="text-center"
                  />
                </Col>
              </Row>
            </Container>

            <hr></hr>

            <AttendeesList 
              attendance={this.props.attendance} 
              onAttendeeStatusChange={this.handleAttendeeStatusChange.bind(this)}
            />

            {comment && (
              <>
              <hr></hr>
              <Form.Group className="mb-3 mt-3" controlId="comment">
                <Form.Label>Комментарий</Form.Label>
                <Form.Control as="textarea" onChange={this.handleChange} value={comment} placeholder="введите..." autoComplete="off"/>
              </Form.Group>
            </>)}

            {showDeclineConfirmation && (
              <>
                <hr></hr>
                <Form.Group className="mb-0 mt-3" controlId="statusReason">
                  <Form.Label>Причина</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    onChange={this.handleStatusReasonChange}
                    value={statusReason}
                    placeholder="Укажите причину отказа..."
                    autoComplete="off"
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          {attendanceType === AttendanceType.TRIAL_LESSON && isCompleted &&(
            <Modal.Footer>
              {showDeclineConfirmation ? (
                <>
                  <Button
                    variant="outline-secondary"
                    onClick={this.handleCancelDeclineTrial}
                    disabled={isSubmittingDecline}
                  >
                    Назад
                  </Button>
                  <Button
                    variant="danger"
                    onClick={this.handleConfirmCancelation}
                    disabled={!statusReason.trim() || isSubmittingDecline}
                  >
                    {isSubmittingDecline ? "Сохраняем..." : "Подтвердить отмену"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline-secondary" onClick={this.handleDeclineTrial}>
                    Отклонил
                  </Button>
                  <Button variant="outline-success" onClick={this.handleAcceptTrial}>
                    Решил продолжить
                  </Button>
                </>
              )}
            </Modal.Footer>
          )}
        </Modal>
    );
  }
}
