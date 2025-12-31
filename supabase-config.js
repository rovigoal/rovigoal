import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

// Configurazione del tuo database Supabase
const supabaseUrl = 'https://jgcjhawtmwfsovuegryz.supabase.co'
const supabaseAnonKey = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase;
