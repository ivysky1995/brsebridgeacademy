export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role: string
          xp_points: number
          streak_count: number
          last_active_date: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      tracks: {
        Row: {
          id: string
          slug: string
          title: string
          title_ja: string | null
          description: string | null
          icon: string | null
          order_index: number
          is_published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tracks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tracks']['Insert']>
      }
      courses: {
        Row: {
          id: string
          track_id: string | null
          slug: string
          title: string
          title_ja: string | null
          description: string | null
          thumbnail_url: string | null
          level: 'beginner' | 'intermediate' | 'advanced' | null
          order_index: number
          is_published: boolean
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      lessons: {
        Row: {
          id: string
          course_id: string | null
          title: string
          title_ja: string | null
          content: Json | null
          content_html: string | null
          summary: string | null
          is_free: boolean
          order_index: number
          estimated_minutes: number
          is_published: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
      }
      quizzes: {
        Row: {
          id: string
          lesson_id: string | null
          title: string
          description: string | null
          passing_score: number
          time_limit_seconds: number | null
          is_published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['quizzes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['quizzes']['Insert']>
      }
      quiz_questions: {
        Row: {
          id: string
          quiz_id: string | null
          question_text: string
          question_type: string
          options: Json
          explanation: string | null
          order_index: number
        }
        Insert: Omit<Database['public']['Tables']['quiz_questions']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['quiz_questions']['Insert']>
      }
      quiz_attempts: {
        Row: {
          id: string
          user_id: string | null
          quiz_id: string | null
          score: number
          total_questions: number
          correct_answers: number
          time_spent_seconds: number | null
          answers: Json | null
          completed_at: string
        }
        Insert: Omit<Database['public']['Tables']['quiz_attempts']['Row'], 'id' | 'completed_at'>
        Update: Partial<Database['public']['Tables']['quiz_attempts']['Insert']>
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string | null
          lesson_id: string | null
          status: 'not_started' | 'in_progress' | 'completed'
          progress_percent: number
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['lesson_progress']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['lesson_progress']['Insert']>
      }
      vocabulary: {
        Row: {
          id: string
          track_id: string | null
          term: string
          term_ja: string | null
          reading: string | null
          meaning_vi: string
          meaning_en: string | null
          example_ja: string | null
          category: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['vocabulary']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['vocabulary']['Insert']>
      }
      user_vocab_decks: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          is_public: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_vocab_decks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_vocab_decks']['Insert']>
      }
      user_vocab_items: {
        Row: {
          id: string
          deck_id: string | null
          vocab_id: string | null
          term: string
          term_ja: string | null
          reading: string | null
          meaning_vi: string
          example: string | null
          mastery_level: number
          next_review_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_vocab_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_vocab_items']['Insert']>
      }
      user_notes: {
        Row: {
          id: string
          user_id: string | null
          lesson_id: string | null
          content: Json | null
          content_text: string | null
          updated_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_notes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_notes']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
