export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      rides: {
        Row: {
          id: string;
          user_id: string;
          passenger_name: string;
          passenger_phone: string;
          pickup_address: string;
          destination_address: string;
          pickup_details: string;
          destination_details: string;
          scheduled_time: string;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          passenger_name: string;
          passenger_phone: string;
          pickup_address: string;
          destination_address: string;
          pickup_details?: string;
          destination_details?: string;
          scheduled_time: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          passenger_name?: string;
          passenger_phone?: string;
          pickup_address?: string;
          destination_address?: string;
          pickup_details?: string;
          destination_details?: string;
          scheduled_time?: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
