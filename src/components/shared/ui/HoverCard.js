import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

export const HoverCard = ({ 
  children, 
  onClick, 
  className = "", 
  style = {},
  hoverTransform = 'translateY(-2px)',
  hoverShadow = '0 4px 8px rgba(0,0,0,0.1)',
  transition = 'transform 0.2s, box-shadow 0.2s',
  clickable = true,
  ...props 
}) => {
  const cardStyle = {
    cursor: clickable ? 'pointer' : 'default',
    transition,
    ...style
  };

  const handleMouseEnter = (e) => {
    if (clickable) {
      e.currentTarget.style.transform = hoverTransform;
      e.currentTarget.style.boxShadow = hoverShadow;
    }
  };

  const handleMouseLeave = (e) => {
    if (clickable) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '';
    }
  };

  const handleClick = (e) => {
    if (onClick && clickable) {
      onClick(e);
    }
  };

  return (
    <Card 
      className={className}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Card>
  );
};

HoverCard.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  hoverTransform: PropTypes.string,
  hoverShadow: PropTypes.string,
  transition: PropTypes.string,
  clickable: PropTypes.bool,
};