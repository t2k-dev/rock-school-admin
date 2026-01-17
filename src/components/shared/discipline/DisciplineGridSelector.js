import PropTypes from "prop-types";
import { SELECTABLE_DISCIPLINES } from "../../../constants/disciplines";
import { DisciplineIcon } from "./DisciplineIcon";

export const DisciplineGridSelector = ({ 
  selectedDisciplineId, 
  selectedDisciplineIds = [], 
  onDisciplineChange, 
  onMultiDisciplineChange,
  label = "",
  multiSelect = false 
}) => {
  
  const isDisciplineSelected = (disciplineId) => {
    if (multiSelect) {
      return selectedDisciplineIds.includes(disciplineId);
    } else {
      return selectedDisciplineId === disciplineId;
    }
  };

  const handleDisciplineClick = (disciplineId) => {
    if (multiSelect) {
      // Multi-select mode: toggle selection
      const isSelected = selectedDisciplineIds.includes(disciplineId);
      if (onMultiDisciplineChange) {
        onMultiDisciplineChange(disciplineId, !isSelected);
      }
    } else {
      // Single-select mode
      if (onDisciplineChange) {
        onDisciplineChange(disciplineId);
      }
    }
  };

  const handleMouseEnter = (e, disciplineId) => {
    if (!isDisciplineSelected(disciplineId)) {
      e.currentTarget.style.backgroundColor = '#f8f9fa';
    }
  };

  const handleMouseLeave = (e, disciplineId) => {
    if (!isDisciplineSelected(disciplineId)) {
      e.currentTarget.style.backgroundColor = '';
    }
  };

  return (
    <div className="mb-4">
      {label && <label className="form-label mb-2">{label}</label>}
      <div 
        className="d-flex flex-wrap justify-content-center" 
        style={{ gap: '10px', maxWidth: '400px', margin: '0 auto' }}
      >
        {SELECTABLE_DISCIPLINES.map((discipline) => {
          const isSelected = isDisciplineSelected(discipline.id);
          return (
            <div
              key={discipline.id}
              className={`p-1 border rounded text-center ${
                isSelected 
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
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onClick={() => handleDisciplineClick(discipline.id)}
              onMouseEnter={(e) => handleMouseEnter(e, discipline.id)}
              onMouseLeave={(e) => handleMouseLeave(e, discipline.id)}
            >
              {/* Multi-select indicator */}
              {/*multiSelect && isSelected && (
                <div 
                  className="position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '20px', height: '20px', fontSize: '12px', marginTop: '2px', marginRight: '2px' }}
                >
                  ✓
                </div>
              )*/}
              
              <DisciplineIcon 
                disciplineId={discipline.id} 
                size="40px" 
                color={isSelected ? '#0d6efd' : '#6c757d'}
              />
              <small 
                className={isSelected ? "text-primary fw-bold mt-2" : "mt-2" }
                style={{ fontSize: '12px', lineHeight: '1.2', textAlign: 'center' }}
                >
                {discipline.name}
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

DisciplineGridSelector.propTypes = {
  selectedDisciplineId: PropTypes.number,
  selectedDisciplineIds: PropTypes.array,
  onDisciplineChange: PropTypes.func,
  onMultiDisciplineChange: PropTypes.func,
  label: PropTypes.string,
  multiSelect: PropTypes.bool
};

export default DisciplineGridSelector;