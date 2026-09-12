import type { Handler } from '@netlify/functions';

import { assertAdmin, listApplications } from './applications-store';

const headers = [
  'date',
  'prenom',
  'nom',
  'email',
  'telephone',
  'ville_souhaitee',
  'activité_actuelle',
  'profil',
  'statut',
  'commentaire',
];

export const handler: Handler = async (event) => {
  const request = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers as HeadersInit,
  });

  const adminError = assertAdmin(request);
  if (adminError) {
    return {
      statusCode: adminError.status,
      headers: Object.fromEntries(adminError.headers.entries()),
      body: await adminError.text(),
    };
  }

  const applications = await listApplications();
  const rows = applications.map((application) => [
    application.created_at,
    application.first_name,
    application.last_name,
    application.email,
    application.phone,
    application.city,
    application.current_activity,
    application.profile_note,
    application.status,
    application.admin_comment,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(formatCsvCell).join(','))
    .join('\n');

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="candidatures-etude-alpha.csv"',
    },
    body: csv,
  };
};

function formatCsvCell(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}
