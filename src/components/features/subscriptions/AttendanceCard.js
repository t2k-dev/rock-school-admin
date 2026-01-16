import { format } from 'date-fns';
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";
import { getRoomName } from "../../../constants/rooms";
import { formatDateWithLetters } from "../../../utils/dateTime";
import { CalendarIcon } from '../../shared/icons/CalendarIcon';
import { DoorIcon } from '../../shared/icons/DoorIcon';
import { TimeIcon } from '../../shared/icons/TimeIcon';
import { AttendanceStatusBadge } from "../../shared/modals/AttendanceStatusBadge";

export const AttendanceCard = ({ 
  attendance, 
  onClick
}) => {
  const formatTime = (date) => {
    try {
      return format(new Date(date), 'HH:mm');
    } catch (error) {
      return '--:--';
    }
  };

  return (
    <Card 
      className="mb-3"
      style={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
      onClick={() => onClick && onClick(attendance)}
    >
      <Card.Body>
        <Row className="align-items-center">
          <Col md="3">
            <div className="text-muted small"><CalendarIcon size="16px" color="gray"/> Дата</div>
            <div className="fw-bold">{formatDateWithLetters(attendance.startDate)}</div>
          </Col>
          <Col md="2">
            <div className="text-muted small"><TimeIcon size="16px" color="gray"/> Время</div>
            <div className="fw-bold">
              {formatTime(attendance.startDate)} - {formatTime(attendance.endDate)}
            </div>
          </Col>
          <Col md="2">
            <div className="text-muted small"><DoorIcon size="16px" color="gray"/> Комната</div>
            <div className="fw-bold">{getRoomName(attendance.roomId)}</div>
          </Col>
          <Col md="3">
            <div className="text-muted small">Комментарий</div>
            {attendance.comment ? (
              <div 
                title={attendance.comment}
                style={{ 
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {attendance.comment}
              </div>
            ) : (
              <div className="text-muted">—</div>
            )}
          </Col>
          <Col md="2">
            <div className="d-flex justify-content-end">
              <AttendanceStatusBadge status={attendance.status} />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

AttendanceCard.propTypes = {
  attendance: PropTypes.shape({
    attendanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.number.isRequired,
    comment: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};