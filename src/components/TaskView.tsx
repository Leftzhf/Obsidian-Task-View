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
        id: '112',
        content: 'Complete project proposala',
        status: 'done',
        tags: ['work', 'urgent'],
        date: '2024-06-19',
        startTime: '09:00',
        endTime: '11:30'
      },
    {
        id: '111',
        content: 'Complete project proposala',
        status: 'done',
        tags: ['work', 'urgent'],
        date: '2024-05-15',
        startTime: '09:00',
        endTime: '11:30'
      },
  {
    id: '1',
    content: 'Complete project proposala',
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
    date: '2023-04-19',
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
    date: '2023-06-21',
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
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setTasks(sortedTasks);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const timelineItems = containerRef.current.querySelectorAll('.timeline-item');
        let currentDate = '';

        // 使用 Array.from() 和 find() 方法替代 for...of 循环
        const foundItem = Array.from(timelineItems).find(item => {
          const rect = item.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= window.innerHeight / 2;
        });

        if (foundItem) {
          currentDate = foundItem.getAttribute('data-date') || '';
        }

        setCurrentDate(currentDate);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };

  const getWeekDay = (date: Date): string => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return `周${days[date.getDay()]}`;
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
        iconContent = '';
        break;
      case 'done':
        iconClass = 'task-done';
        iconContent = '✓';
        break;
    }
    return <span className={`task-icon ${iconClass}`}>{iconContent}</span>;
  };

  const renderWeekNumber = (taskDate: Date, index: number): JSX.Element | null => {
    const week = getWeekNumber(taskDate);
    const year = taskDate.getFullYear().toString();
    const showWeek = index === 0 || getWeekNumber(new Date(tasks[index - 1].date)) !== week;

    if (showWeek) {
      return <span className="timeline-week">{`${year}-W${week.toString().padStart(2, '0')}`}</span>;
    }
    return null;
  };

  return (
    <div ref={containerRef} className="task-view-container">
      <h4>Task Timeline</h4>
      <div className="timeline-container">
        {tasks.map((task: Task, index: number) => {
          const taskDate = new Date(task.date);
          const year = taskDate.getFullYear().toString();
          const month = taskDate.toLocaleString('default', { month: 'long' });
          const weekDay = getWeekDay(taskDate);

          const showYear = index === 0 || year !== new Date(tasks[index - 1].date).getFullYear().toString();
          const showMonth = index === 0 || `${year}-${month}` !== `${new Date(tasks[index - 1].date).getFullYear()}-${new Date(tasks[index - 1].date).toLocaleString('default', { month: 'long' })}`;
          const showDate = index === 0 || task.date !== tasks[index - 1].date;

          return (
            <React.Fragment key={task.id}>
              {showYear && (
                <div className="timeline-year">{year}</div>
              )}
              {showMonth && (
                <div className="timeline-month">{month}</div>
              )}
              {showDate && (
                <div className="timeline-date" data-date={task.date}>
                  {renderWeekNumber(taskDate, index)}
                  <span className="timeline-date-text">{`${task.date} ${weekDay}`}</span>
                </div>
              )}
              <div className="timeline-item" data-date={task.date}>
                <div className="timeline-line"></div>
                <div className="task-start-time">{task.startTime}</div>
                <div className="task-status-icon">
                  {renderTaskStatusIcon(task.status)}
                </div>
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
        padding: 10px;
        font-family: var(--font-interface);
        height: 100%;
        overflow-y: auto;
      }

      .timeline-container {
        position: relative;
        padding-left: 100px;
      }

      .timeline-year {
        font-size: 2em;
        font-weight: bold;
        margin-top: 40px;
        margin-bottom: 20px;
        color: var(--text-normal);
      }

      .timeline-month {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 30px;
        margin-bottom: 15px;
        color: var(--text-muted);
      }

      .timeline-date {
        position: relative;
        margin-top: 20px;
        margin-bottom: 10px;
        padding-left: 20px;
        display: flex;
        align-items: center;
      }

      .timeline-week {
        font-size: 0.8em;
        color: var(--text-muted);
        background-color: var(--background-secondary);
        border: 1px solid var(--background-modifier-border);
        border-radius: 3px;
        padding: 2px 4px;
        margin-right: 8px;
      }

      .timeline-date-text {
        font-size: 1.2em;
        font-weight: bold;
        color: var(--text-normal);
      }

      .timeline-line {
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: var(--background-modifier-border);
      }

      .timeline-item {
        position: relative;
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
        padding-left: 20px;
      }

      .task-start-time {
        position: absolute;
        left: -70px;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        text-align: right;
        font-size: 0.8em;
        color: var(--text-muted);
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

      .task-card {
        flex-grow: 1;
        background-color: var(--background-secondary);
        border-radius: 5px;
        padding: 10px;
        margin-left: 30px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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