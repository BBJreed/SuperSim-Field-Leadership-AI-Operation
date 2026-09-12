import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SuperSim Field Leadership Ops API' });
});

// Endpoint: Dynamic AI Scenario Enrichment
app.post('/api/scenarios/generate', async (req, res) => {
  try {
    const { projectType, day, previousChoices } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ enriched: false, message: 'Local high-fidelity scenario engine active' });
    }

    const prompt = `You are a Senior Construction Operations Director evaluating a Superintendent candidate.
Project: ${projectType}
Day: ${day} of 5
Previous Decisions: ${JSON.stringify(previousChoices || [])}

Provide a brief, realistic trade superintendent radio transmission / field brief (max 60 words) describing the urgency of the moment, mentioning specific sub trades and specs.
Format your response as a simple JSON with a field: "fieldUrgencyMemo".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = response.text ? JSON.parse(response.text) : null;
    res.json({ enriched: true, data: parsed });
  } catch (error: any) {
    console.warn('Scenario enrichment warning, using standard scenario:', error?.message);
    res.json({ enriched: false, message: error?.message });
  }
});

// Endpoint: AI Real-Time Artifact Generation (Daily Log, RFI, or NCR)
app.post('/api/artifact/generate', async (req, res) => {
  try {
    const { artifactType, scenarioTitle, optionLabel, decisionRationale, superName, projectName, day } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ success: false, fallback: true });
    }

    const prompt = `Generate an authentic, professional construction site artifact based on a Superintendent's tactical decision on Day ${day} of a ${projectName} project.
Superintendent: ${superName}
Scenario: ${scenarioTitle}
Action Taken: ${optionLabel}
Rationale/Impact: ${decisionRationale}
Artifact Required: ${artifactType} (Options: DAILY_LOG, RFI, or NCR)

Respond with valid JSON with:
{
  "documentNumber": "e.g. RFI-0024 or NCR-011 or DLOG-D${day}",
  "title": "Formal document title",
  "summary": "2-3 sentence executive synopsis",
  "fullContent": "Realistic, formal construction document with trade names, spec sections, dates, manpower counts or violation codes, root cause, and required actions."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = response.text ? JSON.parse(response.text) : null;
    res.json({ success: true, artifact: parsed });
  } catch (error: any) {
    console.warn('Artifact generation warning, fallback to template:', error?.message);
    res.json({ success: false, fallback: true });
  }
});

// Endpoint: Freeform Radio Directive LLM Evaluation
app.post('/api/directive/evaluate', async (req, res) => {
  try {
    const { directiveText, scenario, projectType, superName, currentStats } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ success: false, fallback: true });
    }

    const prompt = `You are an elite VP of Field Operations and Construction Executive for a top General Contractor.
A Superintendent candidate on a ${projectType} project has transmitted a LIVE VERBAL FIELD RADIO DIRECTIVE on their Motorola walkie-talkie during a critical jobsite dilemma.

SUPERINTENDENT: ${superName}
ACTIVE SCENARIO:
- Title: ${scenario.title}
- Critical Path Milestone: ${scenario.criticalPathTask}
- Dilemma Context: ${scenario.description}
- Active Trades: ${(scenario.keyTrades || []).join(', ')}
- Current Safety Score: ${currentStats?.safety || 85}%
- Current Schedule Float: ${currentStats?.scheduleVarianceDays || 0} days

EXACT VERBAL RADIO DIRECTIVE ISSUED BY SUPERINTENDENT:
"${directiveText}"

Evaluate this directive across the required 3-pillar construction rubric on a strict 0-100 scale:
1. OSHA / Safety Compliance Score (0-100): Does it enforce OSHA standards, zero-tolerance fall protection, rigging safety, trench shoring, or does it gamble with worker life? (100 = flawless safety abatement; 0 = immediate lethal OSHA violation).
2. Contractual & Spec Rigor (0-100): Does it adhere to project specs, BIM submittals, EOR sign-offs, and quality standards, or does it commit unauthorized field modifications? (100 = airtight spec fidelity; 0 = severe non-conformance breach).
3. Trade Friction / Subcontractor Buy-in (0-100): Does it communicate with clear command authority while securing foreman cooperation and trade morale, or does it provoke trade walk-offs and union disputes? (100 = total sub buy-in & high morale; 0 = hostile shutdown).

Also estimate the cost liability ($) and dynamically calculate the net stat deltas based on these scores:
- Safety Delta: calculated from OSHA score (e.g. score >= 85 -> +5 to +15; score <= 50 -> -10 to -25).
- Schedule Days Delta: float impact in days (-2.0 to +1.0).
- Contingency Spent: dollar amount spent to implement this order.
- Quality Delta: calculated from Contractual Rigor score.
- Morale Delta: calculated from Subcontractor Buy-in score (e.g. score >= 80 -> +5 to +15; score <= 40 -> -10 to -20).

Respond with ONLY valid JSON matching this exact structure:
{
  "actionTitle": "Short, punchy title for this verbal field order (e.g. 'Radio Directive: Stand-Down & Expedited EOR RFI')",
  "strategyBadge": "RADIO DIRECTIVE",
  "feedback": "2-3 sentence executive assessment from the VP of Field Ops analyzing the candidate's tactical command, risk posture, and jobsite outcome.",
  "tradeReaction": "A realistic quote from the affected subcontractor foremen acknowledging the radio order over the channel.",
  "scores": {
    "oshaCompliance": {
      "score": 92, // integer 0 - 100
      "label": "e.g. Flawless Hazard Abatement (92/100) or Marginal Fall Protection (55/100)",
      "commentary": "1-2 sentence analysis of safety compliance."
    },
    "contractualSpecRigor": {
      "score": 85, // integer 0 - 100
      "label": "e.g. Full Spec Compliance (85/100) or Unauthorized Deviation (35/100)",
      "commentary": "1 sentence on contract spec adherence and engineering rigor."
    },
    "subcontractorBuyIn": {
      "score": 78, // integer 0 - 100
      "label": "e.g. High Trade Buy-In (78/100) or Severe Friction (28/100)",
      "commentary": "1 sentence on foreman cooperation and trade morale."
    },
    "costLiability": {
      "amount": 12500, // estimated dollar cost/liability generated by this order
      "label": "e.g. Controlled Exposure ($12,500) or High Delay Exposure ($45,000)",
      "commentary": "1 sentence on contingency burn and change order risk."
    }
  },
  "impact": {
    "safety": 12, // integer delta based on OSHA score
    "scheduleDays": -0.5, // float delta in days
    "contingencySpent": 12500, // dollars spent
    "quality": 8, // integer delta based on Spec Rigor score
    "morale": 6 // integer delta based on Subcontractor Buy-in score
  },
  "recommendedArtifactType": "RFI" // one of "DAILY_LOG", "RFI", or "NCR"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = response.text ? JSON.parse(response.text) : null;
    res.json({ success: true, evaluation: parsed });
  } catch (error: any) {
    console.warn('Directive evaluation warning, fallback to local evaluator:', error?.message);
    res.json({ success: false, fallback: true });
  }
});

// Endpoint: Executive AI Performance Evaluation
app.post('/api/evaluation/generate', async (req, res) => {
  try {
    const { projectType, profile, stats, history } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ success: false, fallback: true });
    }

    const prompt = `Conduct a rigorous, executive-level Construction Superintendent Candidate Evaluation for a General Contractor's VP of Field Operations.
Candidate: ${profile.name} (${profile.experience}, Risk Profile: ${profile.riskTolerance})
Project Sector: ${projectType}
Final Iron Triangle & Safety Stats:
- Safety / OSHA Compliance: ${stats.safety}% (Zero tolerance threshold was 50%)
- Schedule Float Variance: ${stats.scheduleVarianceDays > 0 ? `+${stats.scheduleVarianceDays}` : stats.scheduleVarianceDays} Days (Pace: ${stats.schedulePercent}%)
- Contingency Fund Remaining: $${(stats.remainingContingency || 0).toLocaleString()} (Spent: $${(stats.contingencySpent || 0).toLocaleString()})
- Quality & Spec Compliance: ${stats.qualityScore}%
- Subcontractor Morale Index: ${stats.subMorale}%

Day-by-Day Tactical Field History:
${history.map((h: any) => `* Day ${h.day}: "${h.scenarioTitle}" -> Chosen Action: "${h.chosenOption.actionTitle}" (${h.chosenOption.strategyBadge})`).join('\n')}

Produce an authentic, unvarnished Executive Review JSON matching this schema:
{
  "roleClassification": "e.g., Senior Lead Superintendent, Technical Field Integrator, Production Pusher, or Field Coordinator Trainee",
  "overallRating": 84, // number 0-100
  "hireStatus": "HIRE_SENIOR_LEAD" | "HIRE_PROJECT_SUPER" | "CONDITIONAL_TRAINING" | "DO_NOT_HIRE",
  "hireStatusLabel": "e.g. Recommended for Immediate Lead Assignment",
  "executiveSummary": "Paragraph evaluating command presence, trade diplomacy, and risk mitigation.",
  "pillarBreakdown": {
    "safetyAudit": { "score": ${stats.safety}, "status": "Compliant or At-Risk", "commentary": "Brief analysis of fall protection & hazard posture" },
    "scheduleFloat": { "score": ${stats.schedulePercent}, "status": "Ahead/Lagging", "commentary": "Analysis of critical path sequencing" },
    "budgetContingency": { "score": ${stats.budgetPercent}, "status": "Managed/Burned", "commentary": "Analysis of change order exposure" },
    "qualityMorale": { "score": ${stats.qualityScore}, "status": "Superior/Deficient", "commentary": "Subcontractor relations and rework avoidance" }
  },
  "biggestWin": {
    "day": 3,
    "title": "Tactical highlight",
    "impact": "Concrete positive outcome on project trajectory"
  },
  "mostHazardousTradeoff": {
    "day": 4,
    "title": "Highest risk gamble",
    "riskExploration": "What almost went wrong and long-term liability created"
  },
  "fieldLeadershipDNA": ["3-4 bullet tags like 'Trade Diplomat', 'BIM Coordination Savant', 'OSHA Shield'"],
  "markdownReport": "A 3-section markdown summary formatted with clear headings ready for print or portfolio export."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = response.text ? JSON.parse(response.text) : null;
    res.json({ success: true, evaluation: parsed });
  } catch (error: any) {
    console.warn('AI evaluation warning, fallback to deterministic audit:', error?.message);
    res.json({ success: false, fallback: true });
  }
});

// Vite middleware & Static SPA serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v5, wildcard must be *all
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SuperSim] Enterprise Field Ops Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
