export interface Paciente {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  dataNascimento: Date;
  bairro: string;
  cep: string;
  mae: string;
  pai: string;
  laudoUrl?: string;   // foto do laudo (opcional)
  avatarUrl?: string;  // foto/avatar do paciente (opcional)
}

export interface Membro {
  id: number;
  nome: string;
  telefone: string;
  cargo: string;       // ex: presidente, tesoureiro, voluntário
  email?: string;
  avatarUrl?: string; 
}
