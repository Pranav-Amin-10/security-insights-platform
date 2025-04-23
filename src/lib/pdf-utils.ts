import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Vulnerability, VAPTScanResults, ComplianceAudit, SSLCheckResult } from '../types';

// Add type definitions for jsPDF-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Generate a VAPT report in PDF format
export const generateVAPTReport = (results: VAPTScanResults): jsPDF => {
  const doc = new jsPDF();
  
  try {
    // Add title
    doc.setFontSize(20);
    doc.text('Vulnerability Assessment & Penetration Testing Report', 14, 20);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Report generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add target information
    doc.setFontSize(12);
    doc.text(`Target: ${results.target}`, 14, 40);
    doc.text(`Scan ID: ${results.id}`, 14, 48);
    
    // Add summary
    doc.setFontSize(16);
    doc.text('Vulnerability Summary', 14, 60);
    
    const summaryData = [
      ['Critical', results.summary.criticalCount.toString()],
      ['High', results.summary.highCount.toString()],
      ['Medium', results.summary.mediumCount.toString()],
      ['Low', results.summary.lowCount.toString()],
      ['Informational', results.summary.infoCount.toString()],
      ['Total', (
        results.summary.criticalCount +
        results.summary.highCount +
        results.summary.mediumCount +
        results.summary.lowCount +
        results.summary.infoCount
      ).toString()]
    ];
    
    doc.autoTable({
      startY: 65,
      head: [['Severity', 'Count']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] }
    });
    
    // Add vulnerabilities
    doc.setFontSize(16);
    // Get current position
    const currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 100;
    doc.text('Identified Vulnerabilities', 14, currentY);
    
    const vulnData = results.vulnerabilities.map((vuln: Vulnerability) => [
      vuln.severity,
      vuln.name,
      vuln.cveId || 'N/A',
      vuln.cvssScore?.toString() || 'N/A'
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : currentY + 5,
      head: [['Severity', 'Vulnerability', 'CVE ID', 'CVSS Score']],
      body: vulnData,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] }
    });
    
    // Add detailed findings
    doc.addPage();
    doc.setFontSize(18);
    doc.text('Detailed Findings', 14, 20);
    
    let yPosition = 30;
    
    results.vulnerabilities.forEach((vuln: Vulnerability, index: number) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${vuln.name}`, 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.text(`Severity: ${vuln.severity}`, 20, yPosition);
      yPosition += 6;
      
      if (vuln.cveId) {
        doc.text(`CVE ID: ${vuln.cveId}`, 20, yPosition);
        yPosition += 6;
      }
      
      if (vuln.cvssScore) {
        doc.text(`CVSS Score: ${vuln.cvssScore}`, 20, yPosition);
        yPosition += 6;
      }
      
      doc.text('Description:', 20, yPosition);
      yPosition += 6;
      
      // Handle long descriptions with wrapping
      const descLines = doc.splitTextToSize(vuln.description, 170);
      doc.text(descLines, 25, yPosition);
      yPosition += descLines.length * 6;
      
      if (vuln.remediation) {
        doc.text('Remediation:', 20, yPosition);
        yPosition += 6;
        
        const remLines = doc.splitTextToSize(vuln.remediation, 170);
        doc.text(remLines, 25, yPosition);
        yPosition += remLines.length * 6;
      }
      
      if (vuln.affected) {
        doc.text('Affected:', 20, yPosition);
        yPosition += 6;
        doc.text(vuln.affected, 25, yPosition);
        yPosition += 6;
      }
      
      // Add spacing between vulnerabilities
      yPosition += 10;
    });
    
    // Add remediation items if available
    if (results.stages && results.stages[7] && results.stages[7].results && results.stages[7].results.remediationItems) {
      doc.addPage();
      doc.setFontSize(18);
      doc.text('Remediation Plan', 14, 20);
      
      const remItems = results.stages[7].results.remediationItems;
      const remData = remItems.map((item: any) => [
        item.vulnerability.name,
        item.priority,
        item.timeEstimate,
        item.suggestedFix
      ]);
      
      doc.autoTable({
        startY: 30,
        head: [['Vulnerability', 'Priority', 'Timeline', 'Suggested Fix']],
        body: remData,
        theme: 'striped',
        headStyles: { fillColor: [33, 150, 243] },
        columnStyles: {
          3: { cellWidth: 80 }
        },
        styles: { overflow: 'linebreak', cellPadding: 3 }
      });
    }
    
    // Add completion information
    doc.addPage();
    doc.setFontSize(18);
    doc.text('Scan Completion Details', 14, 20);
    
    // Add scan stages
    const stagesData = results.stages.map(stage => [
      stage.name,
      stage.completed ? 'Completed' : 'Not Completed',
      stage.description
    ]);
    
    doc.autoTable({
      startY: 30,
      head: [['Stage', 'Status', 'Description']],
      body: stagesData,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] }
    });
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
      doc.text('© Security Insights Platform', 14, doc.internal.pageSize.getHeight() - 10);
    }
    
    return doc;
  } catch (error) {
    console.error("Error generating VAPT report:", error);
    // Return a basic document with an error message
    const errorDoc = new jsPDF();
    errorDoc.text("Error generating report. Please try again.", 20, 20);
    return errorDoc;
  }
};

// Generate a Compliance Audit report in PDF format
export const generateComplianceReport = (audit: ComplianceAudit): jsPDF => {
  const doc = new jsPDF();
  
  try {
    // Add title
    doc.setFontSize(20);
    doc.text(`${audit.standard} Compliance Audit Report`, 14, 20);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Report generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add summary
    doc.setFontSize(16);
    doc.text('Compliance Summary', 14, 40);
    
    // Add summary score
    doc.setFontSize(14);
    doc.text(`Overall Compliance Score: ${audit.summary.overallScore}%`, 14, 50);
    
    const summaryData = [
      ['Compliant', audit.summary.compliantCount.toString()],
      ['Partially Compliant', audit.summary.partialCount.toString()],
      ['Non-Compliant', audit.summary.nonCompliantCount.toString()],
      ['Not Applicable', audit.summary.naCount.toString()],
      ['Total Controls', (
        audit.summary.compliantCount +
        audit.summary.partialCount +
        audit.summary.nonCompliantCount +
        audit.summary.naCount
      ).toString()]
    ];
    
    doc.autoTable({
      startY: 55,
      head: [['Status', 'Count']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] }
    });
    
    // Add control details
    doc.setFontSize(16);
    const controlY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 100;
    doc.text('Control Details', 14, controlY);
    
    // Create control data array for the table
    const controlData = audit.controls.map(control => [
      control.section,
      control.control,
      control.status,
      control.comments || ''
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : controlY + 5,
      head: [['Section', 'Control', 'Status', 'Comments']],
      body: controlData,
      theme: 'striped',
      headStyles: { fillColor: [76, 175, 80] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 60 },
        2: { cellWidth: 25 },
        3: { cellWidth: 85 }
      },
      styles: { overflow: 'linebreak', cellPadding: 3 }
    });
    
    // Add remediation plan
    doc.addPage();
    doc.setFontSize(18);
    doc.text('Remediation Plan', 14, 20);
    
    const nonCompliantControls = audit.controls.filter(
      control => control.status === 'No' || control.status === 'Partial'
    );
    
    if (nonCompliantControls.length > 0) {
      const remediationData = nonCompliantControls.map(control => [
        control.section,
        control.control,
        control.status,
        `Implement measures to address ${control.control} requirements.`
      ]);
      
      doc.autoTable({
        startY: 30,
        head: [['Section', 'Control', 'Status', 'Recommendation']],
        body: remediationData,
        theme: 'striped',
        headStyles: { fillColor: [76, 175, 80] },
        styles: { overflow: 'linebreak' }
      });
    } else {
      doc.setFontSize(12);
      doc.text('All controls are compliant. No remediation needed.', 14, 30);
    }
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
      doc.text('© Security Insights Platform', 14, doc.internal.pageSize.getHeight() - 10);
    }
    
    return doc;
  } catch (error) {
    console.error("Error generating Compliance report:", error);
    // Return a basic document with an error message
    const errorDoc = new jsPDF();
    errorDoc.text("Error generating report. Please try again.", 20, 20);
    return errorDoc;
  }
};

// Generate an SSL/TLS Analysis report in PDF format
export const generateSSLReport = (result: SSLCheckResult): jsPDF => {
  const doc = new jsPDF();
  
  try {
    // Add title
    doc.setFontSize(20);
    doc.text('SSL/TLS Security Analysis Report', 14, 20);
    
    // Add timestamp and domain
    doc.setFontSize(10);
    doc.text(`Report generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.setFontSize(12);
    doc.text(`Domain: ${result.domain}`, 14, 38);
    
    // Add overall rating
    doc.setFontSize(18);
    doc.text('Overall Rating', 14, 50);
    
    // Set color based on rating
    let ratingColor;
    switch(result.overallRating.charAt(0)) {
      case 'A': ratingColor = [76, 175, 80]; break; // Green
      case 'B': ratingColor = [139, 195, 74]; break; // Light Green
      case 'C': ratingColor = [255, 193, 7]; break; // Yellow
      default: ratingColor = [244, 67, 54]; break; // Red
    }
    
    // Draw rating badge
    doc.setFillColor(ratingColor[0], ratingColor[1], ratingColor[2]);
    doc.circle(30, 65, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(result.overallRating, 26, 68);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add score
    doc.setFontSize(14);
    doc.text(`Score: ${result.score}/100`, 50, 68);
    
    // Add certificate information
    doc.setFontSize(16);
    doc.text('Certificate Information', 14, 90);
    
    const certData = [
      ['Subject', result.certificate.subject],
      ['Issuer', result.certificate.issuer],
      ['Valid From', new Date(result.certificate.validFrom).toLocaleString()],
      ['Valid To', new Date(result.certificate.validTo).toLocaleString()],
      ['Days Remaining', result.certificate.daysRemaining.toString()]
    ];
    
    doc.autoTable({
      startY: 95,
      head: [['Property', 'Value']],
      body: certData,
      theme: 'striped',
      headStyles: { fillColor: [0, 188, 212] }
    });
    
    // Add protocol support
    doc.setFontSize(16);
    const protocolY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 100;
    doc.text('Protocol Support', 14, protocolY);
    
    const protocolData = result.protocols.map(protocol => [
      protocol.name,
      protocol.enabled ? 'Enabled' : 'Disabled',
      protocol.secure ? 'Secure' : 'Insecure'
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : protocolY + 5,
      head: [['Protocol', 'Status', 'Security']],
      body: protocolData,
      theme: 'striped',
      headStyles: { fillColor: [0, 188, 212] }
    });
    
    // Add cipher support
    doc.setFontSize(16);
    const cipherY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 100;
    doc.text('Cipher Support', 14, cipherY);
    
    const cipherData = result.ciphers.map(cipher => [
      cipher.name,
      cipher.strength
    ]);
    
    doc.autoTable({
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : cipherY + 5,
      head: [['Cipher', 'Strength']],
      body: cipherData,
      theme: 'striped',
      headStyles: { fillColor: [0, 188, 212] }
    });
    
    // Add vulnerabilities if any
    if (result.vulnerabilities.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Detected Vulnerabilities', 14, 20);
      
      const vulnData = result.vulnerabilities.map(vuln => [
        vuln.name,
        vuln.severity,
        vuln.description
      ]);
      
      doc.autoTable({
        startY: 25,
        head: [['Vulnerability', 'Severity', 'Description']],
        body: vulnData,
        theme: 'striped',
        headStyles: { fillColor: [0, 188, 212] },
        columnStyles: {
          2: { cellWidth: 100 }
        },
        styles: { overflow: 'linebreak' }
      });
    }
    
    // Add recommendations
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Recommendations', 14, 20);
    
    const recommendations = [];
    
    // Add protocol recommendations
    const insecureProtocols = result.protocols.filter(p => !p.secure && p.enabled);
    if (insecureProtocols.length > 0) {
      insecureProtocols.forEach(protocol => {
        recommendations.push([
          'Disable Insecure Protocol',
          `Disable ${protocol.name} as it is considered insecure.`
        ]);
      });
    }
    
    // Add cipher recommendations
    const weakCiphers = result.ciphers.filter(c => c.strength !== 'Strong');
    if (weakCiphers.length > 0) {
      recommendations.push([
        'Disable Weak Ciphers',
        `Disable weak or insecure ciphers: ${weakCiphers.map(c => c.name).join(', ')}`
      ]);
    }
    
    // Add certificate recommendations
    if (result.certificate.daysRemaining < 30) {
      recommendations.push([
        'Certificate Expiry',
        `Your certificate will expire in ${result.certificate.daysRemaining} days. Consider renewing it soon.`
      ]);
    }
    
    // Add general recommendations
    recommendations.push([
      'HSTS Implementation',
      'Implement HTTP Strict Transport Security (HSTS) to enforce secure connections.'
    ]);
    
    recommendations.push([
      'CSP Implementation',
      'Implement Content Security Policy headers to prevent XSS and data injection attacks.'
    ]);
    
    // Add recommendations to the report
    if (recommendations.length > 0) {
      doc.autoTable({
        startY: 25,
        head: [['Recommendation', 'Description']],
        body: recommendations,
        theme: 'striped',
        headStyles: { fillColor: [0, 188, 212] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 140 }
        },
        styles: { overflow: 'linebreak' }
      });
    }
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
      doc.text('© Security Insights Platform', 14, doc.internal.pageSize.getHeight() - 10);
    }
    
    return doc;
  } catch (error) {
    console.error("Error generating SSL report:", error);
    // Return a basic document with an error message
    const errorDoc = new jsPDF();
    errorDoc.text("Error generating report. Please try again.", 20, 20);
    return errorDoc;
  }
};
