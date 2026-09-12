export enum ProjectType {
  COMMERCIAL = 'Commercial Office Tower',
  HIGH_RISE = 'High-Rise Luxury Residential',
  INDUSTRIAL = 'Industrial Logistics Center',
  INFRASTRUCTURE = 'Highway Interchange & Bridge'
}

export type ExperienceLevel = 
  | 'Assistant Superintendent'
  | 'Lead Superintendent'
  | 'General Superintendent'
  | 'Field Operations VP';

export type RiskTolerance = 
  | 'Conservative / Safety-First'
  | 'Balanced / Standard Spec'
  | 'Aggressive Fast-Track';

export interface SuperintendentProfile {
  name: string;
  experience: ExperienceLevel;
  riskTolerance: RiskTolerance;
  avatarUrl?: string | null;
}

export interface SectorDetails {
  type: ProjectType;
  tagline: string;
  valuation: string;
  durationMonths: number;
  squareFeet: string;
  startingContingency: number;
  tradesOnSite: number;
  keyRisks: string[];
  initialFloatDays: number;
  highlightIcon: string;
  imageUrl?: string;
  aerialDroneUrl?: string;
  projectCode?: string;
}

export interface IronTriangleStats {
  safety: number; // 0-100 (<50 triggers OSHA Stop-Work Order)
  schedulePercent: number; // 0-100
  scheduleVarianceDays: number; // e.g., +1.5 days or -2.0 days
  budgetPercent: number; // 0-100
  remainingContingency: number; // e.g., $1,250,000
  contingencySpent: number; // e.g., $0
  qualityScore: number; // 0-100
  subMorale: number; // 0-100
}

export interface DayWeather {
  day: number;
  tempF: number;
  condition: 'Clear' | 'Partly Cloudy' | 'High Winds' | 'Heavy Rain' | 'Severe Thunderstorm';
  rainProbability: number;
  windMph: number;
  advisory?: string;
}

export type TacticalChoiceType = 'conservative' | 'aggressive' | 'collaborative';

export interface ScenarioOption {
  type: TacticalChoiceType;
  label: string;
  actionTitle: string;
  strategyBadge: string;
  description: string;
  impact: {
    safety: number;
    scheduleDays: number;
    contingencySpent: number;
    quality: number;
    morale: number;
  };
  feedback: string;
  tradeReaction: string;
}

export type ArtifactType = 'DAILY_LOG' | 'RFI' | 'NCR';

export interface SiteArtifact {
  type: ArtifactType;
  typeLabel: string;
  documentNumber: string;
  title: string;
  date: string;
  specSection?: string;
  author: string;
  recipient: string;
  summary: string;
  fullContent: string;
  signatures?: {
    preparedBy: string;
    reviewedBy: string;
    status: 'APPROVED' | 'PENDING_ARCHITECT' | 'ISSUED_NOTICE' | 'FILED';
  };
}

export interface Scenario {
  id: string;
  day: number;
  time: string;
  title: string;
  criticalPathTask: string;
  location: string;
  threatLevel: 'ROUTINE' | 'ELEVATED' | 'CRITICAL' | 'EMERGENCY';
  description: string;
  keyTrades: string[];
  weather: DayWeather;
  options: ScenarioOption[];
  defaultArtifactTemplate?: (option: ScenarioOption, superName: string, projectName: string) => SiteArtifact;
  imageUrl?: string;
  cctvCameraId?: string;
  cameraTelemetry?: {
    fov: string;
    zoom: string;
    gridOverlay: string;
    calloutText: string;
    inspectionTag: string;
  };
}

export interface DecisionRecord {
  day: number;
  scenarioTitle: string;
  criticalPathTask: string;
  chosenOption: ScenarioOption;
  resultingStats: IronTriangleStats;
  generatedArtifact: SiteArtifact;
}

export interface ExecutiveEvaluation {
  roleClassification: string;
  overallRating: number; // 0 - 100
  hireStatus: 'HIRE_SENIOR_LEAD' | 'HIRE_PROJECT_SUPER' | 'CONDITIONAL_TRAINING' | 'DO_NOT_HIRE';
  hireStatusLabel: string;
  executiveSummary: string;
  pillarBreakdown: {
    safetyAudit: { score: number; status: string; commentary: string };
    scheduleFloat: { score: number; status: string; commentary: string };
    budgetContingency: { score: number; status: string; commentary: string };
    qualityMorale: { score: number; status: string; commentary: string };
  };
  biggestWin: {
    day: number;
    title: string;
    impact: string;
  };
  mostHazardousTradeoff: {
    day: number;
    title: string;
    riskExploration: string;
  };
  fieldLeadershipDNA: string[];
  markdownReport: string;
}

export interface DirectiveEvaluation {
  directiveText: string;
  actionTitle: string;
  strategyBadge: string;
  feedback: string;
  tradeReaction: string;
  scores: {
    oshaCompliance: { score: number; label: string; commentary: string }; // 0-100
    contractualSpecRigor: { score: number; label: string; commentary: string }; // 0-100
    subcontractorBuyIn: { score: number; label: string; commentary: string }; // 0-100
    costLiability: { amount: number; label: string; commentary: string };
  };
  impact: {
    safety: number;
    scheduleDays: number;
    contingencySpent: number;
    quality: number;
    morale: number;
  };
  recommendedArtifactType: ArtifactType;
}

export interface EnterpriseTelemetryEvent {
  id: string;
  timestamp: string;
  platform: 'PROCORE' | 'AUTODESK_ACC' | 'SUB_SMS_DISPATCH';
  method: 'POST' | 'PATCH' | 'GET';
  endpoint: string;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  category: 'DAILY_LOG' | 'RFI' | 'NCR' | 'SAFETY_FLAG' | 'SCHEDULE_SYNC' | 'BIM_ISSUE' | 'SMS_DISPATCH';
  summary: string;
  headers: Record<string, string>;
  requestPayload: any;
  responsePayload: any;
}

export interface ProjectSitePhoto {
  id: string;
  title: string;
  category: 'Structural Steel' | 'Foundation & Concrete' | 'Facade & Glazing' | 'MEP & Rough-In' | 'Safety & QA' | 'Aerial Drone';
  url: string;
  timestamp: string;
  location: string;
  subcontractor: string;
  status: 'APPROVED' | 'REQUIRES_ACTION' | 'FLAGGED_DEFECT' | 'CRITICAL_PATH';
  notes: string;
  inspectorName: string;
}

export interface SafetyAuditItem {
  id: string;
  category: 'PPE & Fall Protection' | 'Rigging & Cranes' | 'Electrical & LOTO' | 'Excavation & Shoring' | 'Housekeeping & Egress';
  title: string;
  standard: string;
  status: 'COMPLIANT' | 'WARNING' | 'VIOLATION';
  notes: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'LIFE_SAFETY';
}

export interface SimulationState {
  currentScreen: 'setup' | 'sim' | 'evaluation';
  setupStep: 1 | 2 | 3;
  projectType: ProjectType;
  profile: SuperintendentProfile;
  currentDay: number;
  stats: IronTriangleStats;
  weatherHistory: DayWeather[];
  history: DecisionRecord[];
  activeScenario: Scenario | null;
  activeFeedback: {
    option: ScenarioOption;
    artifact: SiteArtifact;
    isOshaStopWork: boolean;
  } | null;
  isOshaStopWorkModalOpen: boolean;
  evaluation: ExecutiveEvaluation | null;
  isLoadingAI: boolean;
  aiStatusMessage: string;
}
