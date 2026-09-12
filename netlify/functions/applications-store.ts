import { getStore } from '@netlify/blobs';

export type ApplicationStatus = 'nouveau' | 'a_contacter' | 'accepte' | 'refuse';

export type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  current_activity: string;
  profile_note: string;
  consent: boolean;
  status: ApplicationStatus;
  admin_comment: string;
  created_at: string;
  updated_at: string;
};

const statusValues = new Set<ApplicationStatus>([
  'nouveau',
  'a_contacter',
  'accepte',
  'refuse',
]);

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === 'string' && statusValues.has(value as ApplicationStatus);
}

export function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export function assertAdmin(request: Request) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const requestUrl = new URL(request.url);
  const password =
    request.headers.get('x-admin-password') || requestUrl.searchParams.get('password');

  if (!configuredPassword || password !== configuredPassword) {
    return json({ error: 'Accès refuse.' }, 401);
  }

  return null;
}

export function validateApplication(input: Record<string, unknown>) {
  const requiredTextFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'city',
    'currentActivity',
    'profileNote',
  ];

  for (const field of requiredTextFields) {
    if (typeof input[field] !== 'string' || !input[field].trim()) {
      return `${field} est obligatoire.`;
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email))) {
    return 'Adresse e-mail invalide.';
  }

  if (input.consent !== true) {
    return 'Le consentement est obligatoire.';
  }

  return null;
}

export async function listApplications() {
  const store = getStore('applications');
  const { blobs } = await store.list();
  const applications = await Promise.all(
    blobs.map((blob) => store.get(blob.key, { type: 'json' }) as Promise<Application | null>),
  );

  return applications
    .filter((application): application is Application => application !== null)
    .sort(
      (first, second) =>
        new Date(second.created_at).getTime() - new Date(first.created_at).getTime(),
    );
}

export async function saveApplication(application: Application) {
  const store = getStore('applications');
  await store.setJSON(application.id, application);
}

export function createApplication(input: Record<string, unknown>): Application {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    first_name: String(input.firstName).trim(),
    last_name: String(input.lastName).trim(),
    email: String(input.email).trim().toLowerCase(),
    phone: String(input.phone).trim(),
    city: String(input.city).trim(),
    current_activity: String(input.currentActivity).trim(),
    profile_note: String(input.profileNote).trim(),
    consent: true,
    status: 'nouveau',
    admin_comment: '',
    created_at: now,
    updated_at: now,
  };
}
