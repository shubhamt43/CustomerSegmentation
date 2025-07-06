import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

// Register scales/components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsDisplay = ({ results }) => {
  if (!results || !results.summary || !results.charts) return null;

  const { charts } = results;

  return (
    <div className="p-4">
      <h2>Segmentation Insights</h2>

      {/* Chart 1 */}
      <div>
        <h3>Customers per Segment</h3>
        <img src={`data:image/png;base64,${charts.segment_distribution}`} alt="Segment Count" />
      </div>

      {/* Chart 2 */}
      <div>
        <h3>Age Distribution</h3>
        <img src={`data:image/png;base64,${charts.age_distribution}`} alt="Age Distribution" />
      </div>

      {/* Chart 3 */}
      <div>
        <h3>Income Distribution</h3>
        <img src={`data:image/png;base64,${charts.income_distribution}`} alt="Income Distribution" />
      </div>

      {/* Chart 4 */}
      {charts.gender_distribution && (
        <div>
          <h3>Gender Distribution</h3>
          <img src={`data:image/png;base64,${charts.gender_distribution}`} alt="Gender Distribution" />
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
