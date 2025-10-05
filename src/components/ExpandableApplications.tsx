"use client";

import React, { useState } from "react";

type ApplicationType = {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  imageUrl?: string; 
};

export default function ExpandableApplications({
  applications,
}: {
  applications: ApplicationType[];
}) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <div className="applications-page">
      <div className="page-header">
        <div className="page-tag">Real-World Impact</div>
        <h1>Applications & Use Cases</h1>
        <p>
          From agricultural management to conservation science, bloom
          monitoring provides actionable insights across diverse fields.
        </p>
      </div>

      <div className="applications-scroll-container">
        {applications.map((app, index) => (
          <div
            key={index}
            className={`application-card ${
              expandedCard === index ? "expanded" : ""
            }`}
          >
            {/* Card Header */}
            <div className="card-header">
              <div className="card-title">
                {app.icon} {app.title} - {app.description.slice(0, 20)}...
              </div>
              <button
                className="details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedCard(expandedCard === index ? null : index);
                }}
              >
                {expandedCard === index ? "Hide" : "Details"}
              </button>
            </div>

            {/* Card Body */}
            <div
              className={`card-body ${
                expandedCard === index ? "show" : ""
              }`}
            >
              <p>{app.description}</p>
              <ul className="benefits-list">
                {app.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>

              {app.imageUrl && (
                <img
                  src={app.imageUrl}
                  alt={app.title}
                  className="expanded-image"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}