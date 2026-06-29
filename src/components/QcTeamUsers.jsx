import React from "react";
import DomainUserManagement from "./DomainUserManagement";

const QcTeamUsers = () => (
  <DomainUserManagement
    title="QC Team Users"
    sectionTitle="QC Users"
    description="Manage QC user accounts — add, edit, and remove users"
    analyticsLayout
  />
);

export default React.memo(QcTeamUsers);
