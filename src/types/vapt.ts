import { VAPTStage, VAPTScanResults, Vulnerability } from "@/types";

export type VAPTFormValues = {
  targetSystem: string;
  scopeDetails: string;
};

export type StageResults = {
  [key: string]: any;
};

export type ReconnaissanceResults = {
  error?: string;
  errorDetails?: string;
  shodan: {
    lastUpdate: string;
    detectedServices: string[] | number[];
    vulnerabilities: string[];
    ports?: number[];
    vulns?: string[];
    ip?: string;
    hostnames?: string[];
    os?: string;
    services?: Array<{
      port: number;
      service: string;
      version: string;
    }>;
  };
  ipInfo: {
    geolocation: {
      latitude: number | null;
      longitude: number | null;
      accuracy: number | null;
    };
    network: {
      asn: string;
      provider: string;
      type: string;
    };
    city?: string;
    region?: string;
    country?: string;
    hostname?: string;
  };
  whois: {
    registrationDetails: {
      registrar: string;
      createdDate: string;
      expiryDate: string;
      lastUpdated?: string;
    };
    contactInfo: {
      technical: string;
      administrative: string;
    };
    domain_name?: string;
  };
  dnsRecords: {
    records: any[];
    analysisTimestamp: string;
    recordTypes: Array<{
      type: string;
      records: any[];
    }>;
    A?: string[];
    AAAA?: string[];
    MX?: Array<{ preference: number; exchange: string }>;
    NS?: string[];
    TXT?: string[];
    CNAME?: string[];
    SOA?: {
      mname: string;
      rname: string;
      serial: number;
      refresh: number;
      retry: number;
      expire: number;
      minimum: number;
    };
  };
};
