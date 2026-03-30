import PropTypes from "prop-types";
import { Colors } from "../../constants/Colors";

const TONE_MAP = {
  primary: Colors.primary,
  success: Colors.success,
  warning: Colors.warning,
  danger: Colors.danger,
  secondary: Colors.secondary,
};

const resolveToneColor = (tone) => TONE_MAP[tone] || tone || Colors.secondary;

export const ToneBadge = ({ label, tone, className = "", style = {}, ...props }) => {
  const badgeColor = resolveToneColor(tone);

  return (
    <span
      className={[
        "inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.04em]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderColor: `${badgeColor}44`,
        backgroundColor: `${badgeColor}22`,
        color: badgeColor,
        ...style,
      }}
      {...props}
    >
      {label}
    </span>
  );
};

ToneBadge.propTypes = {
  label: PropTypes.node.isRequired,
  tone: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};