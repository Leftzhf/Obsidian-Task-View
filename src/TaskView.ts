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
    date: '2023-04-15',
    startTime: '09:00',
    endTime: '11:30'
  },
  {
    id: '2',
    content: 'Review team\'s code',
    status: 'in-progress',
    tags: ['work', 'coding'],
    date: '2023-04-16',
    startTime: '13:00',
    endTime: '15:00'
  },
  {
    id: '3',
    content: 'Plan weekend trip',
    status: 'todo',
    tags: ['personal', 'travel'],
    date: '2023-04-17',
    startTime: '18:00',
    endTime: '19:30'
  },
  {
    id: '4',
    content: 'Buy groceries',
    status: 'todo',
    tags: ['personal', 'shopping'],
    date: '2023-04-18',
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
  }
];

export class TaskView extends ItemView {
  private resizeObserver: ResizeObserver;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.resizeObserver = new ResizeObserver(() => this.adjustLayout());
  }

  getViewType() {
    return 'task-view';
  }

  getDisplayText() {
    return 'Task View';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl('h4', { text: 'Task Timeline' });
    
    const timelineContainer = container.createEl('div', { cls: 'timeline-container' });

    const sortedTasks = sampleTasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentYear = '';
    let currentMonth = '';
    let currentWeek = '';

    sortedTasks.forEach((task, index) => {
      const taskDate = new Date(task.date);
      const year = taskDate.getFullYear().toString();
      const month = taskDate.toLocaleString('default', { month: 'long' });
      const week = this.getWeekNumber(taskDate);

      // 添加年份标记
      if (year !== currentYear) {
        currentYear = year;
        const yearEl = timelineContainer.createEl('div', { cls: 'timeline-year', text: year });
        yearEl.dataset.year = year;
      }

      // 添加月份标记
      if (`${year}-${month}` !== currentMonth) {
        currentMonth = `${year}-${month}`;
        const monthEl = timelineContainer.createEl('div', { cls: 'timeline-month', text: month });
        monthEl.dataset.month = `${year}-${month}`;
      }

      // 添加周标记
      if (`${year}-W${week}` !== currentWeek) {
        currentWeek = `${year}-W${week}`;
        const weekEl = timelineContainer.createEl('div', { cls: 'timeline-week', text: `Week ${week}` });
        weekEl.dataset.week = `${year}-W${week}`;
      }

      const timelineItem = timelineContainer.createEl('div', { cls: 'timeline-item' });
      
      // 创建时间线连接线
      timelineItem.createEl('div', { cls: 'timeline-line' });

      // 创建日期和状态图标容器
      const dateStatusContainer = timelineItem.createEl('div', { cls: 'date-status-container' });

      // 创建日期标记
      dateStatusContainer.createEl('div', { cls: 'task-date', text: task.date });

      // 创建任务状态图标
      const statusIcon = dateStatusContainer.createEl('div', { cls: 'task-status-icon' });
      this.setTaskStatusIcon(statusIcon, task.status);

      // 创建任务卡片
      const taskCard = timelineItem.createEl('div', { cls: 'task-card' });
      
      // 创建任务头部（时间）
      const cardHeader = taskCard.createEl('div', { cls: 'task-card-header' });
      cardHeader.createEl('span', { 
        cls: 'task-time',
        text: `${task.startTime} - ${task.endTime}`
      });

      // 创建任务内容
      taskCard.createEl('div', { 
        cls: 'task-content',
        text: task.content
      });

      // 创建任务标签
      const tagContainer = taskCard.createEl('div', { cls: 'task-tags' });
      task.tags.forEach(tag => {
        tagContainer.createEl('span', { 
          cls: 'task-tag',
          text: `#${tag}`
        });
      });
    });

    // 开始观察容器大小变化
    this.resizeObserver.observe(this.containerEl);
  }

  async onClose() {
    // 停止观察
    this.resizeObserver.disconnect();
  }

  private adjustLayout() {
    const container = this.containerEl.children[1];
    const width = container.clientWidth;

    if (width < 600) {
      container.classList.add('narrow');
    } else {
      container.classList.remove('narrow');
    }
  }

  private setTaskStatusIcon(element: HTMLElement, status: string) {
    let iconClass = '';
    let iconContent = '';
    switch (status) {
      case 'todo':
        iconClass = 'task-todo';
        iconContent = ''; // 空圆圈
        break;
      case 'in-progress':
        iconClass = 'task-in-progress';
        iconContent = '/'; // 斜线
        break;
      case 'done':
        iconClass = 'task-done';
        iconContent = '✓'; // 勾号
        break;
      case 'cancelled':
        iconClass = 'task-cancelled';
        iconContent = '✗'; // 叉号
        break;
      case 'important':
        iconClass = 'task-important';
        iconContent = '❗'; // 感叹号
        break;
      case 'recurring':
        iconClass = 'task-recurring';
        iconContent = '🔁'; // 循环箭头
        break;
    }
    element.addClass(iconClass);
    element.innerHTML = `<span class="task-icon">${iconContent}</span>`;
  }

  // 添加获取周数的辅助方法
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  }
}