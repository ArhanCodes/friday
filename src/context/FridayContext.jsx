import { createContext, useContext, useState, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSubjects } from '../hooks/useSubjects';
import { useSchedule } from '../hooks/useSchedule';
import { useVoice } from '../hooks/useVoice';
import { useCommandProcessor } from '../hooks/useCommandProcessor';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, VIEWS } from '../utils/constants';
import { getGreeting } from '../engine/fridayPersonality';

const FridayContext = createContext(null);

export function FridayProvider({ children, user, onLogout }) {
  const [activeView, setActiveView] = useState(VIEWS.DASHBOARD);
  const [fridayResponse, setFridayResponse] = useState(
    user?.name ? `Welcome back, ${user.name}. All systems operational. What's the plan?` : getGreeting()
  );
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.HISTORY, []);

  const taskHooks = useTasks();
  const subjectHooks = useSubjects();
  const scheduleHooks = useSchedule();
  const voice = useVoice();

  const { processCommand } = useCommandProcessor({
    tasks: taskHooks.tasks,
    addTask: taskHooks.addTask,
    completeTask: taskHooks.completeTask,
    deleteTask: taskHooks.deleteTask,
    getTaskByIndex: taskHooks.getTaskByIndex,
    getTaskByName: taskHooks.getTaskByName,
    subjects: subjectHooks.subjects,
    addSubject: subjectHooks.addSubject,
    addTopic: subjectHooks.addTopic,
    setConfidence: subjectHooks.setConfidence,
    schedule: scheduleHooks.schedule,
    generateSchedule: scheduleHooks.generateSchedule,
    addBlock: scheduleHooks.addBlock,
    setTasks: taskHooks.setTasks,
    setSubjects: subjectHooks.setSubjects,
    setSchedule: scheduleHooks.setSchedule,
  });

  const executeCommand = useCallback((input) => {
    const result = processCommand(input);
    setFridayResponse(result.response);

    if (result.navigate) {
      setActiveView(result.navigate);
    }

    // Speak the response
    if (voice.isSupported) {
      voice.speak(result.response.replace(/\n/g, '. ').replace(/['\-]/g, ' '));
    }

    // Add to history
    setHistory(prev => [{
      id: crypto.randomUUID(),
      input,
      intent: result.intent,
      response: result.response,
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 50));

    return result;
  }, [processCommand, voice, setHistory]);

  const value = {
    activeView,
    setActiveView,
    fridayResponse,
    setFridayResponse,
    history,
    executeCommand,
    voice,
    user,
    onLogout,
    ...taskHooks,
    ...subjectHooks,
    ...scheduleHooks,
  };

  return <FridayContext.Provider value={value}>{children}</FridayContext.Provider>;
}

export function useFriday() {
  const ctx = useContext(FridayContext);
  if (!ctx) throw new Error('useFriday must be used within FridayProvider');
  return ctx;
}
