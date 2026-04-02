import React from 'react';

const InsightCard = ({ title, value, description, icon, iconColor, valueColor }) => {
  return (
    <div className="insight-card hover-lift">
      <div className="insight-title">
        {icon && React.cloneElement(icon, { color: iconColor || icon.props.color })}
        {title}
      </div>
      <div className="insight-value" style={valueColor ? { color: valueColor } : {}}>
        {value}
      </div>
      <div className="insight-desc">
        {description}
      </div>
    </div>
  );
};

export default InsightCard;
