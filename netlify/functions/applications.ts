import {
  assertAdmin,
  createApplication,
  isApplicationStatus,
  json,
  listApplications,
  saveApplication,
  validateApplication,
} from './applications-store';

export default async function handler(request: Request) {
  try {
    if (request.method === 'POST') {
      const input = await request.json().catch(() => ({}));
      const validationError = validateApplication(input);

      if (validationError) {
        return json({ error: validationError }, 400);
      }

      const application = createApplication(input);
      await saveApplication(application);

      return json({ application });
    }

    const adminError = assertAdmin(request);
    if (adminError) {
      return adminError;
    }

    if (request.method === 'GET') {
      const applications = await listApplications();
      return json({ applications });
    }

    if (request.method === 'PATCH') {
      const input = await request.json().catch(() => ({}));

      if (typeof input.id !== 'string' || !input.id) {
        return json({ error: 'Identifiant manquant.' }, 400);
      }

      if (!isApplicationStatus(input.status)) {
        return json({ error: 'Statut invalide.' }, 400);
      }

      const applications = await listApplications();
      const application = applications.find((item) => item.id === input.id);

      if (!application) {
        return json({ error: 'Candidature introuvable.' }, 404);
      }

      const updatedApplication = {
        ...application,
        status: input.status,
        admin_comment:
          typeof input.adminComment === 'string' ? input.adminComment.trim() : '',
        platform_applied: input.platformApplied === true,
        updated_at: new Date().toISOString(),
      };

      await saveApplication(updatedApplication);

      return json({ application: updatedApplication });
    }

    return json({ error: 'Méthode non autorisée.' }, 405);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Erreur serveur.' },
      500,
    );
  }
}
