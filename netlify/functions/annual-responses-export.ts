import { assertAdmin } from './applications-store';
import { listAnnualResponses } from './annual-responses-store';

const headers = [
  'date_heure',
  'nom_prenom',
  'telephone',
  'souhaite',
  'disponibilites',
  'retour_experience',
  'statut',
  'commentaire',
];

export default async function handler(request: Request) {
  const adminError = assertAdmin(request);
  if (adminError) {
    return adminError;
  }

  const responses = await listAnnualResponses();
  const rows = responses.map((response) => [
    response.created_at,
    response.full_name,
    response.phone,
    response.intent === 'continuer' ? 'continuer' : 'arreter',
    response.availability_note,
    response.experience_note,
    response.status,
    response.admin_comment,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(formatCsvCell).join(','))
    .join('\n');

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="reponses-etude-alpha-2026-2027.csv"',
    },
  });
}

function formatCsvCell(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}
