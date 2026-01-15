import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const BandCard = ({ item }) => {
  const { bandId, name, teacher, studentsCount, isActive } = item;

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col md="6">
            <div className="d-flex align-items-center">
              <div>
                <h5 className="mb-1">{name}</h5>
                <div className="text-muted">
                  {teacher && `${teacher.firstName} ${teacher.lastName}`}
                </div>
              </div>
            </div>
          </Col>
          <Col md="2">
            <Badge bg="info">
              {studentsCount} {studentsCount === 1 ? 'ученик' : studentsCount < 5 ? 'ученика' : 'учеников'}
            </Badge>
          </Col>
          <Col md="2">
            {!isActive && (
              <Badge bg="secondary">Неактивная</Badge>
            )}
          </Col>
          <Col md="2" className="text-end">
            <Button 
              as={Link} 
              to={`/band/${bandId}`} 
              variant="outline-primary" 
              size="sm"
            >
              Открыть
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BandCard;