import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { StudentIcon } from '../../components/icons/SideBarIcons/StudentIcon';
import { NoRecords } from '../../components/NoRecords';
import { Button, FormLabel, RemoveItemButton } from '../../components/ui';
import { calculateAge } from '../../utils/dateTime';

export const SubscriptionStudents = ({
  students = [],
  showLabel = true,
  allowAdd = true,
  allowRemove = true,
  variant = "striped",
  className = "",
  onRemoveStudent,
  onAddStudent,
}) => {
  const renderStudentCard = (student, index) => {
    const age = student.birthDate ? calculateAge(student.birthDate) : null;

    return (
      <div
        key={student.studentId || index}
        className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-inner-bg px-4 py-3"
      >
        <div className="flex min-w-0 items-center gap-3">
          <StudentIcon style={{ width: '32px', height: '32px' }} />
          <div className="min-w-0">
            <Link
              to={`/student/${student.studentId}`}
              className="block truncate text-[15px] font-medium text-text-main no-underline transition hover:text-accent"
            >
              {student.firstName} {student.lastName}
            </Link>
            {age > 0 && (
              <div className="text-[13px] text-text-muted">{age} лет</div>
            )}
          </div>
        </div>

        {allowRemove && students.length > 1 && (
          <RemoveItemButton
            onClick={() => onRemoveStudent && onRemoveStudent(index)}
          >
            X
          </RemoveItemButton>
        )}
      </div>
    );
  };

  const getLabel = () => {
    if (!showLabel) return null;

    return <FormLabel>{students.length > 1 ? "Ученики" : "Ученик"}</FormLabel>;
  };

  return (
    <div className={`flex flex-col ${className}`.trim()}>
      {getLabel()}
      <div className="flex flex-col gap-3">
        {students.length > 0
          ? students.map(renderStudentCard)
          : <NoRecords />
        }
      </div>
      {allowAdd && (
        <div className="text-center mt-4">
          <Button
            size="sm"
            variant="outlineSuccess"
            type="button"
            onClick={onAddStudent}
          >
            + Добавить ученика
          </Button>
        </div>
      )}
    </div>
  );
};

SubscriptionStudents.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      birthDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
      email: PropTypes.string,
    }),
  ),
  showLabel: PropTypes.bool,
  variant: PropTypes.oneOf(["striped", "hover", "bordered", "none"]),
  onStudentClick: PropTypes.func,
  onRemoveStudent: PropTypes.func,
  className: PropTypes.string,
};
