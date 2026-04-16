// ─── Lesson Block System ────────────────────────────────────────────────────

export type BlockType =
  | 'theory'
  | 'real_case'
  | 'dialogue'
  | 'vocab_spotlight'
  | 'quick_check'
  | 'summary'

export interface BaseBlock {
  id: string
  type: BlockType
  order: number
}

export interface VocabHighlight {
  term: string
  reading: string
  meaning_vi: string
  vocab_id?: string
}

export interface TheoryBlock extends BaseBlock {
  type: 'theory'
  data: {
    html: string
    vocab_highlights: VocabHighlight[]
  }
}

export interface RealCaseBlock extends BaseBlock {
  type: 'real_case'
  data: {
    scenario_title: string
    context: string
    situation: string
    what_happened: string
    takeaway: string
  }
}

export interface DialogueLine {
  speaker: 'jp' | 'brse'
  speaker_label: string
  text_ja: string
  text_vi: string
  note?: string | null
}

export interface DialogueBlock extends BaseBlock {
  type: 'dialogue'
  data: {
    scene: string
    lines: DialogueLine[]
  }
}

export interface VocabItem {
  vocab_id?: string
  term: string
  reading: string
  meaning_vi: string
  meaning_en?: string
  example_ja: string
  example_vi: string
  category?: string
}

export interface VocabSpotlightBlock extends BaseBlock {
  type: 'vocab_spotlight'
  data: {
    items: VocabItem[]
  }
}

export interface QuickCheckOption {
  id: string
  text: string
  is_correct: boolean
}

export interface QuickCheckQuestion {
  text: string
  options: QuickCheckOption[]
  explanation: string
}

export interface QuickCheckBlock extends BaseBlock {
  type: 'quick_check'
  data: {
    questions: QuickCheckQuestion[]
  }
}

export interface SummaryBlock extends BaseBlock {
  type: 'summary'
  data: {
    key_points: string[]
    vocab_recap: string[]
    next_lesson_teaser?: string
  }
}

export type LessonBlock =
  | TheoryBlock
  | RealCaseBlock
  | DialogueBlock
  | VocabSpotlightBlock
  | QuickCheckBlock
  | SummaryBlock

export interface LessonContent {
  version: string
  blocks: LessonBlock[]
}

// ─── Gamification ───────────────────────────────────────────────────────────

export interface Level {
  level: number
  xp_required: number
  label: string
  label_vi: string
}

export const LEVELS: Level[] = [
  { level: 1, xp_required: 0, label: '新人', label_vi: 'Tân binh' },
  { level: 2, xp_required: 200, label: '研修生', label_vi: 'Thực tập sinh' },
  { level: 3, xp_required: 600, label: '担当者', label_vi: 'Nhân viên' },
  { level: 4, xp_required: 1500, label: 'BrSE初級', label_vi: 'BrSE Junior' },
  { level: 5, xp_required: 3000, label: 'BrSE中級', label_vi: 'BrSE Mid' },
  { level: 6, xp_required: 6000, label: 'BrSE上級', label_vi: 'BrSE Senior' },
  { level: 7, xp_required: 12000, label: 'SAP Consultant', label_vi: 'SAP Consultant' },
  { level: 8, xp_required: 25000, label: 'Solution Architect', label_vi: 'Solution Architect' },
]

export const XP_REWARDS = {
  COMPLETE_LESSON: 50,
  COMPLETE_QUIZ_PASSING: 100,
  PERFECT_QUIZ: 150,
  ADD_VOCAB: 5,
  DAILY_LOGIN: 10,
  STREAK_7_DAYS: 100,
} as const

export function getLevelFromXP(xp: number): Level {
  let current = LEVELS[0]
  for (const level of LEVELS) {
    if (xp >= level.xp_required) {
      current = level
    }
  }
  return current
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevelFromXP(xp)
  const next = LEVELS.find(l => l.level === current.level + 1)
  return next ?? null
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  xp_points: number
  streak_count: number
  last_active_date: string | null
  created_at: string
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export interface QuizOption {
  id: string
  text: string
  is_correct: boolean
}

export interface QuizQuestion {
  id: string
  question_text: string
  question_type: 'single' | 'multiple' | 'true_false'
  options: QuizOption[]
  explanation: string | null
  order_index: number
}
