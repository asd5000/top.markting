const { contextBridge, ipcRenderer } = require('electron');

// تعريض APIs آمنة للتطبيق
contextBridge.exposeInMainWorld('electronAPI', {
  // معلومات النظام
  platform: process.platform,
  version: process.versions.electron,
  
  // وظائف قاعدة البيانات
  database: {
    export: () => ipcRenderer.invoke('export-database'),
    import: () => ipcRenderer.invoke('import-database'),
    backup: () => ipcRenderer.invoke('backup-database')
  },
  
  // وظائف الملفات
  files: {
    openFile: (filters) => ipcRenderer.invoke('open-file', filters),
    saveFile: (data, filename) => ipcRenderer.invoke('save-file', data, filename),
    openDirectory: () => ipcRenderer.invoke('open-directory')
  },
  
  // إشعارات النظام
  notifications: {
    show: (title, body) => ipcRenderer.invoke('show-notification', title, body)
  },
  
  // معلومات التطبيق
  app: {
    getVersion: () => ipcRenderer.invoke('get-app-version'),
    getPath: (name) => ipcRenderer.invoke('get-app-path', name),
    quit: () => ipcRenderer.invoke('quit-app')
  }
});

// إضافة معلومات للنافذة
window.addEventListener('DOMContentLoaded', () => {
  // إضافة كلاس للتطبيق المكتبي
  document.body.classList.add('desktop-app');
  
  // إضافة معلومات النظام
  const systemInfo = {
    isDesktop: true,
    platform: process.platform,
    version: process.versions.electron
  };
  
  window.SYSTEM_INFO = systemInfo;
  
  // إرسال حدث جاهزية التطبيق
  window.dispatchEvent(new CustomEvent('desktop-app-ready', {
    detail: systemInfo
  }));
});
