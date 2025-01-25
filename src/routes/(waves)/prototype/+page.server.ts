import { supabase } from "$lib/components/supabase/supabaseClient";

export async function load() {
  const { data, error } = await supabase
    .from("privietfotonv")
    .select("*")
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error al cargar datos:', error);
    return {
      mediciones: []
    };
  }

  return {
    mediciones: data ?? []
  };
}
