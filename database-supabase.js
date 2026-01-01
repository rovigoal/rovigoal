// database-supabase.js - VERSIONE CORRETTA
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
            
            // Mappatura dei nomi delle colonne
            if (data) {
                return {
                    id: data.id,
                    created_at: data.created_at,
                    data: data.data,
                    ora: data.ora,
                    squadra_casa: data.squadra_casa,
                    squadra_ospite: data.squadra_ospit, // Mappato da squadra_ospit
                    gol_casa: data.gol_casa,
                    gol_ospite: data.gol_ospite,
                    miglior_giocatore: data.miglior_glocat, // Mappato da miglior_glocat
                    voto_miglior_giocatore: data.voto_miglior_g, // Mappato da voto_miglior_g
                    miglior_portiere: data.portiere_casa, // Mappato da portiere_casa
                    voto_miglior_portiere: data.voto_portiere_e, // Mappato da voto_portiere_e
                    eventi: data.eventi
                }
            }
            
            return null
            
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
            
            // INSERIMENTO CON I NOMI DELLE COLONNE CORRETTI PER SUPA BASE
            const { data, error } = await supabase
                .from('finale')
                .insert([{
                    data: finale.data || null, // Ora data e ora possono essere null
                    ora: finale.ora || null,
                    squadra_casa: finale.squadra_casa,
                    squadra_ospit: finale.squadra_ospite, // Mappato a squadra_ospit
                    gol_casa: finale.gol_casa || 0,
                    gol_ospite: finale.gol_ospite || 0,
                    miglior_glocat: finale.miglior_giocatore || null, // Mappato a miglior_glocat
                    voto_miglior_g: finale.voto_miglior_giocatore || null, // Mappato a voto_miglior_g
                    portiere_casa: finale.miglior_portiere || null, // Mappato a portiere_casa
                    voto_portiere_e: finale.voto_miglior_portiere || null, // Mappato a voto_portiere_e
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
