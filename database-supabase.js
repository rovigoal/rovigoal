[file name]: database-supabase.js
// database-supabase.js - VERSIONE COMPLETA AGGIORNATA CON TUTTE LE FUNZIONI
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

const SUPABASE_URL = 'https://jgcjhawtmwfsovuegryz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)[file name]: database-supabase.js
// database-supabase.js - VERSIONE CORRETTA E COMPLETA
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

const SUPABASE_URL = 'https://jgcjhawtmwfsovuegryz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// FUNZIONE DI TEST PER DEBUG
async function testConnessioneSemplice() {
    try {
        console.log('🔍 Test connessione Supabase...');
        
        const { data, error } = await supabase
            .from('squadre')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Errore connessione Supabase:', error);
            return { success: false, error: error.message };
        }
        
        console.log('✅ Connessione Supabase OK');
        return { success: true, data: data };
        
    } catch (error) {
        console.error('❌ Errore test connessione:', error);
        return { success: false, error: error.message };
    }
}

// OGGETTO PRINCIPALE DEL DATABASE
const DatabaseManager = {
    
    // ============ TEST E DEBUG ============
    async testConnessione() {
        return await testConnessioneSemplice();
    },
    
    // ============ GETTERS ============
    async getSquadre() {
        try {
            console.log('📋 Caricamento squadre...');
            const { data, error } = await supabase
                .from('squadre')
                .select('*')
                .order('punti', { ascending: false });
            
            if (error) {
                console.error('❌ Errore getSquadre:', error);
                return [];
            }
            
            console.log(`✅ Squadre caricate: ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getSquadre:', error);
            return [];
        }
    },
    
    async getGiocatori() {
        try {
            console.log('📋 Caricamento giocatori...');
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .order('nome');
            
            if (error) {
                console.error('❌ Errore getGiocatori:', error);
                return [];
            }
            
            console.log(`✅ Giocatori caricati: ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getGiocatori:', error);
            return [];
        }
    },
    
    async getPartite() {
        try {
            console.log('📋 Caricamento partite...');
            const { data, error } = await supabase
                .from('partite')
                .select('*')
                .order('data', { ascending: false });
            
            if (error) {
                console.error('❌ Errore getPartite:', error);
                return [];
            }
            
            console.log(`✅ Partite caricate: ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getPartite:', error);
            return [];
        }
    },
    
    async getFinale() {
        try {
            console.log('📋 Caricamento finale...');
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
            
            console.log('✅ Finale caricata');
            return data || null;
            
        } catch (error) {
            console.error('❌ Errore getFinale:', error);
            return null;
        }
    },
    
    // ============ CRUD SQUADRE ============
    async aggiungiSquadra(squadra) {
        try {
            console.log('➕ Aggiunta squadra:', squadra.nome);
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
            
            if (error) {
                console.error('❌ Errore aggiungiSquadra:', error);
                throw error;
            }
            
            console.log('✅ Squadra aggiunta:', data.nome);
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiungiSquadra:', error);
            throw error;
        }
    },
    
    async eliminaSquadra(squadraId) {
        try {
            console.log('🗑️ Eliminazione squadra ID:', squadraId);
            const { error } = await supabase
                .from('squadre')
                .delete()
                .eq('id', squadraId);
            
            if (error) {
                console.error('❌ Errore eliminaSquadra:', error);
                throw error;
            }
            
            console.log('✅ Squadra eliminata');
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaSquadra:', error);
            throw error;
        }
    },
    
    // ============ CRUD GIOCATORI ============
    async aggiungiGiocatore(giocatore) {
        try {
            console.log('➕ Aggiunta giocatore:', giocatore.nome);
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
            
            if (error) {
                console.error('❌ Errore aggiungiGiocatore:', error);
                throw error;
            }
            
            console.log('✅ Giocatore aggiunto:', data.nome);
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiungiGiocatore:', error);
            throw error;
        }
    },
    
    async eliminaGiocatore(giocatoreId) {
        try {
            console.log('🗑️ Eliminazione giocatore ID:', giocatoreId);
            const { error } = await supabase
                .from('giocatori')
                .delete()
                .eq('id', giocatoreId);
            
            if (error) {
                console.error('❌ Errore eliminaGiocatore:', error);
                throw error;
            }
            
            console.log('✅ Giocatore eliminato');
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaGiocatore:', error);
            throw error;
        }
    },
    
    // ============ CRUD PARTITE ============
    async aggiungiPartita(partita) {
        try {
            console.log('➕ Aggiunta partita:', 
                `${partita.squadra_casa} vs ${partita.squadra_ospite}`);
            
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
            
            if (error) {
                console.error('❌ Errore aggiungiPartita:', error);
                throw error;
            }
            
            console.log('✅ Partita aggiunta ID:', data.id);
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiungiPartita:', error);
            throw error;
        }
    },
    
    async eliminaPartita(partitaId) {
        try {
            console.log('🗑️ Eliminazione partita ID:', partitaId);
            
            const { error } = await supabase
                .from('partite')
                .delete()
                .eq('id', partitaId);
            
            if (error) {
                console.error('❌ Errore eliminaPartita:', error);
                throw error;
            }
            
            console.log('✅ Partita eliminata');
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaPartita:', error);
            throw error;
        }
    },
    
    async aggiornaPartita(partitaId, datiAggiornati) {
        try {
            console.log('✏️ Aggiornamento partita ID:', partitaId);
            
            const { data, error } = await supabase
                .from('partite')
                .update(datiAggiornati)
                .eq('id', partitaId)
                .select()
                .single();

            if (error) {
                console.error('❌ Errore aggiornaPartita:', error);
                throw error;
            }
            
            console.log('✅ Partita aggiornata');
            return data;

        } catch (error) {
            console.error('❌ Errore aggiornaPartita:', error);
            throw error;
        }
    },
    
    // ============ CRUD FINALE ============
    async salvaFinale(finale) {
        try {
            console.log('💾 Salvataggio finale');
            
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
            
            if (error) {
                console.error('❌ Errore salvaFinale:', error);
                throw error;
            }
            
            console.log('✅ Finale salvata');
            return data;
            
        } catch (error) {
            console.error('❌ Errore salvaFinale:', error);
            throw error;
        }
    },
    
    async eliminaFinale() {
        try {
            console.log('🗑️ Eliminazione finale');
            
            const { error } = await supabase
                .from('finale')
                .delete()
                .neq('id', 0);
            
            if (error) {
                console.error('❌ Errore eliminaFinale:', error);
                throw error;
            }
            
            console.log('✅ Finale eliminata');
            return true;
            
        } catch (error) {
            console.error('❌ Errore eliminaFinale:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI PER GESTIONE EVENTI PARTITE ============
    async aggiungiEventoPartita(partitaId, evento) {
        try {
            console.log('➕ Aggiunta evento partita ID:', partitaId);
            
            const { data: partita, error: getError } = await supabase
                .from('partite')
                .select('eventi')
                .eq('id', partitaId)
                .single();

            if (getError) throw getError;

            const eventiAggiornati = partita.eventi ? [...partita.eventi, evento] : [evento];

            const { data, error } = await supabase
                .from('partite')
                .update({ eventi: eventiAggiornati })
                .eq('id', partitaId)
                .select()
                .single();

            if (error) throw error;
            
            console.log('✅ Evento aggiunto');
            return data;

        } catch (error) {
            console.error('❌ Errore aggiungiEventoPartita:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI PER AGGIORNARE GIOCATORI ============
    async aggiornaGiocatore(giocatoreId, datiAggiornati) {
        try {
            console.log('✏️ Aggiornamento giocatore ID:', giocatoreId);
            
            const { data, error } = await supabase
                .from('giocatori')
                .update(datiAggiornati)
                .eq('id', giocatoreId)
                .select()
                .single();
            
            if (error) {
                console.error('❌ Errore aggiornaGiocatore:', error);
                throw error;
            }
            
            console.log('✅ Giocatore aggiornato');
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiornaGiocatore:', error);
            throw error;
        }
    },
    
    async aggiornaStatisticheGiocatoreEvento(giocatoreId, tipoEvento) {
        try {
            console.log('📊 Aggiornamento statistiche giocatore ID:', giocatoreId, tipoEvento);
            
            const { data: giocatore, error: getError } = await supabase
                .from('giocatori')
                .select('*')
                .eq('id', giocatoreId)
                .single();
            
            if (getError) throw getError;
            
            let datiAggiornati = {};
            
            switch(tipoEvento) {
                case 'gol':
                    datiAggiornati.gol = (giocatore.gol || 0) + 1;
                    break;
                case 'ammonizione':
                    datiAggiornati.ammonizioni = (giocatore.ammonizioni || 0) + 1;
                    break;
                case 'espulsione':
                    datiAggiornati.espulsioni = (giocatore.espulsioni || 0) + 1;
                    break;
            }
            
            const { data, error } = await supabase
                .from('giocatori')
                .update(datiAggiornati)
                .eq('id', giocatoreId)
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('✅ Statistiche aggiornate');
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiornaStatisticheGiocatoreEvento:', error);
            throw error;
        }
    },
    
    async getGiocatoriPerSquadra(nomeSquadra) {
        try {
            console.log('📋 Caricamento giocatori squadra:', nomeSquadra);
            
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .eq('squadra', nomeSquadra)
                .order('nome');
            
            if (error) {
                console.error('❌ Errore getGiocatoriPerSquadra:', error);
                return [];
            }
            
            console.log(`✅ Giocatori squadra "${nomeSquadra}": ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getGiocatoriPerSquadra:', error);
            return [];
        }
    },
    
    // ============ FUNZIONI PER AGGIORNARE SQUADRE ============
    async aggiornaSquadra(squadraId, datiAggiornati) {
        try {
            console.log('✏️ Aggiornamento squadra ID:', squadraId);
            
            const { data, error } = await supabase
                .from('squadre')
                .update(datiAggiornati)
                .eq('id', squadraId)
                .select()
                .single();
            
            if (error) {
                console.error('❌ Errore aggiornaSquadra:', error);
                throw error;
            }
            
            console.log('✅ Squadra aggiornata');
            return data;
            
        } catch (error) {
            console.error('❌ Errore aggiornaSquadra:', error);
            throw error;
        }
    },
    
    async aggiornaClassificaSquadra(squadraNome, risultato, golFatti, golSubiti) {
        try {
            console.log('📊 Aggiornamento classifica squadra:', squadraNome, risultato);
            
            const { data: squadra, error: findError } = await supabase
                .from('squadre')
                .select('*')
                .eq('nome', squadraNome)
                .single();

            if (findError) throw findError;

            const nuoviDati = {
                partite_giocate: (squadra.partite_giocate || 0) + 1,
                gol_fatti: (squadra.gol_fatti || 0) + golFatti,
                gol_subiti: (squadra.gol_subiti || 0) + golSubiti
            };

            if (risultato === 'vittoria') {
                nuoviDati.vittorie = (squadra.vittorie || 0) + 1;
                nuoviDati.punti = (squadra.punti || 0) + 3;
            } else if (risultato === 'pareggio') {
                nuoviDati.pareggi = (squadra.pareggi || 0) + 1;
                nuoviDati.punti = (squadra.punti || 0) + 1;
            } else if (risultato === 'sconfitta') {
                nuoviDati.sconfitte = (squadra.sconfitte || 0) + 1;
            }

            const { data, error } = await supabase
                .from('squadre')
                .update(nuoviDati)
                .eq('nome', squadraNome)
                .select()
                .single();

            if (error) throw error;
            
            console.log('✅ Classifica aggiornata');
            return data;

        } catch (error) {
            console.error('❌ Errore aggiornaClassificaSquadra:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI AGGIUNTIVE PER ADMIN ============
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
    
    // ============ FUNZIONI UTILI PER FILTRI E RICERCHE ============
    async cercaGiocatorePerNome(nome) {
        try {
            console.log('🔍 Ricerca giocatore:', nome);
            
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .ilike('nome', `%${nome}%`)
                .limit(10);
            
            if (error) {
                console.error('❌ Errore cercaGiocatorePerNome:', error);
                return [];
            }
            
            console.log(`✅ Risultati ricerca: ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore cercaGiocatorePerNome:', error);
            return [];
        }
    },
    
    async getPartitePerSquadra(nomeSquadra) {
        try {
            console.log('📋 Caricamento partite squadra:', nomeSquadra);
            
            const { data, error } = await supabase
                .from('partite')
                .select('*')
                .or(`squadra_casa.eq.${nomeSquadra},squadra_ospite.eq.${nomeSquadra}`)
                .order('data', { ascending: false });
            
            if (error) {
                console.error('❌ Errore getPartitePerSquadra:', error);
                return [];
            }
            
            console.log(`✅ Partite squadra "${nomeSquadra}": ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getPartitePerSquadra:', error);
            return [];
        }
    },
    
    // ============ FUNZIONI PER STATISTICHE AVANZATE ============
    async getCannonieri(limit = 10) {
        try {
            console.log('⚽ Caricamento cannonieri');
            
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .order('gol', { ascending: false })
                .limit(limit);
            
            if (error) {
                console.error('❌ Errore getCannonieri:', error);
                return [];
            }
            
            console.log(`✅ Cannonieri caricati: ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getCannonieri:', error);
            return [];
        }
    },
    
    async getMiglioriGiocatori(limit = 10) {
        try {
            console.log('⭐ Caricamento migliori giocatori');
            
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
            
            console.log(`✅ Migliori giocatori caricati: ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getMiglioriGiocatori:', error);
            return [];
        }
    },
    
    async getMiglioriPortieri(limit = 10) {
        try {
            console.log('🥅 Caricamento migliori portieri');
            
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .eq('ruolo', 'Portiere')
                .gt('premi_miglior_portiere', 0)
                .order('punteggio_totale', { ascending: false })
                .limit(limit);
            
            if (error) {
                console.error('❌ Errore getMiglioriPortieri:', error);
                return [];
            }
            
            console.log(`✅ Migliori portieri caricati: ${data?.length || 0}`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Errore getMiglioriPortieri:', error);
            return [];
        }
    },
    
    // ============ FUNZIONE PER REAL-TIME UPDATES ============
    setupRealtime(callback) {
        try {
            console.log('🔔 Setup realtime updates');
            
            const subscription = supabase
                .channel('rovigoal-updates')
                .on('postgres_changes', 
                    { event: '*', schema: 'public' }, 
                    (payload) => {
                        console.log('📡 Realtime update:', payload.table);
                        callback(payload.table, payload.new, payload.old);
                    }
                )
                .subscribe();
            
            console.log('✅ Realtime updates attivati');
            return subscription;
            
        } catch (error) {
            console.error('❌ Errore setupRealtime:', error);
            return null;
        }
    }
};

// ESPORTAZIONE CORRETTA
export default DatabaseManager;

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
            
            if (error) {
                if (error.code === 'PGRST116') {
                    return null
                }
                console.error('Errore getFinale:', error)
                return null
            }
            
            return data || null
            
        } catch (error) {
            console.error('Errore getFinale:', error)
            return null
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
                .single()
            
            if (error) throw error
            return data
            
        } catch (error) {
            console.error('Errore aggiungiSquadra:', error)
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
                .single()
            
            if (error) throw error
            return data
            
        } catch (error) {
            console.error('Errore aggiungiGiocatore:', error)
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
    
    // ============ CRUD PARTITE ============
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
                    eventi: partita.eventi || [],
                    miglior_giocatore: partita.miglior_giocatore || null,
                    voto_miglior_giocatore: partita.voto_miglior_giocatore || null,
                    portiere_casa: partita.portiere_casa || null,
                    portiere_ospite: partita.portiere_ospite || null,
                    voto_portiere_casa: partita.voto_portiere_casa || null,
                    voto_portiere_ospite: partita.voto_portiere_ospite || null
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
    
    async eliminaPartita(partitaId) {
        try {
            console.log('Eliminazione partita ID:', partitaId);
            
            const { error } = await supabase
                .from('partite')
                .delete()
                .eq('id', partitaId)
            
            if (error) {
                console.error('Errore eliminaPartita:', error);
                throw error;
            }
            
            console.log('Partita eliminata con successo');
            return true
            
        } catch (error) {
            console.error('Errore eliminaPartita:', error);
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
            console.error('Errore aggiornaPartita:', error);
            throw error;
        }
    },
    
    // ============ CRUD FINALE ============
    async salvaFinale(finale) {
        try {
            console.log('Salvataggio finale con dati:', finale);
            
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
            await supabase.from('finale').delete().neq('id', 0)
            
            // Inserisci nuova finale
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
    },
    
    // ============ FUNZIONI PER GESTIONE EVENTI PARTITE ============
    async aggiungiEventoPartita(partitaId, evento) {
        try {
            const { data: partita, error: getError } = await supabase
                .from('partite')
                .select('eventi')
                .eq('id', partitaId)
                .single();

            if (getError) throw getError;

            const eventiAggiornati = partita.eventi ? [...partita.eventi, evento] : [evento];

            const { data, error } = await supabase
                .from('partite')
                .update({ eventi: eventiAggiornati })
                .eq('id', partitaId)
                .select()
                .single();

            if (error) throw error;
            return data;

        } catch (error) {
            console.error('Errore aggiungiEventoPartita:', error);
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
                .single()
            
            if (error) throw error
            return data
            
        } catch (error) {
            console.error('Errore aggiornaGiocatore:', error)
            throw error
        }
    },
    
    async aggiornaStatisticheGiocatoreEvento(giocatoreId, tipoEvento) {
        try {
            const { data: giocatore, error: getError } = await supabase
                .from('giocatori')
                .select('*')
                .eq('id', giocatoreId)
                .single();
            
            if (getError) throw getError;
            
            let datiAggiornati = {};
            
            switch(tipoEvento) {
                case 'gol':
                    datiAggiornati.gol = (giocatore.gol || 0) + 1;
                    break;
                case 'ammonizione':
                    datiAggiornati.ammonizioni = (giocatore.ammonizioni || 0) + 1;
                    break;
                case 'espulsione':
                    datiAggiornati.espulsioni = (giocatore.espulsioni || 0) + 1;
                    break;
            }
            
            const { data, error } = await supabase
                .from('giocatori')
                .update(datiAggiornati)
                .eq('id', giocatoreId)
                .select()
                .single();
            
            if (error) throw error;
            return data;
            
        } catch (error) {
            console.error('Errore aggiornaStatisticheGiocatoreEvento:', error);
            throw error;
        }
    },
    
    async getGiocatoriPerSquadra(nomeSquadra) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .eq('squadra', nomeSquadra)
                .order('nome');
            
            if (error) {
                console.error('Errore getGiocatoriPerSquadra:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Errore getGiocatoriPerSquadra:', error);
            return [];
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
                .single()
            
            if (error) throw error
            return data
            
        } catch (error) {
            console.error('Errore aggiornaSquadra:', error)
            throw error
        }
    },
    
    async aggiornaClassificaSquadra(squadraNome, risultato, golFatti, golSubiti) {
        try {
            const { data: squadre, error: findError } = await supabase
                .from('squadre')
                .select('*')
                .eq('nome', squadraNome)
                .single();

            if (findError) throw findError;

            const nuoviDati = {
                partite_giocate: (squadre.partite_giocate || 0) + 1,
                gol_fatti: (squadre.gol_fatti || 0) + golFatti,
                gol_subiti: (squadre.gol_subiti || 0) + golSubiti
            };

            if (risultato === 'vittoria') {
                nuoviDati.vittorie = (squadre.vittorie || 0) + 1;
                nuoviDati.punti = (squadre.punti || 0) + 3;
            } else if (risultato === 'pareggio') {
                nuoviDati.pareggi = (squadre.pareggi || 0) + 1;
                nuoviDati.punti = (squadre.punti || 0) + 1;
            } else if (risultato === 'sconfitta') {
                nuoviDati.sconfitte = (squadre.sconfitte || 0) + 1;
            }

            const { data, error } = await supabase
                .from('squadre')
                .update(nuoviDati)
                .eq('nome', squadraNome)
                .select()
                .single();

            if (error) throw error;
            return data;

        } catch (error) {
            console.error('Errore aggiornaClassificaSquadra:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI AGGIUNTIVE PER ADMIN ============
    async testConnessione() {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .select('id')
                .limit(1)
            
            if (error) {
                console.error('Test connessione fallito:', error);
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('Test connessione fallito:', error);
            return false;
        }
    },
    
    async eliminaTutto() {
        try {
            console.log('Inizio eliminazione totale...');
            
            await supabase.from('finale').delete().neq('id', 0);
            console.log('Finale eliminata');
            
            await supabase.from('partite').delete().neq('id', 0);
            console.log('Partite eliminate');
            
            await supabase.from('giocatori').delete().neq('id', 0);
            console.log('Giocatori eliminati');
            
            await supabase.from('squadre').delete().neq('id', 0);
            console.log('Squadre eliminate');
            
            return true;
            
        } catch (error) {
            console.error('Errore eliminaTutto:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI UTILI PER FILTRI E RICERCHE ============
    async cercaGiocatorePerNome(nome) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .ilike('nome', `%${nome}%`)
                .limit(10);
            
            if (error) {
                console.error('Errore cercaGiocatorePerNome:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Errore cercaGiocatorePerNome:', error);
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
                console.error('Errore getPartitePerSquadra:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Errore getPartitePerSquadra:', error);
            return [];
        }
    },
    
    // ============ FUNZIONI PER STATISTICHE AVANZATE ============
    async getCannonieri(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .order('gol', { ascending: false })
                .limit(limit);
            
            if (error) {
                console.error('Errore getCannonieri:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Errore getCannonieri:', error);
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
                console.error('Errore getMiglioriGiocatori:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Errore getMiglioriGiocatori:', error);
            return [];
        }
    },
    
    async getMiglioriPortieri(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .eq('ruolo', 'Portiere')
                .gt('premi_miglior_portiere', 0)
                .order('punteggio_totale', { ascending: false })
                .limit(limit);
            
            if (error) {
                console.error('Errore getMiglioriPortieri:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('Errore getMiglioriPortieri:', error);
            return [];
        }
    },
    
    // ============ FUNZIONE PER REAL-TIME UPDATES ============
    setupRealtime(callback) {
        const subscription = supabase
            .channel('rovigoal-updates')
            .on('postgres_changes', 
                { event: '*', schema: 'public' }, 
                (payload) => {
                    callback(payload.table, payload.new, payload.old);
                }
            )
            .subscribe();
        
        return subscription;
    }
}

export default DatabaseManager

