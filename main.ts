import { Plugin, WorkspaceLeaf } from 'obsidian';
import { TaskViewWrapper } from './src/components/TaskView';

// 移除这行
// import './src/styles/TaskView.css';

export default class TaskViewPlugin extends Plugin {
	async onload() {
		this.registerView('task-view', (leaf) => new TaskViewWrapper(leaf));

		this.addRibbonIcon('calendar-with-checkmark', 'Open Task View', () => {
			this.activateView();
		});

		this.addCommand({
			id: 'open-task-view',
			name: 'Open Task View',
			callback: () => this.activateView(),
		});
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType('task-view');
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType('task-view');

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view doesn't exist, create a new leaf in the right sidebar
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({ type: 'task-view', active: true });
			}
		}

		// Reveal the leaf in the right sidebar
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}
}
