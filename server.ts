import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from '@supabase/supabase-js';
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  app.use(express.json());
  app.use(cors());

  // --- API Routes ---

  // Auth (Simplified for demo - in production use Supabase Auth)
  app.post("/api/login", async (req, res) => {
    res.status(410).json({ error: "Este endpoint foi desativado. Use o Supabase Auth no frontend." });
  });

  // Participants
  app.get("/api/participants", async (req, res) => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.post("/api/participants", async (req, res) => {
    const { name, active } = req.body;
    const { data, error } = await supabase
      .from('participants')
      .insert([{ name, active: active ? true : false }])
      .select();
    
    if (error) return res.status(500).json(error);
    res.json({ id: data[0].id });
  });

  app.patch("/api/participants/:id", async (req, res) => {
    const { id } = req.params;
    const { name, active } = req.body;
    const { error } = await supabase
      .from('participants')
      .update({ name, active: active ? true : false })
      .eq('id', id);
    
    if (error) return res.status(500).json(error);
    res.json({ success: true });
  });

  // Contributions
  app.get("/api/contributions", async (req, res) => {
    const { data, error } = await supabase
      .from('contributions')
      .select(`
        *,
        participants ( name )
      `)
      .order('month', { ascending: false })
      .order('paid_at', { ascending: false });
    
    if (error) return res.status(500).json(error);
    
    // Flatten the participant name
    const formatted = data.map((c: any) => ({
      ...c,
      participant_name: c.participants?.name
    }));
    
    res.json(formatted);
  });

  app.post("/api/contributions", async (req, res) => {
    const { participant_id, amount, month } = req.body;
    const { data, error } = await supabase
      .from('contributions')
      .insert([{ participant_id, amount, month }])
      .select();
    
    if (error) return res.status(500).json(error);
    res.json({ id: data[0].id });
  });

  // Draws
  app.get("/api/draws", async (req, res) => {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.patch("/api/draws/:id", async (req, res) => {
    const { id } = req.params;
    const { realized, result, prize, allocation_percentage } = req.body;
    
    const { error: updateError } = await supabase
      .from('draws')
      .update({ 
        realized: realized ? true : false, 
        result: result || null, 
        prize: prize || 0, 
        allocation_percentage: allocation_percentage || 0 
      })
      .eq('id', id);

    if (updateError) return res.status(500).json(updateError);

    if (realized) {
      const { data: remainingDraws } = await supabase
        .from('draws')
        .select('*')
        .eq('realized', false);

      if (remainingDraws && remainingDraws.length > 0) {
        const totalRemaining = remainingDraws.reduce((acc, d) => acc + d.allocation_percentage, 0);
        const realizedPercentage = allocation_percentage || 0;
        
        for (const d of remainingDraws) {
          const newPercentage = d.allocation_percentage + (d.allocation_percentage / totalRemaining) * realizedPercentage;
          await supabase.from('draws').update({ allocation_percentage: newPercentage }).eq('id', d.id);
        }
        
        await supabase.from('draws').update({ allocation_percentage: 0 }).eq('id', id);
      }
    }

    res.json({ success: true });
  });

  // Dashboard Stats
  app.get("/api/stats", async (req, res) => {
    const { data: contributions } = await supabase.from('contributions').select('amount');
    const { data: bets } = await supabase.from('bets').select('amount');
    const { count: activeCount } = await supabase.from('participants').select('*', { count: 'exact', head: true }).eq('active', true);
    const { data: nextDraws } = await supabase.from('draws').select('*').eq('realized', false).order('date', { ascending: true }).limit(1);
    
    const totalCollected = contributions?.reduce((acc, c) => acc + Number(c.amount), 0) || 0;
    const totalInvested = bets?.reduce((acc, b) => acc + Number(b.amount), 0) || 0;
    
    res.json({
      totalCollected,
      totalInvested,
      cashAvailable: totalCollected - totalInvested,
      activeParticipants: activeCount || 0,
      nextDraw: nextDraws?.[0] || null
    });
  });

  // Bets
  app.get("/api/draws/:id/bets", async (req, res) => {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('draw_id', req.params.id)
      .order('date', { ascending: false });
    
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.post("/api/bets", async (req, res) => {
    const { draw_id, description, amount } = req.body;
    const { data, error } = await supabase
      .from('bets')
      .insert([{ draw_id, description, amount }])
      .select();
    
    if (error) return res.status(500).json(error);
    res.json({ id: data[0].id });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
