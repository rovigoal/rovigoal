// database-supabase.js - VERSIONE SEMPLIFICATA E FUNZIONANTE
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

// Configurazione Supabase - CORRETTA
const SUPABASE_URL = 'https://jgcjhawtmwfsovuegryz.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'

// Crea client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Gestore database semplificato e funzionante
const DatabaseManager = {
    
    // ============ GETTERS SEMPLICI ============
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
            
            console.log('✅ Squadre caricate:', data?.length || 0)
            return data || []
            
        } catch (error) {
            console.error('❌ Errore grave getSquadre:', error)
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
            
            return data || []
            
        } catch (error) {
            console.error('❌ Errore grave getGiocatori:', error)
            return []
        }
    },
    
    async getPartite() {
        try {
            const { data, error } = await supabase
                .from('partite')
                .select('*')
                .order('data', { ascending: false })
                .order('ora', { ascending: false })
            
            if (error) {
                console.error('❌ Errore getPartite:', error)
                return []
            }
            
            return data || []
            
        } catch (error) {
            console.error('❌ Errore grave getPartite:', error)
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
            
            // Se non trova record, non è un errore
            if (error && error.code !== 'PGRST116') {
                console.error('❌ Errore getFinale:', error)
                return null
            }
            
            return data || null
            
        } catch (error) {
            console.error('❌ Errore grave getFinale:', error)
            return null
        }
    },
    
    // ============ CRUD OPERATIONS ============
    
    // AGGIUNGI SQUADRA
    async aggiungiSquadra(squadra) {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .insert([{
                    nome: squadra.nome,
                    allenatore: squadra.allenatore || null,
                    colori: squadra.colori || null,
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
            
            console.log('✅ Squadra aggiunta:', data.nome)
            return data
            
        } catch (error) {
            console.error('❌ Errore aggiungiSquadra:', error)
            throw error
        }
    },
    
    // AGGIUNGI GIOCATORE
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
                    espulsioni: 0,
                    punteggio_totale: 0,
                    premi_miglior_giocatore: 0,
                    premi_miglior_portiere: 0
                }])
                .select()
                .single()
            
            if (error) throw error
            
            console.log('✅ Giocatore aggiunto:', data.nome)
            return data
            
        } catch (error) {
            console.error('❌ Errore aggiungiGiocatore:', error)
            throw error
        }
    },
    
    // ELIMINA SQUADRA
    async eliminaSquadra(squadraId) {
        try {
            const { error } = await supabase
                .from('squadre')
                .delete()
                .eq('id', squadraId)
            
            if (error) throw error
            
            console.log('✅ Squadra eliminata:', squadraId)
            return true
            
        } catch (error) {
            console.error('❌ Errore eliminaSquadra:', error)
            throw error
        }
    },
    
    // ELIMINA GIOCATORE
    async eliminaGiocatore(giocatoreId) {
        try {
            const { error } = await supabase
                .from('giocatori')
                .delete()
                .eq('id', giocatoreId)
            
            if (error) throw error
            
            console.log('✅ Giocatore eliminato:', giocatoreId)
            return true
            
        } catch (error) {
            console.error('❌ Errore eliminaGiocatore:', error)
            throw error
        }
    },
    
    // AGGIUNGI PARTITA
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
                    miglior_giocatore: partita.miglior_giocatore || null,
                    voto_miglior_giocatore: partita.voto_miglior_giocatore || null,
                    portiere_casa: partita.portiere_casa || null,
                    voto_portiere_casa: partita.voto_portiere_casa || null,
                    portiere_ospite: partita.portiere_ospite || null,
                    voto_portiere_ospite: partita.voto_portiere_ospite || null,
                    eventi: partita.eventi || []
                }])
                .select()
                .single()
            
            if (error) throw error
            
            console.log('✅ Partita aggiunta:', data.squadra_casa, 'vs', data.squadra_ospite)
            return data
            
        } catch (error) {
            console.error('❌ Errore aggiungiPartita:', error)
            throw error
        }
    },
    
    // ELIMINA PARTITA
    async eliminaPartita(partitaId) {
        try {
            const { error } = await supabase
                .from('partite')
                .delete()
                .eq('id', partitaId)
            
            if (error) throw error
            
            console.log('✅ Partita eliminata:', partitaId)
            return true
            
        } catch (error) {
            console.error('❌ Errore eliminaPartita:', error)
            throw error
        }
    },
    
    // SALVA FINALE
    async salvaFinale(finale) {
        try {
            // Prima elimina finale esistente
            const { error: deleteError } = await supabase
                .from('finale')
                .delete()
                .neq('id', 0) // Elimina tutto
            
            if (deleteError && deleteError.code !== 'PGRST116') {
                console.warn('⚠️ Errore eliminazione finale:', deleteError)
            }
            
            // Poi aggiungi nuova finale
            const { data, error } = await supabase
                .from('finale')
                .insert([{
                    data: finale.data,
                    ora: finale.ora || null,
                    squadra_casa: finale.squadra_casa,
                    squadra_ospite: finale.squadra_ospite,
                    gol_casa: finale.gol_casa || 0,
                    gol_ospite: finale.gol_ospite || 0,
                    miglior_giocatore: finale.miglior_giocatore || null,
                    voto_miglior_giocatore: finale.voto_miglior_giocatore || null,
                    miglior_portiere: finale.miglior_portiere || null,
                    voto_miglior_portiere: finale.voto_miglior_portiere || null,
                    eventi: finale.eventi || []
                }])
                .select()
                .single()
            
            if (error) throw error
            
            console.log('✅ Finale salvata:', data.squadra_casa, 'vs', data.squadra_ospite)
            return data
            
        } catch (error) {
            console.error('❌ Errore salvaFinale:', error)
            throw error
        }
    },
    
    // ELIMINA FINALE
    async eliminaFinale() {
        try {
            const { error } = await supabase
                .from('finale')
                .delete()
                .neq('id', 0)
            
            if (error) throw error
            
            console.log('✅ Finale eliminata')
            return true
            
        } catch (error) {
            console.error('❌ Errore eliminaFinale:', error)
            throw error
        }
    },
    
    // ELIMINA TUTTO (reset totale)
    async eliminaTutto() {
        try {
            console.log('⚠️ Inizio eliminazione totale...')
            
            // Ordine importante per constraints
            await supabase.from('partite').delete().neq('id', 0)
            await supabase.from('finale').delete().neq('id', 0)
            await supabase.from('giocatori').delete().neq('id', 0)
            await supabase.from('squadre').delete().neq('id', 0)
            
            console.log('✅ Database completamente reset')
            return true
            
        } catch (error) {
            console.error('❌ Errore eliminaTutto:', error)
            throw error
        }
    },
    
    // TEST CONNESSIONE
    async testConnessione() {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .select('count', { count: 'exact', head: true })
                .limit(1)
            
            if (error) throw error
            
            console.log('✅ Connessione Supabase OK')
            return true
            
        } catch (error) {
            console.error('❌ Test connessione fallito:', error)
            return false
        }
    },
    
    // SETUP LISTENER TEMPO REALE (opzionale)
    setupRealtimeListeners() {
        try {
            console.log('🔔 Setup listener tempo reale...')
            
            // Ascolta cambiamenti squadre
            supabase.channel('squadre-channel')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'squadre' }, 
                    () => {
                        console.log('🔄 Squadre cambiate')
                        if (window.onDatabaseUpdate) {
                            window.onDatabaseUpdate('squadre')
                        }
                    }
                )
                .subscribe()
            
            // Ascolta cambiamenti giocatori
            supabase.channel('giocatori-channel')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'giocatori' }, 
                    () => {
                        console.log('🔄 Giocatori cambiati')
                        if (window.onDatabaseUpdate) {
                            window.onDatabaseUpdate('giocatori')
                        }
                    }
                )
                .subscribe()
            
            // Ascolta cambiamenti partite
            supabase.channel('partite-channel')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'partite' }, 
                    () => {
                        console.log('🔄 Partite cambiate')
                        if (window.onDatabaseUpdate) {
                            window.onDatabaseUpdate('partite')
                        }
                    }
                )
                .subscribe()
            
            // Ascolta cambiamenti finale
            supabase.channel('finale-channel')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'finale' }, 
                    () => {
                        console.log('🔄 Finale cambiata')
                        if (window.onDatabaseUpdate) {
                            window.onDatabaseUpdate('finale')
                        }
                    }
                )
                .subscribe()
            
            console.log('✅ Listener tempo reale attivi')
            
        } catch (error) {
            console.warn('⚠️ Errore setup listener:', error)
        }
    }
}

// Inizializza listener al caricamento
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        DatabaseManager.setupRealtimeListeners()
    }, 1000)
})

// Esporta l'oggetto database
export default DatabaseManager
