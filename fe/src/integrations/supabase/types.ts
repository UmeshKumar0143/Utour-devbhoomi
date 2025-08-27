export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          action_taken: string | null
          alert_type: string
          created_at: string
          id: string
          message: string
          police_notified: boolean | null
          resolved: boolean | null
          resolved_at: string | null
          severity: string
          sms_sent: boolean | null
          tourist_id: string
          zone_type: string | null
        }
        Insert: {
          action_taken?: string | null
          alert_type: string
          created_at?: string
          id?: string
          message: string
          police_notified?: boolean | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity: string
          sms_sent?: boolean | null
          tourist_id: string
          zone_type?: string | null
        }
        Update: {
          action_taken?: string | null
          alert_type?: string
          created_at?: string
          id?: string
          message?: string
          police_notified?: boolean | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string
          sms_sent?: boolean | null
          tourist_id?: string
          zone_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "tourist_profiles"
            referencedColumns: ["tourist_id"]
          },
        ]
      }
      location_tracking: {
        Row: {
          checkpoint_reached: number | null
          deviation_distance: number | null
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          tourist_id: string
          zone_type: string | null
        }
        Insert: {
          checkpoint_reached?: number | null
          deviation_distance?: number | null
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          tourist_id: string
          zone_type?: string | null
        }
        Update: {
          checkpoint_reached?: number | null
          deviation_distance?: number | null
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          tourist_id?: string
          zone_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_tracking_tourist_id_fkey"
            columns: ["tourist_id"]
            isOneToOne: false
            referencedRelation: "tourist_profiles"
            referencedColumns: ["tourist_id"]
          },
        ]
      }
      simulation_sessions: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          participants: Json | null
          session_name: string
          start_time: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          participants?: Json | null
          session_name: string
          start_time?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          participants?: Json | null
          session_name?: string
          start_time?: string | null
          status?: string | null
        }
        Relationships: []
      }
      tourist_profiles: {
        Row: {
          created_at: string
          credit_score: number | null
          current_checkpoint: number | null
          current_location: Json | null
          destination: Json | null
          emergency_contact: string | null
          id: string
          last_seen: string | null
          route_data: Json | null
          status: string | null
          tourist_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credit_score?: number | null
          current_checkpoint?: number | null
          current_location?: Json | null
          destination?: Json | null
          emergency_contact?: string | null
          id?: string
          last_seen?: string | null
          route_data?: Json | null
          status?: string | null
          tourist_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credit_score?: number | null
          current_checkpoint?: number | null
          current_location?: Json | null
          destination?: Json | null
          emergency_contact?: string | null
          id?: string
          last_seen?: string | null
          route_data?: Json | null
          status?: string | null
          tourist_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tourist_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          password_hash: string
          phone: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          password_hash: string
          phone?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          password_hash?: string
          phone?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_tourist_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
