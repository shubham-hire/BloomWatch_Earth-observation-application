import { useState, useEffect } from "react";
import axios from "axios";
import ExpandableApplications from "./components/ExpandableApplications";
import {
  MapPin,
  Activity,
  TrendingUp,
  BarChart3,
  Satellite,
  Zap,
  Leaf,
  Heart,
  Target,
  Triangle,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Fix for default markers in react-leaflet . 
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Data for different sections
const seasonalData = [
  { month: "Jan", intensity: 15 },
  { month: "Feb", intensity: 25 },
  { month: "Mar", intensity: 45 },
  { month: "Apr", intensity: 70 },
  { month: "May", intensity: 95 },
  { month: "Jun", intensity: 85 },
  { month: "Jul", intensity: 75 },
  { month: "Aug", intensity: 50 },
  { month: "Sep", intensity: 60 },
  { month: "Oct", intensity: 40 },
  { month: "Nov", intensity: 30 },
  { month: "Dec", intensity: 20 },
];

const bloomRegions = [
  {
    name: "Amazon Basin",
    intensity: "High",
    coordinates: [-3.4653, -62.2159],
    lat: -3.4653,
    lng: -62.2159,
    species: "Mixed vegetation",
    color: "#ec4899",
    radius: 500000,
  },
  {
    name: "Sahara Edge",
    intensity: "Medium",
    coordinates: [23.4162, 25.6628],
    lat: 23.4162,
    lng: 25.6628,
    species: "Mixed vegetation",
    color: "#f59e0b",
    radius: 300000,
  },
  {
    name: "Siberian Tundra",
    intensity: "Emerging",
    coordinates: [66.9897, 141.7854],
    lat: 66.9897,
    lng: 141.7854,
    species: "Mixed vegetation",
    color: "#8b5cf6",
    radius: 200000,
  },
  {
    name: "Great Plains",
    intensity: "High",
    coordinates: [39.8283, -98.5795],
    lat: 39.8283,
    lng: -98.5795,
    species: "Mixed vegetation",
    color: "#ec4899",
    radius: 400000,
  },
];

const applications = [
  {
    icon: <Leaf className="app-icon" />,
    title: "Agricultural Monitoring",
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
    description:
      "Monitor pollen production cycles to support allergy forecasting initiatives",
    benefits: [
      "Allergy season prediction",
      "Air quality monitoring",
      "Health advisories",
    ],
    color: "#ef4444",
  },
  {
    icon: <TrendingUp className="app-icon" />,
    title: "Climate Research",
    description:
      "Track phenological shifts as bio-indicators of climate change impacts",
    benefits: [
      "Peak bloom trends",
      "Seasonal pattern changes",
      "Long-term ecosystem shifts",
    ],
    color: "#8b5cf6",
  },
  {
    icon: <Target className="app-icon" />,
    title: "Conservation Planning",
    description:
      "Identify critical habitats and support targeted ecosystem protection efforts",
    benefits: [
      "Habitat identification",
      "Ecosystem productivity",
      "Conservation priorities",
    ],
    color: "#06b6d4",
  },
  {
    icon: <Triangle className="app-icon" />,
    title: "Invasive Species Detection",
    description:
      "Early detection of unusual bloom patterns indicating invasive plant spread",
    benefits: [
      "Anomaly detection",
      "Spread monitoring",
      "Rapid response planning",
    ],
    color: "#f59e0b",
  },
];

const dataSources = [
  {
    name: "EMIT",
    type: "Spectrometer",
    description: "Earth Surface Mineral Dust Source Investigation",
    resolution: "60m spatial",
    color: "#ec4899",
  },
  {
    name: "Sentinel",
    type: "Land monitoring",
    description: "optical multispectral imaging satellite for land monitoring",
    resolution: "1km spatial",
    color: "#ec4899",
  },
  {
    name: "Landsat 8/9",
    type: "Multispectral",
    description: "Land Remote Sensing Satellite",
    resolution: "30m spatial, 16-day temporal",
    color: "#10b981",
  },
  {
    name: "MODIS",
    type: "Multispectral",
    description: "Moderate Resolution Imaging Spectroradiometer",
    resolution: "250m-1km, Daily",
    color: "#ec4899",
  },
  {
    name: "VIIRS",
    type: "Multispectral",
    description: "Visible Infrared Imaging Radiometer Suite",
    resolution: "375m-750m, Daily",
    color: "#ec4899",
  },
  {
    name: "AVIRIS",
    type: "Hyperspectral",
    description: "Airborne Visible/Infrared Imaging Spectrometer",
    resolution: "Variable airborne",
    color: "#ec4899",
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [weather, setWeather] = useState<{
    temp: number;
    description: string;
  } | null>(null);

  const renderLandingPage = () => (
    <div className="landing-page">
      <img src="./earth-bloom-hero.jpg" alt="Earth Bloom Hero" />
      <div className="hero-section">
        <div className="hero-badge">
          <Satellite className="badge-icon" />
          NASA Earth Observation Platform
        </div>
        <h1 className="hero-title">BloomWatch</h1>
        <p className="hero-tagline">
          Witness the Pulse of Life Across Our Planet
        </p>
        <p className="hero-description">
          Track flowering phenology events globally using NASA satellite data.
          From seasonal blooms to climate patterns, explore how vegetation
          transforms our world—just like pollinators do.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">
            Explore Global Blooms
            <BarChart3 className="btn-icon" />
          </button>
          <button className="btn-secondary">
            <MapPin className="btn-icon" />
            Regional Analysis
          </button>
        </div>
      </div>
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-value">195+</div>
          <div className="stat-label">Global Coverage</div>
          <div className="stat-sublabel">Countries Monitored</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Daily</div>
          <div className="stat-label">Temporal Resolution</div>
          <div className="stat-sublabel">Satellite Updates</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">6+</div>
          <div className="stat-label">Data Sources</div>
          <div className="stat-sublabel">NASA Missions</div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 40.7128; // Example latitude (change to your region)
        const lon = -74.006; // Example longitude

        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );

        console.log("Open-Meteo response:", response.data); // check data in console

        setWeather({
          temp: response.data.current_weather.temperature,
          description: `Wind ${response.data.current_weather.windspeed} km/h`,
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather();
  }, []);

  const renderSeasonalPatterns = () => (
    <div className="seasonal-page">
      <div className="page-header">
        <div className="page-tag">Temporal Analysis</div>
        <h1>Seasonal Bloom Patterns</h1>
        <p>Track how flowering events shift across hemispheres and seasons</p>
      </div>

      <div className="year-selector">
        <label>Select Year: {selectedYear}</label>
        <div className="year-slider">
          {[2019, 2020, 2021, 2022, 2023, 2024].map((year) => (
            <button
              key={year}
              className={`year-btn ${selectedYear === year ? "active" : ""}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <BarChart3 className="chart-icon" />
          <h2>Global Bloom Intensity by Month</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={seasonalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#faf9fbff",
              }}
            />
            <Bar dataKey="intensity" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="highlight-label">75% Active</div>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <h3>Primary Hemisphere</h3>
          <div className="info-value primary">Northern</div>
        </div>
        <div className="info-card">
          <h3>Peak Activity Month</h3>
          <div className="info-value secondary">May (Northern)</div>
        </div>
        <div className="info-card">
          <h3>Weather Overview</h3>
          {weather ? (
            <div className="info-value tertiary">
              {weather.description}, {Math.round(weather.temp)}°C
            </div>
          ) : (
            <div className="info-value tertiary">Loading...</div>
          )}
          <p className="info-sublabel">
            Current conditions for selected region
          </p>
        </div>
      </div>
    </div>
  );

  const renderGlobalActivity = () => (
    <div className="global-activity-page">
      <div className="page-header">
        <div className="page-tag">
          <Zap className="tag-icon" />
          Live Monitoring
        </div>
        <h1>Global Bloom Activity</h1>
        <p>
          Real-time visualization of flowering events detected by NASA's Earth
          observation satellites.
        </p>
      </div>

      <div className="map-section">
        <div className="map-container">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: "500px", width: "100%", borderRadius: "1rem" }}
            className="bloom-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {bloomRegions.map((region, index) => (
              <div key={index}>
                <Circle
                  center={[region.lat, region.lng]}
                  radius={region.radius}
                  pathOptions={{
                    fillColor: region.color,
                    color: region.color,
                    weight: 2,
                    opacity: 0.6,
                    fillOpacity: 0.3,
                  }}
                />
                <Marker position={[region.lat, region.lng]}>
                  <Popup>
                    <div className="map-popup">
                      <h3>{region.name}</h3>
                      <div className="popup-intensity">
                        <span
                          className="intensity-badge"
                          style={{ backgroundColor: region.color }}
                        >
                          {region.intensity}
                        </span>
                      </div>
                      <div className="popup-details">
                        <div className="coordinates">
                          {region.lat.toFixed(4)}°, {region.lng.toFixed(4)}°
                        </div>
                        <div className="species">
                          <div className="species-dot"></div>
                          {region.species}
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </div>
            ))}
          </MapContainer>
          <div className="intensity-legend">
            <h4>Bloom Intensity</h4>
            <div className="legend-item">
              <div className="legend-dot high"></div>
              <span>High</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot medium"></div>
              <span>Medium</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot emerging"></div>
              <span>Emerging</span>
            </div>
          </div>
        </div>

        <div className="regions-panel">
          <div className="panel-header">
            <MapPin className="panel-icon" />
            <h3>Active Bloom Regions</h3>
          </div>
          <div className="regions-list">
            {bloomRegions.map((region, index) => (
              <div key={index} className="region-item">
                <div className="region-header">
                  <h4>{region.name}</h4>
                  <div
                    className="intensity-badge"
                    style={{ backgroundColor: region.color }}
                  >
                    {region.intensity}
                  </div>
                </div>
                <div className="region-details">
                  <div className="coordinates">
                    {region.lat.toFixed(4)}°, {region.lng.toFixed(4)}°
                  </div>
                  <div className="species">
                    <div className="species-dot"></div>
                    {region.species}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="applications-page">
      <div className="page-header">
        <div className="page-tag">Real-World Impact</div>
        <h1>Applications & Use Cases</h1>
        <p>
          From agricultural management to conservation science, bloom monitoring
          provides actionable insights across diverse fields.
        </p>
      </div>

      {/* <div className="applications-grid">
        {applications.map((app, index) => (
          <div key={index} className="application-card">
            <div className="app-icon-container" style={{ color: app.color }}>
              {app.icon}
            </div>
            <h3>{app.title}</h3>
            <p>{app.description}</p>
            <ul className="benefits-list">
              {app.benefits.map((benefit, idx) => (
                <li key={idx} style={{ color: app.color }}>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
      <div className="applications-scroll-container">
        {applications.map((app, index) => (
          <div key={index} className="application-card">
            <div className="app-icon-container" style={{ color: app.color }}>
              {app.icon}
            </div>
            <h3>{app.title}</h3>
            <p>{app.description}</p>
            <ul className="benefits-list">
              {app.benefits.map((benefit, idx) => (
                <li key={idx} style={{ color: app.color }}>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDataSources = () => (
    <div className="data-sources-page">
      <div className="page-header">
        <div className="page-tag">NASA Earth Observations</div>
        <h1>Data Sources & Satellites</h1>
        <p>
          BloomWatch integrates data from NASA's most advanced Earth observation
          missions
        </p>
      </div>

      <div className="sources-grid">
        {dataSources.map((source, index) => (
          <div key={index} className="source-card">
            <div
              className="source-icon"
              style={{ backgroundColor: source.color }}
            >
              <Satellite className="icon" />
            </div>
            <div className="source-type">{source.type}</div>
            <h3>{source.name}</h3>
            <p>{source.description}</p>
            <div className="resolution-info">
              <span className="resolution-label">Resolution</span>
              <span className="resolution-value">{source.resolution}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="footer-attribution">
        <p>
          All data is <span className="highlight">publicly available</span>{" "}
          through NASA's Earth Observing System Data and Information System
          (EOSDIS)
        </p>
      </div>
    </div>
  );

  const renderAboutPage = () => (
    <div className="about-page">
      <div className="content-box">
        <h1>Scalable from Local to Global</h1>
        <p>
          Whether monitoring a single agricultural region or tracking global
          phenological patterns, BloomWatch adapts to your scale. Our
          high-resolution temporal datasets provide insights that inform
          decision-making from conservation field sites to international climate
          research.
        </p>
      </div>

      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon"></div>
            </div>
            <div className="brand-text">
              <h2>BloomWatch</h2>
              <p>NASA Earth Observation Platform</p>
            </div>
          </div>
          <nav className="footer-nav">
            <a href="#" className="nav-link">
              About
            </a>
            <a href="#" className="nav-link">
              Data Sources
            </a>
            <a href="#" className="nav-link">
              API Documentation
            </a>
            <a href="#" className="nav-link">
              Contact
            </a>
          </nav>
        </div>
        <div className="footer-attribution">
          <p>
            Powered by NASA Earth Observations - EMIT - Sentinel - Landsat - MODIS -
            VIIRS - AVIRIS
          </p>
          <p>All satellite data is publicly available through NASA's EOSDIS</p>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="app">
      <nav className="main-nav">
        <div className="nav-brand">
          <div className="nav-logo">
            <Leaf className="logo-icon" />
          </div>
          <span>BloomWatch</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === "landing" ? "active" : ""}`}
            onClick={() => setCurrentPage("landing")}
          >
            Home
          </button>
          <button
            className={`nav-link ${currentPage === "seasonal" ? "active" : ""}`}
            onClick={() => setCurrentPage("seasonal")}
          >
            Seasonal Patterns
          </button>
          <button
            className={`nav-link ${currentPage === "global" ? "active" : ""}`}
            onClick={() => setCurrentPage("global")}
          >
            Global Activity
          </button>
          <button
            className={`nav-link ${
              currentPage === "applications" ? "active" : ""
            }`}
            onClick={() => setCurrentPage("applications")}
          >
            Applications
          </button>
          <button
            className={`nav-link ${currentPage === "data" ? "active" : ""}`}
            onClick={() => setCurrentPage("data")}
          >
            Data Sources
          </button>
          <button
            className={`nav-link ${currentPage === "about" ? "active" : ""}`}
            onClick={() => setCurrentPage("about")}
          >
            About
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === "landing" && renderLandingPage()}
        {currentPage === "seasonal" && renderSeasonalPatterns()}
        {currentPage === "global" && renderGlobalActivity()}
        {/* {currentPage === "applications" && <ExpandableApplications />} */}
        {currentPage === "applications" && (
          <ExpandableApplications applications={applications} />
        )}
        {currentPage === "data" && renderDataSources()}
        {currentPage === "about" && renderAboutPage()}
      </main>
    </div>
  );
}

export default App;
