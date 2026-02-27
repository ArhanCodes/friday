import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { SAT_SUBJECTS } from '../data/satTopics';
import { ALEVEL_SUBJECTS, SUBJECTS_DATA_VERSION } from '../data/aLevelTopics';

function createDefaultSubjects() {
  const all = [...SAT_SUBJECTS, ...ALEVEL_SUBJECTS];
  return all.map(s => ({
    id: crypto.randomUUID(),
    name: s.name,
    examType: s.examType,
    color: s.color,
    topics: s.topics.map(t => ({
      id: crypto.randomUUID(),
      name: t,
      confidence: 3,
      lastReviewed: null,
      reviewCount: 0,
      notes: '',
    })),
    createdAt: new Date().toISOString(),
  }));
}

export function useSubjects() {
  const [subjects, setSubjects] = useLocalStorage(STORAGE_KEYS.SUBJECTS, createDefaultSubjects());

  // Version-based migration: reset to new defaults when topic data changes
  useEffect(() => {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.SUBJECTS_VERSION);
    const currentVersion = String(SUBJECTS_DATA_VERSION);
    if (storedVersion !== currentVersion) {
      const fresh = createDefaultSubjects();
      setSubjects(fresh);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS_VERSION, currentVersion);
    }
  }, [setSubjects]);

  const addSubject = useCallback((data) => {
    const newSubject = {
      id: crypto.randomUUID(),
      name: data.subjectName || data.name || 'New Subject',
      examType: data.examType || 'general',
      color: data.color || '#06b6d4',
      topics: [],
      createdAt: new Date().toISOString(),
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  }, [setSubjects]);

  const addTopic = useCallback((subjectName, topicName) => {
    let added = null;
    setSubjects(prev => prev.map(s => {
      if (s.name.toLowerCase().includes(subjectName.toLowerCase())) {
        const newTopic = {
          id: crypto.randomUUID(),
          name: topicName,
          confidence: 3,
          lastReviewed: null,
          reviewCount: 0,
          notes: '',
        };
        added = { topic: newTopic, subject: s };
        return { ...s, topics: [...s.topics, newTopic] };
      }
      return s;
    }));
    return added;
  }, [setSubjects]);

  const setConfidence = useCallback((topicName, level) => {
    let updated = null;
    setSubjects(prev => prev.map(s => ({
      ...s,
      topics: s.topics.map(t => {
        if (t.name.toLowerCase().includes(topicName.toLowerCase())) {
          updated = { topic: t, subject: s, level };
          return { ...t, confidence: level, lastReviewed: new Date().toISOString(), reviewCount: t.reviewCount + 1 };
        }
        return t;
      }),
    })));
    return updated;
  }, [setSubjects]);

  const deleteSubject = useCallback((subjectId) => {
    let deleted = null;
    setSubjects(prev => {
      deleted = prev.find(s => s.id === subjectId);
      return prev.filter(s => s.id !== subjectId);
    });
    return deleted;
  }, [setSubjects]);

  const deleteTopic = useCallback((subjectId, topicId) => {
    let deleted = null;
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        deleted = s.topics.find(t => t.id === topicId);
        return { ...s, topics: s.topics.filter(t => t.id !== topicId) };
      }
      return s;
    }));
    return deleted;
  }, [setSubjects]);

  const addTopicById = useCallback((subjectId, topicName) => {
    let added = null;
    setSubjects(prev => prev.map(s => {
      if (s.id === subjectId) {
        const newTopic = {
          id: crypto.randomUUID(),
          name: topicName,
          confidence: 3,
          lastReviewed: null,
          reviewCount: 0,
          notes: '',
        };
        added = { topic: newTopic, subject: s };
        return { ...s, topics: [...s.topics, newTopic] };
      }
      return s;
    }));
    return added;
  }, [setSubjects]);

  const findSubject = useCallback((name) => {
    return subjects.find(s => s.name.toLowerCase().includes(name.toLowerCase())) || null;
  }, [subjects]);

  return { subjects, setSubjects, addSubject, addTopic, addTopicById, setConfidence, deleteSubject, deleteTopic, findSubject };
}
