"use client";

import React from "react";

interface AlertSettingsProps {
  enabled: boolean;
  threshold: number;
  onToggle: () => void;
  onThresholdChange: (val: number) => void;
}

export const AlertSettings: React.FC<AlertSettingsProps> = ({
  enabled,
  threshold,
  onToggle,
  onThresholdChange,
}) => {
  return (
    <section className="glass-card alert-settings-section tool-card" id="alertSettingsSection">
      <div className="section-title-row">
        <h2><i className="fa-solid fa-bell"></i> Budget Alert Settings</h2>
        <label className="toggle-switch">
          <input
            type="checkbox"
            id="alertToggle"
            checked={enabled}
            onChange={onToggle}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
      <p className="alert-description">Get notified when your spending crosses the limit.</p>
      <div className="alert-threshold-row">
        <label htmlFor="alertThreshold">Alert at:</label>
        <div className="threshold-input-wrap">
          <input
            type="number"
            id="alertThreshold"
            value={threshold}
            min={10}
            max={100}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
          />
          <span>%</span>
        </div>
        <span className="threshold-hint">of budget used</span>
      </div>
    </section>
  );
};
