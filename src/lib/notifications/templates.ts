interface Template {
  subject: string;
  body: string;
}

export function caseCreatedTemplate(
  employeeName: string,
  tenantName: string,
): Template {
  return {
    subject: "Your background verification has started",
    body: `Hi ${employeeName}, your background verification for ${tenantName} has been initiated. Please upload the required documents to proceed.`,
  };
}

export function documentRejectedTemplate(
  employeeName: string,
  documentLabel: string,
  notes: string | null,
): Template {
  return {
    subject: `Action needed: ${documentLabel} was rejected`,
    body: `Hi ${employeeName}, your uploaded ${documentLabel} could not be verified${
      notes ? ` (${notes})` : ""
    }. Please re-upload a valid document.`,
  };
}

export function caseCompletedTemplate(
  employeeName: string,
  tenantName: string,
): Template {
  return {
    subject: "Background verification completed",
    body: `Hi ${employeeName}, your background verification for ${tenantName} has been completed successfully.`,
  };
}

export function caseCompletedEmployerTemplate(
  employeeName: string,
): Template {
  return {
    subject: `Background verification completed: ${employeeName}`,
    body: `The background verification for ${employeeName} has been completed successfully. View the report in your employer dashboard.`,
  };
}

export function caseRejectedTemplate(
  employeeName: string,
  tenantName: string,
): Template {
  return {
    subject: "Background verification could not be completed",
    body: `Hi ${employeeName}, your background verification for ${tenantName} could not be completed. Please contact your employer for details.`,
  };
}

export function caseRejectedEmployerTemplate(
  employeeName: string,
): Template {
  return {
    subject: `Background verification rejected: ${employeeName}`,
    body: `The background verification for ${employeeName} was rejected. View the report in your employer dashboard for details.`,
  };
}

export function reverificationDueTemplate(
  employeeName: string,
  dueDate: string,
): Template {
  return {
    subject: "Annual re-verification due",
    body: `Hi ${employeeName}, your background verification is due for its annual re-verification on ${dueDate}. A new verification case will be created automatically.`,
  };
}

export function reverificationDueEmployerTemplate(
  employeeName: string,
  dueDate: string,
): Template {
  return {
    subject: `Annual re-verification due: ${employeeName}`,
    body: `The background verification for ${employeeName} is due for its annual re-verification on ${dueDate}.`,
  };
}

export function reverificationCaseCreatedTemplate(
  employeeName: string,
  tenantName: string,
): Template {
  return {
    subject: "Annual re-verification started",
    body: `Hi ${employeeName}, your annual re-verification for ${tenantName} has started automatically. Please upload updated documents.`,
  };
}
