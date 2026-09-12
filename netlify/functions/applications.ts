import type { Handler } from '@netlify/functions';

import {
  assertAdmin,
  createApplication,
  isApplicationStatus,
  json,
  listApplications,
  saveApplication,
  validateApplication,
} from './applications-store';

export const handler: Handler = async (event) => {
  const request = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers as HeadersInit,
    body: event.body,
  });

  try {
    if (event.httpMethod === 'POST') {
      const input = event.body ? JSON.parse(event.body) : {};
      const validationError = validateApplication(input);

      if (validationError) {
        return toNetlifyResponse(json({ error: validationError }, 400));
      }

      const application = createApplication(input);
      await saveApplication(application);

      return toNetlifyResponse(json({ application }));
    }

    const adminError = assertAdmin(request);
    if (adminError) {
      return toNetlifyResponse(adminError);
    }

    if (event.httpMethod === 'GET') {
      const applications = await listApplications();
      return toNetlifyResponse(json({ applications }));
    }

    if (event.httpMethod === 'PATCH') {
      const input = event.body ? JSON.parse(event.body) : {};

      if (typeof input.id !== 'string' || !input.id) {
        return toNetlifyResponse(json({ error: 'Identifiant manquant.' }, 400));
      }

      if (!isApplicationStatus(input.status)) {
        return toNetlifyResponse(json({ error: 'Statut invalide.' }, 400));
      }

      const applications = await listApplications();
      const application = applications.find((item) => item.id === input.id);

      if (!application) {
        return toNetlifyResponse(json({ error: 'Candidature introuvable.' }, 404));
      }

      const updatedApplication = {
        ...application,
        status: input.status,
        admin_comment:
          typeof input.adminComment === 'string' ? input.adminComment.trim() : '',
        updated_at: new Date().toISOString(),
      };

      await saveApplication(updatedApplication);

      return toNetlifyResponse(json({ application: updatedApplication }));
    }

    return toNetlifyResponse(json({ error: 'Méthode non autorisee.' }, 405));
  } catch (error) {
    return toNetlifyResponse(
      json({ error: error instanceof Error ? error.message : 'Erreur serveur.' }, 500),
    );
  }
};

async function toNetlifyResponse(response: Response) {
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text(),
  };
}
