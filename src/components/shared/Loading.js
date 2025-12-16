import PropTypes from 'prop-types';
import { Container, Spinner } from 'react-bootstrap';

export const Loading = ({ 
  message = "Загрузка...", 
  size = "border",
  containerStyle = {},
  showSpinner = true,
  className = "",
  centered = true 
}) => {
  const defaultContainerStyle = centered 
    ? { marginTop: "100px", textAlign: "center" }
    : {};

  const finalContainerStyle = { 
    ...defaultContainerStyle, 
    ...containerStyle 
  };

  return (
    <Container 
      className={`${centered ? 'text-center' : ''} ${className}`}
      style={finalContainerStyle}
    >
      {showSpinner && (
        <Spinner 
          animation={size} 
          role="status" 
          className="mb-3"
        >
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      )}
      <div className="loading-message">
        {message}
      </div>
    </Container>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['border', 'grow']),
  containerStyle: PropTypes.object,
  showSpinner: PropTypes.bool,
  className: PropTypes.string,
  centered: PropTypes.bool,
};