import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Server API: AI Shopping Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, history, catalog } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      // Graceful fallback if API key is not configured
      return res.json({
        reply: "Hello! I'm Nova AI, your personal fashion stylist for NovaCart Ai. I can help you find dresses, handbags, jewellery, and accessories tailored to your style, budget, and occasion! What are you shopping for today?",
        suggestedProductIds: [],
      });
    }

    // Prepare system instructions with current store catalog
    const catalogSummary = (catalog || [])
      .map(
        (p: any) =>
          `[ID: ${p.id}] ${p.name} | Category: ${p.category} | Price: ₹${p.price} (MRP: ₹${p.originalPrice}) | Stock: ${p.stock > 0 ? `${p.stock} units` : 'OUT OF STOCK'} | Colors: ${p.colors?.join(', ')} | Tags: ${p.tags?.join(', ')}`
      )
      .join('\n');

    const prompt = `You are "Nova AI", the intelligent fashion shopping assistant for "NovaCart Ai" (novaworld.digital), an Indian fashion e-commerce destination for teenagers, college students, and young adults.
Tagline: "Your Style. Your Choice. Powered by AI."

Store Categories: Fashion Dresses, Handbags, Jewellery, and Fashion Accessories.
Currency: Indian Rupees (₹).

CURRENT STORE CATALOG:
${catalogSummary}

CRITICAL RULES:
1. Recommend ONLY products that actually exist in the store catalog above. Never invent products or brands not in the catalog.
2. If a product is OUT OF STOCK, do NOT recommend it unless asked specifically.
3. Be friendly, warm, stylish, concise, and helpful with an Indian shopping context (college wear, festive events, casual outings, party looks, gifting).
4. If the user's request is vague (e.g. "I want clothes" or "show me something nice"), ask clarifying questions such as their occasion, budget, preferred category, or color.
5. In your response, provide helpful styling advice and mention the specific products you recommend.
6. YOU MUST return a JSON object with this exact structure:
{
  "reply": "Your conversational response with advice and questions",
  "recommendedProductIds": ["prod-1", "prod-2"],
  "followUpQuestions": ["What is your preferred color?", "Are you dressing up for day or evening?"]
}

User request: "${message}"

User conversation history:
${(history || [])
  .slice(-4)
  .map((h: any) => `${h.role === 'user' ? 'Customer' : 'Nova AI'}: ${h.text}`)
  .join('\n')}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      parsedData = {
        reply: responseText,
        recommendedProductIds: [],
        followUpQuestions: [],
      };
    }

    return res.json({
      reply: parsedData.reply || "Here are some top picks from NovaCart Ai for you!",
      suggestedProductIds: parsedData.recommendedProductIds || [],
      followUpQuestions: parsedData.followUpQuestions || [],
    });
  } catch (error: any) {
    console.error('Error in /api/assistant:', error);
    return res.status(500).json({
      error: 'Failed to process AI assistant request',
      details: error?.message || 'Unknown error',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`NovaCart Ai Server running on http://localhost:${PORT}`);
  });
}

startServer();
