import { assertAdmin, json } from './applications-store';
import {
  createAnnualResponse,
  isAnnualResponseStatus,
  listAnnualResponses,
  saveAnnualResponse,
  validateAnnualResponse,
} from './annual-responses-store';

export default async function handler(request: Request) {
  try {
    if (request.method === 'POST') {
      const input = await request.json().catch(() => ({}));
      const validationError = validateAnnualResponse(input);

      if (validationError) {
        return json({ error: validationError }, 400);
      }

      const response = createAnnualResponse(input);
      await saveAnnualResponse(response);

      return json({ response });
    }

    const adminError = assertAdmin(request);
    if (adminError) {
      return adminError;
    }

    if (request.method === 'GET') {
      const responses = await listAnnualResponses();
      return json({ responses });
    }

    if (request.method === 'PATCH') {
      const input = await request.json().catch(() => ({}));

      if (typeof input.id !== 'string' || !input.id) {
        return json({ error: 'Identifiant manquant.' }, 400);
      }

      if (!isAnnualResponseStatus(input.status)) {
        return json({ error: 'Statut invalide.' }, 400);
      }

      const responses = await listAnnualResponses();
      const response = responses.find((item) => item.id === input.id);

      if (!response) {
        return json({ error: 'Réponse introuvable.' }, 404);
      }

      const updatedResponse = {
        ...response,
        status: input.status,
        admin_comment:
          typeof input.adminComment === 'string' ? input.adminComment.trim() : '',
        updated_at: new Date().toISOString(),
      };

      await saveAnnualResponse(updatedResponse);

      return json({ response: updatedResponse });
    }

    return json({ error: 'Méthode non autorisée.' }, 405);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Erreur serveur.' },
      500,
    );
  }
}
