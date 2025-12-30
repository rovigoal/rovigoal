// database-supabase.js
import supabase from './supabase-config.js'

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
        // Squadre
        supabase.channel('squadre-channel')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'squadre' }, 
                () => this.caricaSquadre()
            )
            .subscribe()
        
        // Giocatori
        supabase.channel('giocatori-channel')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'giocatori' }, 
                () => this.caricaGiocatori()
            )
            .subscribe()
        
        // Partite
        supabase.channel('partite-channel')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'partite' }, 
                () => this.caricaPartite()
            )
            .subscribe()
        
        // Finale
        supabase.channel('finale-channel')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'finale' }, 
                () => this.caricaFinale()
            )
            .subscribe()
        
        // Carica dati iniziali
        await Promise.all([
            this.caricaSquadre(),
            this.caricaGiocatori(),
            this.caricaPartite(),
            this.caricaFinale()
        ]);
    }
    
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
        } catch (error) {
            console.error('Errore caricamento squadre:', error);
        }
    }
    
    // Carica giocatori
    async caricaGiocatori() {
        try {
            const { data, error } = await supabase
                .from('giocatori')
                .select('*');
            
            if (error) throw error;
            
            this.data.giocatori = data || [];
            this.triggerUpdate('giocatori');
        } catch (error) {
            console.error('Errore caricamento giocatori:', error);
        }
    }
    
    // Carica partite
    async caricaPartite() {
        try {
            const { data, error } = await supabase
                .from('partite')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            this.data.partite = data || [];
            this.triggerUpdate('partite');
        } catch (error) {
            console.error('Errore caricamento partite:', error);
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
        } catch (error) {
            console.error('Errore caricamento finale:', error);
        }
    }
    
    // Notifica aggiornamenti
    triggerUpdate(type) {
        if (typeof window.onDatabaseUpdate === 'function') {
            window.onDatabaseUpdate(type, this.data[type]);
        }
    }
    
    // --- OPERAZIONI CRUD ---
    
    // AGGIUNGI SQUADRA
    async aggiungiSquadra(squadra) {
        try {
            const { data, error } = await supabase
                .from('squadre')
                .insert([squadra])
                .select()
                .single();
            
            if (error) throw error;
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
                .insert([giocatore])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Errore aggiunta giocatore:', error);
            throw error;
        }
    }
    
    // AGGIUNGI PARTITA
    async aggiungiPartita(partita) {
        try {
            const { data, error } = await supabase
                .from('partite')
                .insert([partita])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Errore aggiunta partita:', error);
            throw error;
        }
    }
    
    // SALVA FINALE
    async salvaFinale(finale) {
        try {
            // Elimina finale esistente se presente
            await supabase.from('finale').delete().neq('id', 0);
            
            // Aggiungi nuova finale
            const { data, error } = await supabase
                .from('finale')
                .insert([finale])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Errore salvataggio finale:', error);
            throw error;
        }
    }
    
    // ELIMINA PARTITA
    async eliminaPartita(partitaId) {
        try {
            const { error } = await supabase
                .from('partite')
                .delete()
                .eq('id', partitaId);
            
            if (error) throw error;
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
        } catch (error) {
            console.error('Errore eliminazione squadra:', error);
            throw error;
        }
    }
    
    // ELIMINA TUTTO
    async eliminaTutto() {
        try {
            // Elimina in ordine per evitare errori di foreign key
            await supabase.from('partite').delete().neq('id', 0);
            await supabase.from('finale').delete().neq('id', 0);
            await supabase.from('giocatori').delete().neq('id', 0);
            await supabase.from('squadre').delete().neq('id', 0);
            
            console.log('Tutti i dati eliminati');
        } catch (error) {
            console.error('Errore eliminazione totale:', error);
            throw error;
        }
    }
    
    // AGGIORNA STATISTICHE GIOCATORE
    async aggiornaGiocatore(giocatoreId, updates) {
        try {
            const { error } = await supabase
                .from('giocatori')
                .update(updates)
                .eq('id', giocatoreId);
            
            if (error) throw error;
        } catch (error) {
            console.error('Errore aggiornamento giocatore:', error);
            throw error;
        }
    }
    
    // AGGIORNA STATISTICHE SQUADRA
    async aggiornaSquadra(squadraId, updates) {
        try {
            const { error } = await supabase
                .from('squadre')
                .update(updates)
                .eq('id', squadraId);
            
            if (error) throw error;
        } catch (error) {
            console.error('Errore aggiornamento squadra:', error);
            throw error;
        }
    }
    
    // GETTERS
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
}

// Crea istanza globale
const database = new SupabaseManager();
export default database;