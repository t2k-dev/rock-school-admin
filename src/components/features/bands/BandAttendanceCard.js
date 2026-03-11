import PropTypes from "prop-types";
import { Card, Col, Row } from "react-bootstrap";
import { formatDateWithLetters } from "../../../utils/dateTime";
import { CalendarIcon } from "../../shared/icons";
import { AttendanceStatusBadge } from "../../shared/modals/AttendanceStatusBadge";
import { HoverCard } from "../../shared/ui";

export const BandAttendanceCard = ({ 
  attendance, 
  onClick
}) => {
  return (
    <HoverCard 
      className="mb-3"
      onClick={() => onClick && onClick(attendance)}
    >
      <Card.Body>
        <Row className="align-items-center">
          <Col md="6">
            <div className="text-muted small"><CalendarIcon size="16px" color="gray"/> Дата</div>
            <div className="fw-bold">{formatDateWithLetters(attendance.startDate)}</div>
          </Col>
          <Col md="6">
            <AttendanceStatusBadge status={attendance.status} />
          </Col>
        </Row>
      </Card.Body>
    </HoverCard>
  );
};

BandAttendanceCard.propTypes = {
  attendance: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

BandAttendanceCard.defaultProps = {
  onClick: () => {},
};
