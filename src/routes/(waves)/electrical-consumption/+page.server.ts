import { supabase } from "$lib/components/supabase/supabaseClient";

export async function load() {
  const { data: casaDomaData, error: casaDomaError } = await supabase
    .from("casa_doma")
    .select("*")
    .order('fecha_hora', { ascending: false })
    .limit(100);

  if (casaDomaError) {
    console.error('Error al cargar datos:', casaDomaError);
  }

  return {
    casaDoma: casaDomaData ?? []
  };
}