import PropTypes from "prop-types";
import { getDisciplineName } from "../../constants/disciplines";
import { DisciplineIcon } from "./DisciplineIcon";

export const DisciplinePlate = ({
  disciplineId,
  label = "",
  size = "medium",
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          container: "w-[80px] h-[80px]",
          iconSize: "32px",
          fontSize: "text-[10px]",
        };
      case "large":
        return {
          container: "w-[120px] h-[120px]",
          iconSize: "48px",
          fontSize: "text-[12px]",
        };
      case "fill":
        return {
          container: "w-full h-[100px]",
          iconSize: "48px",
          fontSize: "text-[12px]",
        };
      default: // medium
        return {
          container: "w-[100px] h-[100px]",
          iconSize: "40px",
          fontSize: "text-[11px]",
        };
    }
  };

  const config = getSizeStyles();
  const disciplineName = disciplineId
    ? getDisciplineName(disciplineId)
    : "Не выбрано";

  return (
    <div className="mb-3" style={{ border: "none" }}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-text-muted">
          {label}
        </label>
      )}

      <div className="flex justify-center">
        <div
          className={`
            ${config.container}
            flex flex-col items-center justify-center
            p-2 rounded-xl border border-accent/30 
            bg-inner-bg shadow-inner transition-all
            opacity-90 hover:opacity-100 hover:border-accent
          `}
          style={{ border: "none" }}
        >
          <DisciplineIcon
            disciplineId={disciplineId}
            size={config.iconSize}
            color="var(--accent)"
            style={{ border: "none" }}
          />

          <small
            className={`
              ${config.fontSize}
              mt-1.5 font-bold text-accent tracking-wide uppercase
              leading-tight text-center line-clamp-2
            `}
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
  size: PropTypes.oneOf(["small", "medium", "large", "fill"]),
};

export default DisciplinePlate;
