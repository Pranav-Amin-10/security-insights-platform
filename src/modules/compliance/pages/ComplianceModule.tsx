
import React from "react";
import { Layout } from "@/components/Layout";

const ComplianceModule = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Module</h1>
          <p className="text-gray-600 mb-6">
            Manage compliance audits and standards for your organization.
          </p>
        </div>

        <div className="p-8 text-center">
          <h2 className="text-xl font-medium mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            The compliance module is currently under development. Check back soon for updates.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ComplianceModule;
