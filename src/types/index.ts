
// Common types used across the application

// VAPT Module Types
export type VAPTStage = {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  results: any;
};

export type VAPTScanResults = {
  id: string;
  timestamp: string;
  target: string;
  stages: VAPTStage[];
  vulnerabilities: Vulnerability[];
  summary: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    infoCount: number;
  };
};

export type Vulnerability = {
  id: string;
  name: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  cveId?: string;
  cvssScore?: number;
  remediation?: string;
  affected?: string;
  references?: string[];
};

// Compliance Module Types
export type ComplianceStandard = 'GDPR' | 'ISO27001';

export type ComplianceControl = {
  id: string;
  section: string;
  control: string;
  description: string;
  status: 'Yes' | 'No' | 'Partial' | 'N/A';
  evidence?: string;
  comments?: string;
};

export type ComplianceAudit = {
  id: string;
  timestamp: string;
  standard: ComplianceStandard;
  controls: ComplianceControl[];
  summary: {
    compliantCount: number;
    partialCount: number;
    nonCompliantCount: number;
    naCount: number;
    overallScore: number;
  };
};

// SSL Module Types
export type SSLCheckResult = {
  id: string;
  timestamp: string;
  domain: string;
  certificate: {
    subject: string;
    issuer: string;
    validFrom: string;
    validTo: string;
    daysRemaining: number;
  };
  protocols: {
    name: string;
    enabled: boolean;
    secure: boolean;
  }[];
  ciphers: {
    name: string;
    strength: 'Strong' | 'Weak' | 'Insecure';
  }[];
  vulnerabilities: {
    name: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
  }[];
  overallRating: 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'E' | 'F';
  score: number;
};
