// database-supabase.js - VERSIONE COMPLETA E TESTATA
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

const SUPABASE_URL = 'https://jgcjhawtmwfsovuegryz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// OGGETTO PRINCIPALE DEL DATABASE
const DatabaseManager = {
    
    // ============ TEST E DEBUG ============
    async testConnessione() {
        try {
            console.log('🔍 Test connessione Supabase...');
            const { data, error } = await supabase
                .from('squadre')
                .select('id')
                .limit(1);
            
            if (error) {
                console.error('❌ Errore connessione:', error);
                return { success: false, error: error.message };
            }
            
            console.log('✅ Connessione OK');
            return { success: true, data: data };
            
        } catch (error) {
            console.error('❌ Errore test:', error);
            return { success: false, error: error.message };
        }
    },
    
    // ============ GETTERS ============
    async getSquadre() {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .select('*')
                .order('punti', { ascending: false });
            
            if (error) {
                console.error('❌ Errore getSquadre:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getSquadre:', error);
            return [];
        }
    },
    
    async getGiocatori() {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .order('nome');
            
            if (error) {
                console.error('❌ Errore getGiocatori:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getGiocatori:', error);
            return [];
        }
    },
    
    async getPartite() {
        try {
            const { data, error } = await supabase
                .from('partite')
                .select('*')
                .order('data', { ascending: false });
            
            if (error) {
                console.error('❌ Errore getPartite:', error);
                return [];
            }
            
            console.log('✅ Partite caricate:', data?.length || 0);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getPartite:', error);
            return [];
        }
    },
    
    async getFinale() {
        try {
            const { data, error } = await supabase
                .from('finale')
                .select('*')
                .limit(1)
                .single();
            
            if (error) {
                if (error.code === 'PGRST116') {
                    console.log('ℹ️ Nessuna finale trovata');
                    return null;
                }
                console.error('❌ Errore getFinale:', error);
                return null;
            }
            
            return data;
            
        } catch (error) {
            console.error('❌ Errore getFinale:', error);
            return null;
        }
    },
    
    // ============ CRUD SQUADRE ============
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
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiungiSquadra:', error);
            throw error;
        }
    },
    
    async eliminaSquadra(squadraId) {
        try {
            const { error } = await supabase
                .from('squadre')
                .delete()
                .eq('id', squadraId);
            
            if (error) throw error;
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaSquadra:', error);
            throw error;
        }
    },
    
    // ============ CRUD GIOCATORI ============
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
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiungiGiocatore:', error);
            throw error;
        }
    },
    
    async eliminaGiocatore(giocatoreId) {
        try {
            const { error } = await supabase
                .from('giocatori')
                .delete()
                .eq('id', giocatoreId);
            
            if (error) throw error;
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaGiocatore:', error);
            throw error;
        }
    },
    
    // ============ CRUD PARTITE ============
    async aggiungiPartita(partita) {
        try {
            console.log('➕ Aggiunta partita:', partita);
            
            const { data, error } = await supabase
                .from('partite')
                .insert([{
                    data: partita.data,
                    ora: partita.ora || null,
                    squadra_casa: partita.squadra_casa,
                    squadra_ospite: partita.squadra_ospite,
                    gol_casa: partita.gol_casa || 0,
                    gol_ospite: partita.gol_ospite || 0,
                    eventi: partita.eventi || [],
                    miglior_giocatore: partita.miglior_giocatore || null,
                    voto_miglior_giocatore: partita.voto_miglior_giocatore || null,
                    portiere_casa: partita.portiere_casa || null,
                    portiere_ospite: partita.portiere_ospite || null,
                    voto_portiere_casa: partita.voto_portiere_casa || null,
                    voto_portiere_ospite: partita.voto_portiere_ospite || null
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('✅ Partita aggiunta con ID:', data.id);
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiungiPartita:', error);
            throw error;
        }
    },
    
    async eliminaPartita(partitaId) {
        try {
            console.log('🗑️ Eliminazione partita ID:', partitaId);
            console.log('🔢 Tipo ID:', typeof partitaId, 'Valore:', partitaId);
            
            // Converti in numero se necessario
            let idDaUsare = partitaId;
            if (typeof partitaId === 'string') {
                idDaUsare = Number(partitaId);
                console.log('🔄 ID convertito a numero:', idDaUsare);
            }
            
            // Controlla se la partita esiste prima di eliminare
            const { data: partitaEsistente, error: checkError } = await supabase
                .from('partite')
                .select('id, squadra_casa, squadra_ospite')
                .eq('id', idDaUsare)
                .maybeSingle();
            
            if (checkError) {
                console.error('❌ Errore verifica partita:', checkError);
                throw new Error(`Errore verifica: ${checkError.message}`);
            }
            
            if (!partitaEsistente) {
                console.error('❌ Partita non trovata con ID:', idDaUsare);
                throw new Error('Partita non trovata nel database');
            }
            
            console.log('✅ Partita trovata:', partitaEsistente);
            
            // Ora elimina
            const { error } = await supabase
                .from('partite')
                .delete()
                .eq('id', idDaUsare);
            
            if (error) {
                console.error('❌ Errore eliminazione:', error);
                throw error;
            }
            
            console.log('✅ Partita eliminata con successo');
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaPartita:', error);
            throw error;
        }
    },
    
    async aggiornaPartita(partitaId, datiAggiornati) {
        try {
            const { data, error } = await supabase
                .from('partite')
                .update(datiAggiornati)
                .eq('id', partitaId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiornaPartita:', error);
            throw error;
        }
    },
    
    // ============ CRUD FINALE ============
    async salvaFinale(finale) {
        try {
            console.log('🏆 Salvataggio finale:', finale);
            
            const datiDaInserire = {
                data: finale.data,
                ora: finale.ora || null,
                squadra_casa: finale.squadra_casa,
                squadra_ospite: finale.squadra_ospite,
                gol_casa: finale.gol_casa || 0,
                gol_ospite: finale.gol_ospite || 0,
                eventi: finale.eventi || [],
                marcatori: finale.marcatori || [],
                miglior_giocatore: finale.miglior_giocatore || null,
                voto_miglior_giocatore: finale.voto_miglior_giocatore || null,
                portiere_casa: finale.portiere_casa || null,
                portiere_ospite: finale.portiere_ospite || null,
                voto_portiere_casa: finale.voto_portiere_casa || null,
                voto_portiere_ospite: finale.voto_portiere_ospite || null
            };
            
            // Elimina finale esistente
            await supabase.from('finale').delete().neq('id', 0);
            
            // Inserisci nuova finale
            const { data, error } = await supabase
                .from('finale')
                .insert([datiDaInserire])
                .select()
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('❌ Errore salvaFinale:', error);
            throw error;
        }
    },
    
    async eliminaFinale() {
        try {
            const { error } = await supabase
                .from('finale')
                .delete()
                .neq('id', 0);
            
            if (error) throw error;
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaFinale:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI PER AGGIORNARE GIOCATORI ============
    async aggiornaGiocatore(giocatoreId, datiAggiornati) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .update(datiAggiornati)
                .eq('id', giocatoreId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiornaGiocatore:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI PER AGGIORNARE SQUADRE ============
    async aggiornaSquadra(squadraId, datiAggiornati) {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .update(datiAggiornati)
                .eq('id', squadraId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiornaSquadra:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI UTILI ============
    async getGiocatoriPerSquadra(nomeSquadra) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .eq('squadra', nomeSquadra)
                .order('nome');
            
            if (error) {
                console.error('❌ Errore getGiocatoriPerSquadra:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getGiocatoriPerSquadra:', error);
            return [];
        }
    },
    
    async getPartitePerSquadra(nomeSquadra) {
        try {
            const { data, error } = await supabase
                .from('partite')
                .select('*')
                .or(`squadra_casa.eq.${nomeSquadra},squadra_ospite.eq.${nomeSquadra}`)
                .order('data', { ascending: false });
            
            if (error) {
                console.error('❌ Errore getPartitePerSquadra:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getPartitePerSquadra:', error);
            return [];
        }
    },
    
    // ============ FUNZIONI ADMIN ============
    async eliminaTutto() {
        try {
            console.log('⚠️ INIZIO ELIMINAZIONE TOTALE DATABASE');
            
            await supabase.from('finale').delete().neq('id', 0);
            console.log('✅ Finale eliminata');
            
            await supabase.from('partite').delete().neq('id', 0);
            console.log('✅ Partite eliminate');
            
            await supabase.from('giocatori').delete().neq('id', 0);
            console.log('✅ Giocatori eliminati');
            
            await supabase.from('squadre').delete().neq('id', 0);
            console.log('✅ Squadre eliminate');
            
            console.log('✅ ELIMINAZIONE COMPLETATA');
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaTutto:', error);
            throw error;
        }
    },
    
    // ============ STATISTICHE ============
    async getCannonieri(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .order('gol', { ascending: false })
                .limit(limit);
            
            if (error) {
                console.error('❌ Errore getCannonieri:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getCannonieri:', error);
            return [];
        }
    },
    
    async getMiglioriGiocatori(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .gt('premi_miglior_giocatore', 0)
                .order('punteggio_totale', { ascending: false })
                .limit(limit);
            
            if (error) {
                console.error('❌ Errore getMiglioriGiocatori:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getMiglioriGiocatori:', error);
            return [];
        }
    }
};

// ESPORTAZIONE
export default DatabaseManager;
