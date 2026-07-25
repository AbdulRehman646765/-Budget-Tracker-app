"use client";

import React from "react";

interface AlertBannerProps {
  show: boolean;
  text: string;
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ show, text, onDismiss }) => {
  return (
    <div className={`alert-banner ${show ? "show" : ""}`} id="alertBanner">
      <div className="alert-banner-content">
        <i className="fa-solid fa-bell"></i>
        <span id="alertBannerText" dangerouslySetInnerHTML={{ __html: text }}></span>
        <button className="alert-dismiss" onClick={onDismiss}><i className="fa-solid fa-xmark"></i></button>
      </div>
    </div>
  );
};
