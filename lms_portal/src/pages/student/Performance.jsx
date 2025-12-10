import "../../styles/student/performance.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

function Performance() {
  // Pie chart data (course progress)
  const progressData = [
    { name: "Completed", value: 60 },
    { name: "Remaining", value: 40 }
  ];

  const COLORS = ["#FFA700", "#f0f0f0"];


  // Bar chart data (quiz scores)
  const quizData = [
    { quiz: "Python", score: 80 },
    { quiz: "React", score: 75 },
    { quiz: "Django", score: 65 },
  ];

  return (
    <div>
      <h1>Performance</h1>

      <div className="performance-grid">

        {/* PIE CHART CARD */}
        <div className="card chart-card">
          <h3>Course Progress</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {progressData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* BAR CHART CARD */}
        <div className="card chart-card">
          <h3>Quiz Performance</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={quizData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quiz" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#FFA700" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>
    </div>
  );
}

export default Performance;
