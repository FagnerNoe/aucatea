import { useState, useEffect } from "react";
import { supabase } from "../service/supabase";


export function useMembros() {
  const [membros, setMembros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchMembros = async () => {
    setLoading(true);
    const { data, error } = await supabase.
    from("membros")
    .select("*")
    
    if (error) setError(error);
    else setMembros(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembros();
  }, []);

  return { membros, loading, error, fetchMembros };
}