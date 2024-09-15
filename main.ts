import { Plugin, WorkspaceLeaf, addIcon } from 'obsidian';
import { TaskView } from './src/TaskView';
import { SettingTab } from './src/SettingTab';

const TASK_VIEW_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="10" y="10" width="80" height="80" rx="5" ry="5"/>
  <line x1="10" y1="30" x2="90" y2="30"/>
  <line x1="30" y1="10" x2="30" y2="90"/>
  <circle cx="20" cy="50" r="3" fill="currentColor"/>
  <circle cx="20" cy="70" r="3" fill="currentColor"/>
  <line x1="40" y1="50" x2="80" y2="50"/>
  <line x1="40" y1="70" x2="80" y2="70"/>
</svg>`;

export default class TaskViewPlugin extends Plugin {
	async onload() {
		console.log('Loading Task View plugin');

		// 添加自定义图标
		addIcon('task-view', TASK_VIEW_ICON);

		// 添加侧边栏按钮
		this.addRibbonIcon('task-view', 'Task View', (evt: MouseEvent) => {
			this.activateView();
		});

		// 注册视图
		this.registerView(
			'task-view',
			(leaf: WorkspaceLeaf) => new TaskView(leaf)
		);

		// 添加设置选项卡
		this.addSettingTab(new SettingTab(this.app, this));

		// 添加命令
		this.addCommand({
			id: 'open-task-view',
			name: 'Open Task View',
			callback: () => this.activateView(),
		});
	}

	async onunload() {
		console.log('Unloading Task View plugin');
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf = workspace.getLeavesOfType('task-view')[0];
		if (!leaf) {
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: 'task-view', active: true });
		}
		workspace.revealLeaf(leaf);
	}
}
