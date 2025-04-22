
import { VAPTStage, VAPTScanResults, Vulnerability } from "@/types";

export type VAPTFormValues = {
  targetSystem: string;
  scopeDetails: string;
  testingMethod: "black-box" | "white-box" | "gray-box";
};

export type StageResults = {
  [key: string]: any;
};

export type ReconnaissanceResults = {
  shodan: {
    lastUpdate: string;
    detectedServices: string[];
    vulnerabilities: string[];
    ports?: number[];
    vulns?: string[];
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
  };
  whois: {
    registrationDetails: {
      registrar: string;
      createdDate: string;
      expiryDate: string;
    };
    contactInfo: {
      technical: string;
      administrative: string;
    };
  };
  dnsRecords: {
    records: any[];
    analysisTimestamp: string;
    recordTypes: Array<{
      type: string;
      records: any[];
    }>;
  };
};

