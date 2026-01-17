import { format } from 'date-fns';
import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";
import { getRoomName } from "../../../constants/rooms";
import { formatDateWithLetters } from "../../../utils/dateTime";
import { CalendarIcon, DoorIcon, TimeIcon } from '../../shared/icons';
import { AttendanceStatusBadge } from "../../shared/modals/AttendanceStatusBadge";
import { HoverCard } from "../../shared/ui";

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
    <HoverCard 
      className="mb-3"
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
    </HoverCard>
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