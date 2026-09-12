import { 
  ProjectType, 
  SuperintendentProfile, 
  IronTriangleStats, 
  DecisionRecord, 
  ExecutiveEvaluation, 
  SiteArtifact,
  ScenarioOption,
  DirectiveEvaluation,
  Scenario
} from '../types';

/**
 * Calls server-side Gemini API proxy to enrich scenario details
 */
export async function enrichScenario(
  projectType: ProjectType,
  day: number,
  previousChoices: any[]
): Promise<string | null> {
  try {
    const res = await fetch('/api/scenarios/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectType, day, previousChoices })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.fieldUrgencyMemo || null;
  } catch {
    return null;
  }
}

/**
 * Generates an authentic construction artifact via server-side Gemini
 */
export async function generateSiteArtifactAI(
  type: string,
  scenarioTitle: string,
  option: ScenarioOption,
  superName: string,
  projectName: string,
  day: number
): Promise<Partial<SiteArtifact> | null> {
  try {
    const res = await fetch('/api/artifact/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artifactType: type,
        scenarioTitle,
        optionLabel: option.actionTitle,
        decisionRationale: option.feedback,
        superName,
        projectName,
        day
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.artifact) {
      return data.artifact;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Evaluates a Superintendent's custom verbal / typed radio directive using Gemini or deterministic evaluator
 */
export async function evaluateFreeformRadioDirective(
  directiveText: string,
  scenario: Scenario,
  projectType: ProjectType,
  superName: string,
  currentStats: IronTriangleStats
): Promise<DirectiveEvaluation> {
  try {
    const res = await fetch('/api/directive/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        directiveText,
        scenario: {
          title: scenario.title,
          criticalPathTask: scenario.criticalPathTask,
          description: scenario.description,
          keyTrades: scenario.keyTrades,
          location: scenario.location
        },
        projectType,
        superName,
        currentStats
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.evaluation) {
        return {
          ...data.evaluation,
          directiveText
        };
      }
    }
  } catch (err) {
    console.warn('Radio directive evaluation falling back to deterministic evaluator:', err);
  }

  return computeDeterministicDirectiveEvaluation(directiveText, scenario, superName);
}

function computeDeterministicDirectiveEvaluation(
  directiveText: string,
  scenario: Scenario,
  superName: string
): DirectiveEvaluation {
  const text = directiveText.toLowerCase();

  // Pattern detection
  const isSafetyHalt = text.includes('stop') || text.includes('hold') || text.includes('halt') || text.includes('stand down') || text.includes('safety') || text.includes('shut down') || text.includes('wind') || text.includes('gust');
  const isSpecFocus = text.includes('engineer') || text.includes('eor') || text.includes('rfi') || text.includes('spec') || text.includes('tolerance') || text.includes('shim') || text.includes('laser') || text.includes('survey') || text.includes('inspect') || text.includes('bim');
  const isCollaborative = text.includes('resequence') || text.includes('re-sequence') || text.includes('swing') || text.includes('staging') || text.includes('mezzanine') || text.includes('huddle') || text.includes('foreman') || text.includes('coordinate') || text.includes('overtime') || text.includes('shift');
  const isAggressivePush = text.includes('push') || text.includes('keep going') || text.includes('pour') || text.includes('proceed') || text.includes('hurry') || text.includes('ignore') || text.includes('no delay') || text.includes('override');

  // Strict 0-100 Rubric Metrics
  let oshaScore = 80;
  let oshaLabel = 'Standard OSHA Compliance';
  let oshaComment = 'Maintains general duty clause and standard site PPE/fall protection baseline.';

  let specRigorScore = 75;
  let specRigorLabel = 'Acceptable Spec Conformity';
  let specRigorComment = 'Satisfies standard construction drawings without unapproved modifications.';

  let subBuyInScore = 75;
  let subBuyInLabel = 'Cooperative Subcontractor Alignment';
  let subBuyInComment = 'Foremen acknowledge order without disputing contractual scope or demanding change orders.';

  let costLiabilityAmount = 10000;
  let costLiabilityLabel = 'Controlled Float Buffer ($10,000)';
  let costLiabilityComment = 'Minor trade staging expense covered within baseline contingency reserves.';

  let recArtifact: 'DAILY_LOG' | 'RFI' | 'NCR' = 'DAILY_LOG';
  let actionTitle = `Radio Directive: Field Order by ${superName}`;
  let badge = 'RADIO DIRECTIVE: BALANCED';

  if (isAggressivePush && !isSafetyHalt) {
    oshaScore = 32;
    oshaLabel = 'High OSHA Hazard Exposure';
    oshaComment = 'Pressing production without verifying structural tolerance or pick wind limits breaches OSHA 1926 standards.';

    specRigorScore = 40;
    specRigorLabel = 'Severe Spec Deviation';
    specRigorComment = 'Waiving engineering inspection risks structural non-conformance and mandatory tear-out.';

    subBuyInScore = 35;
    subBuyInLabel = 'Hostile Subcontractor Pushback';
    subBuyInComment = 'Foreman states on record that their crew will not take liability for work placed out of tolerance.';

    costLiabilityAmount = 55000;
    costLiabilityLabel = 'Extreme Latent Defect Risk ($55,000)';
    costLiabilityComment = 'Exposes general contractor to structural backcharges, delay liquidated damages, and warranty claims.';

    recArtifact = 'NCR';
    actionTitle = 'Radio Directive: Fast-Track Production Push';
    badge = 'RADIO DIRECTIVE: AGGRESSIVE';
  } else if (isSafetyHalt && isSpecFocus) {
    oshaScore = 96;
    oshaLabel = 'Flawless Zero-Harm Protocol';
    oshaComment = 'Decisive stop-work and stand-down completely mitigates critical safety risk and life-safety exposure.';

    specRigorScore = 94;
    specRigorLabel = 'Airtight Engineering Fidelity';
    specRigorComment = 'Mandates structural EOR review and laser verification before releasing subsequent trades.';

    subBuyInScore = 82;
    subBuyInLabel = 'Professional Sub Alignment';
    subBuyInComment = 'Trade foremen respect authoritative safety boundaries and clear documented chain-of-custody.';

    costLiabilityAmount = 18000;
    costLiabilityLabel = 'Engineering Consult & Standby ($18,000)';
    costLiabilityComment = 'Investment in rapid engineering sign-off prevents catastrophic structural rework.';

    recArtifact = 'RFI';
    actionTitle = 'Radio Directive: Emergency Hold & EOR Review';
    badge = 'RADIO DIRECTIVE: SPEC-FIRST';
  } else if (isCollaborative) {
    oshaScore = 88;
    oshaLabel = 'Proactive Workfront Segregation';
    oshaComment = 'Safely isolates the active hazard zone while redirecting manpower to clear work zones.';

    specRigorScore = 86;
    specRigorLabel = 'Logistical Spec Preservation';
    specRigorComment = 'Maintains critical path tolerances without cutting corners on material cure times.';

    subBuyInScore = 92;
    subBuyInLabel = 'Exceptional Subcontractor Morale';
    subBuyInComment = 'Foremen applaud superintendent for preserving their daily crew billing hours on secondary workfronts.';

    costLiabilityAmount = 12000;
    costLiabilityLabel = 'Overtime / Staging Buffer ($12,000)';
    costLiabilityComment = 'Modest expenditure to re-sequence trades while safeguarding master project float.';

    recArtifact = 'DAILY_LOG';
    actionTitle = 'Radio Directive: Dynamic Re-Sequencing & Workfront Shift';
    badge = 'RADIO DIRECTIVE: COLLABORATIVE';
  }

  // Adjust scores slightly based on text length/detail
  if (directiveText.length < 25) {
    specRigorScore = Math.max(30, specRigorScore - 15);
    specRigorComment += ' Order was brief, lacking specific gridlines or quality checkpoints.';
  } else if (directiveText.length > 90) {
    specRigorScore = Math.min(99, specRigorScore + 5);
  }

  // Calculate net stat deltas dynamically from the custom scores (0-100)
  // OSHA: >=85 -> +10 to +18; 60-84 -> +2 to +8; <50 -> -15 to -25
  const safetyDelta = oshaScore >= 85 
    ? Math.round((oshaScore - 80) * 0.9) 
    : oshaScore >= 60 
      ? Math.round((oshaScore - 60) * 0.25) 
      : -Math.round((60 - oshaScore) * 0.55);

  // Quality: derived from spec rigor
  const qualityDelta = specRigorScore >= 80 
    ? Math.round((specRigorScore - 75) * 0.6) 
    : -Math.round((80 - specRigorScore) * 0.5);

  // Morale: derived from subcontractor buy-in
  const moraleDelta = subBuyInScore >= 80 
    ? Math.round((subBuyInScore - 75) * 0.6) 
    : -Math.round((75 - subBuyInScore) * 0.5);

  // Schedule impact
  const scheduleDaysDelta = isAggressivePush 
    ? 0.5 
    : isSafetyHalt && isSpecFocus 
      ? -0.5 
      : isCollaborative 
        ? 0.0 
        : -0.5;

  return {
    directiveText,
    actionTitle,
    strategyBadge: badge,
    feedback: `VP Field Operations Review: Verbal radio directive shows tactical awareness. By broadcasting "${directiveText.slice(0, 75)}...", the field team addressed the ${scenario.criticalPathTask} bottleneck with structured command.`,
    tradeReaction: `Lead Foreman: "Copy that, Superintendent. Received 10-4 on Channel 4. Informing all lead trades immediately."`,
    scores: {
      oshaCompliance: { score: oshaScore, label: oshaLabel, commentary: oshaComment },
      contractualSpecRigor: { score: specRigorScore, label: specRigorLabel, commentary: specRigorComment },
      subcontractorBuyIn: { score: subBuyInScore, label: subBuyInLabel, commentary: subBuyInComment },
      costLiability: { amount: costLiabilityAmount, label: costLiabilityLabel, commentary: costLiabilityComment }
    },
    impact: {
      safety: safetyDelta,
      scheduleDays: scheduleDaysDelta,
      contingencySpent: costLiabilityAmount,
      quality: qualityDelta,
      morale: moraleDelta
    },
    recommendedArtifactType: recArtifact
  };
}

/**
 * Conducts the executive post-mortem evaluation using server-side Gemini or local deterministic engine
 */
export async function evaluateSuperintendentPerformance(
  projectType: ProjectType,
  profile: SuperintendentProfile,
  stats: IronTriangleStats,
  history: DecisionRecord[]
): Promise<ExecutiveEvaluation> {
  try {
    const res = await fetch('/api/evaluation/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectType, profile, stats, history })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.evaluation) {
        return data.evaluation;
      }
    }
  } catch (err) {
    console.warn('Falling back to deterministic evaluation engine:', err);
  }

  // Robust deterministic fallback evaluator
  return computeDeterministicEvaluation(projectType, profile, stats, history);
}

function computeDeterministicEvaluation(
  projectType: ProjectType,
  profile: SuperintendentProfile,
  stats: IronTriangleStats,
  history: DecisionRecord[]
): ExecutiveEvaluation {
  const compositeScore = Math.round(
    stats.safety * 0.35 +
    stats.schedulePercent * 0.25 +
    stats.budgetPercent * 0.20 +
    stats.qualityScore * 0.20
  );

  let roleClassification = 'Field Operations Superintendent';
  let hireStatus: 'HIRE_SENIOR_LEAD' | 'HIRE_PROJECT_SUPER' | 'CONDITIONAL_TRAINING' | 'DO_NOT_HIRE' = 'HIRE_PROJECT_SUPER';
  let hireStatusLabel = 'Approved for Standard Field Assignment';

  const aggressiveChoicesCount = history.filter(h => h.chosenOption.type === 'aggressive').length;
  const collaborativeChoicesCount = history.filter(h => h.chosenOption.type === 'collaborative').length;
  const conservativeChoicesCount = history.filter(h => h.chosenOption.type === 'conservative').length;

  if (stats.safety < 50) {
    roleClassification = 'High-Risk Production Pusher (OSHA Risk)';
    hireStatus = 'DO_NOT_HIRE';
    hireStatusLabel = 'Disqualified — Unacceptable OSHA & Safety Liability Exposure';
  } else if (compositeScore >= 88 && stats.safety >= 85) {
    if (collaborativeChoicesCount >= 3) {
      roleClassification = 'Senior Field General & Technical Integrator';
      hireStatus = 'HIRE_SENIOR_LEAD';
      hireStatusLabel = 'Immediate Hire: Elite Senior Lead Superintendent';
    } else {
      roleClassification = 'Senior Lead Superintendent';
      hireStatus = 'HIRE_SENIOR_LEAD';
      hireStatusLabel = 'Top Candidate: High Command of Safety, Quality & Budget';
    }
  } else if (aggressiveChoicesCount >= 3) {
    roleClassification = 'Aggressive Fast-Tracker / High Trade Friction';
    hireStatus = 'CONDITIONAL_TRAINING';
    hireStatusLabel = 'Conditional Hire: Requires Safety & QA/QC Oversight';
  } else if (conservativeChoicesCount >= 3) {
    roleClassification = 'Risk-Averse Spec Purist';
    hireStatus = 'HIRE_PROJECT_SUPER';
    hireStatusLabel = 'Approved for Complex Technical Shells with Contingency Reserves';
  } else if (compositeScore < 60) {
    roleClassification = 'Assistant Superintendent / Field Coordinator Trainee';
    hireStatus = 'CONDITIONAL_TRAINING';
    hireStatusLabel = 'Requires 12 Months Mentorship Under General Superintendent';
  }

  // Find biggest win & hazardous tradeoff from history
  let biggestWin = {
    day: 1,
    title: 'Baseline Mobilization',
    impact: 'Established initial trade coordination without incident.'
  };

  let mostHazardousTradeoff = {
    day: 1,
    title: 'Standard Operations',
    riskExploration: 'Maintained standard operating risk envelope.'
  };

  const collabWin = history.find(h => h.chosenOption.type === 'collaborative');
  if (collabWin) {
    biggestWin = {
      day: collabWin.day,
      title: collabWin.chosenOption.actionTitle,
      impact: collabWin.chosenOption.feedback
    };
  } else {
    const consWin = history.find(h => h.chosenOption.type === 'conservative');
    if (consWin) {
      biggestWin = {
        day: consWin.day,
        title: consWin.chosenOption.actionTitle,
        impact: consWin.chosenOption.feedback
      };
    }
  }

  const riskyChoice = history.find(h => h.chosenOption.type === 'aggressive');
  if (riskyChoice) {
    mostHazardousTradeoff = {
      day: riskyChoice.day,
      title: riskyChoice.chosenOption.actionTitle,
      riskExploration: riskyChoice.chosenOption.feedback
    };
  }

  const leadershipDna = [
    stats.safety >= 80 ? 'OSHA Shield & Zero-Harm Protocol' : 'Production-First Urgency',
    collaborativeChoicesCount >= 2 ? 'Master of Trade Diplomacy & BIM Workarounds' : 'Direct Hierarchical Commander',
    stats.remainingContingency > 800000 ? 'Disciplined Fiscal Custodian' : 'Aggressive Schedule Accelerator',
    stats.qualityScore >= 80 ? 'AISC/ACI Spec Perfectionist' : 'Field Pragmatist'
  ];

  const executiveSummary = `Candidate ${profile.name} completed a 5-day high-pressure simulation on a ${projectType} project. Demonstrating an overall evaluation index of ${compositeScore}/100, ${profile.name} demonstrated ${stats.safety >= 80 ? 'uncompromising vigilance regarding site life-safety and trade coordination' : 'occasional willingness to compromise regulatory standards under schedule pressure'}. Master schedule variance concluded at ${stats.scheduleVarianceDays >= 0 ? `+${stats.scheduleVarianceDays}` : stats.scheduleVarianceDays} days with $${stats.remainingContingency.toLocaleString()} in remaining contingency.`;

  const markdownReport = `# Construction Superintendent Leadership & AI Ops Evaluation
**Candidate Name:** ${profile.name}  
**Experience Level:** ${profile.experience}  
**Assigned Project:** ${projectType}  
**Evaluator System:** SuperSim v2.0 Enterprise Engine  
**Overall Performance Rating:** ${compositeScore} / 100  
**Status:** ${hireStatusLabel}

---

### Executive Synopsis
${executiveSummary}

### Iron Triangle & Safety Compliance
- **Safety / OSHA Compliance:** ${stats.safety}% ${stats.safety < 50 ? '[FAILED - STOP-WORK TRIGGERED]' : '[PASSED]'}
- **Critical Path Schedule Variance:** ${stats.scheduleVarianceDays >= 0 ? `+${stats.scheduleVarianceDays}` : stats.scheduleVarianceDays} Days (${stats.schedulePercent}% pace)
- **Contingency Fund Retained:** $${stats.remainingContingency.toLocaleString()} (Expended: $${stats.contingencySpent.toLocaleString()})
- **Quality & Spec Audit:** ${stats.qualityScore}%
- **Trade Subcontractor Morale:** ${stats.subMorale}%

### Critical Decision Chronicle
${history.map(h => `#### Day ${h.day}: ${h.scenarioTitle}
- **Action Taken:** ${h.chosenOption.actionTitle}
- **Strategy Type:** ${h.chosenOption.strategyBadge}
- **Field Impact:** ${h.chosenOption.feedback}
- **Generated Artifact:** ${h.generatedArtifact.type} (${h.generatedArtifact.documentNumber} - ${h.generatedArtifact.title})
`).join('\n')}

### Field Leadership DNA
${leadershipDna.map(dna => `- ${dna}`).join('\n')}

---
*Report certified by General Contractor Operations Committee.*
`;

  return {
    roleClassification,
    overallRating: compositeScore,
    hireStatus,
    hireStatusLabel,
    executiveSummary,
    pillarBreakdown: {
      safetyAudit: {
        score: stats.safety,
        status: stats.safety >= 80 ? 'Exemplary Zero-Harm' : stats.safety >= 50 ? 'Compliant with Minor Findings' : 'Critical OSHA Stoppage',
        commentary: stats.safety >= 80 ? 'Maintained 100% tie-off and pro-active subcontractor safety stand-downs.' : 'Incurred hazardous exposure by cutting corners on high-altitude steel or perimeter operations.'
      },
      scheduleFloat: {
        score: stats.schedulePercent,
        status: stats.scheduleVarianceDays >= 0 ? 'Ahead of Critical Path' : 'Lagging Milestones',
        commentary: `${Math.abs(stats.scheduleVarianceDays)} days variance against contractual master schedule.`
      },
      budgetContingency: {
        score: stats.budgetPercent,
        status: stats.remainingContingency > 700000 ? 'Contingency Intact' : 'Heavy Burn Rate',
        commentary: `Preserved $${stats.remainingContingency.toLocaleString()} of initial owner contingency allowance.`
      },
      qualityMorale: {
        score: stats.qualityScore,
        status: stats.qualityScore >= 80 ? 'Architectural Distinction' : 'Punch-List Risk',
        commentary: `Trade morale index at ${stats.subMorale}%. Concrete and MEP tolerances rigorously preserved.`
      }
    },
    biggestWin,
    mostHazardousTradeoff,
    fieldLeadershipDNA: leadershipDna,
    markdownReport
  };
}
