# Queue Simulation Model

A lightweight queue simulator built with React and Create React App. It models arrival/service timing, generates random priorities, and visualizes the resulting schedule with a Gantt-style timeline and summary metrics.

## Features

- configurable arrival rate and service rate
- random priority generation using a linear congruential generator
- queue metrics such as turnaround, wait, and response time
- Gantt chart view for each generated customer/job
- server utilization summary
- sample values included for quick testing

## Recommended Node setup

This project is intentionally kept on the CRA setup, but it has been updated for a current Node environment.

- Node: 18 LTS or 20 LTS recommended
- npm: 9+

If you use nvm:

```bash
nvm install 20
nvm use 20
```

## Getting started

```bash
npm install
npm start
```

Then open:

http://localhost:3000

## Useful sample values

Try the following values to test the app quickly:

- Arrival rate: 2.4
- Service rate: 3.8
- Random numbers: 6

Expected behavior:

- the simulator creates a short queue with valid arrival/service timing
- the table shows generated customer rows with timing metrics
- server utilization should appear as a percentage, typically below 100% when the system remains stable

Example output pattern:

| Customer | Arrival | Service | Priority | Start | End | Turnaround | Wait | Response |
| -------- | ------: | ------: | -------: | ----: | --: | ---------: | ---: | -------: |
| C1       |       0 |       2 |        1 |     0 |   2 |          2 |    0 |        0 |
| C2       |       2 |       3 |        2 |     2 |   5 |          3 |    0 |        0 |
| C3       |       4 |       2 |        3 |     5 |   7 |          3 |    1 |        1 |
| C4       |       7 |       1 |        1 |     7 |   8 |          1 |    0 |        0 |

The exact values vary because random numbers are generated on the fly, but the structure and calculations should remain consistent.

## Scripts

```bash
npm start
npm run build
npm test
```

## Notes

- This app is intentionally not migrated to Vite because the current workflow is simple and the aim is to keep the project lightweight and stable.
- The main updates were focused on modern dependency compatibility, cleaner UI behavior, and removing outdated assumptions that could trigger warnings or future compatibility issues.
