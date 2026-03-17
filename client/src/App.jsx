import { useState, useEffect } from "react";
import "./App.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function App() {
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/bowling-stats")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load bowling stats");
        }
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const pieColors = ["#2563eb", "#0f172a", "#60a5fa", "#93c5fd", "#1d4ed8"];

  const projects = [
    {
      name: "Cricket Bowling Stats Dashboard",
      tech: ["React,", " Node.js,", " HTML Parsing"],
      description:
        "A full-stack dashboard that shows my bowling stats from CricClubs with charts and format-wise breakdown.",
    },
    {
      name: "DocPortal",
      tech: ["PEGA,", " Decision Table,"," Data Transform"],
      description:
        " A robust doctor appointment booking system using PEGA,enabling seamless scheduling with specialists.",
    },
    {
      name: "Cruise Ship Management System",
      tech: ["PEGA,", " Flow Action,", " Portal"],
      description:
        "A Cruise Ship Management System built using PEGA to automate booking and management processes.",
    },
  ];

  return (
    <div className="page">
      <div className="container">
        <header className="hero">
          <h1>My Cricket Website</h1>
          <p>Bowling stats dashboard and personal projects</p>
          {stats && <h2 className="player-name">{stats.playerName}</h2>}
        </header>

        {stats && (
          <div className="profile-card">
            <div className="profile-name">{stats.playerName}</div>

            <div className="profile-stats">
              <div>
                <span>Matches</span>
                <strong>{stats.totals.matches}</strong>
              </div>

              <div>
                <span>Wickets</span>
                <strong>{stats.totals.wickets}</strong>
              </div>

              <div>
                <span>Best Bowling</span>
                <strong>{stats.totals.bestBowling}</strong>
              </div>

              <div>
                <span>Economy</span>
                <strong>{stats.totals.economy}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="tabs">
          <button
            className={tab === "stats" ? "tab active" : "tab"}
            onClick={() => setTab("stats")}
          >
            Bowling Stats
          </button>
          <button
            className={tab === "projects" ? "tab active" : "tab"}
            onClick={() => setTab("projects")}
          >
            Projects
          </button>
        </div>

        {tab === "stats" && loading && (
          <section className="section">
            <h2>Loading bowling stats...</h2>
          </section>
        )}

        {tab === "stats" && error && (
          <section className="section">
            <h2>Could not load bowling stats</h2>
            <p>{error}</p>
          </section>
        )}

        {tab === "stats" && stats && !loading && !error && (
          <>
            <section className="section">
              <h2>Overall Bowling Stats</h2>

              <div className="stats-grid">
                <div className="stat-card">
                  <span>Matches</span>
                  <strong>{stats.totals.matches}</strong>
                </div>
                <div className="stat-card">
                  <span>Innings</span>
                  <strong>{stats.totals.innings}</strong>
                </div>
                <div className="stat-card">
                  <span>Overs</span>
                  <strong>{stats.totals.overs}</strong>
                </div>
                <div className="stat-card">
                  <span>Runs</span>
                  <strong>{stats.totals.runs}</strong>
                </div>
                <div className="stat-card">
                  <span>Wickets</span>
                  <strong>{stats.totals.wickets}</strong>
                </div>
                <div className="stat-card">
                  <span>Economy</span>
                  <strong>{stats.totals.economy}</strong>
                </div>
                <div className="stat-card">
                  <span>Average</span>
                  <strong>{stats.totals.average}</strong>
                </div>
                <div className="stat-card">
                  <span>Strike Rate</span>
                  <strong>{stats.totals.strikeRate}</strong>
                </div>
                <div className="stat-card wide">
                  <span>Best Bowling</span>
                  <strong>{stats.totals.bestBowling}</strong>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Bowling Charts</h2>

              <div className="chart-grid">
                <div className="chart-card">
                  <h3>Wickets by Format</h3>
                  <div className="chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.bowlingByFormat}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="seriesType" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="wickets" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Economy by Format</h3>
                  <div className="chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.bowlingByFormat}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="seriesType" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="economy" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Runs by Format</h3>
                  <div className="chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.bowlingByFormat}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="seriesType" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="runs" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Wickets Share by Format</h3>
                  <div className="chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.bowlingByFormat}
                          dataKey="wickets"
                          nameKey="seriesType"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {stats.bowlingByFormat.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={pieColors[index % pieColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Stats by Format</h2>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Format</th>
                      <th>Matches</th>
                      <th>Innings</th>
                      <th>Overs</th>
                      <th>Runs</th>
                      <th>Wickets</th>
                      <th>Best</th>
                      <th>Economy</th>
                      <th>Average</th>
                      <th>SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.bowlingByFormat.map((format, index) => (
                      <tr key={index}>
                        <td>{format.seriesType}</td>
                        <td>{format.matches}</td>
                        <td>{format.innings}</td>
                        <td>{format.overs}</td>
                        <td>{format.runs}</td>
                        <td>{format.wickets}</td>
                        <td>{format.bestBowling}</td>
                        <td>{format.economy}</td>
                        <td>{format.average}</td>
                        <td>{format.strikeRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {tab === "projects" && (
          <section className="section">
            <h2>Projects</h2>

            <div className="project-grid">
              {projects.map((project, index) => (
                <div className="project-card" key={index}>
                  <h3>{project.name}</h3>

                  <div className="tech-stack">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;