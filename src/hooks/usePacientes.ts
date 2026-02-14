import { useState, useEffect } from "react";
import { supabase } from "../service/supabase";


export function usePacientes() {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchPacientes = async (ativo = true) => {
    setLoading(true);
    const { data, error } = await supabase.
    from("pacientes")
    .select("*")
    .eq('ativo',ativo);
    if (error) setError(error);
    else setPacientes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return { pacientes, loading, error, fetchPacientes };
}