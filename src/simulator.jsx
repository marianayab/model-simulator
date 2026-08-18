import { useState } from "react";
import { generateRandomPriority, mapTo123 } from "./priority";
import {
  TableBody,
  TableHead,
  TableCell,
  Table,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const SAMPLE_VALUES = {
  arrivalRate: 2.4,
  serviceRate: 3.8,
  randomNum: 6,
};

const GanttChart = ({ ganttChartData }) => {
  if (!ganttChartData.length) {
    return (
      <div className="chart-panel">
        <h2>Gantt chart</h2>
        <p className="empty-state">
          Generate a simulation to view the schedule.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-panel">
      <h2>Gantt chart</h2>
      <div className="gantt-wrapper">
        {ganttChartData.map((entry) => (
          <div key={entry.id} className="gantt-item">
            <span className="gantt-time">{entry.start}</span>
            <div className="gantt-box">{entry.label}</div>
            <span className="gantt-time">{entry.end}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const QueueSimulation = () => {
  const [arrivalRate, setArrivalRate] = useState(SAMPLE_VALUES.arrivalRate);
  const [serviceRate, setServiceRate] = useState(SAMPLE_VALUES.serviceRate);
  const [randomNum, setRandomNum] = useState(SAMPLE_VALUES.randomNum);
  const [randomPriorities, setRandomPriorities] = useState([]);
  const [results, setResults] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);
  const [serverUtilization, setServerUtilization] = useState("0.00");

  const a = 1;
  const b = 3;
  const A = 55;
  const C = 9;
  const m = 1994;
  const seed = 10112166;

  const exponentialDistribution = (serviceRateValue) => {
    let num;
    do {
      num = -(1 / serviceRateValue) * Math.log(1 - Math.random());
    } while (num < 1);
    return num;
  };

  const poissonDistribution = (arrivalRateValue) => {
    const lambda = Math.exp(-arrivalRateValue);
    let k = 0;
    let probability = 1;

    do {
      k += 1;
      probability *= Math.random();
    } while (probability > lambda);

    return k - 1;
  };

  const runSimulation = (nextArrivalRate, nextServiceRate, nextRandomNum) => {
    const numericArrivalRate = Number(nextArrivalRate);
    const numericServiceRate = Number(nextServiceRate);
    const numericRandomNum = Number(nextRandomNum);

    if (
      !Number.isFinite(numericArrivalRate) ||
      !Number.isFinite(numericServiceRate) ||
      !Number.isFinite(numericRandomNum) ||
      numericArrivalRate <= 0 ||
      numericServiceRate <= 0 ||
      numericRandomNum <= 0
    ) {
      setResults([]);
      setGanttChart([]);
      setServerUtilization("0.00");
      setRandomPriorities([]);
      return;
    }

    let arrivalTime = 0;
    let simulationResults = [];
    let ganttChartData = [];

    const prioritiesLCG = generateRandomPriority(
      seed,
      numericRandomNum,
      A,
      C,
      m,
    );
    const priorities123 = mapTo123(prioritiesLCG, a, b);
    setRandomPriorities(priorities123);

    for (let i = 0; i < numericRandomNum; i += 1) {
      const interArrivalTime = poissonDistribution(numericArrivalRate);
      const service = exponentialDistribution(numericServiceRate);
      const arrival = Math.round(arrivalTime + interArrivalTime);
      const serviceTime = Math.round(service);

      arrivalTime = arrival;

      const previousEndTime =
        ganttChartData.length > 0
          ? ganttChartData[ganttChartData.length - 1].end
          : arrival;
      const startTime = Math.max(arrival, previousEndTime);
      const endTime = startTime + serviceTime;
      const turnAroundTime = endTime - arrival;
      const waitTime = turnAroundTime - serviceTime;
      const responseTime = Math.round(startTime) - Math.round(arrival);

      ganttChartData.push({
        id: i + 1,
        label: `C${i + 1}`,
        start: startTime,
        end: endTime,
      });

      simulationResults.push({
        arrivalTime: arrival,
        serviceTime,
        priority: priorities123[i],
        startTime,
        endTime,
        turnaroundTime: turnAroundTime,
        waitTime,
        responseTime,
      });
    }

    const utilization = numericArrivalRate / numericServiceRate;
    setServerUtilization(
      utilization <= 1 ? (utilization * 100).toFixed(2) : "100.00",
    );

    setResults(simulationResults);
    setGanttChart(ganttChartData);
  };

  const handleGenerateClick = () => {
    runSimulation(arrivalRate, serviceRate, randomNum);
  };

  const handleUseSampleValues = () => {
    setArrivalRate(SAMPLE_VALUES.arrivalRate);
    setServiceRate(SAMPLE_VALUES.serviceRate);
    setRandomNum(SAMPLE_VALUES.randomNum);
    runSimulation(
      SAMPLE_VALUES.arrivalRate,
      SAMPLE_VALUES.serviceRate,
      SAMPLE_VALUES.randomNum,
    );
  };

  return (
    <div className="simulator-shell">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Queue & Service Simulation</p>
          <h1>Random Number Simulator</h1>
        </div>
        <button className="secondary-button" onClick={handleUseSampleValues}>
          Load sample data
        </button>
      </div>

      <div className="control-panel">
        <h2>Simulation parameters</h2>
        <div className="input-grid">
          <label>
            Arrival rate
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={arrivalRate}
              onChange={(event) => setArrivalRate(event.target.value)}
            />
          </label>

          <label>
            Service rate
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={serviceRate}
              onChange={(event) => setServiceRate(event.target.value)}
            />
          </label>

          <label>
            Random numbers
            <input
              type="number"
              min="1"
              step="1"
              value={randomNum}
              onChange={(event) => setRandomNum(event.target.value)}
            />
          </label>
        </div>

        <button className="primary-button" onClick={handleGenerateClick}>
          Generate results
        </button>
      </div>

      <div className="summary-row">
        <div className="summary-card">
          <span className="summary-label">Random priorities</span>
          <strong>
            {randomPriorities.length ? randomPriorities.join(", ") : "—"}
          </strong>
        </div>
        <div className="summary-card accent">
          <span className="summary-label">Server utilization</span>
          <strong>{serverUtilization}%</strong>
        </div>
      </div>

      <TableContainer component={Paper} className="results-table">
        <Table sx={{ minWidth: 650 }} aria-label="simulation results table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Arrival</TableCell>
              <TableCell align="center">Service</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Start</TableCell>
              <TableCell align="center">End</TableCell>
              <TableCell align="center">Turnaround</TableCell>
              <TableCell align="center">Wait</TableCell>
              <TableCell align="center">Response</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.length > 0 ? (
              results.map((result, index) => (
                <TableRow key={`${result.arrivalTime}-${index}`}>
                  <TableCell align="center">{result.arrivalTime}</TableCell>
                  <TableCell align="center">{result.serviceTime}</TableCell>
                  <TableCell align="center">{result.priority}</TableCell>
                  <TableCell align="center">{result.startTime}</TableCell>
                  <TableCell align="center">{result.endTime}</TableCell>
                  <TableCell align="center">{result.turnaroundTime}</TableCell>
                  <TableCell align="center">{result.waitTime}</TableCell>
                  <TableCell align="center">{result.responseTime}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  className="empty-table-cell"
                >
                  No results yet. Adjust the inputs and generate the simulation.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <GanttChart ganttChartData={ganttChart} />
    </div>
  );
};

export default QueueSimulation;
