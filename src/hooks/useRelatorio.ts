import { useEffect, useState } from "react";
import { supabase } from "../service/supabase";

export function useRelatorio() {
const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [laudos, setLaudos] = useState<Record<string, number>>({});
  const [tratamentos, setTratamentos] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      // Contar pacientes
      const { count } = await supabase
        .from("pacientes")
        .select("*", { count: "exact", head: true });
      setTotalPacientes(count || 0);

      // Buscar tipos de laudo
      const { data } = await supabase.from("pacientes").select("laudo, tratamentos");

      if (data) {
        const agrupado = data.reduce((acc: Record<string, number>, paciente: any) => {
          acc[paciente.laudo] = (acc[paciente.laudo] || 0) + 1;
          return acc;
        }, {});
        setLaudos(agrupado);

         // Agrupar tratamentos (array)
      const agrupadoTratamentos = data.reduce((acc: Record<string, number>, paciente: any) => {
        if (paciente.tratamentos && Array.isArray(paciente.tratamentos)) {
          paciente.tratamentos.forEach((trat: string) => {
            acc[trat] = (acc[trat] || 0) + 1;
          });
        }
        return acc;
      }, {});
      setTratamentos(agrupadoTratamentos);

      }
    };

    fetchData();
  }, []);

  return { totalPacientes, laudos,tratamentos };

}