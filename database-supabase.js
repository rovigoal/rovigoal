// database-supabase.js - VERSIONE CORRETTA E TESTATA
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

// CONTROLLA QUESTI VALORI - DEVI USARE I TUOI DATI SUPABASE
const SUPABASE_URL = 'https://jgcjhawtmwfsovuegryz.supabase.co'  // Il tuo URL Supabase
const SUPABASE_KEY = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'  // La tua chiave pubblica

// TESTA LA CONNESSIONE
console.log('🔌 Tentativo connessione Supabase...');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY.substring(0, 10) + '...');

// Crea il client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// FUNZIONE PER TESTARE LA CONNESSIONE
async function testConnessione() {
    try {
        console.log('🧪 Test connessione Supabase...');
        
        // Prova a connetterti semplicemente
        const { data, error } = await supabase
            .from('squadre')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Errore connessione:', error);
            return false;
        }
        
        console.log('✅ Connessione OK!');
        return true;
        
    } catch (error) {
        console.error('❌ Errore test connessione:', error);
        return false;
    }
}

// CONTROLLA ANCHE IL NOME DELLE TABELLE
// Assicurati che esistano queste tabelle in Supabase:
// 1. squadre
// 2. giocatori  
// 3. partite
// 4. finale

const DatabaseManager = {
    
    // ============ FUNZIONI BASE ============
    testConnessione: testConnessione,
    
    // ============ GETTERS ============
    async getSquadre() {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .select('*')
                .order('punti', { ascending: false })
            
            if (error) {
                console.error('❌ Errore getSquadre:', error)
                return []
            }
            
            console.log(`✅ Caricate ${data?.length || 0} squadre`)
            return data || []
            
        } catch (error) {
            console.error('❌ Errore getSquadre:', error)
            return []
        }
    },
    
    async getGiocatori() {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .order('nome')
            
            if (error) {
                console.error('❌ Errore getGiocatori:', error)
                return []
            }
            
            console.log(`✅ Caricati ${data?.length || 0} giocatori`)
            return data || []
            
        } catch (error) {
            console.error('❌ Errore getGiocatori:', error)
            return []
        }
    },
    
    async getPartite() {
        try {
            const { data, error } = await supabase
                .from('partite')
                .select('*')
                .order('data', { ascending: false })
            
            if (error) {
                console.error('❌ Errore getPartite:', error)
                return []
            }
            
            console.log(`✅ Caricate ${data?.length || 0} partite`)
            return data || []
            
        } catch (error) {
            console.error('❌ Errore getPartite:', error)
            return []
        }
    },
    
    async getFinale() {
        try {
            const { data, error } = await supabase
                .from('finale')
                .select('*')
                .limit(1)
                .single()
            
            // Se non c'è finale, ritorna null (non è un errore)
            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('ℹ️ Nessuna finale trovata')
                    return null
                }
                console.error('❌ Errore getFinale:', error)
                return null
            }
            
            console.log('✅ Finale caricata')
            return data || null
            
        } catch (error) {
            console.error('❌ Errore getFinale:', error)
            return null
        }
    },
    
    // ============ FUNZIONI DI RESET ============
    async eliminaTutto() {
        try {
            console.log('⚠️ Inizio reset completo database...')
            
            // Elimina tutte le tabelle
            const tables = ['finale', 'partite', 'giocatori', 'squadre']
            
            for (const table of tables) {
                console.log(`🗑️ Elimino ${table}...`)
                const { error } = await supabase
                    .from(table)
                    .delete()
                    .neq('id', 0) // Questo elimina tutto
                
                if (error && error.code !== 'PGRST116') {
                    console.error(`❌ Errore eliminazione ${table}:`, error)
                }
            }
            
            console.log('✅ Reset completato')
            return true
            
        } catch (error) {
            console.error('❌ Errore eliminaTutto:', error)
            throw error
        }
    }
}

export default DatabaseManager
