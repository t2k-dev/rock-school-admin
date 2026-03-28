import { useState } from "react";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  CalendarIcon,
  EditIcon,
  GroupIcon,
} from "../../components/icons";
import { generateAttendances } from "../../services/apiBandService";

export const BandScreenCard = ({ band, onActivateToggle, onEditSchedules }) => {
  const [isActivating, setIsActivating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleActivateToggle = async () => {
    try {
      setIsActivating(true);
      if (onActivateToggle) {
        await onActivateToggle(band);
      }
    } catch (error) {
      console.error("Failed to toggle band status:", error);
    } finally {
      setIsActivating(false);
    }
  };

  const handleGenerateAttendances = async () => {
    try {
      setIsGenerating(true);
      await generateAttendances(band.bandId);
    } catch (error) {
      console.error("Failed to generate attendances:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
            <Col md="4">
              <div className="mt-4">
                <strong style={{ fontSize: "24px" }}>
                  <div>
                    {name}
                    <EditIcon />
                  </div>
                </strong>
              </div>
            </Col>
            <Col md="3">
              {teacher && (
                <>
                  <div className="text-muted small mt-3">Куратор</div>
                  <Link to={`/teacher/${teacher.teacherId}`}>
                    {teacher.firstName} {teacher.lastName}
                  </Link>
                </>
              )}
            </Col>
            <Col md="3">
              <div className="d-flex justify-content-end mb-3">
                <Stack gap={2} style={{ width: "200px" }}>
                  <Button
                    variant="outline-warning"
                    onClick={handleGenerateAttendances}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Создание..." : "Пересоздать слоты"}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => onEditSchedules && onEditSchedules(band)}
                  >
                    <CalendarIcon color="white" />
                    Расписание
                  </Button>

                  <Button
                    variant={band.isActive ? "outline-danger" : "success"}
                    type="button"
                    onClick={handleActivateToggle}
                    disabled={isActivating}
                  >
                    {isActivating
                      ? band.isActive
                        ? "Отключение..."
                        : "Включение..."
                      : band.isActive
                        ? "Отключить"
                        : "Включить"}
                  </Button>
                </Stack>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};
