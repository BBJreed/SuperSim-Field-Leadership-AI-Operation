import { 
  ProjectType, 
  Scenario, 
  SectorDetails, 
  SiteArtifact, 
  ScenarioOption,
  DayWeather 
} from '../types';

export const SECTOR_CONFIGS: Record<ProjectType, SectorDetails> = {
  [ProjectType.COMMERCIAL]: {
    type: ProjectType.COMMERCIAL,
    tagline: 'Class-A 18-Story Steel & Glass Commercial HQ',
    valuation: '$52,500,000',
    durationMonths: 18,
    squareFeet: '385,000 RSF',
    startingContingency: 1250000,
    tradesOnSite: 16,
    keyRisks: ['Tight Urban Staging', 'Curtain Wall Wind Loads', 'Liquidated Damages ($12k/day)'],
    initialFloatDays: 2.5,
    highlightIcon: 'Building2',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    aerialDroneUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    projectCode: 'JOB-2026-HQ-COMM'
  },
  [ProjectType.HIGH_RISE]: {
    type: ProjectType.HIGH_RISE,
    tagline: '42-Story Post-Tensioned Concrete Luxury Tower',
    valuation: '$118,000,000',
    durationMonths: 28,
    squareFeet: '640,000 GSF',
    startingContingency: 2400000,
    tradesOnSite: 22,
    keyRisks: ['Tower Crane Wind Shutdowns', 'Vertical Logistics & Hoists', 'Post-Tension Cable Stressing Safety'],
    initialFloatDays: 1.5,
    highlightIcon: 'Building',
    imageUrl: 'https://images.unsplash.com/photo-1504307651554-66914ee56a38?auto=format&fit=crop&w=1200&q=80',
    aerialDroneUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    projectCode: 'JOB-2026-TOWER-HR'
  },
  [ProjectType.INDUSTRIAL]: {
    type: ProjectType.INDUSTRIAL,
    tagline: '875,000 SF E-Commerce Logistics Facility & Cold Storage',
    valuation: '$68,000,000',
    durationMonths: 14,
    squareFeet: '875,000 SF Footprint',
    startingContingency: 950000,
    tradesOnSite: 12,
    keyRisks: ['Subgrade Soil Settlement', 'Tilt-Up Panel Erection Rigging', 'Super-Flat Floor Tolerances (FF/FL 50)'],
    initialFloatDays: 3.0,
    highlightIcon: 'Warehouse',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    aerialDroneUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    projectCode: 'JOB-2026-DIST-LOG'
  },
  [ProjectType.INFRASTRUCTURE]: {
    type: ProjectType.INFRASTRUCTURE,
    tagline: 'Twin Viaduct Highway Overpass & Retaining Wall Complex',
    valuation: '$94,000,000',
    durationMonths: 24,
    squareFeet: '1.8 Miles Civil Corridor',
    startingContingency: 1850000,
    tradesOnSite: 14,
    keyRisks: ['Public Traffic Lane Closures', 'Deep Caisson Drilling Water Table', 'State DOT Stringent Quality Penalties'],
    initialFloatDays: 2.0,
    highlightIcon: 'Construction',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    aerialDroneUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    projectCode: 'JOB-2026-DOT-CIVIL'
  }
};

export const DEFAULT_WEATHER_FORECAST: DayWeather[] = [
  { day: 1, tempF: 68, condition: 'Clear', rainProbability: 5, windMph: 8, advisory: 'Optimal field temperature for concrete and survey optics.' },
  { day: 2, tempF: 72, condition: 'Partly Cloudy', rainProbability: 15, windMph: 12, advisory: 'Mild conditions; interior rough-in and deliveries proceeding.' },
  { day: 3, tempF: 65, condition: 'Heavy Rain', rainProbability: 90, windMph: 24, advisory: 'Severe weather alert: Squall line arriving midday with 1.5" rain/hr.' },
  { day: 4, tempF: 58, condition: 'High Winds', rainProbability: 25, windMph: 32, advisory: 'High wind advisory: Gusts exceeding 30 mph threshold for crane hoists.' },
  { day: 5, tempF: 70, condition: 'Clear', rainProbability: 10, windMph: 9, advisory: 'Dry and calm conditions; ideal for final commissioning and owner review.' }
];

export function getSectorScenarios(sector: ProjectType): Scenario[] {
  return [
    // DAY 1: Foundation / Tolerances
    {
      id: 'day-1-foundation',
      day: 1,
      time: '07:15 AM',
      title: 'Foundation Anchor Bolt Deviation vs. Structural Steel Mobilization',
      criticalPathTask: 'Erect Tier 1 Structural Steel Columns (Gridline C4-F8)',
      location: 'Substructure Mat Foundation — Sector B Anchor Group',
      threatLevel: 'CRITICAL',
      imageUrl: 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?auto=format&fit=crop&w=1200&q=80',
      cctvCameraId: 'CAM-01 [MAT FOUNDATION PIT & CRANE HOOK]',
      cameraTelemetry: {
        fov: '92° WIDE',
        zoom: '1.8x OPTICAL',
        gridOverlay: 'GRIDLINE C4-F8 / ANCHOR GROUP B-4',
        calloutText: 'AISC TOLERANCE BREACH: +7/8" LATERAL OFFSET DETECTED',
        inspectionTag: 'FOUNDATION MAT • ANCHOR BOLTS'
      },
      description: 'The survey crew just flagged that four 1-1/2" anchor bolts for the critical corner column on Gridline C4 are 1-1/4" out of plumb and shifted 7/8" off centerline, exceeding AISC Code of Standard Practice allowable tolerance (±1/4"). Outside the gate, four flatbed tractor-trailers carrying 80 tons of fabricated columns have arrived, and the 250-ton lattice boom crane is mobilized at $4,800/hour.',
      keyTrades: ['Ironworkers Local 40', 'Structural Steel Fabricator', 'Foundation Concrete Sub (MatCon)', 'Third-Party Testing Lab'],
      weather: DEFAULT_WEATHER_FORECAST[0],
      options: [
        {
          type: 'conservative',
          label: 'Option A: Halt Column Erection & Issue Emergency RFI to Structural EOR',
          actionTitle: 'Halt Erection & Await Engineer-of-Record Approved Repair',
          strategyBadge: 'Conservative / Safety & Spec First',
          description: 'Refuse to set the steel column. Detain or turn away steel trucks, send crane into standby, and require the concrete trade and EOR to issue a certified welded plate or drill-and-epoxy Hilti anchor detail.',
          impact: {
            safety: 5,
            scheduleDays: -1.5,
            contingencySpent: 38000,
            quality: 8,
            morale: -6
          },
          feedback: 'EOR commends your strict compliance with AISC standards. However, steel trucks incurred $8,500 in standby demurrage, and crane standby burned $18,000. Critical path lost 1.5 days awaiting epoxy pull-test sign-off.',
          tradeReaction: 'Steel erector super grumbles about crane standby costs, but QA/QC inspector notes that avoiding an unapproved field-welded bodge prevented catastrophic shear failure liability.'
        },
        {
          type: 'aggressive',
          label: 'Option B: Torch-Slot the Column Baseplate and Set Immediately',
          actionTitle: 'Flame-Cut Baseplate Holes On Site & Fast-Track Erection',
          strategyBadge: 'Aggressive Fast-Track',
          description: 'Instruct ironworkers to oxy-acetylene torch slot the 2-inch baseplate holes to fit over the misaligned bolts. Set the column immediately to keep the crane moving and avoid demurrage penalties.',
          impact: {
            safety: -18,
            scheduleDays: 0.5,
            contingencySpent: 4500,
            quality: -22,
            morale: 4
          },
          feedback: 'Columns set on schedule and the crane was fully utilized. However, the special deputy inspector immediately photographed the torch-slotted plate and red-tagged the connection for structural non-compliance.',
          tradeReaction: 'The ironworkers praised your hustle on day one, but the City Building Official has threatened a formal audit of all foundation connections.'
        },
        {
          type: 'collaborative',
          label: 'Option C: AI-Assisted Sequence Flip + Field Plate Reinforcement Coordination',
          actionTitle: 'Pivot Crane to Gridline F and Mobilize Rapid EOR Field Mod Detail',
          strategyBadge: 'Collaborative / Tactical Sequence Workaround',
          description: 'Immediately reroute the crane hook to start with Gridline F columns (which surveyed 100% compliant). Simultaneously, video-call the EOR with 3D laser scan data to approve an engineered structural washer plate with ultrasonic testing.',
          impact: {
            safety: 3,
            scheduleDays: 0,
            contingencySpent: 11000,
            quality: 4,
            morale: 7
          },
          feedback: 'The crane never stopped picking steel. The EOR stamped the heavy washer plate retrofit within 3 hours. Both steel and foundation trades appreciated your calm sequencing under pressure.',
          tradeReaction: 'Both trade foremen celebrated: "That’s how a real superintendent runs a site. Kept the iron moving without breaking the spec."'
        }
      ],
      defaultArtifactTemplate: (opt, superName, projName) => {
        if (opt.type === 'conservative') {
          return {
            type: 'RFI',
            typeLabel: 'Request For Information (Urgent)',
            documentNumber: 'RFI-0012-STR',
            title: 'Foundation Anchor Bolt Deviation — Gridline C4 Column Base Detail',
            date: 'Day 1 — 08:30 EST',
            specSection: 'Spec 05 12 00: Structural Steel Framing / AISC 303-16',
            author: superName,
            recipient: 'Lead Structural Engineer of Record (SEOR)',
            summary: 'Formal notice of 7/8-inch anchor bolt deviation on Gridline C4. Proposes drill-and-epoxy Hilti HAS-V-36 anchor retrofit or certified welded shim plate.',
            fullContent: `PROJECT: ${projName}
DOCUMENT: RFI-0012-STR (CRITICAL PATH PRIORITY)
FROM: ${superName}, Lead Superintendent
TO: Thornton & Partners Structural Engineers (SEOR)
SUBJECT: Gridline C4 Out-of-Tolerance Anchor Bolts

DESCRIPTION OF CONDITION:
During Day 1 morning survey verification, Anchor Bolt Group B-4 at Gridline C4 was found to exceed allowable tolerances specified in AISC Code of Standard Practice Section 7.5.
- Centerline offset: 0.875 inches North
- Plumbness deviation: 1.25 inches over 18 inches projection
- Column Baseplate Mark: C-01 (4" thick A572 Gr. 50)

PROPOSED CONTRACTOR RESOLUTION:
Option 1: Weld 1.5" A572 Gr. 50 structural plate washer over oversized hole and grind flat.
Option 2: Core drill 4x #8 Hilti HIT-RE 500 V3 post-installed adhesive anchors with 24-hour cure.

IMPACT ASSESSMENT:
- Cost: T&M field work estimated at $12,500
- Schedule: 24-hour epoxy pull testing hold on Column C-01

STATUS: SUBMITTED FOR IMMEDIATE ARCHITECT/EOR REVIEW`
          };
        } else if (opt.type === 'aggressive') {
          return {
            type: 'NCR',
            typeLabel: 'Non-Conformance Report (Pending Notice)',
            documentNumber: 'NCR-001-QA',
            title: 'Unauthorized Torch Modification of Column Baseplate C-01',
            date: 'Day 1 — 11:45 EST',
            specSection: 'Spec 05 12 00 / AWS D1.1 Structural Welding Code',
            author: 'Special Deputy Inspector (Third-Party QA)',
            recipient: `${superName}, General Contractor Field Ops`,
            summary: 'Non-conformance filed for unapproved thermal cutting of bolt holes in Grade 50 structural baseplate without engineer written authorization.',
            fullContent: `NON-CONFORMANCE REPORT: NCR-001-QA
PROJECT: ${projName}
LOCATION: Gridline C4 Baseplate
SUB: Vertex Steel Erectors LLC

DEFICIENCY OBSERVED:
Field modifications using oxy-fuel torch were observed enlarging 1-3/4" bolt holes to approximately 2-7/8" slotted configuration. No pre-heat was conducted; edge distance violation noted (< 1.5x bolt diameter).

CODE VIOLATIONS:
1. AISC 360-16 Chapter M, Section M2.5
2. Project Structural General Notes Sheet S-001 Note 14B

REQUIRED CORRECTIVE ACTION:
1. Cease welding/grouting of baseplate immediately.
2. Magnetic Particle Examination (MT) of all cut edges for micro-fissures.
3. Submit formal structural repair procedure to Engineer of Record within 48 hours.

ISSUED BY: Certified Welding Inspector #49281`
          };
        } else {
          return {
            type: 'DAILY_LOG',
            typeLabel: 'Superintendent Daily Operations Log',
            documentNumber: 'DLOG-DAY-01',
            title: 'Daily Field Log: Steel Mobilization & Dynamic Sequence Reroute',
            date: 'Day 1 — 17:00 EST',
            author: superName,
            recipient: 'Project Executive & Operations File',
            summary: '84 tradesmen on site. Zero safety incidents. Successfully pivoted steel erection to Gridline F while resolving C4 anchor deviation via EOR-approved reinforced washer plate.',
            fullContent: `DAILY CONSTRUCTION REPORT: DAY 1
PROJECT: ${projName}
SUPERINTENDENT: ${superName}
WEATHER: 68°F, Clear, Wind: 8 mph

MANPOWER HEADCOUNT:
- Ironworkers: 24 (Hook time: 7.2 hrs)
- Concrete/Foundation: 18 (Grout prep & layout)
- MEP Layout: 16 (Under-slab sleeves)
- Earthwork/Logistics: 14 (Gate control & laydown)
- GC Field Staff: 12

SIGNIFICANT FIELD EVENTS:
1. 07:15 - Survey detected 7/8" anchor variance on Gridline C4.
2. 07:45 - Implemented Tactical Pivot: Directed 250T crane to Gridline F. Steel erection proceeded without crane idle time.
3. 10:30 - Video conference with EOR. High-resolution point cloud scan transmitted.
4. 14:00 - Formal engineering sketch SK-S01 issued approving 1-1/2" Grade 50 washer plate with 100% UT testing.
5. 16:30 - Total steel erected: 14 columns, 8 spandrel girders. Schedule preserved.`
          };
        }
      }
    },

    // DAY 2: MEP Rough-in vs. Drywall Stacking
    {
      id: 'day-2-mep-drywall',
      day: 2,
      time: '09:30 AM',
      title: 'Drywall Board Stacking vs. Unsigned MEP In-Wall Rough-In',
      criticalPathTask: 'Corridor B Wall Close-In & Level 3 Finishes',
      location: 'Level 3 — Main Patient/Tenant Corridor & Core Risers',
      threatLevel: 'ELEVATED',
      imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      cctvCameraId: 'CAM-03 [LEVEL 3 CORRIDOR B IN-WALL RISER]',
      cameraTelemetry: {
        fov: '78° CORRIDOR',
        zoom: '1.2x OPTICAL',
        gridOverlay: 'LEVEL 3 RISER CAVITY / ELEC-04',
        calloutText: 'HOLD POINT ACTIVE: 4X UNINSPECTED CONDUIT BOXES DETECTED',
        inspectionTag: 'MEP ROUGH-IN • IN-WALL CLOSE-IN'
      },
      description: 'The drywall framing sub has stacked 350 sheets of Type X gypsum board in Corridor B and has 18 drywall tapers standing by. The drywall foreman insists on boarding one side of the corridor immediately to hit their weekly milestone. However, the municipal electrical inspector was delayed in traffic, and four critical conduit junction boxes and fire-alarm pull homerun conduits inside the wall cavity lack signed inspection tags.',
      keyTrades: ['Drywall & Acoustic (Tri-State)', 'Electrical Contractor (AmpCore)', 'Fire Alarm Specialty Sub', 'City Building Inspector'],
      weather: DEFAULT_WEATHER_FORECAST[1],
      options: [
        {
          type: 'conservative',
          label: 'Option A: Strictly Enforce No-Board Policy Until Green Inspection Tags on Wall',
          actionTitle: 'Lock Down Walls; Hold Drywall Until In-Wall Inspection Signs Off',
          strategyBadge: 'Conservative / Zero Rework Tolerance',
          description: 'Issue a strict field directive forbidding any board from going up. Direct the drywall trade to move their crew to exterior soffits or frame partition headers in an uninspected zone.',
          impact: {
            safety: 3,
            scheduleDays: -0.5,
            contingencySpent: 6000,
            quality: 7,
            morale: -4
          },
          feedback: 'Inspector arrived at 2:00 PM and signed off cleanly. No concealed defects. The drywall sub complained about moving material twice, but avoided $45,000 in destructive wall-teardown risk.',
          tradeReaction: 'Drywall foreman was agitated initially, but admitted after the inspector checked every single box: "You saved my butt from having to cut inspection windows in fresh board."'
        },
        {
          type: 'aggressive',
          label: 'Option B: Allow One-Side Boarding to Keep Tapers Productive',
          actionTitle: 'Hang Single Side Board & Hope Inspector Inspects from Open Side',
          strategyBadge: 'Aggressive Fast-Track',
          description: 'Permit the drywallers to board the north wall of Corridor B, leaving only the south side open for the inspector. Bet that the inspector accepts viewing conduits through the single-sided opening.',
          impact: {
            safety: -6,
            scheduleDays: 0.5,
            contingencySpent: 18000,
            quality: -15,
            morale: 2
          },
          feedback: 'The municipal inspector arrived, became furious that sightlines were blocked on deep junction boxes, failed the corridor, and ordered 40 feet of newly hung drywall ripped down for visual verification.',
          tradeReaction: 'Electrical sub blamed drywall for rushing; drywall blamed electrical for delayed rough-in. Trade coordination meeting became contentious.'
        },
        {
          type: 'collaborative',
          label: 'Option C: AI Video Documentation Walk + High-Priority Inspector Expediting',
          actionTitle: 'Execute 360° BIM Reality-Capture + Coordinate Inspector Route',
          strategyBadge: 'Collaborative / AI Reality Capture',
          description: 'Conduct an immediate 360-degree LiDAR and photo walkthrough of every junction box with the electrical foreman, tagging it to the BIM model. Call the chief city inspector to submit timestamped visual QA, and redirect drywall to Level 4 perimeter framing.',
          impact: {
            safety: 2,
            scheduleDays: 0,
            contingencySpent: 2500,
            quality: 5,
            morale: 6
          },
          feedback: 'The inspector reviewed the geotagged 360° cloud capture on arrival, verified high-resolution box details in 10 minutes, and stamped the green tags. Drywall hung board without a single rework cut.',
          tradeReaction: 'City inspector noted: "Best documentation I have seen on any job this quarter. Fast-tracked your sign-off."'
        }
      ],
      defaultArtifactTemplate: (opt, superName, projName) => {
        if (opt.type === 'conservative') {
          return {
            type: 'DAILY_LOG',
            typeLabel: 'Superintendent Field Directive Log',
            documentNumber: 'FD-002-QC',
            title: 'Field Directive: Hold-Point Enforced for Corridor In-Wall Inspections',
            date: 'Day 2 — 10:15 EST',
            author: superName,
            recipient: 'Tri-State Drywall & AmpCore Electrical',
            summary: 'Enforced formal hold-point 14A. No gypsum board placement permitted until municipal mechanical, electrical, and plumbing rough-in sign-offs are in place.',
            fullContent: `PROJECT: ${projName}
DIRECTIVE: FD-002-QC (QUALITY CONTROL MANDATORY HOLD-POINT)
ISSUED BY: ${superName}, Lead Superintendent
AFFECTED TRADES: Drywall / Electrical / Fire Alarm

ORDER:
1. No gypsum board or sound insulation shall be installed on Level 3 Corridor B until signed municipal rough-in tags are physically affixed to the framing.
2. Drywall crew is redirected to Level 4 exterior soffit framing (Work Order 22-A).
3. Any board installed prior to sign-off will be subject to removal at subcontractor sole expense.`
          };
        } else if (opt.type === 'aggressive') {
          return {
            type: 'NCR',
            typeLabel: 'Non-Conformance Report (Municipal Violation)',
            documentNumber: 'NCR-002-CITY',
            title: 'Premature Wall Concealment Prior to Electrical Inspection Sign-off',
            date: 'Day 2 — 15:45 EST',
            specSection: 'NEC Article 300.22 / City Building Code Sec 107',
            author: 'Chief Municipal Electrical Inspector',
            recipient: `${superName} (General Contractor)`,
            summary: 'City inspector issued formal stop-work on drywall installation on Level 3 due to premature concealment of electrical feeders without inspection.',
            fullContent: `MUNICIPAL INSPECTION BUREAU: NOTICE OF DEFICIENCY
PROJECT: ${projName}
LOCATION: Level 3 Corridor B East
PERMIT #: BLD-2026-9812

VIOLATION DESCRIPTION:
Contractor commenced hanging 5/8" Type X drywall covering 4x high-voltage junction boxes and Class-1 fire alarm conduits prior to required rough-in verification.

ORDER:
Remove 8 panels (256 SF) of gypsum board on Corridor B North wall to expose conduit sweeps and box bonding bushings. Re-inspection fee of $450 assessed.`
          };
        } else {
          return {
            type: 'DAILY_LOG',
            typeLabel: 'Daily BIM/Reality Capture Log',
            documentNumber: 'DLOG-DAY-02',
            title: 'Daily Field Log: 360° LiDAR Pre-Drywall Milestone Verification',
            date: 'Day 2 — 17:00 EST',
            author: superName,
            recipient: 'Owner QA/QC Representative & Project File',
            summary: 'Completed 100% pre-cover digital twin record of Level 3 MEP systems. Municipal inspector approved rough-in with zero destructive testing.',
            fullContent: `DAILY CONSTRUCTION REPORT: DAY 2
PROJECT: ${projName}
SUPERINTENDENT: ${superName}
WEATHER: 72°F, Partly Cloudy, Calm

FIELD SUMMARY:
- 100% digital pre-pour & pre-cover photogrammetry capture uploaded to BIM coordinate system.
- Corridor B in-wall electrical and medical gas lines fully inspected and green-tagged by 11:30 AM.
- Drywall crew commenced hanging board on schedule at 12:45 PM.
- Rebar delivery for Level 4 pour staged in laydown Yard C.`
          };
        }
      }
    },

    // DAY 3: Concrete Pour vs. Incoming Severe Storm
    {
      id: 'day-3-concrete-storm',
      day: 3,
      time: '05:45 AM',
      title: '450 CY Slab Pour vs. Incoming Thunderstorm Squall Line',
      criticalPathTask: 'Level 4 Elevated Structural Slab Pour (450 CY, Post-Tensioned)',
      location: 'Level 4 Elevated Deck — Gridlines 1-12',
      threatLevel: 'EMERGENCY',
      imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      cctvCameraId: 'CAM-02 [ROOF DECK SLAB PLACEMENT PUMP 1]',
      cameraTelemetry: {
        fov: '110° PANORAMIC',
        zoom: '1.0x WIDE',
        gridOverlay: 'DECK 14 POUR ZONE / SECTOR A-C',
        calloutText: 'WEATHER RADAR SQUALL ALERT: RAIN CELL ARRIVAL IN 45 MIN',
        inspectionTag: 'STRUCTURAL CONCRETE • SLAB DECK'
      },
      description: 'It is 5:45 AM. The ready-mix batch plant has the first 10 transit-mix trucks (100 cubic yards of 5,000 PSI high-early concrete) en route to your jobsite. Two boom pump trucks are set up with outriggers deployed. Doppler radar shows an intense convective squall line with torrential downpours (1.5" rain/hr and 35 mph wind gusts) tracking 2 hours ahead of schedule, set to hit the site between 09:30 AM and 11:00 AM — exactly during initial set and trowel finishing!',
      keyTrades: ['Ready-Mix Concrete Supplier (Central Batch)', 'Concrete Placement Sub (Apex Concrete)', 'Pumping Contractor', 'Testing Agency (ACI Techs)'],
      weather: DEFAULT_WEATHER_FORECAST[2],
      options: [
        {
          type: 'conservative',
          label: 'Option A: Abort Pour Immediately — Wave Off Trucks & Pay Batch Waste',
          actionTitle: 'Abort Pour Before Placement to Avoid Washed-Out Structural Concrete',
          strategyBadge: 'Conservative / Quality & Structural Integrity First',
          description: 'Call the batch plant immediately to halt batching. Turn around the 10 transit trucks. Pay the $32,000 batch cancellation and wasted mix fees, but ensure zero risk of weak, rain-saturated slab surface or cold joints.',
          impact: {
            safety: 4,
            scheduleDays: -1.0,
            contingencySpent: 38000,
            quality: 9,
            morale: -5
          },
          feedback: 'Heavy rain hit at 09:15 AM with driving winds. Other jobs in the city suffered surface delamination and concrete washout. Your deck remained clean and ready for a dry pour tomorrow.',
          tradeReaction: 'Concrete finisher foreman admitted: "We would have lost that slab in that downpour. Cold joint would have triggered core tests. Good call boss."'
        },
        {
          type: 'aggressive',
          label: 'Option B: Push Through with Pour & Double the Trowel Crews',
          actionTitle: 'Double Finisher Crews, Add Accelerator, and Race the Storm',
          strategyBadge: 'Aggressive Fast-Track',
          description: 'Call for non-chloride accelerator in all remaining loads. Order both pump trucks to run at maximum output (90 CY/hour). Double the finishing crew and push through to beat the storm.',
          impact: {
            safety: -14,
            scheduleDays: 0.5,
            contingencySpent: 42000,
            quality: -25,
            morale: -8
          },
          feedback: 'Pour finished at 09:40 AM just as the torrential downpour arrived. Tarping blew off in 35 mph gusts. Top 1/2 inch of paste washed out over 8,000 square feet, resulting in structural scaling.',
          tradeReaction: 'Testing lab cylinders failed 7-day compressive test due to water-cement ratio blowout. Owner issued notice of possible deck rejection.'
        },
        {
          type: 'collaborative',
          label: 'Option C: Partition Pour at Engineered Construction Joint + Visqueen Weather Tent',
          actionTitle: 'Pour Section 1 to Approved Bulkhead + Deploy Rapid Enclosure Tent',
          strategyBadge: 'Collaborative / Strategic Sectioning',
          description: 'Consult the structural drawings for pre-approved mid-span construction joint bulkheads. Place Section 1 (200 CY) where trucks are already in transit, install waterstop and keyway, deploy motorized tarps, and hold Section 2 for tomorrow.',
          impact: {
            safety: 2,
            scheduleDays: 0,
            contingencySpent: 12500,
            quality: 6,
            morale: 5
          },
          feedback: 'Section 1 placed, vibrated, and protected under tensioned visqueen tenting before the rain began. Joint keyed cleanly per structural detail. Minimal concrete wasted; critical path preserved.',
          tradeReaction: 'Batch plant sales rep and concrete finisher foreman shook hands: "Smart engineering move. Didn’t dump trucks and didn’t ruin the slab."'
        }
      ],
      defaultArtifactTemplate: (opt, superName, projName) => {
        if (opt.type === 'conservative') {
          return {
            type: 'DAILY_LOG',
            typeLabel: 'Inclement Weather Stoppage Log',
            documentNumber: 'DLOG-WEATHER-03',
            title: 'Weather Abort Notice: Level 4 Slab Pour Scrubbed Due to Storm Event',
            date: 'Day 3 — 06:15 EST',
            author: superName,
            recipient: 'Owner Representative & Structural EOR',
            summary: 'Pour aborted at 05:50 AM due to incoming convective storm. 10 trucks turned around to preserve structural water-cement ratio specifications.',
            fullContent: `SUPERINTENDENT WEATHER ADVISORY & LOG: DAY 3
PROJECT: ${projName}
SUPERINTENDENT: ${superName}
CONDITIONS: NOAA Radar Warning — 1.5" rain/hr squall line arrival 09:15 AM

ACTION TAKEN:
1. 05:50 AM: Ordered Apex Concrete and Central Ready Mix to halt pour operations.
2. 10 transit trucks returned to plant. Slump test: 5.5", but finishing in monsoon rainfall would have compromised 28-day 5,000 psi compressive requirement.
3. Rescheduled pour for Day 4 at 05:00 AM.
4. Total contingency cost impact: $32,400 (standby & disposal).`
          };
        } else if (opt.type === 'aggressive') {
          return {
            type: 'NCR',
            typeLabel: 'Critical Non-Conformance (Testing Lab)',
            documentNumber: 'NCR-003-STR',
            title: 'Surface Washout & Water-Cement Ratio Scaling on Level 4 Slab',
            date: 'Day 3 — 14:30 EST',
            specSection: 'ACI 301-16 / Spec 03 30 00 Cast-in-Place Concrete',
            author: 'GeoTech & Materials Testing Lab',
            recipient: `${superName} (Superintendent)`,
            summary: 'Surface scaling and paste erosion detected over 8,200 SF of elevated deck caused by placement during heavy rainfall.',
            fullContent: `LABORATORY TESTING INCIDENT REPORT: NCR-003-STR
PROJECT: ${projName}
ELEMENT: Level 4 Elevated PT Slab
CONTRACTOR: Apex Concrete

FINDINGS:
Heavy rain during concrete setting resulted in uncontrolled dilution of surface paste. Surface hardness (Schmidt Hammer) reads 2,100 psi vs. 5,000 psi design minimum.

REMEDIAL ACTION REQUIRED:
1. Petrographic examination of core samples.
2. Shot-blasting or scarification of weakened surface layer.
3. Application of structural polymer-modified topping slab at GC expense.`
          };
        } else {
          return {
            type: 'DAILY_LOG',
            typeLabel: 'Daily Field Log: Engineered Bulkhead Placement',
            documentNumber: 'DLOG-DAY-03',
            title: 'Daily Field Log: Sectional Pour Completed to Grid 6 Bulkhead',
            date: 'Day 3 — 17:00 EST',
            author: superName,
            recipient: 'Structural Engineer & Project Executive',
            summary: 'Placed 210 CY of concrete to approved construction joint at third-point of span. Covered and cured under heavy-duty tarps prior to squall.',
            fullContent: `DAILY CONSTRUCTION REPORT: DAY 3
PROJECT: ${projName}
SUPERINTENDENT: ${superName}
WEATHER: Convective Storm (1.4" rain recorded between 09:20 and 11:30 AM)

KEY ACHIEVEMENTS:
- Successfully placed Section 1 (210 CY) prior to 09:00 AM.
- Installed 16-gauge steel keyway bulkhead with continuous hydrophilic waterstop at Gridline 6 per Detail S-402.
- High-density curing blankets and visqueen anchored with sandbags prior to storm front.
- Slump: 4.75", Air: 5.8%, Cylinders cast: 6 (Break schedule: 3-day, 7-day, 28-day).
- Safety: Zero slips, trips, or lightning strikes during morning staging.`
          };
        }
      }
    },

    // DAY 4: High-Risk Safety Violation (Zero Tolerance Test)
    {
      id: 'day-4-safety-leading-edge',
      day: 4,
      time: '11:15 AM',
      title: 'High-Risk Fall Protection Violation on Perimeter Leading Edge',
      criticalPathTask: 'Erect Level 7 Metal Decking & Perimeter Fall Protection Cables',
      location: 'Level 7 — North Elevation Edge Cantilever',
      threatLevel: 'CRITICAL',
      imageUrl: 'https://images.unsplash.com/photo-1527018606416-a67ffec538ce?auto=format&fit=crop&w=1200&q=80',
      cctvCameraId: 'CAM-04 [TOWER CRANE CAB & LEADING EDGE]',
      cameraTelemetry: {
        fov: '85° TELEPHOTO',
        zoom: '3.2x OPTICAL',
        gridOverlay: 'FLOOR 18 LEADING EDGE / PERIMETER BEAM',
        calloutText: 'CRITICAL SAFETY VIOLATION: 2X UNTIED WORKERS ON LEADING EDGE',
        inspectionTag: 'FALL PROTECTION • LEADING EDGE 100% TIE-OFF'
      },
      description: 'During your field walkthrough, you observe two steel decking installers on the 7th floor perimeter (75 feet above ground) unhooking their dual lanyards from the static lifeline to maneuver a bundle of decking sheets across a gusty opening (winds currently 28 mph). The steel sub foreman is standing nearby, urging them to finish the bay before lunch to beat an afternoon rain delay. Failure to tie off at heights over 6 feet is a catastrophic OSHA willful violation.',
      keyTrades: ['Steel Erectors & Deckers', 'GC Safety Director', 'Ironworkers Union Steward', 'Rigging Crew'],
      weather: DEFAULT_WEATHER_FORECAST[3],
      options: [
        {
          type: 'conservative',
          label: 'Option A: Immediate Red-Card Stop-Work & Stand Down the Decking Crew',
          actionTitle: 'Instant Red Card: Stand Down Crew, Revoke Site Badges, Issue Formal NCR',
          strategyBadge: 'Conservative / Zero-Tolerance Safety Protocol',
          description: 'Blow the emergency air horn, stop the decking operation immediately, escort the two workers to the safety trailer, revoke their site credentials, and mandate an immediate all-hands safety stand-down for the entire structural trade.',
          impact: {
            safety: 16,
            scheduleDays: -0.5,
            contingencySpent: 8500,
            quality: 4,
            morale: 5
          },
          feedback: 'Decisive leadership prevented a potentially fatal fall. The subcontractor president was summoned to the trailer, submitted a revised Fall Protection Plan, and replaced the negligent foreman.',
          tradeReaction: 'Other trades on site saw that you value human life above all else: "That super doesn’t mess around. If you work on his deck, you tie off 100%."'
        },
        {
          type: 'aggressive',
          label: 'Option B: Give a Verbal Warning from the Deck but Let Them Finish the Bundle',
          actionTitle: 'Issue Shouted Warning but Allow Them to Finish the Final Deck Sheet',
          strategyBadge: 'Aggressive / High-Liability Gamble',
          description: 'Yell at the workers to hook back up immediately, but avoid shutting down the deck so they can place the last two metal sheets before the wind picks up.',
          impact: {
            safety: -32,
            scheduleDays: 0.5,
            contingencySpent: 28000,
            quality: -10,
            morale: -16
          },
          feedback: 'CRITICAL SAFETY FAILURE: While rushing the final sheet, a wind gust caught the panel, nearly pulling a worker over the edge. A nearby regional OSHA compliance officer witnessed the event from the street.',
          tradeReaction: 'OSHA arrived on site with an immediate inspection warrant, resulting in a Willful Citation ($156,259 penalty) and severe morale collapse.'
        },
        {
          type: 'collaborative',
          label: 'Option C: Deploy Retractable Inertia Reels + Temporary Mobile Warning Line Stanchions',
          actionTitle: 'Enforce Controlled Decking Zone (CDZ) with Dedicated Safety Watcher',
          strategyBadge: 'Collaborative / OSHA-Compliant Tactical Retool',
          description: 'Immediately halt the workers, hook them up to overhead retractable self-retracting lifelines (SRLs) anchored to central core columns, install perimeter stanchion cables, and post an OSHA-certified dedicated safety monitor on the leading edge.',
          impact: {
            safety: 8,
            scheduleDays: 0,
            contingencySpent: 5200,
            quality: 3,
            morale: 8
          },
          feedback: 'Compliant with OSHA 1926.760 (Steel Erection Subpart R). Workers maintained continuous 100% tie-off with full freedom of movement. Decking completed safely without schedule slip.',
          tradeReaction: 'Union safety steward complimented your technical mastery of OSHA Subpart R: "You fixed the hazard on the spot without throwing a tantrum."'
        }
      ],
      defaultArtifactTemplate: (opt, superName, projName) => {
        if (opt.type === 'conservative') {
          return {
            type: 'NCR',
            typeLabel: 'Safety Non-Conformance Report & Stand-Down',
            documentNumber: 'NCR-SAF-004',
            title: 'Willful Fall Protection Non-Compliance — 100% Tie-Off Breach',
            date: 'Day 4 — 11:30 EST',
            specSection: 'OSHA 29 CFR 1926.501 / GC Safety Manual Rule 1.1',
            author: superName,
            recipient: 'Steel Erectors Inc. Management & Executive Committee',
            summary: 'Immediate stop-work order issued on Level 7 perimeter decking. Two operatives found untied at 75-foot leading edge. Safety stand-down enforced.',
            fullContent: `SAFETY NON-CONFORMANCE & STOP-WORK ORDER: NCR-SAF-004
PROJECT: ${projName}
TIME: 11:15 AM
LOCATION: Level 7 Leading Edge Grid 1-A

INFRACTION:
Operatives observed walking steel beams at height of 75 feet without personal fall arrest system (PFAS) attached to available static life line.

CORRECTIVE ACTIONS MANDATED:
1. Immediate removal of operatives #382 and #419 from project.
2. 1-hour mandatory Fall Protection retraining for all 24 ironworkers on site.
3. Installation of additional perimeter cable stanchions prior to restart.
4. Formal corrective action plan signed by Subcontractor Corporate Safety VP.`
          };
        } else if (opt.type === 'aggressive') {
          return {
            type: 'NCR',
            typeLabel: 'OSHA Notice of Investigation',
            documentNumber: 'OSHA-CIT-2026-081',
            title: 'Imminent Danger Investigation: Unprotected Leading Edge',
            date: 'Day 4 — 13:45 EST',
            specSection: 'OSHA Standard 1926.501(b)(1)',
            author: 'OSHA Regional Compliance Officer',
            recipient: `${superName} & General Contractor Officers`,
            summary: 'Federal OSHA inspection opened following plain-view observation of workers untied on perimeter steel deck during high wind conditions.',
            fullContent: `UNITED STATES DEPARTMENT OF LABOR - OSHA
NOTICE OF UNANNOUNCED INSPECTION
PROJECT: ${projName}

PRELIMINARY FINDINGS:
Compliance officer observed two employees exposed to fall hazards exceeding 60 feet without fall protection while carrying sheet metal during wind gusts >25 mph.

STATUS: OPEN INVESTIGATION
Subject to Repeat/Willful classification under Section 17(a) of the OSH Act.
Penalty assessment pending informal conference.`
          };
        } else {
          return {
            type: 'DAILY_LOG',
            typeLabel: 'Safety Toolbox & Hazard Mitigation Log',
            documentNumber: 'DLOG-SAF-04',
            title: 'Daily Field Log: Implementation of Overhead SRL Fall Arrest Array',
            date: 'Day 4 — 17:00 EST',
            author: superName,
            recipient: 'Corporate Safety Director & Insurance Risk File',
            summary: 'Successfully mitigated leading-edge fall hazards by installing overhead cable reel system with dedicated safety monitor per OSHA 1926.760.',
            fullContent: `DAILY SAFETY AUDIT & OPERATIONS REPORT: DAY 4
PROJECT: ${projName}
SUPERINTENDENT: ${superName}
WEATHER: 58°F, Winds 28 mph gusting to 34 mph

HAZARD MITIGATION SUMMARY:
- 11:15 AM: Identified leading-edge vulnerability during high-wind decking installation.
- 11:30 AM: Deployed 4x Miller Falcon 50-ft Dual Self-Retracting Lifelines anchored to structural core hoist beams.
- Certified Foreman Dave Jenkins designated as full-time Leading Edge Safety Monitor.
- Zero incidents, zero falls. 100% tie-off compliance maintained throughout high-wind advisory.`
          };
        }
      }
    },

    // DAY 5: Critical Path Commissioning & Final Punch List
    {
      id: 'day-5-commissioning-punch',
      day: 5,
      time: '13:00 PM',
      title: 'Owner Walkthrough vs. Unresolved Smoke Control Life-Safety Damper Fault',
      criticalPathTask: 'Integrated Life-Safety Testing & Substantial Completion Milestone',
      location: 'Stairwell 2 & Main Atrium Smoke Evacuation System',
      threatLevel: 'CRITICAL',
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      cctvCameraId: 'CAM-05 [EXECUTIVE CONFERENCE & ARCHITECT TRAILER]',
      cameraTelemetry: {
        fov: '90° DRAFTING',
        zoom: '1.5x OPTICAL',
        gridOverlay: 'SUITE 400 ACOUSTIC BAFFLE CEILING',
        calloutText: 'SPEC CONFLICT: ARCHITECTURAL A-402 VS HVAC SUBMITTAL D-04',
        inspectionTag: 'COMMISSIONING • ARCHITECTURAL PUNCHLIST'
      },
      description: 'The Owner’s Executive VP and Capital Projects Committee arrive on site in 3 hours for their formal Walkthrough and Substantial Completion review (which unlocks the final $4.2M milestone payment). During preliminary pre-testing 20 minutes ago, Smoke Damper SD-04 in Stairwell 2 failed to modulate open upon fire alarm relay activation due to an intermittent actuator voltage drop. The Fire Marshal is scheduled to arrive Monday morning.',
      keyTrades: ['Mechanical Balancing Sub (Controls)', 'Life-Safety Alarm Techs', 'Electrical Foreman', 'Owner Capital Projects VP'],
      weather: DEFAULT_WEATHER_FORECAST[4],
      options: [
        {
          type: 'conservative',
          label: 'Option A: Disclose the Damper Fault Upfront to the Owner Before the Tour',
          actionTitle: 'Transparent Executive Briefing: Present Fault & Show Active Fix in Progress',
          strategyBadge: 'Conservative / Radical Integrity & Trust Building',
          description: 'Meet the Owner’s VP at the job trailer with coffee, lay out the mechanical drawings, explain the exact actuator voltage glitch, show the repair crew already replacing the power supply, and present the full punch-list roadmap.',
          impact: {
            safety: 6,
            scheduleDays: 0,
            contingencySpent: 4500,
            quality: 7,
            morale: 8
          },
          feedback: 'The Owner was deeply impressed by your transparency and technical grasp. Instead of finding a surprise during the walk, they praised your command of field realities and signed the punch list.',
          tradeReaction: 'Owner’s VP said in the debrief: "I’ve worked with dozens of supers who try to hide bugs. Your honesty and instant action plan earned our next $80M contract."'
        },
        {
          type: 'aggressive',
          label: 'Option B: Manually Wedge the Damper Open and Steer the Tour Away from Stairwell 2',
          actionTitle: 'Manual Lockout of Damper & Conceal from Owner Inspection Tour',
          strategyBadge: 'Aggressive / Concealment Risk',
          description: 'Instruct the mechanical sub to physically wedge the damper blades open with a timber block so the test lamp shows green on the annunciator panel, and route the Owner’s tour through Stairwell 1.',
          impact: {
            safety: -28,
            scheduleDays: 0.5,
            contingencySpent: 22000,
            quality: -20,
            morale: -14
          },
          feedback: 'CATASTROPHIC AUDIT FAILURE: During the walk, the Owner’s mechanical commissioning agent unexpectedly opened Stairwell 2 door, noticed the wood wedge, and reported deliberate falsification of life-safety testing.',
          tradeReaction: 'The Owner halted final billing approval, launched a full forensic commissioning audit, and demanded the immediate removal of the superintendent.'
        },
        {
          type: 'collaborative',
          label: 'Option C: Fast-Track Direct 24V Power Tap + AI Control Relay Reconfiguration',
          actionTitle: 'Run Dedicated Clean 24V Line + Live Commissioning Demo for Owner Tour',
          strategyBadge: 'Collaborative / Technical Problem-Solving Under Pressure',
          description: 'Mobilize the electrical and fire alarm foremen simultaneously. Run a temporary dedicated 24V Class-2 power feed from Panel LP-2, reflash the BACnet actuator firmware, and conduct 3 successful cycle tests before the tour arrives.',
          impact: {
            safety: 5,
            scheduleDays: 0,
            contingencySpent: 3200,
            quality: 8,
            morale: 9
          },
          feedback: 'Damper was fully recertified at 14:45 PM. When the Owner walked in at 15:00 PM, you demonstrated the live smoke pressurization cycle on the iPad terminal. Flawless execution.',
          tradeReaction: 'Controls tech and electrical foreman high-fived: "That was high-pressure teamwork. Nailed it."'
        }
      ],
      defaultArtifactTemplate: (opt, superName, projName) => {
        if (opt.type === 'conservative') {
          return {
            type: 'DAILY_LOG',
            typeLabel: 'Executive Turnover & Commissioning Audit Log',
            documentNumber: 'DLOG-DAY-05',
            title: 'Substantial Completion Walkthrough & Transparency Debrief',
            date: 'Day 5 — 17:30 EST',
            author: superName,
            recipient: 'Owner Capital Committee & General Contractor Executives',
            summary: 'Conducted executive walkthrough with Owner VP. Fully disclosed Stairwell 2 damper actuator replacement. Punch list 96% cleared for Monday Fire Marshal final.',
            fullContent: `EXECUTIVE PROJECT TURNOVER LOG: DAY 5
PROJECT: ${projName}
SUPERINTENDENT: ${superName}
MILESTONE: Substantial Completion Preliminary Walk

COMMISSIONING STATUS:
- Life Safety Systems: Smoke Damper SD-04 actuator power supply replaced under warranty. Functional test verified 100% travel in 14.2 seconds (NFPA 92 requirement: < 75s).
- Owner Walkthrough: Completed 16:30. Zero punch items in public lobby, tenant corridors, and MEP penthouse.
- 5-Day Safety Record: ZERO Lost Time Injuries (LTI), ZERO OSHA Recordables.
- Recommendation: Approved for Final Occupancy Certificate Inspection.`
          };
        } else if (opt.type === 'aggressive') {
          return {
            type: 'NCR',
            typeLabel: 'Owner Formal Notice of Default',
            documentNumber: 'OWNER-NOD-001',
            title: 'Notice of Default: Tampering with Life-Safety Smoke Damper',
            date: 'Day 5 — 16:45 EST',
            specSection: 'Contract General Conditions Clause 14.2 / NFPA 90A',
            author: 'Owner Chief Legal Counsel',
            recipient: `${superName} (Superintendent) & GC Principals`,
            summary: 'Formal notice issued following discovery of mechanical wedge disabling automatic smoke damper during walkthrough.',
            fullContent: `LEGAL NOTICE OF CONTRACTUAL DEFAULT
PROJECT: ${projName}
DATE: Day 5 Operations Close

DEFICIENCY:
Contractor personnel intentionally bypassed automatic safety interlocks on Stairwell 2 Smoke Damper SD-04 using mechanical wedging to produce false annunciator indications.

CONSEQUENCES:
1. Immediate stop of Substantial Completion sign-off.
2. Complete re-commissioning of all 184 smoke dampers at Contractor expense.
3. Retention of $4,200,000 progress billing pending third-party engineering recertification.`
          };
        } else {
          return {
            type: 'RFI',
            typeLabel: 'Commissioning Verification Sign-Off',
            documentNumber: 'CX-SIGN-005',
            title: 'Certified Integrated Smoke Control System Functional Test Protocol',
            date: 'Day 5 — 16:00 EST',
            specSection: 'Spec 23 09 00 Instrumentation and Controls / NFPA 92',
            author: superName,
            recipient: 'Owner Commissioning Agent (CxA) & City Fire Marshal',
            summary: 'Completed integrated life-safety smoke purge and pressurization test with dedicated clean 24V supply and BACnet protocol confirmation.',
            fullContent: `COMMISSIONING TEST REPORT: CX-SIGN-005
PROJECT: ${projName}
SYSTEM: Stairwell Pressurization & Smoke Evacuation
TEST WITNESSED BY: ${superName} (GC Super), J. Miller (CxA), D. Vance (Electrical)

TEST MATRIX RESULTS:
- Damper SD-04 Open Time: 12.8 seconds (PASS)
- Stairwell 2 Differential Pressure: 0.18 in. w.g. (Design: 0.15 - 0.25 in. w.g. - PASS)
- Door Opening Force on Egress Doors: 26 lbs (NFPA max: 30 lbs - PASS)
- Fire Alarm Control Panel (FACP) Signal Verification: 100% Clear

RESULT: APPROVED AND SIGNED FOR FINAL FIRE MARSHAL OCCUPANCY WALKTHROUGH.`
          };
        }
      }
    }
  ];
}
