import { Plugin } from 'obsidian';
import { TaskViewWrapper } from './components/TaskView';
import { SettingTab } from './components/SettingTab';

interface TaskViewSettings {
  // 添加您的设置项
  exampleSetting: string;
}

const DEFAULT_SETTINGS: TaskViewSettings = {
  exampleSetting: 'default value'
};

export default class TaskViewPlugin extends Plugin {
  settings: TaskViewSettings;

  async onload() {
    await this.loadSettings();

    this.registerView('task-view', (leaf) => new TaskViewWrapper(leaf));

    this.addSettingTab(new SettingTab(this.app, this));

    this.addRibbonIcon('calendar', 'Open Task View', () => {
      this.activateView();
    });
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onunload() {
    // 添加清理代码
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