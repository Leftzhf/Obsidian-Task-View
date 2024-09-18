import { App, PluginSettingTab, Setting } from 'obsidian';
import TaskViewPlugin from '../../main';

interface TaskViewSettings {
  exampleSetting: string;
}

export class SettingTab extends PluginSettingTab {
  plugin: TaskViewPlugin;

  constructor(app: App, plugin: TaskViewPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Task View Settings' });

    new Setting(containerEl)
      .setName('Example Setting')
      .setDesc('This is an example setting.')
      .addText(text => text
        .setPlaceholder('Enter a value')
        .setValue(this.plugin.settings.exampleSetting)
        .onChange(async (value) => {
          this.plugin.settings.exampleSetting = value;
          await this.plugin.saveSettings();
        }));
  }
}