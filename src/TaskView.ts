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
    
    // 创建时间线容器
    const timelineContainer = container.createEl('div', { cls: 'timeline-container' });

    // 按日期排序任务
    const sortedTasks = sampleTasks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 遍历排序后的任务并创建时间线项
    sortedTasks.forEach((task, index) => {
      const timelineItem = timelineContainer.createEl('div', { cls: 'timeline-item' });
      
      // 创建时间线连接线
      if (index < sortedTasks.length - 1) {
        timelineItem.createEl('div', { cls: 'timeline-line' });
      }

      // 创建日期标记
      timelineItem.createEl('div', { cls: 'timeline-date', text: task.date });

      // 创建任务卡片
      const taskCard = timelineItem.createEl('div', { cls: 'task-card' });
      
      // 创建任务头部（状态）
      const cardHeader = taskCard.createEl('div', { cls: 'task-card-header' });
      cardHeader.createEl('span', { 
        cls: `task-status task-status-${task.status}`,
        text: task.status
      });
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
}