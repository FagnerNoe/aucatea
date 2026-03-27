import { useEffect, useState } from "react";
import { supabase } from "../service/supabase";
import type { Paciente } from "../types/database.types";



export function useAniversariante() {
    const [doMes,setDoMes]= useState<any[]>([]);
    const [doDia,setDoDia]= useState<any[]>([]);
    const [loading,setLoading]= useState(true);

useEffect(() => {
    async function buscarAniversariantes() {
        setLoading(true);
        const hoje = new Date();
        const mesAtual = hoje.getMonth() + 1; // getMonth() retorna de 0 a 11
        const diaAtual = hoje.getDate();
        console.log(diaAtual);

        const {data,error} = await supabase
        .rpc('get_aniversariantes_mes', { mes_consulta: mesAtual })
        
        console.log("Aniversariantes do mês:", data);

        if(!error && data) {
           const aniversariantesDoDia= data.filter((paciente: Paciente) => {
            const dataNasc = new Date(paciente.data_nascimento + 'T00:00:00'); // Convertendo para Date
            const diaNasc = dataNasc.getDate() 
            
            return diaNasc === diaAtual;});       

            //ordenando por dia melhor visualização
            const ordenados = data.sort((a: Paciente, b: Paciente) => {
                const diaA = Number(a.data_nascimento.toString().split('-')[2]);
                const diaB = Number(b.data_nascimento.toString().split('-')[2]);
                return diaA - diaB;
            });           

            setDoMes(ordenados);
            setDoDia(aniversariantesDoDia);
        }
        setLoading(false);   
            console.log("Aniversariantes do dia:", doDia.length);
    }
    buscarAniversariantes();
},[])
return {doMes,doDia,loading};
}