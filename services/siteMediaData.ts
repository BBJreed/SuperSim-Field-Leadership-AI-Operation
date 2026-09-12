import { ProjectSitePhoto, SafetyAuditItem, ProjectType } from '../types';

export const INITIAL_SITE_PHOTOS: ProjectSitePhoto[] = [
  {
    id: 'PHOTO-01',
    title: 'Tier 1 Column Splice & Anchor Bolt Field Survey',
    category: 'Structural Steel',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
    timestamp: 'Day 1 • 07:15 AM',
    location: 'Substructure Mat Foundation — Sector B / Gridline C4',
    subcontractor: 'Ironworkers Local 40 / Apex Steel',
    status: 'FLAGGED_DEFECT',
    notes: 'Laser survey indicates corner anchor group offset +7/8" beyond AISC Code of Standard Practice allowable tolerance (±1/4"). Awaiting PE repair procedure.',
    inspectorName: 'J. Morrison (Superintendent)'
  },
  {
    id: 'PHOTO-02',
    title: 'Tower Crane 1 Jib Rigging & Hoist Operations',
    category: 'Aerial Drone',
    url: 'https://images.unsplash.com/photo-1504307651554-66914ee56a38?auto=format&fit=crop&w=1200&q=80',
    timestamp: 'Day 1 • 09:40 AM',
    location: 'Tower Crane 1 — 220ft Elevation',
    subcontractor: 'SkyLift Crane Services',
    status: 'APPROVED',
    notes: 'Pre-shift crane rigging inspection completed. Wind speed anemometer at 14 mph (safe operating envelope <30 mph). Certified rigger on radio.',
    inspectorName: 'D. Vance (Rigging Lead)'
  },
  {
    id: 'PHOTO-03',
    title: 'Level 4 Elevated Deck Rebar & Tendon Placement',
    category: 'Foundation & Concrete',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    timestamp: 'Day 2 • 06:10 AM',
    location: 'Level 4 Elevated Slab — Gridlines 1-12',
    subcontractor: 'Apex Concrete & PT Specialists',
    status: 'CRITICAL_PATH',
    notes: '450 CY Post-Tensioned deck pour preparations. Rebar chairs, PT ducts, and perimeter pour stops verified prior to concrete batch arrival.',
    inspectorName: 'M. Chen (Structural QA)'
  },
  {
    id: 'PHOTO-04',
    title: 'Corridor B Core In-Wall MEP Rough-In Cavity',
    category: 'MEP & Rough-In',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    timestamp: 'Day 2 • 11:30 AM',
    location: 'Level 3 — Corridor B Riser Shaft & Wall Cavity',
    subcontractor: 'AmpCore Electric / Tri-State Drywall',
    status: 'REQUIRES_ACTION',
    notes: 'Hold point active. City building inspector delayed. 4 junction boxes lack signed rough-in tags. Drywall boarding paused until municipal sign-off.',
    inspectorName: 'J. Morrison (Superintendent)'
  },
  {
    id: 'PHOTO-05',
    title: 'Perimeter Leading Edge Dual-Lanyard 100% Tie-Off',
    category: 'Safety & QA',
    url: 'https://images.unsplash.com/photo-1527018606416-a67ffec538ce?auto=format&fit=crop&w=1200&q=80',
    timestamp: 'Day 3 • 01:25 PM',
    location: 'Level 7 — North Elevation Perimeter Cantilever',
    subcontractor: 'Steel Erectors & Deckers',
    status: 'APPROVED',
    notes: 'Full perimeter static lifelines tensioned and torqued to 5,000 lbs. Dual shock-absorbing lanyards verified for all deckers.',
    inspectorName: 'S. Rodriguez (Safety Director)'
  },
  {
    id: 'PHOTO-06',
    title: 'Curtain Wall Unitized Glazing Panel Rigging',
    category: 'Facade & Glazing',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    timestamp: 'Day 4 • 08:50 AM',
    location: 'East Facade — Floors 10 through 14',
    subcontractor: 'Vision Glass & Aluminum Enclosures',
    status: 'APPROVED',
    notes: 'Suction-cup vacuum lifter certified. Silicone weather-seal joints inspected. Water penetration field tests meet ASTM E1105 spec.',
    inspectorName: 'R. Kowalski (Envelope Specialist)'
  },
  {
    id: 'PHOTO-07',
    title: 'Staging Logistics & Delivery Queue at Gate 2',
    category: 'Aerial Drone',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    timestamp: 'Day 4 • 10:00 AM',
    location: 'South Perimeter Access — Gate 2 Logistics Pad',
    subcontractor: 'Logistics Traffic Marshalling',
    status: 'APPROVED',
    notes: 'Just-in-time delivery coordination. 4 flatbed steel trailers sequenced without blocking municipal arterial street traffic.',
    inspectorName: 'T. Briggs (Site Logistics)'
  },
  {
    id: 'PHOTO-08',
    title: 'Life-Safety Stairwell Smoke Control Damper SD-04',
    category: 'MEP & Rough-In',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    timestamp: 'Day 5 • 02:15 PM',
    location: 'Stairwell 2 Pressurization Shaft',
    subcontractor: 'Controls & Balancing Specialists',
    status: 'CRITICAL_PATH',
    notes: 'Actuator terminal tightened and 24VAC control transformer checked. Fire damper cycles smoothly upon smoke sensor test activation.',
    inspectorName: 'J. Morrison (Superintendent)'
  }
];

export const INITIAL_SAFETY_AUDIT_ITEMS: SafetyAuditItem[] = [
  {
    id: 'SAF-01',
    category: 'PPE & Fall Protection',
    title: 'Leading Edge 100% Tie-Off & Static Lifeline Tension',
    standard: 'OSHA 1926.501(b)(1) & 1926.502',
    status: 'COMPLIANT',
    notes: 'All workers within 6 ft of open perimeter connected to engineered 5,000-lb anchorage points with dual lanyards.',
    criticality: 'LIFE_SAFETY'
  },
  {
    id: 'SAF-02',
    category: 'PPE & Fall Protection',
    title: 'Class E Hardhat, High-Vis Vest & Eye Protection (100% Site PPE)',
    standard: 'OSHA 1926.100 & 1926.102',
    status: 'COMPLIANT',
    notes: 'Daily gate check enforced. All trades, delivery drivers, and inspectors wearing ANSI Z89.1 Type 1/2 hardhats.',
    criticality: 'MEDIUM'
  },
  {
    id: 'SAF-03',
    category: 'Rigging & Cranes',
    title: 'Crane Swing Radius Barricade & Rigging Tag Inspection',
    standard: 'OSHA 1926.1424 & 1926.251',
    status: 'COMPLIANT',
    notes: '360° red danger tape barricade active around counterweight swing radius. Synthetic slings inspected with clear capacity tags.',
    criticality: 'HIGH'
  },
  {
    id: 'SAF-04',
    category: 'Electrical & LOTO',
    title: 'Temporary Power Spider Box GFCIs & Extension Cord QA',
    standard: 'OSHA 1926.404(b)(1)',
    status: 'WARNING',
    notes: 'One temporary spider box on Level 3 tripped GFCI. Sparky dispatched to reset and replace worn extension cord.',
    criticality: 'HIGH'
  },
  {
    id: 'SAF-05',
    category: 'Excavation & Shoring',
    title: 'Trench Excavation Sloping & Atmospheric Air Monitor',
    standard: 'OSHA 1926.651 & 1926.652',
    status: 'COMPLIANT',
    notes: 'Utility trench sloped at 1.5:1 (Type C soil). Competent person daily soil assessment logged at 06:45 AM.',
    criticality: 'LIFE_SAFETY'
  },
  {
    id: 'SAF-06',
    category: 'Housekeeping & Egress',
    title: 'Stairwell Emergency Egress Clear & Temp Lighting (5 Foot-Candles)',
    standard: 'OSHA 1926.56 & 1926.25',
    status: 'COMPLIANT',
    notes: 'Stairwells 1 & 2 clear of debris, cords, and drywall scraps. Battery backup exit fixtures verified.',
    criticality: 'MEDIUM'
  }
];

export const SAFETY_TOOLBOX_TALKS = [
  {
    id: 'TB-01',
    title: 'Leading Edge Fall Protection & Self-Retracting Lifelines (SRLs)',
    focusTrade: 'Ironworkers, Carpenters & Deckers',
    keyPoints: [
      '100% tie-off mandatory whenever working within 6 feet of an unprotected edge.',
      'Check SRL brake mechanism before each shift; inspect wire rope for birdcaging.',
      'Never anchor to conduits, fire sprinkler pipes, or unrated studs.',
      'Stop-work authority: Any worker can halt operations if a lifeline is missing or slack.'
    ],
    duration: '10 min',
    attendanceExpected: 28
  },
  {
    id: 'TB-02',
    title: 'Overhead Crane Picks, Rigging Slings & Blind Lift Comms',
    focusTrade: 'Riggers, Signalmen & Crane Operators',
    keyPoints: [
      'Only designated, NCCCO-certified signal persons may communicate with the crane operator.',
      'Always use two tag lines on loads exceeding 20 feet in length.',
      'Never walk or stand beneath a suspended load, regardless of speed.',
      'Cease all critical picks if wind gusts exceed 25 mph or lightning is detected within 10 miles.'
    ],
    duration: '12 min',
    attendanceExpected: 16
  },
  {
    id: 'TB-03',
    title: 'High-Temperature Concrete Hydration & Cold-Joint Prevention',
    focusTrade: 'Concrete Finishers & Laborers',
    keyPoints: [
      'Maintain continuous discharge rate to avoid cold joint formation.',
      'Apply curing compound or wet burlap immediately after bull-floating.',
      'Wear chemical-resistant boots and gloves to prevent caustic alkaline burns.',
      'Keep hydration stations and electrolyte packs within 50 feet of placement deck.'
    ],
    duration: '8 min',
    attendanceExpected: 22
  }
];
