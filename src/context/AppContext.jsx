import { createContext, useContext, useState } from 'react'
import { DEMO_PROFILE, MOCK_WEEKLY_HISTORY, DEMO_ROUTINE_COMPLETIONS } from '../data/mockData'

const AppContext = createContext(null)

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}
const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function AppProvider({ children }) {
  const [userProfile, setUserProfileState] = useState(() => load('herya_profile', DEMO_PROFILE))
  const [weeklyLogs, setWeeklyLogsState] = useState(() => load('herya_logs', MOCK_WEEKLY_HISTORY))
  const [checkedActions, setCheckedActionsState] = useState(() => load('herya_actions', {}))
  const [routineCompletions, setRoutineCompletionsState] = useState(() => load('herya_routines', DEMO_ROUTINE_COMPLETIONS))
  const [sessionRatings, setSessionRatingsState] = useState(() => load('herya_session_ratings', {}))
  const [bookmarks, setBookmarksState] = useState(() => load('herya_bookmarks', []))
  const [reminderSettings, setReminderSettingsState] = useState(() => load('herya_reminders', {
    morningEnabled: true, morningTime: '7:30',
    nightEnabled: true, nightTime: '21:30',
    checkinDay: 'Lunes',
    hydrationEnabled: true,
  }))
  const [chatHistory, setChatHistoryState] = useState(() => load('herya_chat', []))

  // ── Profile ──────────────────────────────────────────────────────────────────
  const saveProfile = (profile) => { setUserProfileState(profile); save('herya_profile', profile) }
  const clearProfile = () => { setUserProfileState(null); localStorage.removeItem('herya_profile') }

  // ── Weekly logs ──────────────────────────────────────────────────────────────
  const saveWeeklyLog = (log) => {
    const newLogs = [...weeklyLogs, log]
    setWeeklyLogsState(newLogs); save('herya_logs', newLogs)
  }

  // ── Dashboard daily actions ──────────────────────────────────────────────────
  const toggleAction = (key) => {
    const updated = { ...checkedActions, [key]: !checkedActions[key] }
    setCheckedActionsState(updated); save('herya_actions', updated)
  }

  // ── Routine completions ──────────────────────────────────────────────────────
  const completeHabit = (date, habitId) => {
    const updated = {
      ...routineCompletions,
      [date]: { ...(routineCompletions[date] || {}), [habitId]: true },
    }
    setRoutineCompletionsState(updated); save('herya_routines', updated)
  }
  const uncompleteHabit = (date, habitId) => {
    const updated = {
      ...routineCompletions,
      [date]: { ...(routineCompletions[date] || {}), [habitId]: false },
    }
    setRoutineCompletionsState(updated); save('herya_routines', updated)
  }

  // ── Session ratings ──────────────────────────────────────────────────────────
  const rateSession = (sessionId, rating) => {
    const updated = { ...sessionRatings, [sessionId]: rating }
    setSessionRatingsState(updated); save('herya_session_ratings', updated)
  }

  // ── Bookmarks ────────────────────────────────────────────────────────────────
  const toggleBookmark = (articleId) => {
    const updated = bookmarks.includes(articleId)
      ? bookmarks.filter(id => id !== articleId)
      : [...bookmarks, articleId]
    setBookmarksState(updated); save('herya_bookmarks', updated)
  }

  // ── Reminders ────────────────────────────────────────────────────────────────
  const saveReminderSettings = (settings) => {
    setReminderSettingsState(settings); save('herya_reminders', settings)
  }

  // ── Chat ─────────────────────────────────────────────────────────────────────
  const addChatMessage = (message) => {
    const updated = [...chatHistory, message]
    setChatHistoryState(updated); save('herya_chat', updated)
  }
  const clearChat = () => { setChatHistoryState([]); localStorage.removeItem('herya_chat') }

  // ── Reset to demo ─────────────────────────────────────────────────────────────
  const resetToDemo = () => {
    saveProfile(DEMO_PROFILE)
    setWeeklyLogsState(MOCK_WEEKLY_HISTORY); save('herya_logs', MOCK_WEEKLY_HISTORY)
    setCheckedActionsState({}); localStorage.removeItem('herya_actions')
    setRoutineCompletionsState(DEMO_ROUTINE_COMPLETIONS); save('herya_routines', DEMO_ROUTINE_COMPLETIONS)
    setChatHistoryState([]); localStorage.removeItem('herya_chat')
  }

  return (
    <AppContext.Provider value={{
      userProfile, weeklyLogs, checkedActions,
      routineCompletions, sessionRatings, bookmarks,
      reminderSettings, chatHistory,
      saveProfile, clearProfile, saveWeeklyLog, toggleAction,
      completeHabit, uncompleteHabit, rateSession,
      toggleBookmark, saveReminderSettings,
      addChatMessage, clearChat, resetToDemo,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
