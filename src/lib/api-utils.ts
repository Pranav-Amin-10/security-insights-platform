
import { Vulnerability, ComplianceControl, SSLCheckResult } from "../types";
import supabase from "./supabase";

// Mock API simulation functions
// In a real application, these would make actual API calls

// Shodan API simulation
export const shodanReconnaissance = async (target: string): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    ip: target,
    hostnames: ['server1.example.com', 'server2.example.com'],
    ports: [80, 443, 22, 21, 3389],
    os: 'Linux 4.15',
    services: [
      { port: 80, service: 'http', version: 'nginx 1.18.0' },
      { port: 443, service: 'https', version: 'nginx 1.18.0' },
      { port: 22, service: 'ssh', version: 'OpenSSH 7.6p1' },
    ],
    vulnerabilities: [
      { id: 'CVE-2021-44228', name: 'Log4Shell', severity: 'Critical' },
      { id: 'CVE-2020-1472', name: 'Zerologon', severity: 'Critical' },
      { id: 'CVE-2019-19781', name: 'Citrix ADC Path Traversal', severity: 'High' },
    ]
  };
};

// IP Info simulation
export const getIPInfo = async (ip: string): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    ip: ip,
    hostname: 'server.example.com',
    city: 'San Francisco',
    region: 'California',
    country: 'US',
    loc: '37.7749,-122.4194',
    org: 'AS13335 Cloudflare, Inc.',
    postal: '94107',
    timezone: 'America/Los_Angeles'
  };
};

// WHOIS simulation
export const getWHOIS = async (domain: string): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    domain_name: domain,
    registrar: 'GoDaddy.com, LLC',
    whois_server: 'whois.godaddy.com',
    referral_url: 'http://www.godaddy.com',
    updated_date: '2022-09-10T10:11:01Z',
    creation_date: '2010-03-15T23:30:49Z',
    expiration_date: '2023-03-15T23:30:49Z',
    name_servers: ['ns1.example.com', 'ns2.example.com'],
    status: ['clientDeleteProhibited', 'clientRenewProhibited', 'clientTransferProhibited', 'clientUpdateProhibited'],
    emails: ['abuse@godaddy.com', 'whois@godaddy.com'],
    dnssec: 'unsigned',
    registrant: {
      organization: 'Example Corporation',
      state: 'California',
      country: 'US'
    }
  };
};

// DNS lookup simulation
export const getDNSRecords = async (domain: string): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    A: ['192.168.1.1', '192.168.1.2'],
    AAAA: ['2001:0db8:85a3:0000:0000:8a2e:0370:7334'],
    MX: [
      { preference: 10, exchange: 'aspmx.l.google.com' },
      { preference: 20, exchange: 'alt1.aspmx.l.google.com' },
    ],
    NS: ['ns1.example.com', 'ns2.example.com'],
    TXT: ['"v=spf1 include:_spf.google.com ~all"'],
    CNAME: [],
    SOA: {
      mname: 'ns1.example.com',
      rname: 'hostmaster.example.com',
      serial: 1234567890,
      refresh: 3600,
      retry: 600,
      expire: 604800,
      minimum: 86400
    }
  };
};

// Generate random vulnerabilities
export const generateVulnerabilities = (count: number): Vulnerability[] => {
  const severities: ('Critical' | 'High' | 'Medium' | 'Low' | 'Info')[] = ['Critical', 'High', 'Medium', 'Low', 'Info'];
  const vulnTypes = [
    { name: 'SQL Injection', desc: 'Input validation vulnerability allowing attackers to execute SQL commands' },
    { name: 'Cross-Site Scripting (XSS)', desc: 'Client-side code injection vulnerability' },
    { name: 'Cross-Site Request Forgery', desc: 'Forces authenticated users to execute unwanted actions' },
    { name: 'Remote Code Execution', desc: 'Allows attackers to run arbitrary code on the affected system' },
    { name: 'Authentication Bypass', desc: 'Allows attackers to bypass authentication mechanisms' },
    { name: 'Information Disclosure', desc: 'Reveals sensitive information to unauthorized actors' },
    { name: 'Insecure Direct Object References', desc: 'Access control vulnerability exposing internal implementation objects' },
    { name: 'Command Injection', desc: 'Allows execution of arbitrary commands on the host operating system' },
    { name: 'Privilege Escalation', desc: 'Enables users to gain elevated access to resources' },
    { name: 'Insecure Deserialization', desc: 'Improper deserialization of user controllable data' },
  ];
  
  const vulnerabilities: Vulnerability[] = [];
  
  for (let i = 0; i < count; i++) {
    const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const cvssScore = severity === 'Critical' ? Math.random() * 2 + 8 :
                     severity === 'High' ? Math.random() * 2 + 6 :
                     severity === 'Medium' ? Math.random() * 2 + 4 :
                     severity === 'Low' ? Math.random() * 2 + 2 : 0;
    
    vulnerabilities.push({
      id: `VULN-${Math.floor(Math.random() * 10000)}`,
      name: vulnType.name,
      description: vulnType.desc,
      severity,
      cveId: Math.random() > 0.3 ? `CVE-202${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 90000) + 10000}` : undefined,
      cvssScore: Math.round(cvssScore * 10) / 10,
      remediation: `Update the affected component and implement proper ${vulnType.name.toLowerCase()} prevention techniques.`,
      affected: `https://example.com/path${Math.floor(Math.random() * 100)}`,
      references: [
        'https://owasp.org/Top10',
        'https://cve.mitre.org',
        'https://nvd.nist.gov'
      ]
    });
  }
  
  return vulnerabilities;
};

// Generate GDPR compliance controls
export const getGDPRControls = (): ComplianceControl[] => {
  return [
    {
      id: 'gdpr-1',
      section: 'Article 5',
      control: 'Principles relating to processing of personal data',
      description: 'Personal data shall be processed lawfully, fairly and in a transparent manner',
      status: 'N/A'
    },
    {
      id: 'gdpr-2',
      section: 'Article 6',
      control: 'Lawfulness of processing',
      description: 'Processing shall be lawful only if and to the extent that certain conditions apply',
      status: 'N/A'
    },
    {
      id: 'gdpr-3',
      section: 'Article 7',
      control: 'Conditions for consent',
      description: 'Where processing is based on consent, the controller shall be able to demonstrate that the data subject has consented',
      status: 'N/A'
    },
    {
      id: 'gdpr-4',
      section: 'Article 12',
      control: 'Transparent information',
      description: 'Transparent information, communication and modalities for the exercise of the rights of the data subject',
      status: 'N/A'
    },
    {
      id: 'gdpr-5',
      section: 'Article 15',
      control: 'Right of access',
      description: 'The data subject shall have the right to obtain from the controller confirmation as to whether or not personal data concerning him or her are being processed',
      status: 'N/A'
    },
    {
      id: 'gdpr-6',
      section: 'Article 17',
      control: 'Right to erasure',
      description: 'The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay',
      status: 'N/A'
    },
    {
      id: 'gdpr-7',
      section: 'Article 25',
      control: 'Data protection by design and by default',
      description: 'The controller shall implement appropriate technical and organisational measures',
      status: 'N/A'
    },
    {
      id: 'gdpr-8',
      section: 'Article 32',
      control: 'Security of processing',
      description: 'The controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk',
      status: 'N/A'
    },
    {
      id: 'gdpr-9',
      section: 'Article 35',
      control: 'Data protection impact assessment',
      description: 'Where processing is likely to result in a high risk to the rights and freedoms of natural persons, the controller shall carry out an assessment',
      status: 'N/A'
    },
    {
      id: 'gdpr-10',
      section: 'Article 37',
      control: 'Designation of the data protection officer',
      description: 'The controller and the processor shall designate a data protection officer in certain cases',
      status: 'N/A'
    }
  ];
};

// Generate ISO 27001 compliance controls
export const getISO27001Controls = (): ComplianceControl[] => {
  return [
    {
      id: 'iso-1',
      section: 'A.5',
      control: 'Information security policies',
      description: 'Management direction for information security',
      status: 'N/A'
    },
    {
      id: 'iso-2',
      section: 'A.6',
      control: 'Organization of information security',
      description: 'Internal organization and mobile devices/teleworking',
      status: 'N/A'
    },
    {
      id: 'iso-3',
      section: 'A.7',
      control: 'Human resource security',
      description: 'Prior to, during, and after employment',
      status: 'N/A'
    },
    {
      id: 'iso-4',
      section: 'A.8',
      control: 'Asset management',
      description: 'Responsibility for assets, information classification, media handling',
      status: 'N/A'
    },
    {
      id: 'iso-5',
      section: 'A.9',
      control: 'Access control',
      description: 'Business requirements, user access management, system and application access control',
      status: 'N/A'
    },
    {
      id: 'iso-6',
      section: 'A.10',
      control: 'Cryptography',
      description: 'Cryptographic controls',
      status: 'N/A'
    },
    {
      id: 'iso-7',
      section: 'A.11',
      control: 'Physical and environmental security',
      description: 'Secure areas and equipment',
      status: 'N/A'
    },
    {
      id: 'iso-8',
      section: 'A.12',
      control: 'Operations security',
      description: 'Operational procedures, protection from malware, backup, logging, software/systems management, vulnerability management',
      status: 'N/A'
    },
    {
      id: 'iso-9',
      section: 'A.13',
      control: 'Communications security',
      description: 'Network security management and information transfer',
      status: 'N/A'
    },
    {
      id: 'iso-10',
      section: 'A.14',
      control: 'System acquisition, development and maintenance',
      description: 'Security requirements, secure development, test data',
      status: 'N/A'
    },
    {
      id: 'iso-11',
      section: 'A.15',
      control: 'Supplier relationships',
      description: 'Information security in supplier relationships and supplier service delivery management',
      status: 'N/A'
    },
    {
      id: 'iso-12',
      section: 'A.16',
      control: 'Information security incident management',
      description: 'Management of information security incidents and improvements',
      status: 'N/A'
    },
    {
      id: 'iso-13',
      section: 'A.17',
      control: 'Business continuity management',
      description: 'Information security continuity and redundancies',
      status: 'N/A'
    },
    {
      id: 'iso-14',
      section: 'A.18',
      control: 'Compliance',
      description: 'Compliance with legal and contractual requirements and information security reviews',
      status: 'N/A'
    }
  ];
};

// Simulate SSL/TLS Check
export const checkSSL = async (domain: string): Promise<SSLCheckResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Random SSL grade
  const grades = ['A+', 'A', 'A-', 'B', 'C', 'D', 'E', 'F'];
  const gradeIndex = Math.floor(Math.random() * 3); // Mostly good grades for demo
  const grade = grades[gradeIndex] as 'A+' | 'A' | 'A-' | 'B' | 'C' | 'D' | 'E' | 'F';
  
  // Random score between 0-100, weighted toward higher scores
  const score = Math.round(100 - (gradeIndex * 15) - (Math.random() * 10));
  
  // Generate random dates for certificate
  const now = new Date();
  const validFrom = new Date(now);
  validFrom.setMonth(validFrom.getMonth() - Math.floor(Math.random() * 6)); // 0-6 months ago
  
  const validTo = new Date(now);
  validTo.setMonth(validTo.getMonth() + Math.floor(Math.random() * 24) + 1); // 1-24 months in future
  
  const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    id: `ssl-check-${Date.now()}`,
    timestamp: new Date().toISOString(),
    domain,
    certificate: {
      subject: `CN=${domain}`,
      issuer: Math.random() > 0.5 ? 'CN=DigiCert SHA2 Secure Server CA' : 'CN=Let\'s Encrypt Authority X3',
      validFrom: validFrom.toISOString(),
      validTo: validTo.toISOString(),
      daysRemaining
    },
    protocols: [
      { name: 'TLS 1.3', enabled: Math.random() > 0.2, secure: true },
      { name: 'TLS 1.2', enabled: true, secure: true },
      { name: 'TLS 1.1', enabled: Math.random() > 0.5, secure: false },
      { name: 'TLS 1.0', enabled: Math.random() > 0.7, secure: false },
      { name: 'SSL 3.0', enabled: Math.random() > 0.9, secure: false }
    ],
    ciphers: [
      { name: 'TLS_AES_256_GCM_SHA384', strength: 'Strong' },
      { name: 'TLS_CHACHA20_POLY1305_SHA256', strength: 'Strong' },
      { name: 'TLS_AES_128_GCM_SHA256', strength: 'Strong' },
      { name: 'ECDHE-RSA-AES256-GCM-SHA384', strength: 'Strong' },
      { name: 'ECDHE-RSA-AES128-GCM-SHA256', strength: 'Strong' },
      { name: 'DHE-RSA-AES256-GCM-SHA384', strength: Math.random() > 0.5 ? 'Strong' : 'Weak' },
      { name: 'AES256-SHA', strength: 'Weak' },
      { name: 'DES-CBC3-SHA', strength: 'Insecure' }
    ],
    vulnerabilities: [
      { 
        name: 'ROBOT', 
        severity: Math.random() > 0.7 ? 'High' : 'Low' as 'High' | 'Low',
        description: 'Return Of Bleichenbacher\'s Oracle Threat vulnerability' 
      },
      { 
        name: 'BEAST', 
        severity: Math.random() > 0.8 ? 'Medium' : 'Low' as 'Medium' | 'Low',
        description: 'Browser Exploit Against SSL/TLS attack' 
      },
      { 
        name: 'POODLE', 
        severity: Math.random() > 0.7 ? 'High' : 'Medium' as 'High' | 'Medium',
        description: 'Padding Oracle On Downgraded Legacy Encryption vulnerability' 
      },
      { 
        name: 'Heartbleed', 
        severity: Math.random() > 0.9 ? 'Critical' : 'Low' as 'Critical' | 'Low',
        description: 'OpenSSL heartbeat information disclosure vulnerability' 
      }
    ].slice(0, Math.floor(Math.random() * 3)), // 0-2 vulnerabilities
    overallRating: grade,
    score
  };
};

// Save VAPT scan results to Supabase
export const saveVAPTResults = async (results: any) => {
  try {
    const { data, error } = await supabase
      .from('vapt_scans')
      .insert([results]);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving VAPT results:', error);
    return { success: false, error };
  }
};

// Save Compliance audit results to Supabase
export const saveComplianceResults = async (results: any) => {
  try {
    const { data, error } = await supabase
      .from('compliance_audits')
      .insert([results]);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving compliance results:', error);
    return { success: false, error };
  }
};

// Save SSL check results to Supabase
export const saveSSLResults = async (results: any) => {
  try {
    const { data, error } = await supabase
      .from('ssl_checks')
      .insert([results]);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error saving SSL results:', error);
    return { success: false, error };
  }
};
