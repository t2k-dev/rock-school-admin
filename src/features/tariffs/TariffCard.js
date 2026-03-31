import PropTypes from "prop-types";
import { CalendarIcon } from "../../components/icons";
import { toMoneyString } from "../../utils/moneyUtils";

const TariffCard = ({
  title,
  amount,
  description,
  style = {},
  className = "",
  showIcon = true,
}) => {
  return (
    <div
      style={style}
      className={`rounded-[20px] border border-white/10 bg-inner-bg px-5 py-4 ${className}`.trim()}
    >
      <div className="flex items-center gap-2 text-[14px] font-semibold text-text-main">
        {showIcon && <CalendarIcon />}
        <strong>{title}</strong>
      </div>
      <div className="mt-2 text-[13px] text-text-muted">
        {description} {toMoneyString(amount)}
      </div>
    </div>
  );
};

TariffCard.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  showIcon: PropTypes.bool,
};

TariffCard.defaultProps = {
  description: "",
  style: {},
  className: "",
  showIcon: true,
};

export default TariffCard;
