# Security Insights Platform

A **web-based cybersecurity analysis tool** designed to provide automated vulnerability assessments, compliance audits, and SSL/TLS configuration checks. Built as part of an academic project (Jan–May 2025), the platform demonstrates how modern cybersecurity concepts can be simulated in a simplified and user-friendly format.

> 🚀 **Demo Link**: [Security Insights Platform](https://security-insights-platform.pages.dev/)

## 📌 Project Overview

The **Security Insights Platform** is divided into 3 core modules:

### 1. Automated VAPT
Simulates automated Vulnerability Assessment & Penetration Testing using mock data from APIs like **Shodan**, **ipinfo.io**, and **SSL Labs**. The user can input a target IP/domain to receive simulated scan results highlighting common misconfigurations, open ports, and outdated services.

### 2. Compliance Audit – GDPR & ISO 27001
Helps users understand how well their systems align with compliance standards like **GDPR** and **ISO 27001**. The tool provides basic audit checklists and mock evaluation summaries.

### 3. SSL/TLS Checker
Checks the SSL/TLS configuration of any domain and displays information such as certificate validity, cipher strength, and expiration dates. Uses simulated results based on known best practices.

> *Note: This project uses **mock data** to simulate responses from real-world APIs (e.g., Shodan, SSL Labs, ipinfo.io). As students, we chose this approach to avoid hitting API rate limits or incurring costs for paid access.*

## 🎯 Features

- 🔍 Simulated VAPT Reports (Mock API-based)
- ✅ GDPR & ISO 27001 Compliance Self-Audit
- 🔐 SSL/TLS Health Checks
- 📊 Clean UI for report viewing
- 🌐 Works across major browsers and screen sizes

## ✅ How to Use

1. Clone the repo  
   ```bash
   git clone https://github.com/yourusername/security-insights-platform.git
   cd security-insights-platform
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Start the development server  
   ```bash
   npm run dev
   ```

4. Open in browser  
   ```
   http://localhost:3000
   ```

## 🛠 Future Enhancements

- Real-time scanning with API key integration
- User login system and dashboard
- PDF Report Generation
- Enhanced error handling and data validation
- Admin panel to track usage and logs

## 📚 References

- https://developer.shodan.io/
- https://ipinfo.io/developers
- https://www.ssllabs.com/projects/ssllabs-apis/
- https://gdpr.eu/
- https://www.iso.org/isoiec-27001-information-security.html
- https://platform.openai.com/

## 👥 Team Members

- Pranav Amin
- Yash Gadhiya
- Shashank Patel
- Het Solanki  

## License

This project is licensed under the [MIT License](LICENSE).
