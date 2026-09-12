import { assertAdmin, listApplications } from './applications-store';

const headers = [
  'date',
  'prenom',
  'nom',
  'email',
  'telephone',
  'ville_souhaitee',
  'activite_actuelle',
  'profil',
  'statut',
  'commentaire',
];

export default async function handler(request: Request) {
  const adminError = assertAdmin(request);
  if (adminError) {
    return adminError;
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

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="candidatures-etude-alpha.csv"',
    },
  });
}

function formatCsvCell(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}
