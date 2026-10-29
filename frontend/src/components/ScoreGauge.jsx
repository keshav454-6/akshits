import React from 'react';

export default function ScoreGauge({ score = 0, size = 120, label = "Risk Score" }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#2E8B57'; // Low risk — success green

  if (clampedScore >= 75) {
    strokeColor = '#B74A4A'; // Critical — danger
  } else if (clampedScore >= 50) {
    strokeColor = '#D4A44B'; // High — warning amber
  } else if (clampedScore >= 25) {
    strokeColor = '#D4A44B'; // Medium — warning amber
  }

  return (
    <div className="gauge-container" style={{ width: size, minWidth: size }}>
      <div className="gauge-meter-wrapper" style={{ width: size, height: size }}>
        <svg className="gauge-svg" viewBox="0 0 110 110">
          <circle
            className="gauge-circle-bg"
            cx="55"
            cy="55"
            r={radius}
          />
          <circle
            className="gauge-circle-val"
            cx="55"
            cy="55"
            r={radius}
            style={{
              stroke: strokeColor,
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset
            }}
          />
        </svg>
        <div className="gauge-text-overlay">
          <span className="gauge-score-num" style={{ color: strokeColor }}>
            {clampedScore}
          </span>
          <span className="gauge-score-sub">{label}</span>
        </div>
      </div>
    </div>
  );
}







