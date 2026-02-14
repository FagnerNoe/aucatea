export interface Paciente {
  id: number;
  nome: string;  
  endereco: string;
  complemento_endereco?: string;  
  numero_casa: string;
  data_nascimento: Date;
  bairro: string;
  cep: string;
  slug:string;
  nome_mae: string;
  nome_pai?: string;
  telefone_mae: string;  
  telefone_pai?: string;  
  email_principal?: string;
  laudo_url?: string;   // foto do laudo (opcional)
  foto_paciente?: string;  // foto/avatar do paciente (opcional)
  convenio?: string; // nome do convênio (opcional) 
  tratamento?: []; // descrição do tratamento (opcional)
  data_criacao: Date;
  data_atualizacao: Date;
  cadastro_por?: string; 
  atualizado_por?: string; 

}

export interface Membro {
  id: number;
  nome: string;
  telefone: string;
  responsabilidade: string;       // ex: presidente, tesoureiro, voluntário
  email?: string;
  avatarUrl?: string;  
}

export interface Agenda {
  id: number;
  pacienteId: number;
  membroId: number;
  dataHora: Date;
  descricao?: string;
  criadoPor?: string; 
  editadoPor?: string; 
}
