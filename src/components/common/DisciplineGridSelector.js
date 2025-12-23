import PropTypes from "prop-types";
import { SELECTABLE_DISCIPLINES } from "../../constants/disciplines";
import { DisciplineIcon } from "./DisciplineIcon";

export const DisciplineGridSelector = ({ selectedDisciplineId, onDisciplineChange}) => {
  const handleMouseEnter = (e, disciplineId) => {
    if (selectedDisciplineId !== disciplineId) {
      e.currentTarget.style.backgroundColor = '#f8f9fa';
    }
  };

  const handleMouseLeave = (e, disciplineId) => {
    if (selectedDisciplineId !== disciplineId) {
      e.currentTarget.style.backgroundColor = '';
    }
  };

  return (
    <div className="mb-4">
      <div 
        className="d-flex flex-wrap justify-content-center" 
        style={{ gap: '10px', maxWidth: '400px', margin: '0 auto' }}
      >
        {SELECTABLE_DISCIPLINES.map((discipline) => (
          <div
            key={discipline.id}
            className={`p-1 border rounded text-center ${
              selectedDisciplineId === discipline.id 
                ? 'border-primary bg-light' 
                : 'border-secondary'
            }`}
            style={{
              width: '100px',
              height: '100px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onDisciplineChange(discipline.id)}
            onMouseEnter={(e) => handleMouseEnter(e, discipline.id)}
            onMouseLeave={(e) => handleMouseLeave(e, discipline.id)}
          >
            <DisciplineIcon 
              disciplineId={discipline.id} 
              size="40px" 
              color={selectedDisciplineId === discipline.id ? '#0d6efd' : '#6c757d'}
            />
            <small className="mt-2" style={{ fontSize: '12px', lineHeight: '1.2' }}>
              {discipline.name}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

DisciplineGridSelector.propTypes = {
  selectedDisciplineId: PropTypes.number,
  onDisciplineChange: PropTypes.func.isRequired,
  label: PropTypes.string
};

export default DisciplineGridSelector;