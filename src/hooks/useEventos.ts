import { useEffect, useState } from "react";
import { supabase } from "../service/supabase";

export function useEventos() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("agenda").select("*");
      if (error) {
        setError(error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEvents();

    // opcional: escutar mudanças em tempo real
    const subscription = supabase
      .channel("agenda-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agenda" },
        () => {
          // Atualiza automaticamente quando houver insert/update/delete
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { events, loading, error };
}
