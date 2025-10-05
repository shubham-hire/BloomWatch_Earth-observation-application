import React, { useState } from "react";
import { Leaf, Activity, Heart, TrendingUp, Target, Triangle } from "lucide-react";

export default function ExpandableApplications() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const applications = [
    {
      icon: <Leaf className="app-icon" />,
      title: "Agricultural Monitoring",
      short: "Crop cycles",
      description:
        "Track flowering crop cycles for optimal harvest timing and yield predictions",
      benefits: [
        "Cotton harvest planning",
        "Pre-bloom disease management",
        "Crop health assessment",
      ],
      color: "#10b981",
    },
    {
      icon: <Activity className="app-icon" />,
      title: "Pollinator Research",
      short: "Ecosystem health",
      description:
        "Map plant-pollinator relationships and track ecosystem health indicators",
      benefits: [
        "Pollen source mapping",
        "Species migration patterns",
        "Biodiversity hotspots",
      ],
      color: "#f59e0b",
    },
    {
      icon: <Heart className="app-icon" />,
      title: "Public Health",
      short: "Pollen forecast",
      description:
        "Monitor pollen production cycles to support allergy forecasting initiatives",
      benefits: ["Allergy season prediction", "Air quality monitoring", "Health advisories"],
      color: "#ef4444",
    },
  ];

  return (
    <div className="applications-page">
      <h1 className="page-header">Applications & Use Cases</h1>

      <div className="applications-scroll-container">
        {applications.map((app, index) => (
          <div
            key={index}
            className={`application-card ${expandedCard === index ? "expanded" : ""}`}
          >
            <div className="card-header">
              <div className="card-title">
                {app.icon} {app.title} - {app.short}
              </div>
              <button
                className="details-btn"
                onClick={() =>
                  setExpandedCard(expandedCard === index ? null : index)
                }
              >
                {expandedCard === index ? "Hide" : "Details"}
              </button>
            </div>

            <div className={`card-body ${expandedCard === index ? "show" : ""}`}>
              <p>{app.description}</p>
              <ul className="benefits-list">
                {app.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}