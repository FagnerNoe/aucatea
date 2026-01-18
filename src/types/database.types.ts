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
      corridas: {
        Row: {
          id: string;
          user_id: string;
          nome_passageiro: string;
          telefone_passageiro: string;
          endereco_partida: string;
          endereco_destino: string;
          detalhes_partida: string;
          detalhes_destino: string;
          horario_agendado: string;
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nome_passageiro: string;
          telefone_passageiro: string;
          endereco_partida: string;
          endereco_destino: string;
          detalhes_partida?: string;
          detalhes_destino?: string;
          horario_agendado: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nome_passageiro?: string;
          telefone_passageiro?: string;
          endereco_partida?: string;
          endereco_destino?: string;
          detalhes_partida?: string;
          detalhes_destino?: string;
          horario_agendado?: string;
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
