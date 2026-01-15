import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

import { calculateAge } from "../../../utils/dateTime";
import { Avatar } from "../../shared/Avatar";

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

  const renderStudentsList = () => {
    if (!students || students.length === 0) {
      return (
        <div className="text-center py-3 text-muted">
          Ученики не добавлены
        </div>
      );
    }

    return (
      <div>
        {students.map((student, index) => (
          <div key={index} className="d-flex align-items-center mb-2 p-2 border rounded">
            <Avatar style={{ width: "40px", height: "40px", marginRight: "15px" }} />
            <div className="flex-grow-1">
              <div>
                <strong>
                  <Link to={`/student/${student.studentId}`}>
                    {student.firstName} {student.lastName}
                  </Link>
                </strong>
              </div>
              <div className="text-muted small">
                {calculateAge(student.birthDate)} лет • {student.phone}
              </div>
            </div>
            <div>
              <Badge bg="secondary">{student.level || "Начинающий"}</Badge>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSchedule = () => {
    if (!schedules || schedules.length === 0) {
      return (
        <div className="text-center py-3 text-muted">
          Расписание не настроено
        </div>
      );
    }

    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>День</th>
            <th>Время</th>
            <th>Комната</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <tr key={index}>
              <td>{getDayName(schedule.weekDay)}</td>
              <td>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</td>
              <td>Комната {schedule.roomId}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div>
      {/* General Information */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Общая информация</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md="6">
              <div className="mb-3">
                <strong>Название:</strong>
                <div>{name}</div>
              </div>
              <div className="mb-3">
                <strong>Статус:</strong>
                <div>
                  <Badge bg={isActive ? "success" : "secondary"}>
                    {isActive ? "Активная" : "Неактивная"}
                  </Badge>
                </div>
              </div>
            </Col>
            <Col md="6">
              <div className="mb-3">
                <strong>Преподаватель:</strong>
                {teacher ? (
                  <div>
                    <Link to={`/teacher/${teacher.teacherId}`}>
                      {teacher.firstName} {teacher.lastName}
                    </Link>
                  </div>
                ) : (
                  <div className="text-muted">Не назначен</div>
                )}
              </div>
              <div className="mb-3">
                <strong>Количество учеников:</strong>
                <div>{studentsCount || students.length}</div>
              </div>
              <div className="mb-3">
                <strong>Дата создания:</strong>
                <div>{createdDate ? new Date(createdDate).toLocaleDateString('ru-RU') : "—"}</div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Students */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Ученики ({students.length})</h5>
        </Card.Header>
        <Card.Body>
          {renderStudentsList()}
        </Card.Body>
      </Card>

      {/* Schedule */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Расписание</h5>
        </Card.Header>
        <Card.Body>
          {renderSchedule()}
        </Card.Body>
      </Card>
    </div>
  );
};