// database-supabase.js - VERSIONE DEFINITIVA CON NOMI CORRETTI
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

const SUPABASE_URL = 'https://jgcjhawtmwfsovuegryz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const DatabaseManager = {
    
    // ============ GETTERS ============
    async getSquadre() {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .select('*')
                .order('punti', { ascending: false })
            
            if (error) {
                console.error('Errore getSquadre:', error)
                return []
            }
            
            return data || []
            
        } catch (error) {
            console.error('Errore getSquadre:', error)
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
                console.error('Errore getGiocatori:', error)
                return []
            }
            
            return data || []
            
        } catch (error) {
            console.error('Errore getGiocatori:', error)
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
                console.error('Errore getPartite:', error)
                return []
            }
            
            return data || []
            
        } catch (error) {
            console.error('Errore getPartite:', error)
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
                    return null
                }
                throw error
            }
            
            return data || null
            
        } catch (error) {
            console.error('Errore getFinale:', error)
            return null
        }
    },
    
    // ============ CRUD ============
    async aggiungiSquadra(squadra) {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .insert([{
                    nome: squadra.nome,
                    punti: 0,
                    partite_giocate: 0,
                    vittorie: 0,
                    pareggi: 0,
                    sconfitte: 0,
                    gol_fatti: 0,
                    gol_subiti: 0
                }])
                .select()
                .single()
            
            if (error) throw error
            return data
            
        } catch (error) {
            console.error('Errore aggiungiSquadra:', error)
            throw error
        }
    },
    
    async aggiungiGiocatore(giocatore) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .insert([{
                    nome: giocatore.nome,
                    numero: giocatore.numero || null,
                    squadra: giocatore.squadra,
                    ruolo: giocatore.ruolo || 'Giocatore',
                    gol: 0,
                    ammonizioni: 0,
                    espulsioni: 0
                }])
                .select()
                .single()
            
            if (error) throw error
            return data
            
        } catch (error) {
            console.error('Errore aggiungiGiocatore:', error)
            throw error
        }
    },
    
    async eliminaSquadra(squadraId) {
        try {
            const { error } = await supabase
                .from('squadre')
                .delete()
                .eq('id', squadraId)
            
            if (error) throw error
            return true
            
        } catch (error) {
            console.error('Errore eliminaSquadra:', error)
            throw error
        }
    },
    
    async eliminaGiocatore(giocatoreId) {
        try {
            const { error } = await supabase
                .from('giocatori')
                .delete()
                .eq('id', giocatoreId)
            
            if (error) throw error
            return true
            
        } catch (error) {
            console.error('Errore eliminaGiocatore:', error)
            throw error
        }
    },
    
    async aggiungiPartita(partita) {
        try {
            const { data, error } = await supabase
                .from('partite')
                .insert([{
                    data: partita.data,
                    ora: partita.ora || null,
                    squadra_casa: partita.squadra_casa,
                    squadra_ospite: partita.squadra_ospite,
                    gol_casa: partita.gol_casa || 0,
                    gol_ospite: partita.gol_ospite || 0,
                    eventi: partita.eventi || []
                }])
                .select()
                .single()
            
            if (error) throw error
            return data
            
        } catch (error) {
            console.error('Errore aggiungiPartita:', error)
            throw error
        }
    },
    
    async salvaFinale(finale) {
        try {
            // Elimina finale esistente
            await supabase.from('finale').delete().neq('id', 0)
            
            // INSERIMENTO CON I NOMI DELLE COLONNE ESATTI
            const { data, error } = await supabase
                .from('finale')
                .insert([{
                    data: null, // Non serve più
                    ora: null,  // Non serve più
                    squadra_casa: finale.squadra_casa,
                    squadra_ospite: finale.squadra_ospite,
                    gol_casa: finale.gol_casa || 0,
                    gol_ospite: finale.gol_ospite || 0,
                    miglior_giocatore: finale.miglior_giocatore || null,
                    voto_miglior_giocatore: finale.voto_miglior_giocatore || null,
                    portiere_casa: finale.miglior_portiere || null, // Usiamo portiere_casa per il miglior portiere
                    portiere_ospite: null, // Lasciamo vuoto
                    voto_portiere_casa: finale.voto_miglior_portiere || null, // Usiamo voto_portiere_casa per il voto del miglior portiere
                    voto_portiere_ospite: null, // Lasciamo vuoto
                    eventi: finale.eventi || []
                }])
                .select()
                .single()
            
            if (error) throw error
            return data
            
        } catch (error) {
            console.error('Errore salvaFinale:', error)
            throw error
        }
    },
    
    async eliminaFinale() {
        try {
            const { error } = await supabase
                .from('finale')
                .delete()
                .neq('id', 0)
            
            if (error) throw error
            return true
            
        } catch (error) {
            console.error('Errore eliminaFinale:', error)
            throw error
        }
    },
    
    // NUOVO: Test connessione
    async testConnessione() {
        try {
            const { error } = await supabase
                .from('finale')
                .select('id')
                .limit(1)
            
            return !error
        } catch (error) {
            console.error('Errore test connessione:', error)
            return false
        }
    },
    
    // NUOVO: Elimina tutto
    async eliminaTutto() {
        try {
            // Elimina in ordine corretto (per vincoli foreign key se ci sono)
            await supabase.from('finale').delete().neq('id', 0)
            await supabase.from('partite').delete().neq('id', 0)
            await supabase.from('giocatori').delete().neq('id', 0)
            await supabase.from('squadre').delete().neq('id', 0)
            
            return true
        } catch (error) {
            console.error('Errore eliminaTutto:', error)
            throw error
        }
    }
}

export default DatabaseManager
