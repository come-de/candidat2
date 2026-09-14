import { getStore } from '@netlify/blobs';

import { assertAdmin, json } from './applications-store';

type PageView = {
  id: string;
  page: string;
  visitor_id: string;
  created_at: string;
};

const trackedPages = new Set(['bonne-etude-alpha']);

function isTrackedPage(page: unknown): page is string {
  return typeof page === 'string' && trackedPages.has(page);
}

export default async function handler(request: Request) {
  try {
    if (request.method === 'POST') {
      const input = await request.json().catch(() => ({}));

      if (!isTrackedPage(input.page)) {
        return json({ error: 'Page inconnue.' }, 400);
      }

      if (typeof input.visitorId !== 'string' || !input.visitorId.trim()) {
        return json({ error: 'Visiteur manquant.' }, 400);
      }

      const now = new Date().toISOString();
      const view: PageView = {
        id: crypto.randomUUID(),
        page: input.page,
        visitor_id: input.visitorId.trim().slice(0, 120),
        created_at: now,
      };

      const store = getStore('page-views');
      await store.setJSON(`${view.page}/${view.created_at}-${view.id}`, view);

      return json({ ok: true });
    }

    const adminError = assertAdmin(request);
    if (adminError) {
      return adminError;
    }

    if (request.method === 'GET') {
      const requestUrl = new URL(request.url);
      const page = requestUrl.searchParams.get('page') || 'bonne-etude-alpha';

      if (!isTrackedPage(page)) {
        return json({ error: 'Page inconnue.' }, 400);
      }

      const store = getStore('page-views');
      const { blobs } = await store.list({ prefix: `${page}/` });
      const views = await Promise.all(
        blobs.map((blob) => store.get(blob.key, { type: 'json' }) as Promise<PageView | null>),
      );
      const pageViews = views.filter((view): view is PageView => view !== null);
      const uniqueVisitors = new Set(pageViews.map((view) => view.visitor_id));
      const lastVisit = pageViews
        .map((view) => view.created_at)
        .sort((first, second) => new Date(second).getTime() - new Date(first).getTime())[0] || null;

      return json({
        stats: {
          page,
          total_visits: pageViews.length,
          unique_visitors: uniqueVisitors.size,
          last_visit_at: lastVisit,
        },
      });
    }

    return json({ error: 'Méthode non autorisée.' }, 405);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Erreur serveur.' },
      500,
    );
  }
}
