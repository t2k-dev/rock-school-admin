import PropTypes from 'prop-types';
import { toMoneyString } from '../../../utils/moneyUtils';
import { CalendarIcon } from '../../shared/icons';

const TariffCard = ({ 
  title, 
  amount, 
  description, 
  style = {},
  className = '',
  showIcon = true 
}) => {
  const defaultStyle = {
    background: '#f8f9fa',
    padding: '15px 20px',
    borderRadius: '8px',
    border: '1px solid #dee2e6',
    ...style
  };

  return (
    <div style={defaultStyle} className={className}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#495057' }}>
        {showIcon && <CalendarIcon />} <strong>{title}</strong>
      </div>
      <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '5px' }}>
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
  showIcon: PropTypes.bool
};

TariffCard.defaultProps = {
  description: '',
  style: {},
  className: '',
  showIcon: true
};

export default TariffCard;