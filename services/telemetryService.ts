import { 
  EnterpriseTelemetryEvent, 
  ScenarioOption, 
  SiteArtifact, 
  ProjectType, 
  SuperintendentProfile, 
  IronTriangleStats, 
  Scenario 
} from '../types';

let eventCounter = 1000;

export function createInitialTelemetry(
  projectType: ProjectType,
  profile: SuperintendentProfile
): EnterpriseTelemetryEvent[] {
  const now = new Date();
  const baseTime = (offsetSec: number) => {
    const d = new Date(now.getTime() - offsetSec * 1000);
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  };

  return [
    {
      id: `tx_prc_${++eventCounter}`,
      timestamp: baseTime(320),
      platform: 'PROCORE',
      method: 'GET',
      endpoint: 'https://api.procore.com/rest/v1.0/projects/84920/manifest',
      statusCode: 200,
      statusText: 'OK',
      latencyMs: 142,
      category: 'SCHEDULE_SYNC',
      summary: `Procore Project Hub Connected: Verified job #${projectType.slice(0, 12)} active roster`,
      headers: {
        'Authorization': 'Bearer prc_prod_live_839210482910',
        'Procore-Company-Id': '84920',
        'X-Client-Version': 'SuperSim-FieldOps-v2.6',
        'Content-Type': 'application/json'
      },
      requestPayload: {
        company_id: 84920,
        project_id: 'PRJ-2026-HQ',
        lead_superintendent: profile.name,
        operational_tier: profile.experience,
        sync_mode: 'BI_DIRECTIONAL_WEBHOOK'
      },
      responsePayload: {
        status: 'CONNECTED',
        project_name: projectType,
        server_region: 'us-east-1',
        active_rfis_count: 14,
        open_observations: 2,
        master_schedule_source: 'Primavera_P6_Cloud_XML'
      }
    },
    {
      id: `tx_acc_${++eventCounter}`,
      timestamp: baseTime(180),
      platform: 'AUTODESK_ACC',
      method: 'POST',
      endpoint: 'https://developer.api.autodesk.com/bim360/clash/v1/containers/acc-corp-8492/handshake',
      statusCode: 201,
      statusText: 'Created',
      latencyMs: 119,
      category: 'RFI',
      summary: 'Autodesk Construction Cloud: BIM 360 Coordination Model Mesh Synchronized',
      headers: {
        'Authorization': 'Bearer acc_oauth2_live_token_7482910384',
        'x-user-id': `usr_acc_${profile.name.toLowerCase().replace(/\s+/g, '_')}`,
        'Content-Type': 'application/json'
      },
      requestPayload: {
        federated_model_urn: 'urn:adsk.wipprod:fs.file:vf.84928172901?version=4',
        target_discipline: 'Structural_MEP_Combined_v14',
        clash_tolerance_inches: 0.5,
        field_lead_contact: profile.name
      },
      responsePayload: {
        handshake_status: 'SYNCHRONIZED',
        container_id: 'acc-corp-8492',
        clash_test_run_id: 'clash_run_9921',
        spatial_reference: 'State Plane Coordinate System NAD83'
      }
    },
    {
      id: `tx_sms_${++eventCounter}`,
      timestamp: baseTime(60),
      platform: 'SUB_SMS_DISPATCH',
      method: 'POST',
      endpoint: 'https://api.twilio.com/2010-04-01/Accounts/AC849204810294/Messages.json',
      statusCode: 201,
      statusText: 'Created',
      latencyMs: 84,
      category: 'SMS_DISPATCH',
      summary: 'Twilio SMS Dispatch: Broadcast Shift Plan to Lead Trade Foremen',
      headers: {
        'Authorization': 'Basic QUM4NDkyMDQ4MTAyOTQ6c2VjcmV0X2F1dGhfdG9rZW4=',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Service-Tier': 'Twilio-Enterprise-FieldOps'
      },
      requestPayload: {
        from: '+1 (555) 839-4401 (SuperSim Field Dispatch)',
        to_roster: ['Framing Foreman (+1 555-492-0192)', 'Steel Erectors (+1 555-839-2201)', 'MEP Lead (+1 555-302-8812)'],
        body: `[JOB ALERT] Day 1 Shift: Superintendent ${profile.name} on deck. All crane picks and hot work permits active. Channel 4 for radio comms.`,
        status_callback: 'https://supersim.internal/webhooks/sms/delivery-receipt'
      },
      responsePayload: {
        sid: 'SM849204820194820104820194',
        status: 'delivered',
        num_segments: 1,
        date_sent: new Date().toISOString(),
        direction: 'outbound-api',
        subcontractor_receipts: 3
      }
    }
  ];
}

/**
 * Generates simulated Procore & Autodesk ACC webhook transactions triggered by a field decision
 */
export function generateDecisionTelemetry(
  day: number,
  scenario: Scenario,
  option: ScenarioOption,
  artifact: SiteArtifact,
  stats: IronTriangleStats,
  profile: SuperintendentProfile,
  projectType: ProjectType
): EnterpriseTelemetryEvent[] {
  const events: EnterpriseTelemetryEvent[] = [];
  const now = new Date();
  const formatTime = () => now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

  // 1. Procore Daily Log Push
  events.push({
    id: `tx_prc_${++eventCounter}`,
    timestamp: formatTime(),
    platform: 'PROCORE',
    method: 'POST',
    endpoint: `https://api.procore.com/rest/v1.0/projects/84920/daily_logs`,
    statusCode: 201,
    statusText: 'Created',
    latencyMs: Math.floor(95 + Math.random() * 60),
    category: 'DAILY_LOG',
    summary: `Procore Daily Log Synced: Day ${day} Shift Notes & Manpower Logged`,
    headers: {
      'Authorization': 'Bearer prc_prod_live_839210482910',
      'Procore-Company-Id': '84920',
      'Content-Type': 'application/json',
      'X-Origin-Device': 'Handheld-Super-Toughbook-Field'
    },
    requestPayload: {
      daily_log: {
        date: `2026-09-${14 + day}`,
        day_of_week: `Day ${day} Shift`,
        superintendent: profile.name,
        critical_path_milestone: scenario.criticalPathTask,
        action_executed: option.actionTitle,
        strategy_badge: option.strategyBadge,
        weather_conditions: {
          temp_f: scenario.weather.tempF,
          condition: scenario.weather.condition,
          wind_mph: scenario.weather.windMph,
          impact_on_schedule: scenario.weather.windMph > 25 ? 'High Wind Hold Potential' : 'Compliant'
        },
        active_subcontractors: scenario.keyTrades.map(t => ({
          trade_name: t,
          status: 'Active on Site',
          trade_friction_index: stats.subMorale
        })),
        superintendent_field_notes: option.feedback
      }
    },
    responsePayload: {
      daily_log_id: 994000 + day * 10 + Math.floor(Math.random() * 9),
      status: 'PUBLISHED_TO_PROJECT_LEDGER',
      procore_web_url: `https://app.procore.com/84920/project/daily_log/show/${994000 + day * 10}`,
      notified_roles: ['Project Manager', 'Safety Director', 'Lead Engineer']
    }
  });

  // 2. Specific Document Generation (RFI, NCR, or BIM Coordination)
  if (artifact.type === 'RFI') {
    events.push({
      id: `tx_prc_${++eventCounter}`,
      timestamp: formatTime(),
      platform: 'PROCORE',
      method: 'POST',
      endpoint: `https://api.procore.com/rest/v1.0/projects/84920/rfis`,
      statusCode: 201,
      statusText: 'Created',
      latencyMs: Math.floor(130 + Math.random() * 50),
      category: 'RFI',
      summary: `Procore RFI Created: #${artifact.documentNumber} "${artifact.title}"`,
      headers: {
        'Authorization': 'Bearer prc_prod_live_839210482910',
        'Procore-Company-Id': '84920',
        'Content-Type': 'application/json'
      },
      requestPayload: {
        rfi: {
          number: artifact.documentNumber,
          subject: artifact.title,
          status: 'Open - Pending EOR Review',
          priority: option.impact.scheduleDays < 0 ? 'High / Critical Path Delay' : 'Standard',
          spec_section: artifact.specSection || '05 12 00 - Structural Steel',
          question: artifact.summary,
          ball_in_court_role: 'Engineer of Record',
          due_date: 'Within 48 Hours',
          cost_impact: option.impact.contingencySpent > 0 ? `$${option.impact.contingencySpent}` : 'TBD'
        }
      },
      responsePayload: {
        rfi_id: 482910,
        rfi_number: artifact.documentNumber,
        status: 'ISSUED_TO_CONSULTANTS',
        auto_distribution_list: ['structural.eor@spec-eng.com', 'pm.field@generalcontractor.com']
      }
    });
  } else if (artifact.type === 'NCR') {
    events.push({
      id: `tx_acc_${++eventCounter}`,
      timestamp: formatTime(),
      platform: 'AUTODESK_ACC',
      method: 'POST',
      endpoint: `https://developer.api.autodesk.com/construction/issues/v1/projects/b.84920/issues`,
      statusCode: 201,
      statusText: 'Created',
      latencyMs: Math.floor(120 + Math.random() * 45),
      category: 'NCR',
      summary: `Autodesk ACC Issue Flagged: Non-Conformance Notice #${artifact.documentNumber}`,
      headers: {
        'Authorization': 'Bearer acc_oauth2_live_token_7482910384',
        'Content-Type': 'application/json'
      },
      requestPayload: {
        issue_type: 'QUALITY_NON_CONFORMANCE',
        title: artifact.title,
        description: artifact.summary,
        status: 'Open',
        assigned_to_subcontractor: scenario.keyTrades[0] || 'Lead Trade Sub',
        root_cause: 'Field Deviation / Unapproved Fast-Tracking',
        corrective_action_deadline: 'Immediate - Before Subsequent Work Over-Cover',
        quality_score_delta: `${option.impact.quality}%`
      },
      responsePayload: {
        issue_id: `acc_issue_${Math.floor(10000 + Math.random() * 90000)}`,
        issue_number: artifact.documentNumber,
        status: 'OPEN_NON_CONFORMANCE',
        attached_bim_guid: 'f9a8b2c4-11e4-4d82-8410-b98a18374920'
      }
    });
  }

  // 3. Safety / OSHA Observation (if safety dipped or option was aggressive)
  if (option.impact.safety < 0 || stats.safety < 65) {
    events.push({
      id: `tx_prc_${++eventCounter}`,
      timestamp: formatTime(),
      platform: 'PROCORE',
      method: 'POST',
      endpoint: `https://api.procore.com/rest/v1.0/projects/84920/observations`,
      statusCode: stats.safety < 50 ? 422 : 201,
      statusText: stats.safety < 50 ? 'Unprocessable Entity (OSHA Risk)' : 'Created',
      latencyMs: Math.floor(105 + Math.random() * 40),
      category: 'SAFETY_FLAG',
      summary: stats.safety < 50 
        ? 'PROCORE SAFETY ALERT: Site OSHA Score Dropped Below 50% Zero-Tolerance' 
        : `Procore Safety Observation Filed: Hazard Assessment on ${scenario.criticalPathTask}`,
      headers: {
        'Authorization': 'Bearer prc_prod_live_839210482910',
        'Procore-Company-Id': '84920',
        'X-Safety-Priority': stats.safety < 50 ? 'STOP_WORK_ORDER' : 'ELEVATED_WATCH'
      },
      requestPayload: {
        observation: {
          category: 'Safety & OSHA Compliance',
          observation_type: stats.safety < 50 ? 'IMMINENT_DANGER_FLAG' : 'HAZARD_IDENTIFICATION',
          subcontractors_involved: scenario.keyTrades,
          hazard_description: option.description,
          current_safety_score: stats.safety,
          stop_work_warranted: stats.safety < 50,
          superintendent_in_command: profile.name
        }
      },
      responsePayload: {
        observation_id: 8849201,
        osha_notification_dispatched: stats.safety < 50,
        safety_director_alert: stats.safety < 50 ? 'ESCALATED_TO_VP_FIELD_OPS' : 'LOGGED_IN_SITE_REPORTS'
      }
    });
  }

  // 4. Autodesk ACC Cost / Schedule Potential Change Order (PCO) sync
  if (option.impact.contingencySpent > 0 || Math.abs(option.impact.scheduleDays) > 0.5) {
    events.push({
      id: `tx_acc_${++eventCounter}`,
      timestamp: formatTime(),
      platform: 'AUTODESK_ACC',
      method: 'PATCH',
      endpoint: `https://developer.api.autodesk.com/cost/v1/containers/acc-84920/potential-change-orders`,
      statusCode: 200,
      statusText: 'OK',
      latencyMs: Math.floor(140 + Math.random() * 50),
      category: 'SCHEDULE_SYNC',
      summary: `ACC Cost Engine: PCO #${100 + day} Contingency Burn $${option.impact.contingencySpent.toLocaleString()}`,
      headers: {
        'Authorization': 'Bearer acc_oauth2_live_token_7482910384',
        'Content-Type': 'application/json'
      },
      requestPayload: {
        pco_number: `PCO-0${day}`,
        title: `Field Dilemma Mitigation: ${scenario.title}`,
        cost_impact_amount: option.impact.contingencySpent,
        remaining_project_contingency: stats.remainingContingency,
        schedule_float_delta_days: option.impact.scheduleDays,
        approval_status: 'Field_Super_Authorized'
      },
      responsePayload: {
        pco_status: 'COMMITTED_TO_BUDGET_LOG',
        contingency_balance_verified: true,
        variance_tracking_updated: true
      }
    });
  }

  // 5. Automated Subcontractor SMS Dispatch (Twilio / Field Radio Bridge)
  const leadTrade = scenario.keyTrades[0] || 'Framing Foreman';
  events.push({
    id: `tx_sms_${++eventCounter}`,
    timestamp: formatTime(),
    platform: 'SUB_SMS_DISPATCH',
    method: 'POST',
    endpoint: `https://api.twilio.com/2010-04-01/Accounts/AC849204810294/Messages.json`,
    statusCode: 201,
    statusText: 'Created',
    latencyMs: Math.floor(75 + Math.random() * 35),
    category: 'SMS_DISPATCH',
    summary: `Twilio SMS Dispatch: Field Directive to ${leadTrade} (${option.strategyBadge})`,
    headers: {
      'Authorization': 'Basic QUM4NDkyMDQ4MTAyOTQ6c2VjcmV0X2F1dGhfdG9rZW4=',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Twilio-MessagingServiceSid': 'MG4829104820194'
    },
    requestPayload: {
      From: '+1 (555) 839-4401 (GC Field Ops)',
      To: `+1 (555) 492-0192 (${leadTrade})`,
      Body: `[GC DIRECTIVE - DAY ${day}] Super ${profile.name}: "${option.actionTitle}". ${option.feedback.slice(0, 110)}... Artifact logged: ${artifact.type} #${artifact.documentNumber}. Acknowledge on Ch 4.`,
      StatusCallback: 'https://supersim.internal/webhooks/sms/delivered'
    },
    responsePayload: {
      sid: `SM${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      date_created: new Date().toISOString(),
      to: `+15554920192 (${leadTrade})`,
      from: '+15558394401',
      status: 'queued_for_delivery',
      carrier_route: 'Verizon_Enterprise_Direct',
      error_code: null
    }
  });

  return events;
}
