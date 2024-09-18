import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ItemView, WorkspaceLeaf } from 'obsidian';

interface Task {
  id: string;
  content: string;
  status: 'todo' | 'in-progress' | 'done';
  tags: string[];
  date: string;
  startTime: string;
  endTime: string;
}

const sampleTasks: Task[] = [
  {
    id: '1',
    content: 'Complete project proposal',
    status: 'done',
    tags: ['work', 'urgent'],
    date: '2023-05-15',
    startTime: '09:00',
    endTime: '11:30'
  },
  {
    id: '2',
    content: 'Review team\'s code',
    status: 'in-progress',
    tags: ['work', 'coding'],
    date: '2023-05-16',
    startTime: '13:00',
    endTime: '15:00'
  },
  {
    id: '3',
    content: 'Plan weekend trip',
    status: 'todo',
    tags: ['personal', 'travel'],
    date: '2023-05-20',
    startTime: '18:00',
    endTime: '19:30'
  },
  {
    id: '4',
    content: 'Buy groceries',
    status: 'todo',
    tags: ['personal', 'shopping'],
    date: '2023-05-18',
    startTime: '10:00',
    endTime: '11:00'
  },
  {
    id: '5',
    content: 'Prepare presentation for client',
    status: 'in-progress',
    tags: ['work', 'important'],
    date: '2023-05-19',
    startTime: '14:00',
    endTime: '16:30'
  },
  {
    id: '6',
    content: 'Attend team meeting',
    status: 'todo',
    tags: ['work', 'meeting'],
    date: '2023-05-17',
    startTime: '10:00',
    endTime: '11:00'
  },
  {
    id: '7',
    content: 'Submit expense report',
    status: 'todo',
    tags: ['work', 'finance'],
    date: '2023-05-22',
    startTime: '09:00',
    endTime: '10:00'
  },
  {
    id: '8',
    content: 'Call mom',
    status: 'todo',
    tags: ['personal', 'family'],
    date: '2023-05-21',
    startTime: '19:00',
    endTime: '19:30'
  },
  {
    id: '9',
    content: 'Gym workout',
    status: 'todo',
    tags: ['personal', 'health'],
    date: '2023-05-18',
    startTime: '17:00',
    endTime: '18:30'
  },
  {
    id: '10',
    content: 'Read chapter 5 of new book',
    status: 'todo',
    tags: ['personal', 'learning'],
    date: '2023-05-23',
    startTime: '20:00',
    endTime: '21:00'
  }
];

const TaskView: React.FC<{ leaf: WorkspaceLeaf }> = ({ leaf }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

  useEffect(() => {
    // 按日期降序排序任务
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTasks(sortedTasks);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width < 600) {
          containerRef.current.classList.add('narrow');
        } else {
          containerRef.current.classList.remove('narrow');
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };

  const renderTaskStatusIcon = (status: string) => {
    let iconClass = '';
    let iconContent = '';
    switch (status) {
      case 'todo':
        iconClass = 'task-todo';
        iconContent = '☐';
        break;
      case 'in-progress':
        iconClass = 'task-in-progress';
        iconContent = '◔';
        break;
      case 'done':
        iconClass = 'task-done';
        iconContent = '✓';
        break;
    }
    return <span className={`task-icon ${iconClass}`}>{iconContent}</span>;
  };

  return (
    <div ref={containerRef} className="task-view-container">
      <h4>Task Timeline</h4>
      <div className="timeline-container">
        {tasks.map((task: Task, index: number) => {
          const taskDate = new Date(task.date);
          const year = taskDate.getFullYear().toString();
          const month = taskDate.toLocaleString('default', { month: 'long' });
          const week = getWeekNumber(taskDate);

          const showYear = index === 0 || year !== new Date(tasks[index - 1].date).getFullYear().toString();
          const showMonth = index === 0 || `${year}-${month}` !== `${new Date(tasks[index - 1].date).getFullYear()}-${new Date(tasks[index - 1].date).toLocaleString('default', { month: 'long' })}`;
          const showWeek = index === 0 || `${year}-W${week}` !== `${new Date(tasks[index - 1].date).getFullYear()}-W${getWeekNumber(new Date(tasks[index - 1].date))}`;
          const showDate = index === 0 || task.date !== tasks[index - 1].date;

          return (
            <React.Fragment key={task.id}>
              {showYear && (
                <div className="timeline-year" data-year={year}>{year}</div>
              )}
              {showMonth && (
                <div className="timeline-month" data-month={`${year}-${month}`}>{month}</div>
              )}
              {showWeek && (
                <div className="timeline-week" data-week={`${year}-W${week}`}>Week {week}</div>
              )}
              {showDate && (
                <div className="timeline-date" data-date={task.date}>{task.date}</div>
              )}
              <div className="timeline-item">
                <div className="timeline-line"></div>
                <div className="task-card">
                  <div className="task-card-header">
                    <span className="task-time">{`${task.startTime} - ${task.endTime}`}</span>
                  </div>
                  <div className="task-content">{task.content}</div>
                  <div className="task-tags">
                    {task.tags.map((tag: string, tagIndex: number) => (
                      <span key={tagIndex} className="task-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="task-status-icon">
                  {renderTaskStatusIcon(task.status)}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export class TaskViewWrapper extends ItemView {
  private root: HTMLElement;
  private reactRoot: ReactDOM.Root | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.root = document.createElement('div');
    this.root.classList.add('task-view-container');
  }

  getViewType() {
    return 'task-view';
  }

  getDisplayText() {
    return 'Task View';
  }

  async onOpen() {
    this.containerEl.children[1].appendChild(this.root);
    this.reactRoot = ReactDOM.createRoot(this.root);
    this.reactRoot.render(<TaskView leaf={this.leaf} />);

    // 加载 CSS
    this.loadStyles();
  }

  async onClose() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
  }

  loadStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'task-view-styles';
    styleElement.textContent = `
      .task-view-container {
        padding: 20px;
        font-family: var(--font-interface);
      }

      .timeline-container {
        position: relative;
        padding-left: 30px;
      }

      .timeline-year,
      .timeline-month,
      .timeline-week,
      .timeline-date {
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
        padding-left: 30px;
      }

      .timeline-date {
        font-size: 0.9em;
        color: var(--text-muted);
      }

      .timeline-item {
        position: relative;
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
      }

      .timeline-line {
        position: absolute;
        left: 10px;
        top: 0;
        bottom: -20px;
        width: 2px;
        background-color: var(--background-modifier-border);
      }

      .task-card {
        flex-grow: 1;
        background-color: var(--background-secondary);
        border-radius: 5px;
        padding: 10px;
        margin-left: 30px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .task-status-icon {
        position: absolute;
        left: 1px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        background-color: var(--background-primary);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
      }

      .task-icon {
        font-size: 14px;
      }

      .task-todo {
        color: var(--text-muted);
      }

      .task-in-progress {
        color: var(--text-accent);
      }

      .task-done {
        color: var(--text-success);
      }

      .task-card-header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 5px;
        font-size: 0.9em;
        color: var(--text-muted);
      }

      .task-content {
        margin-bottom: 5px;
      }

      .task-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .task-tag {
        font-size: 0.8em;
        background-color: var(--background-modifier-accent);
        color: var(--text-muted);
        padding: 2px 5px;
        border-radius: 3px;
      }
    `;
    document.head.appendChild(styleElement);
  }
}