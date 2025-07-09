import React from 'react';
import './TimelineBoard.scss';

type TaskType = 'appointment' | 'service' | 'inspection';

interface Task {
  id: string;
  title: string;
  type: TaskType;
  startHour: number; // e.g. 9 for 09:00
  endHour: number;   // e.g. 11 for 11:00
}

interface Technician {
  id: string;
  name: string;
  tasks: Task[];
}

const startHour = 8;
const endHour = 18;
const totalHours = endHour - startHour;

const technicians: Technician[] = [
  {
    id: 't1',
    name: 'Alice Johnson',
    tasks: [
      { id: 'a1', title: 'Inspect A1', type: 'inspection', startHour: 8, endHour: 9 },
      { id: 'a2', title: 'Service B2', type: 'service', startHour: 10, endHour: 12 },
      { id: 'a3', title: 'Appointment C3', type: 'appointment', startHour: 14, endHour: 16 },
    ],
  },
  {
    id: 't2',
    name: 'Bob Smith',
    tasks: [
      { id: 'b1', title: 'Appointment D4', type: 'appointment', startHour: 9, endHour: 11 },
      { id: 'b2', title: 'Inspect E5', type: 'inspection', startHour: 13, endHour: 14 },
      { id: 'b3', title: 'Service F6', type: 'service', startHour: 15, endHour: 18 },
    ],
  },
  {
    id: 't3',
    name: 'Carol Lee',
    tasks: [
      { id: 'c1', title: 'Service G7', type: 'service', startHour: 8, endHour: 10 },
      { id: 'c2', title: 'Inspection H8', type: 'inspection', startHour: 11, endHour: 13 },
      { id: 'c3', title: 'Appointment I9', type: 'appointment', startHour: 16, endHour: 17 },
    ],
  },
  // add more technicians as needed...
];

const TimelineBoard: React.FC = () => {
  const hours = Array.from({ length: totalHours + 1 }, (_, i) => startHour + i);

  return (
    <div className="timeline-board">
      {/* Header: empty corner + hour labels */}
      <div
        className="timeline-header"
        style={{ gridTemplateColumns: `150px repeat(${totalHours}, 1fr)` }}
      >
        <div className="timeline-header-cell label-cell" />
        {hours.map((h) => (
          <div key={h} className="timeline-header-cell">
            {h}:00
          </div>
        ))}
      </div>

      {/* Body: one row per technician */}
      <div className="timeline-body">
        {technicians.map((tech) => (
          <div
            key={tech.id}
            className="timeline-row"
            style={{ gridTemplateColumns: `150px repeat(${totalHours}, 1fr)` }}
          >
            <div className="timeline-row-label">{tech.name}</div>
            <div className="timeline-row-cells">
              {tech.tasks.map((task) => {
                const leftPercent = ((task.startHour - startHour) / totalHours) * 100;
                const widthPercent =
                  ((task.endHour - task.startHour) / totalHours) * 100;
                return (
                  <div
                    key={task.id}
                    className={`timeline-task ${task.type}`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  >
                    {task.title}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineBoard;
