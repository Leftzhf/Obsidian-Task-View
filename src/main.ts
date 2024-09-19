import { Plugin } from 'obsidian';
import { TaskViewWrapper } from './components/TaskView';

export default class TaskViewPlugin extends Plugin {
  async onload() {
    console.log('Loading Task View Plugin');

    this.registerView(
      'task-view',
      (leaf) => new TaskViewWrapper(leaf)
    );

    this.addRibbonIcon('checkmark', 'Open Task View', () => {
      this.activateView();
    });

    this.addCommand({
      id: 'open-task-view',
      name: 'Open Task View',
      callback: () => this.activateView(),
    });
  }

  async onunload() {
    console.log('Unloading Task View Plugin');
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType('task-view');

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: 'task-view',
      active: true,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType('task-view')[0]
    );
  }
}