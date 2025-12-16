import PropTypes from 'prop-types';
import { Container, Form, Table } from 'react-bootstrap';

export const SubscriptionStudents = ({ 
  students = [], 
  showLabel = true, 
  variant = 'striped',
  className = '' 
}) => {
  const renderEmptyState = () => (
    <tr>
      <td className="text-center text-muted p-3">
        Студенты не найдены
      </td>
    </tr>
  );

  const renderStudentRow = (student, index) => (
    <tr 
      key={student.studentId || index}
      //className={onStudentClick ? 'cursor-pointer' : ''}
      //onClick={onStudentClick ? () => onStudentClick(student) : undefined}
    >
      <td>
        <Container className="d-flex p-0">
          <div className="flex-grow-1">
            <span className="fw-medium">
              {student.firstName} {student.lastName}
            </span>
          </div>
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
  className: PropTypes.string,
};