// database-supabase.js - VERSIONE FUNZIONANTE
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
            // Prima controlla quali colonne esistono
            console.log('Dati finale da salvare:', finale);
            
            // Prepara i dati da inserire SOLO con le colonne che hai nel database
            const datiDaInserire = {
                data: finale.data,
                ora: finale.ora || null,
                squadra_casa: finale.squadra_casa,
                squadra_ospite: finale.squadra_ospite,
                gol_casa: finale.gol_casa || 0,
                gol_ospite: finale.gol_ospite || 0,
                marcatori: finale.marcatori || [], // Cerchiamo di salvare i marcatori
                eventi: finale.eventi || []
            };
            
            // Aggiungi solo le colonne che hai nel database (basandoci sugli errori)
            // Se hai "miglior_giocatore" ma non "miglior_portiere"
            if (finale.miglior_giocatore) {
                datiDaInserire.miglior_giocatore = finale.miglior_giocatore;
            }
            
            if (finale.voto_miglior_giocatore) {
                datiDaInserire.voto_miglior_giocatore = finale.voto_miglior_giocatore;
            }
            
            // Se hai "portiere_casa" e "portiere_ospite" invece di "miglior_portiere"
            if (finale.portiere_casa) {
                datiDaInserire.portiere_casa = finale.portiere_casa;
            }
            
            if (finale.portiere_ospite) {
                datiDaInserire.portiere_ospite = finale.portiere_ospite;
            }
            
            if (finale.voto_portiere_casa) {
                datiDaInserire.voto_portiere_casa = finale.voto_portiere_casa;
            }
            
            if (finale.voto_portiere_ospite) {
                datiDaInserire.voto_portiere_ospite = finale.voto_portiere_ospite;
            }
            
            // Elimina finale esistente
            await supabase.from('finale').delete().neq('id', 0)
            
            // Aggiungi nuova finale con SOLO le colonne esistenti
            const { data, error } = await supabase
                .from('finale')
                .insert([datiDaInserire])
                .select()
                .single()
            
            if (error) {
                console.error('Errore dettagliato salvaFinale:', error);
                throw error;
            }
            
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
    }
}

export default DatabaseManager
