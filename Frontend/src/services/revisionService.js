const REVISION_INTERVALS = [1, 3, 7, 21];

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
};

const formatDate = (date) => date.toISOString().split('T')[0];

// SHARED DATA POOL - Single Source of Truth for Syncing
let globalRevisions = [
  { id: 'rev-1', topic_name: 'Dynamic Programming', subject: 'Algorithms', interval_day: 3, scheduled_date: formatDate(addDays(new Date(), -2)), completed: false },
  { id: 'rev-2', topic_name: 'Process Scheduling', subject: 'Operating Systems', interval_day: 1, scheduled_date: formatDate(new Date()), completed: false },
  { id: 'rev-3', topic_name: 'Normalization', subject: 'DBMS', interval_day: 7, scheduled_date: formatDate(new Date()), completed: false }
];

export const revisionService = {
  // Returns only pending for Dashboard, but all for Revision Page
  getDueRevisions: (includeCompleted = false) => {
    return includeCompleted ? globalRevisions : globalRevisions.filter(r => !r.completed);
  },
  
  // New Toggle Logic: Allows checking and unchecking
  toggleStatus: (id) => {
    globalRevisions = globalRevisions.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
  },

  getStats: () => {
    const active = globalRevisions.filter(r => !r.completed);
    return {
      total: globalRevisions.length,
      overdue: active.filter(r => revisionService.getUrgencyStatus(r.scheduled_date) === 'overdue').length,
      today: active.filter(r => revisionService.getUrgencyStatus(r.scheduled_date) === 'today').length,
      completed: globalRevisions.filter(r => r.completed).length
    };
  },

  getUrgencyStatus: (scheduled_date) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const target = new Date(scheduled_date).setHours(0, 0, 0, 0);
    if (target < today) return 'overdue';
    if (target === today) return 'today';
    return 'upcoming';
  },

  formatRelativeDate: (date) => {
    const diff = Math.round((new Date(date).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === -1) return 'Yesterday';
    return diff < 0 ? `${Math.abs(diff)} days ago` : `In ${diff} days`;
  },

  getIntervalLabel: (days) => `Day-${days} Mastery Step`
};/**
 * revisionService.js
 * Spaced Repetition Logic for PrepMate
 */

const REVISION_INTERVALS = [1, 3, 7, 21];

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
};

const formatDate = (date) => date.toISOString().split('T')[0];

// Shared data pool for syncing across components
let globalRevisions = [
  { id: 'rev-1', topic_name: 'Dynamic Programming', subject: 'Algorithms', interval_day: 3, scheduled_date: formatDate(addDays(new Date(), -2)), completed: false },
  { id: 'rev-2', topic_name: 'Process Scheduling', subject: 'Operating Systems', interval_day: 1, scheduled_date: formatDate(new Date()), completed: false },
  { id: 'rev-3', topic_name: 'Normalization', subject: 'DBMS', interval_day: 7, scheduled_date: formatDate(new Date()), completed: false }
];

export const revisionService = {
  // Returns pending revisions for Dashboard, or all for Revision Page
  getDueRevisions: (includeCompleted = false) => {
    return includeCompleted ? globalRevisions : globalRevisions.filter(r => !r.completed);
  },
  
  // Toggle logic for the "beautiful uncheck" effect
  toggleStatus: (id) => {
    globalRevisions = globalRevisions.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
  },

  getStats: () => {
    const active = globalRevisions.filter(r => !r.completed);
    return {
      total: globalRevisions.length,
      overdue: active.filter(r => revisionService.getUrgencyStatus(r.scheduled_date) === 'overdue').length,
      today: active.filter(r => revisionService.getUrgencyStatus(r.scheduled_date) === 'today').length,
      completed: globalRevisions.filter(r => r.completed).length
    };
  },

  getUrgencyStatus: (scheduled_date) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const target = new Date(scheduled_date).setHours(0, 0, 0, 0);
    if (target < today) return 'overdue';
    if (target.getTime() === today.getTime()) return 'today';
    return 'upcoming';
  },

  formatRelativeDate: (date) => {
    const diff = Math.round((new Date(date).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === -1) return 'Yesterday';
    return diff < 0 ? `${Math.abs(diff)} days ago` : `In ${diff} days`;
  }
};