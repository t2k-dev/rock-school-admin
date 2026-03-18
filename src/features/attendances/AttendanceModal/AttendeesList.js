import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Avatar } from "../../../components/Avatar";
import AttendeeStatus, { getAttendeeStatusColor, getAttendeeStatusName } from "../../../constants/AttendeeStatus";

export function AttendeesList({ attendance, onAttendeeStatusChange }) {
  if (!attendance || !attendance.attendees || attendance.attendees.length === 0) {
    return <p className="text-muted text-center">Нет учеников</p>;
  }

  return (
    <Row className="g-3 mb-3">
      {attendance.attendees.map((attendee) => (
        <Col xs={12} key={attendee.attendeeId}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Avatar style={{ width: "40px", height: "40px", marginRight: "12px" }} />
                  <div>
                    <h6 className="mb-0">
                      <Link to={`/student/${attendee.studentId}`}>
                        {attendee.student.firstName} {attendee.student.lastName}
                      </Link>
                    </h6>
                  </div>
                </div>
                <div>
                  {attendee.status === AttendeeStatus.NEW ? (
                    <>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="me-2"
                        onClick={() => onAttendeeStatusChange(attendance.attendanceId, attendee.attendeeId, AttendeeStatus.MISSED)}
                      >
                        Пропущено
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => onAttendeeStatusChange(attendance.attendanceId, attendee.attendeeId, AttendeeStatus.ATTENDED)}
                      >
                        Посещено
                      </Button>
                    </>
                  ) : (
                    <Badge bg={getAttendeeStatusColor(attendee.status)}>
                      {getAttendeeStatusName(attendee.status)}
                    </Badge>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
