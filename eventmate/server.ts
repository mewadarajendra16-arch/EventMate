import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client for server-side Interactions API
let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    genAiClient = new GoogleGenAI({ apiKey });
  }
  return genAiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'EventMate Antigravity Agent Proxy' });
});

// Antigravity Agent interaction endpoint
app.post('/api/antigravity', async (req, res) => {
  try {
    const { prompt, context, environmentId } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A valid prompt string is required.' });
    }

    const ai = getGeminiClient();

    // Construct enriched task instructions for Antigravity agent
    const systemPrompt = `You are Antigravity, the executive autonomous event production agent for EventMate.
EventMate is India's leading on-demand event crew & staffing platform.
Current context: ${JSON.stringify(context || {})}

Task: ${prompt}

Provide a structured, deeply practical event operations briefing, actionable crew roster recommendations, risk mitigations, turnstile crowd safety plans, or staff calculations tailored to the Indian live events landscape (festivals, VIP lounges, corporate summits, stadium concerts).`;

    // Call Antigravity managed agent via Interactions API
    const interaction = await ai.interactions.create({
      agent: 'antigravity-preview-05-2026',
      input: systemPrompt,
      environment: environmentId || 'remote',
    }, { timeout: 300000 });

    return res.json({
      id: interaction.id,
      environmentId: interaction.environment_id,
      outputText: interaction.output_text,
      status: 'completed',
    });
  } catch (error: any) {
    console.error('Antigravity interaction error:', error);
    
    // Graceful fallback for demo/unprovisioned states
    return res.status(500).json({
      error: error?.message || 'Failed to communicate with Antigravity Agent.',
      fallbackAvailable: true,
    });
  }
});

// Production static serving or Vite middleware
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EventMate Server running on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
