// supabase-config.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

// Configurazione Supabase
const supabaseUrl = 'https://jgcjhawtmwfsovuegryz.supabase.co'
const supabaseAnonKey = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'

// Crea il client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Esporta per usarlo in altri file
export default supabase