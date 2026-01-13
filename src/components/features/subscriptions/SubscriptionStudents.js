import PropTypes from 'prop-types';
import { Button, Container, Form, Table } from 'react-bootstrap';

export const SubscriptionStudents = ({ 
  students = [], 
  showLabel = true,
  allowRemove = true,
  variant = 'striped',
  className = '',
  onRemoveStudent
}) => {
  const renderEmptyState = () => (
    <tr>
      <td className="text-center text-muted">
        Нет записей
      </td>
    </tr>
  );

  const renderStudentRow = (student, index) => (
    <tr 
      key={student.studentId || index}
    >
      <td>
        <Container className="d-flex p-0">
          <div className="flex-grow-1">
            <span className="fw-medium">
              {student.firstName} {student.lastName}
            </span>
          </div>
          {allowRemove && students.length > 1 && (
          <div className="flex-shrink-1">
              <Button
                variant="outline-danger"
                style={{ fontSize: "10px", marginLeft: "10px", borderRadius: "25px" }}
                onClick={() => onRemoveStudent && onRemoveStudent(index)}
              >
                X
              </Button>
            </div>
          )}
        </Container>
      </td>
    </tr>
  );

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
      <Table striped bordered hover={variant === 'hover'}>
        <tbody>
          {students.length > 0 
            ? students.map(renderStudentRow)
            : renderEmptyState()
          }
        </tbody>
      </Table>
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