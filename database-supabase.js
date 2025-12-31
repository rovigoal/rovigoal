// database-supabase.js - VERSIONE COMPLETA CON FUNZIONI ADMIN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

// Configurazione Supabase
const supabaseUrl = 'https://jgcjhawtmwfsovuegryz.supabase.co'
const supabaseAnonKey = 'sb_publishable_X6PIatMpCblUcS487cOMfQ_HfP2GpUq'

// Crea il client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Gestore del database Supabase
class SupabaseManager {
    constructor() {
        this.data = {
            squadre: [],
            giocatori: [],
            partite: [],
            finale: null
        };
        
        // Setup listener in tempo reale
        this.setupRealtimeListeners();
    }
    
    // Ascolta cambiamenti in tempo reale
    async setupRealtimeListeners() {
        console.log('Setup listener Supabase...');
        
        try {
            // Squadre
            supabase.channel('squadre-channel')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'squadre' }, 
                    async () => {
                        console.log('Cambiamento in squadre');
                        await this.caricaSquadre();
                    }
                )
                .subscribe((status) => {
                    console.log('Squadre channel status:', status);
                });
            
            // Giocatori
            supabase.channel('giocatori-channel')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'giocatori' }, 
                    async () => {
                        console.log('Cambiamento in giocatori');
                        await this.caricaGiocatori();
                    }
                )
                .subscribe((status) => {
                    console.log('Giocatori channel status:', status);
                });
            
            // Partite
            supabase.channel('partite-channel')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'partite' }, 
                    async () => {
                        console.log('Cambiamento in partite');
                        await this.caricaPartite();
                    }
                )
                .subscribe((status) => {
                    console.log('Partite channel status:', status);
                });
            
            // Finale
            supabase.channel('finale-channel')
                .on('postgres_changes', 
                    { event: '*', schema: 'public', table: 'finale' }, 
                    async () => {
                        console.log('Cambiamento in finale');
                        await this.caricaFinale();
                    }
                )
                .subscribe((status) => {
                    console.log('Finale channel status:', status);
                });
            
            // Carica dati iniziali
            console.log('Caricamento dati iniziali...');
            await Promise.all([
                this.caricaSquadre(),
                this.caricaGiocatori(),
                this.caricaPartite(),
                this.caricaFinale()
            ]);
            
            console.log('Listener Supabase attivi');
            
        } catch (error) {
            console.error('Errore setup listener:', error);
        }
    }
    
    // ==================== CARICAMENTO DATI ====================
    
    // Carica squadre
    async caricaSquadre() {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .select('*')
                .order('punti', { ascending: false });
            
            if (error) throw error;
            
            this.data.squadre = data || [];
            this.triggerUpdate('squadre');
            console.log(`Squadre caricate: ${this.data.squadre.length}`);
            
            return this.data.squadre;
            
        } catch (error) {
            console.error('Errore caricamento squadre:', error);
            this.data.squadre = [];
            this.triggerUpdate('squadre');
            return [];
        }
    }
    
    // Carica giocatori
    async caricaGiocatori() {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*')
                .order('nome', { ascending: true });
            
            if (error) throw error;
            
            this.data.giocatori = data || [];
            this.triggerUpdate('giocatori');
            console.log(`Giocatori caricati: ${this.data.giocatori.length}`);
            
            return this.data.giocatori;
            
        } catch (error) {
            console.error('Errore caricamento giocatori:', error);
            this.data.giocatori = [];
            this.triggerUpdate('giocatori');
            return [];
        }
    }
    
    // Carica partite
    async caricaPartite() {
        try {
            const { data, error } = await supabase
                .from('partite')
                .select('*')
                .order('data', { ascending: false })
                .order('ora', { ascending: false });
            
            if (error) throw error;
            
            this.data.partite = data || [];
            this.triggerUpdate('partite');
            console.log(`Partite caricate: ${this.data.partite.length}`);
            
            return this.data.partite;
            
        } catch (error) {
            console.error('Errore caricamento partite:', error);
            this.data.partite = [];
            this.triggerUpdate('partite');
            return [];
        }
    }
    
    // Carica finale
    async caricaFinale() {
        try {
            const { data, error } = await supabase
                .from('finale')
                .select('*')
                .limit(1)
                .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 = nessun risultato
                throw error;
            }
            
            this.data.finale = data || null;
            this.triggerUpdate('finale');
            console.log('Finale caricata:', !!this.data.finale);
            
            return this.data.finale;
            
        } catch (error) {
            console.error('Errore caricamento finale:', error);
            this.data.finale = null;
            this.triggerUpdate('finale');
            return null;
        }
    }
    
    // Notifica aggiornamenti
    triggerUpdate(type) {
        if (typeof window.onDatabaseUpdate === 'function') {
            window.onDatabaseUpdate(type, this.data[type]);
        }
    }
    
    // ==================== OPERAZIONI CRUD ====================
    
    // AGGIUNGI SQUADRA
    async aggiungiSquadra(squadra) {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .insert([{
                    nome: squadra.nome,
                    allenatore: squadra.allenatore || null,
                    colori: squadra.colori || null,
                    punti: squadra.punti || 0,
                    partite_giocate: squadra.partite_giocate || 0,
                    vittorie: squadra.vittorie || 0,
                    pareggi: squadra.pareggi || 0,
                    sconfitte: squadra.sconfitte || 0,
                    gol_fatti: squadra.gol_fatti || 0,
                    gol_subiti: squadra.gol_subiti || 0
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('Squadra aggiunta:', data.nome);
            return data;
            
        } catch (error) {
            console.error('Errore aggiunta squadra:', error);
            throw error;
        }
    }
    
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
                    gol: giocatore.gol || 0,
                    ammonizioni: giocatore.ammonizioni || 0,
                    espulsioni: giocatore.espulsioni || 0,
                    punteggio_totale: giocatore.punteggio_totale || 0,
                    premi_miglior_giocatore: giocatore.premi_miglior_giocatore || 0,
                    premi_miglior_portiere: giocatore.premi_miglior_portiere || 0
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('Giocatore aggiunto:', data.nome);
            return data;
            
        } catch (error) {
            console.error('Errore aggiunta giocatore:', error);
            throw error;
        }
    }
    
    // AGGIUNGI PARTITA
    async aggiungiPartita(partita) {
        try {
            // Prima aggiorna statistiche giocatori per premi
            await this.aggiornaPremiGiocatori(partita);
            
            // Poi salva la partita
            const { data, error } = await supabase
                .from('partite')
                .insert([{
                    data: partita.data,
                    ora: partita.ora,
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
                .single();
            
            if (error) throw error;
            
            console.log('Partita aggiunta:', data.squadra_casa, 'vs', data.squadra_ospite);
            return data;
            
        } catch (error) {
            console.error('Errore aggiunta partita:', error);
            throw error;
        }
    }
    
    // SALVA FINALE
    async salvaFinale(finale) {
        try {
            // Prima elimina finale esistente se presente
            const { error: deleteError } = await supabase
                .from('finale')
                .delete()
                .neq('id', 0);
            
            if (deleteError && deleteError.code !== 'PGRST116') {
                console.warn('Errore eliminazione finale esistente:', deleteError);
            }
            
            // Poi aggiungi nuova finale
            const { data, error } = await supabase
                .from('finale')
                .insert([{
                    data: finale.data,
                    ora: finale.ora,
                    squadra_casa: finale.squadra_casa,
                    squadra_ospite: finale.squadra_ospite,
                    gol_casa: finale.gol_casa || 0,
                    gol_ospite: finale.gol_ospite || 0,
                    miglior_giocatore: finale.miglior_giocatore || null,
                    voto_miglior_giocatore: finale.voto_miglior_giocatore || null,
                    portiere_casa: finale.portiere_casa || null,
                    voto_portiere_casa: finale.voto_portiere_casa || null,
                    portiere_ospite: finale.portiere_ospite || null,
                    voto_portiere_ospite: finale.voto_portiere_ospite || null,
                    eventi: finale.eventi || []
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('Finale salvata:', data.squadra_casa, 'vs', data.squadra_ospite);
            return data;
            
        } catch (error) {
            console.error('Errore salvataggio finale:', error);
            throw error;
        }
    }
    
    // AGGIORNA PARTITA
    async aggiornaPartita(partitaId, updates) {
        try {
            // Se ci sono eventi, aggiorna anche statistiche giocatori
            if (updates.eventi !== undefined) {
                // Qui potresti voler aggiornare le statistiche dei giocatori
                // in base ai cambiamenti negli eventi
                console.log('Aggiornamento partita con nuovi eventi');
            }
            
            const { error } = await supabase
                .from('partite')
                .update(updates)
                .eq('id', partitaId);
            
            if (error) throw error;
            
            console.log('Partita aggiornata:', partitaId);
            
        } catch (error) {
            console.error('Errore aggiornamento partita:', error);
            throw error;
        }
    }
    
    // AGGIORNA GIOCATORE
    async aggiornaGiocatore(giocatoreId, updates) {
        try {
            const { error } = await supabase
                .from('giocatori')
                .update(updates)
                .eq('id', giocatoreId);
            
            if (error) throw error;
            
            console.log('Giocatore aggiornato:', giocatoreId);
            
        } catch (error) {
            console.error('Errore aggiornamento giocatore:', error);
            throw error;
        }
    }
    
    // AGGIORNA SQUADRA
    async aggiornaSquadra(squadraId, updates) {
        try {
            const { error } = await supabase
                .from('squadre')
                .update(updates)
                .eq('id', squadraId);
            
            if (error) throw error;
            
            console.log('Squadra aggiornata:', squadraId);
            
        } catch (error) {
            console.error('Errore aggiornamento squadra:', error);
            throw error;
        }
    }
    
    // ==================== ELIMINAZIONI ====================
    
    // ELIMINA PARTITA
    async eliminaPartita(partitaId) {
        try {
            // Prima recupera la partita per eventuali aggiornamenti statistiche
            const { data: partita, error: fetchError } = await supabase
                .from('partite')
                .select('*')
                .eq('id', partitaId)
                .single();
            
            if (fetchError) throw fetchError;
            
            // Poi elimina la partita
            const { error } = await supabase
                .from('partite')
                .delete()
                .eq('id', partitaId);
            
            if (error) throw error;
            
            console.log('Partita eliminata:', partitaId);
            
            // Nota: Qui dovresti anche aggiornare le statistiche delle squadre
            // sottraendo i punti/gol di questa partita
            // Questa logica è gestita nel file admin.html
            
        } catch (error) {
            console.error('Errore eliminazione partita:', error);
            throw error;
        }
    }
    
    // ELIMINA GIOCATORE
    async eliminaGiocatore(giocatoreId) {
        try {
            const { error } = await supabase
                .from('giocatori')
                .delete()
                .eq('id', giocatoreId);
            
            if (error) throw error;
            
            console.log('Giocatore eliminato:', giocatoreId);
            
        } catch (error) {
            console.error('Errore eliminazione giocatore:', error);
            throw error;
        }
    }
    
    // ELIMINA SQUADRA
    async eliminaSquadra(squadraId) {
        try {
            const { error } = await supabase
                .from('squadre')
                .delete()
                .eq('id', squadraId);
            
            if (error) throw error;
            
            console.log('Squadra eliminata:', squadraId);
            
        } catch (error) {
            console.error('Errore eliminazione squadra:', error);
            throw error;
        }
    }
    
    // ELIMINA FINALE
    async eliminaFinale() {
        try {
            const { error } = await supabase
                .from('finale')
                .delete()
                .neq('id', 0);
            
            if (error) throw error;
            
            console.log('Finale eliminata');
            
        } catch (error) {
            console.error('Errore eliminazione finale:', error);
            throw error;
        }
    }
    
    // ELIMINA TUTTE LE PARTITE
    async eliminaTuttePartite() {
        try {
            const { error } = await supabase
                .from('partite')
                .delete()
                .neq('id', 0);
            
            if (error) throw error;
            
            console.log('Tutte le partite eliminate');
            
        } catch (error) {
            console.error('Errore eliminazione partite:', error);
            throw error;
        }
    }
    
    // ELIMINA TUTTI I GIOCATORI
    async eliminaTuttiGiocatori() {
        try {
            const { error } = await supabase
                .from('giocatori')
                .delete()
                .neq('id', 0);
            
            if (error) throw error;
            
            console.log('Tutti i giocatori eliminati');
            
        } catch (error) {
            console.error('Errore eliminazione giocatori:', error);
            throw error;
        }
    }
    
    // ELIMINA TUTTE LE SQUADRE
    async eliminaTutteSquadre() {
        try {
            const { error } = await supabase
                .from('squadre')
                .delete()
                .neq('id', 0);
            
            if (error) throw error;
            
            console.log('Tutte le squadre eliminate');
            
        } catch (error) {
            console.error('Errore eliminazione squadre:', error);
            throw error;
        }
    }
    
    // ELIMINA TUTTO IL DATABASE
    async eliminaTutto() {
        try {
            console.log('Inizio eliminazione totale database...');
            
            // Ordine importante per foreign key constraints
            const { error: errorPartite } = await supabase
                .from('partite')
                .delete()
                .neq('id', 0);
            
            if (errorPartite) {
                console.warn('Errore eliminazione partite:', errorPartite);
            }
            
            const { error: errorFinale } = await supabase
                .from('finale')
                .delete()
                .neq('id', 0);
            
            if (errorFinale) {
                console.warn('Errore eliminazione finale:', errorFinale);
            }
            
            const { error: errorGiocatori } = await supabase
                .from('giocatori')
                .delete()
                .neq('id', 0);
            
            if (errorGiocatori) {
                console.warn('Errore eliminazione giocatori:', errorGiocatori);
            }
            
            const { error: errorSquadre } = await supabase
                .from('squadre')
                .delete()
                .neq('id', 0);
            
            if (errorSquadre) {
                console.warn('Errore eliminazione squadre:', errorSquadre);
            }
            
            console.log('Database completamente eliminato');
            
        } catch (error) {
            console.error('Errore eliminazione totale:', error);
            throw error;
        }
    }
    
    // ==================== FUNZIONI AUSILIARIE ====================
    
    // Aggiorna premi giocatori quando si salva una partita
    async aggiornaPremiGiocatori(partita) {
        try {
            // Miglior giocatore
            if (partita.miglior_giocatore && partita.voto_miglior_giocatore) {
                const giocatore = this.data.giocatori.find(g => g.id === partita.miglior_giocatore);
                if (giocatore) {
                    await this.aggiornaGiocatore(partita.miglior_giocatore, {
                        punteggio_totale: (giocatore.punteggio_totale || 0) + partita.voto_miglior_giocatore,
                        premi_miglior_giocatore: (giocatore.premi_miglior_giocatore || 0) + 1
                    });
                }
            }
            
            // Portiere casa
            if (partita.portiere_casa && partita.voto_portiere_casa) {
                const portiere = this.data.giocatori.find(g => g.id === partita.portiere_casa);
                if (portiere) {
                    await this.aggiornaGiocatore(partita.portiere_casa, {
                        punteggio_totale: (portiere.punteggio_totale || 0) + partita.voto_portiere_casa,
                        premi_miglior_portiere: (portiere.premi_miglior_portiere || 0) + 1
                    });
                }
            }
            
            // Portiere ospite
            if (partita.portiere_ospite && partita.voto_portiere_ospite) {
                const portiere = this.data.giocatori.find(g => g.id === partita.portiere_ospite);
                if (portiere) {
                    await this.aggiornaGiocatore(partita.portiere_ospite, {
                        punteggio_totale: (portiere.punteggio_totale || 0) + partita.voto_portiere_ospite,
                        premi_miglior_portiere: (portiere.premi_miglior_portiere || 0) + 1
                    });
                }
            }
            
        } catch (error) {
            console.error('Errore aggiornamento premi giocatori:', error);
        }
    }
    
    // ==================== GETTERS ====================
    
    getSquadre() {
        return [...this.data.squadre];
    }
    
    getGiocatori() {
        return [...this.data.giocatori];
    }
    
    getPartite() {
        return [...this.data.partite];
    }
    
    getFinale() {
        return this.data.finale ? { ...this.data.finale } : null;
    }
    
    // ==================== TEST CONNESSIONE ====================
    
    async testConnessione() {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .select('count')
                .limit(1);
            
            if (error) throw error;
            
            return true;
        } catch (error) {
            console.error('Test connessione fallito:', error);
            return false;
        }
    }
}

// Crea istanza globale
const database = new SupabaseManager();

// Test connessione periodico
setInterval(async () => {
    try {
        await database.testConnessione();
    } catch (error) {
        console.warn('Connessione database instabile');
    }
}, 30000);

export default database;
