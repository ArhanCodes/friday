import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.TASKS, []);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: crypto.randomUUID(),
      title: taskData.title || 'Untitled Task',
      subject: taskData.subject || null,
      description: taskData.description || '',
      deadline: taskData.deadline || null,
      priority: taskData.priority || 'medium',
      status: 'pending',
      estimatedMinutes: taskData.estimatedMinutes || 45,
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, [setTasks]);

  const completeTask = useCallback((taskId) => {
    let completed = null;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        completed = { ...t, status: 'done', completedAt: new Date().toISOString() };
        return completed;
      }
      return t;
    }));
    return completed;
  }, [setTasks]);

  const deleteTask = useCallback((taskId) => {
    let deleted = null;
    setTasks(prev => {
      deleted = prev.find(t => t.id === taskId);
      return prev.filter(t => t.id !== taskId);
    });
    return deleted;
  }, [setTasks]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, [setTasks]);

  const getTaskByIndex = useCallback((index) => {
    const pending = tasks.filter(t => t.status !== 'done');
    return pending[index - 1] || null;
  }, [tasks]);

  const getTaskByName = useCallback((name) => {
    const lower = name.toLowerCase();
    return tasks.find(t => t.title.toLowerCase().includes(lower)) || null;
  }, [tasks]);

  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const completedToday = tasks.filter(t => {
    if (!t.completedAt) return false;
    const today = new Date().toDateString();
    return new Date(t.completedAt).toDateString() === today;
  });

  return {
    tasks,
    setTasks,
    addTask,
    completeTask,
    deleteTask,
    updateTask,
    getTaskByIndex,
    getTaskByName,
    pendingTasks,
    completedToday,
  };
}
