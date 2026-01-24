import PropTypes from "prop-types";
import { getDisciplineName } from "../../../constants/disciplines";
import { DisciplineIcon } from "./DisciplineIcon";

export const DisciplinePlate = ({ 
  disciplineId,
  label = "",
  size = "medium" // "small", "medium", "large"
}) => {
  
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          width: '80px',
          height: '80px',
          iconSize: '32px',
          fontSize: '10px'
        };
      case "large":
        return {
          width: '120px',
          height: '120px',
          iconSize: '48px',
          fontSize: '12px'
        };
      case "fill":
        return {
          width: '100%',
          height: '100px',
          iconSize: '48px',
          fontSize: '12px'
        };        
      default: // medium
        return {
          width: '100px',
          height: '100px',
          iconSize: '40px',
          fontSize: '11px'
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const disciplineName = disciplineId ? getDisciplineName(disciplineId) : 'Не выбрано';

  return (
    <div className="mb-3">
      {label && <label className="form-label mb-2">{label}</label>}
      <div className="d-flex justify-content-center">
        <div
          className="p-2 border border-primary bg-light rounded text-center"
          style={{
            width: sizeStyles.width,
            height: sizeStyles.height,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.9
          }}
        >
          <DisciplineIcon 
            disciplineId={disciplineId} 
            size={sizeStyles.iconSize}
            color="#0d6efd"
          />
          <small 
            className="mt-1 text-primary fw-bold" 
            style={{ 
              fontSize: sizeStyles.fontSize, 
              lineHeight: '1.2', 
              textAlign: 'center' 
            }}
          >
            {disciplineName}
          </small>
        </div>
      </div>
    </div>
  );
};

DisciplinePlate.propTypes = {
  disciplineId: PropTypes.number,
  label: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"])
};

export default DisciplinePlate;