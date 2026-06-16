import React from "react";
import DomainUserManagement from "./DomainUserManagement";

const QC_TEAM_USERS_TITLE = "QC Team Users";
const QC_TEAM_USERS_DESC =
  "Manage QC Users in your module. New users must sign in with their email and password at the login page.";

const QcTeamUsers = () => (
  <DomainUserManagement
    title={QC_TEAM_USERS_TITLE}
    description={QC_TEAM_USERS_DESC}
  />
);

export default React.memo(QcTeamUsers);
