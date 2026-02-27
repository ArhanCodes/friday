import { useCallback } from 'react';
import { parseCommand } from '../engine/commandParser';
import { generateResponse } from '../engine/fridayPersonality';
import { analyzeWeakTopics } from '../engine/weakTopicAnalyzer';
import { calculateUrgency } from '../utils/urgencyCalculator';
import { formatDateKey } from '../utils/dateUtils';

export function useCommandProcessor({ tasks, addTask, completeTask, deleteTask, getTaskByIndex, getTaskByName, subjects, addSubject, addTopic, setConfidence, schedule, generateSchedule, addBlock, setTasks, setSubjects, setSchedule }) {

  const processCommand = useCallback((input) => {
    const parsed = parseCommand(input);

    switch (parsed.intent) {
      case 'add_task': {
        const { title, deadline, priority, subject } = parsed.entities;
        if (!title) {
          return { success: false, response: generateResponse('unknown'), intent: parsed.intent };
        }
        const newTask = addTask({ title, deadline: deadline?.toISOString(), priority, subject });
        const response = generateResponse('add_task', { title: newTask.title, deadline: newTask.deadline });
        return { success: true, response, intent: parsed.intent, data: newTask };
      }

      case 'complete_task': {
        const { taskIndex, taskName } = parsed.entities;
        let task = taskIndex ? getTaskByIndex(taskIndex) : getTaskByName(taskName || '');
        if (!task) {
          return { success: false, response: `I couldn't find that task. Try 'show tasks' to see your list.`, intent: parsed.intent };
        }
        const completed = completeTask(task.id);
        const response = generateResponse('complete_task', { title: completed?.title || task.title });
        return { success: true, response, intent: parsed.intent };
      }

      case 'delete_task': {
        const { taskIndex, taskName } = parsed.entities;
        let task = taskIndex ? getTaskByIndex(taskIndex) : getTaskByName(taskName || '');
        if (!task) {
          return { success: false, response: `Task not found. Try 'show tasks' to see your list.`, intent: parsed.intent };
        }
        const deleted = deleteTask(task.id);
        const response = generateResponse('delete_task', { title: deleted?.title || task.title });
        return { success: true, response, intent: parsed.intent };
      }

      case 'list_tasks': {
        const pending = tasks.filter(t => t.status !== 'done');
        const urgentCount = pending.filter(t => calculateUrgency(t.deadline) >= 75).length;
        const response = generateResponse('list_tasks', { count: pending.length, urgentCount });
        return { success: true, response, intent: parsed.intent, navigate: 'tasks' };
      }

      case 'generate_schedule': {
        const newBlocks = generateSchedule(tasks, subjects);
        const response = generateResponse('generate_schedule', { blockCount: newBlocks.length });
        return { success: true, response, intent: parsed.intent, navigate: 'schedule' };
      }

      case 'schedule_session': {
        const { sessionDescription, sessionStart } = parsed.entities;
        if (!sessionStart) {
          return { success: false, response: "I need a time for that session. Try 'schedule physics for tomorrow at 3pm'.", intent: parsed.intent };
        }
        const day = formatDateKey(sessionStart);
        const startH = String(sessionStart.getHours()).padStart(2, '0');
        const startM = String(sessionStart.getMinutes()).padStart(2, '0');
        const endDate = new Date(sessionStart.getTime() + 45 * 60 * 1000);
        const endH = String(endDate.getHours()).padStart(2, '0');
        const endM = String(endDate.getMinutes()).padStart(2, '0');

        const block = addBlock({
          title: sessionDescription || 'Study Session',
          type: 'study',
          day,
          startTime: `${startH}:${startM}`,
          endTime: `${endH}:${endM}`,
        });
        const response = generateResponse('schedule_session', { title: block.title, date: day });
        return { success: true, response, intent: parsed.intent, navigate: 'schedule' };
      }

      case 'add_subject': {
        const newSubject = addSubject(parsed.entities);
        const response = generateResponse('add_subject', { name: newSubject.name });
        return { success: true, response, intent: parsed.intent, navigate: 'revision' };
      }

      case 'add_topic': {
        const { topicName, subjectName } = parsed.entities;
        if (!topicName || !subjectName) {
          return { success: false, response: "I need both a topic and a subject. Try 'add topic: Kinematics to Physics'.", intent: parsed.intent };
        }
        const result = addTopic(subjectName, topicName);
        if (!result) {
          return { success: false, response: `I couldn't find the subject '${subjectName}'. Try 'add subject: ${subjectName}' first.`, intent: parsed.intent };
        }
        const response = generateResponse('add_topic', { topicName, subjectName: result.subject.name });
        return { success: true, response, intent: parsed.intent, navigate: 'revision' };
      }

      case 'set_confidence': {
        const { topicName, level } = parsed.entities;
        if (!topicName) {
          return { success: false, response: "I need a topic name. Try 'set confidence for Kinematics to 2'.", intent: parsed.intent };
        }
        const result = setConfidence(topicName, level);
        if (!result) {
          return { success: false, response: `I couldn't find a topic matching '${topicName}'.`, intent: parsed.intent };
        }
        const response = generateResponse('set_confidence', { topic: result.topic.name, level });
        return { success: true, response, intent: parsed.intent };
      }

      case 'show_weak_topics': {
        const weakTopics = analyzeWeakTopics(subjects);
        const topTopic = weakTopics[0]?.topicName || null;
        const response = generateResponse('show_weak_topics', { count: weakTopics.length, topTopic });
        return { success: true, response, intent: parsed.intent, navigate: 'revision', data: weakTopics };
      }

      case 'status_report': {
        const pending = tasks.filter(t => t.status !== 'done');
        const urgentCount = pending.filter(t => calculateUrgency(t.deadline) >= 75).length;
        const doneToday = tasks.filter(t => {
          if (!t.completedAt) return false;
          return new Date(t.completedAt).toDateString() === new Date().toDateString();
        }).length;
        const weakTopics = analyzeWeakTopics(subjects);
        const response = generateResponse('status_report', {
          pendingCount: pending.length,
          doneToday,
          urgentCount,
          weakCount: weakTopics.length,
        });
        return { success: true, response, intent: parsed.intent, navigate: 'dashboard' };
      }

      case 'clear_data': {
        setTasks([]);
        setSubjects([]);
        setSchedule([]);
        const response = generateResponse('clear_data');
        return { success: true, response, intent: parsed.intent };
      }

      case 'help': {
        const response = generateResponse('help');
        return { success: true, response, intent: parsed.intent };
      }

      default: {
        const response = generateResponse('unknown');
        return { success: false, response, intent: 'unknown' };
      }
    }
  }, [tasks, subjects, schedule, addTask, completeTask, deleteTask, getTaskByIndex, getTaskByName, addSubject, addTopic, setConfidence, generateSchedule, addBlock, setTasks, setSubjects, setSchedule]);

  return { processCommand };
}
