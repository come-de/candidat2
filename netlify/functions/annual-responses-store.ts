import { getStore } from '@netlify/blobs';

export type AnnualIntent = 'continuer' | 'arreter';
export type AnnualResponseStatus = 'nouveau' | 'traite';

export type AnnualResponse = {
  id: string;
  full_name: string;
  phone: string;
  intent: AnnualIntent;
  availability_note: string;
  experience_note: string;
  status: AnnualResponseStatus;
  admin_comment: string;
  created_at: string;
  updated_at: string;
};

const intentValues = new Set<AnnualIntent>(['continuer', 'arreter']);
const statusValues = new Set<AnnualResponseStatus>(['nouveau', 'traite']);

export function isAnnualIntent(value: unknown): value is AnnualIntent {
  return typeof value === 'string' && intentValues.has(value as AnnualIntent);
}

export function isAnnualResponseStatus(value: unknown): value is AnnualResponseStatus {
  return typeof value === 'string' && statusValues.has(value as AnnualResponseStatus);
}

export function validateAnnualResponse(input: Record<string, unknown>) {
  if (typeof input.fullName !== 'string' || !input.fullName.trim()) {
    return 'Le nom et prénom sont obligatoires.';
  }

  if (typeof input.phone !== 'string' || !input.phone.trim()) {
    return 'Le numéro de téléphone est obligatoire.';
  }

  if (!/^0[67]\d{8}$/.test(String(input.phone).trim())) {
    return 'Le numéro de téléphone doit être au format 06... ou 07... sans espace.';
  }

  if (!isAnnualIntent(input.intent)) {
    return 'Veuillez indiquer si vous souhaitez continuer ou arrêter.';
  }

  if (input.intent === 'continuer' && (typeof input.availabilityNote !== 'string' || !input.availabilityNote.trim())) {
    return 'Merci de préciser vos disponibilités.';
  }

  if (input.intent === 'arreter' && (typeof input.experienceNote !== 'string' || !input.experienceNote.trim())) {
    return 'Merci de nous dire quelques mots sur votre expérience.';
  }

  return null;
}

export async function listAnnualResponses() {
  const store = getStore('annual-responses');
  const { blobs } = await store.list();
  const responses = await Promise.all(
    blobs.map((blob) => store.get(blob.key, { type: 'json' }) as Promise<AnnualResponse | null>),
  );

  return responses
    .filter((response): response is AnnualResponse => response !== null)
    .sort(
      (first, second) =>
        new Date(second.created_at).getTime() - new Date(first.created_at).getTime(),
    );
}

export async function saveAnnualResponse(response: AnnualResponse) {
  const store = getStore('annual-responses');
  await store.setJSON(response.id, response);
}

export function createAnnualResponse(input: Record<string, unknown>): AnnualResponse {
  const now = new Date().toISOString();
  const intent = input.intent as AnnualIntent;

  return {
    id: crypto.randomUUID(),
    full_name: String(input.fullName).trim(),
    phone: String(input.phone).trim(),
    intent,
    availability_note: intent === 'continuer' ? String(input.availabilityNote).trim() : '',
    experience_note: intent === 'arreter' ? String(input.experienceNote).trim() : '',
    status: 'nouveau',
    admin_comment: '',
    created_at: now,
    updated_at: now,
  };
}
