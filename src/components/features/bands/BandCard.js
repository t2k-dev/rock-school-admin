import { Badge, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HoverCard } from "../../shared/ui";

const BandCard = ({ item }) => {
  const { bandId, name, teacher, studentsCount, isActive } = item;

  return (
    <HoverCard className="mb-3" as={Link} to={`/band/${bandId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card.Body>
        <Row className="align-items-center">
          <Col md="4">
            <div className="d-flex align-items-center">
              <div>
                <h3 className="mb-1">{name}</h3>
              </div>
            </div>
          </Col>
          <Col md="4">
            <div className="text-muted">
              Куратор
            </div>
            <div>{teacher && `${teacher.firstName} ${teacher.lastName}`}</div>
          </Col>
          <Col md="4">
            {!isActive && (
              <Badge bg="secondary">Неактивная</Badge>
            )}
          </Col>
        </Row>
      </Card.Body>
    </HoverCard>
  );
};

export default BandCard;