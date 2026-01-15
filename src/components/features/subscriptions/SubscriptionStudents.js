import PropTypes from 'prop-types';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { calculateAge } from '../../../utils/dateTime';
import { Avatar } from '../../shared/Avatar';

export const SubscriptionStudents = ({ 
  students = [], 
  showLabel = true,
  allowAdd = true,
  allowRemove = true,
  variant = 'striped',
  className = '',
  onRemoveStudent,
  onAddStudent
}) => {
  const renderEmptyState = () => (
    <div className="text-center py-2 mb-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
      <p className="text-muted mb-0">Нет записей</p>
    </div>
  );

  const renderStudentCard = (student, index) => {
    const age = student.birthDate ? calculateAge(student.birthDate) : null;
    
    return (
      <Card key={student.studentId || index} className="mb-2">
        <Card.Body className="py-2">
          <Row className="align-items-center">
            <Col md="1">
              <Avatar style={{ width: "30px", height: "30px" }} />
            </Col>
            <Col md="9">
              <div style={{marginLeft: "10px"}}>
                <strong>
                  <Link to={`/student/${student.studentId}`}>
                    {student.firstName} {student.lastName}
                  </Link>
                </strong>
                {age > 0 && (
                  <div className="text-muted small">
                    {age} лет
                  </div>
                )}
              </div>
            </Col>
            <Col md="2" className="text-end">
              {allowRemove && students.length > 1 && (
                <Button
                  variant="outline-danger"
                  style={{ fontSize: "10px", marginLeft: "10px", borderRadius: "25px" }}
                  onClick={() => onRemoveStudent && onRemoveStudent(index)}
                >
                  X
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const getLabel = () => {
    if (!showLabel) return null;
    
    return (
      <Form.Label>
        <b>{students.length > 1 ? 'Ученики' : 'Ученик'}</b>
      </Form.Label>
    );
  };

  return (
    <Form.Group className={`mb-3 ${className}`}>
      {getLabel()}
      <div className="mt-2">
        {students.length > 0 
          ? students.map(renderStudentCard)
          : renderEmptyState()
        }
      </div>
      {allowAdd && (
        <div className="text-center">
          <Button size="sm" variant="outline-success" onClick={onAddStudent}>
            + Добавить
          </Button>
        </div>
      )}
    </Form.Group>
  );
};

SubscriptionStudents.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      birthDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      email: PropTypes.string,
    })
  ),
  showLabel: PropTypes.bool,
  variant: PropTypes.oneOf(['striped', 'hover', 'bordered', 'none']),
  onStudentClick: PropTypes.func,
  onRemoveStudent: PropTypes.func,
  className: PropTypes.string,
};