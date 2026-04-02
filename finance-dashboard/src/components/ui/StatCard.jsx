import React from 'react';

const StatCard = ({ title, value, icon, iconBg, iconColor, trendIcon, trendText, trendColor }) => {
  return (
    <div className="card">
      <div className="card-title">
        {title}
        <div className="icon-btn" style={{ background: iconBg, color: iconColor, border: 'none' }}>
          {icon}
        </div>
      </div>
      <div className="card-value">{value}</div>
      <div className="card-trend" style={{ color: trendColor }}>
        {trendIcon}
        <span style={{ fontSize: '0.75rem' }}>{trendText}</span>
      </div>
    </div>
  );
};

export default StatCard;
