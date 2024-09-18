import { useEffect } from 'react';
import { Plugin, WorkspaceLeaf, addIcon } from 'obsidian';
import TaskView from '../components/TaskView';
import SettingTab from '../components/SettingTab';

const TASK_VIEW_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="10" y="10" width="80" height="80" rx="5" ry="5"/>
  <line x1="10" y1="30" x2="90" y2="30"/>
  <line x1="30" y1="10" x2="30" y2="90"/>
  <circle cx="20" cy="50" r="3" fill="currentColor"/>
  <circle cx="20" cy="70" r="3" fill="currentColor"/>
  <line x1="40" y1="50" x2="80" y2="50"/>
  <line x1="40" y1="70" x2="80" y2="70"/>
</svg>`;

export default function Home() {
  useEffect(() => {
    const plugin = new Plugin();
    plugin.onload = () => {
      addIcon('task-view', TASK_VIEW_ICON);
      plugin.addRibbonIcon('task-view', 'Task View', (evt: MouseEvent) => {
        // 处理点击事件
      });
      plugin.addSettingTab(new SettingTab(plugin));
    };
    return () => {
      plugin.onunload();
    };
  }, []);

  return (
    <div>
      <h1>Task Timeline</h1>
      <TaskView />
    </div>
  );
}