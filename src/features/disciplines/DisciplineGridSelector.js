import PropTypes from "prop-types";
import { FormLabel } from "../../components/ui";
import { SELECTABLE_DISCIPLINES } from "../../constants/disciplines";
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

  return (
    <div className="flex flex-col gap-4">
      {label && <FormLabel as="label">{label}</FormLabel>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SELECTABLE_DISCIPLINES.map((discipline) => {
          const isSelected = isDisciplineSelected(discipline.id);
          return (
            <div
              key={discipline.id}
              className={`group relative flex h-[104px] cursor-pointer flex-col items-center justify-center rounded-[18px] border p-2 text-center transition ${
                isSelected 
                  ? 'border-[var(--accent)] bg-accent/20 text-text-main shadow-[0_0_0_1px_rgba(69,92,200,0.15)]' 
                  : 'border-white/10 bg-inner-bg text-text-muted hover:border-white/20 hover:bg-white/[0.03]'
              }`}
              onClick={() => handleDisciplineClick(discipline.id)}
            >
              {multiSelect && isSelected && (
                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-text-main">
                  ✓
                </div>
              )}
              
              <DisciplineIcon 
                disciplineId={discipline.id} 
                size="40px" 
                color={isSelected ? '#0d6efd' : '#6c757d'}
              />
              <small 
                className={`mt-2 text-center text-[12px] leading-[1.2] ${isSelected ? 'font-bold text-accent' : 'text-text-muted'}`}
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