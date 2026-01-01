// database-supabase.js - VERSIONE COMPLETA E FUNZIONANTE
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
    
    // ============ CRUD FINALE ============
    async salvaFinale(finale) {
        try {
            console.log('Salvataggio finale con dati:', finale);
            
            // Prepara dati secondo la TUA struttura esatta
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
    
    // ============ FUNZIONI AGGIUNTIVE PER ADMIN ============
    async testConnessione() {
        try {
            // Prova a fare una query semplice
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
            
            // Elimina in ordine per evitare errori di foreign key
            // Prima finale (non ha dipendenze)
            await supabase.from('finale').delete().neq('id', 0);
            console.log('Finale eliminata');
            
            // Poi partite
            await supabase.from('partite').delete().neq('id', 0);
            console.log('Partite eliminate');
            
            // Poi giocatori (dipende da squadre)
            await supabase.from('giocatori').delete().neq('id', 0);
            console.log('Giocatori eliminati');
            
            // Infine squadre
            await supabase.from('squadre').delete().neq('id', 0);
            console.log('Squadre eliminate');
            
            return true;
            
        } catch (error) {
            console.error('Errore eliminaTutto:', error);
            throw error;
        }
    },
    
    // ============ FUNZIONI AGGIUNTIVE UTILI ============
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
    }
}

// Aggiungi queste funzioni alla fine del file database-supabase.js

// ============ FUNZIONI PER EVENTI PARTITA ============
async function aggiungiEventoPartita(partitaId, evento) {
    try {
        // Prima ottieni la partita corrente
        const { data: partita, error: getError } = await supabase
            .from('partite')
            .select('eventi')
            .eq('id', partitaId)
            .single();

        if (getError) throw getError;

        // Aggiungi il nuovo evento agli eventi esistenti
        const eventiAggiornati = partita.eventi ? [...partita.eventi, evento] : [evento];

        // Aggiorna la partita
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
}

async function aggiornaPartita(partitaId, datiAggiornati) {
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
}

// ============ FUNZIONI PER AGGIORNARE GIOCATORI ============
async function aggiornaStatisticheGiocatore(giocatoreId, datiAggiornati) {
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
        console.error('Errore aggiornaStatisticheGiocatore:', error);
        throw error;
    }
}

// ============ FUNZIONE PER AGGIORNARE CLASSIFICA SQUADRE ============
async function aggiornaClassificaSquadra(squadraNome, risultato, golFatti, golSubiti) {
    try {
        // Trova la squadra
        const { data: squadre, error: findError } = await supabase
            .from('squadre')
            .select('*')
            .eq('nome', squadraNome)
            .single();

        if (findError) throw findError;

        // Calcola i nuovi valori
        const nuoviDati = {
            partite_giocate: (squadre.partite_giatte || 0) + 1,
            gol_fatti: (squadre.gol_fatti || 0) + golFatti,
            gol_subiti: (squadre.gol_subiti || 0) + golSubiti
        };

        // Aggiorna vittorie/pareggi/sconfitte
        if (risultato === 'vittoria') {
            nuoviDati.vittorie = (squadre.vittorie || 0) + 1;
            nuoviDati.punti = (squadre.punti || 0) + 3;
        } else if (risultato === 'pareggio') {
            nuoviDati.pareggi = (squadre.pareggi || 0) + 1;
            nuoviDati.punti = (squadre.punti || 0) + 1;
        } else if (risultato === 'sconfitta') {
            nuoviDati.sconfitte = (squadre.sconfitte || 0) + 1;
        }

        // Aggiorna la squadra
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
}

export default DatabaseManager

