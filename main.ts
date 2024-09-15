import { Plugin, WorkspaceLeaf, addIcon } from 'obsidian';
import { TaskView } from './src/TaskView';
import { SettingTab } from './src/SettingTab';

const TASK_VIEW_ICON = `<svg>...</svg>`; // 添加您的自定义图标 SVG

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
