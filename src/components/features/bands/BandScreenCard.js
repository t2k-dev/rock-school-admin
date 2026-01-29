import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { EditIcon, GroupIcon } from "../../shared/icons";

const formatTime = (timeString) => {
  if (!timeString) return "";
  return timeString.slice(0, 5); // "HH:MM:SS" -> "HH:MM"
};

const getDayName = (dayNumber) => {
  const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  return days[dayNumber] || "";
};

export const BandScreenCard = ({ band }) => {
  const {
    name,
    teacher,
    students = [],
    schedules = [],
    isActive,
    createdDate,
    studentsCount,
  } = band;

  return (
    <div>
      {/* General Information */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md="2">
              <div style={{ width: "160px" }}>
                <GroupIcon size="100px" color="#000000" />
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4">
                <strong style={{ fontSize: "24px" }}>
                  <div>{name}<EditIcon /></div>
                </strong>
              </div>
            </Col>
            <Col md="4">
              {teacher &&
              <>
                <div className="text-muted small mt-3">Куратор</div>
                <Link to={`/teacher/${teacher.teacherId}`}>
                  {teacher.firstName} {teacher.lastName}
                </Link>
              </>
              }
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};