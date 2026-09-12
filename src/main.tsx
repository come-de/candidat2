import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Download,
  GraduationCap,
  HeartHandshake,
  Lock,
  RefreshCcw,
  Save,
  Send,
  ShieldCheck,
} from 'lucide-react';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import './globals.css';

type Status = 'nouveau' | 'a_contacter' | 'accepte' | 'refuse';

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  current_activity: string;
  profile_note: string;
  status: Status;
  admin_comment: string | null;
  created_at: string;
};

const strengths = [
  {
    icon: BookOpenCheck,
    title: 'Aider concrètement',
    text: 'Accompagner les élèves dans leurs devoirs, leur méthode et leur confiance.',
  },
  {
    icon: HeartHandshake,
    title: 'Encadrer avec bienveillance',
    text: 'Créer un cadre sérieux, rassurant et motivant pour chaque famille.',
  },
  {
    icon: GraduationCap,
    title: 'Faire progresser',
    text: 'Suivre les besoins de l’élève et l’aider à avancer étape après étape.',
  },
];

const activities = [
  'Etudiant',
  'Enseignant',
  'Salarie',
  'Independant',
  'En recherche d’emploi',
  'Autre',
];

const statuses: { value: Status | 'tous'; label: string }[] = [
  { value: 'tous', label: 'Tous' },
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'a_contacter', label: 'A contacter' },
  { value: 'accepte', label: 'Accepte' },
  { value: 'refuse', label: 'Refuse' },
];

const statusLabels: Record<Status, string> = {
  nouveau: 'Nouveau',
  a_contacter: 'A contacter',
  accepte: 'Accepte',
  refuse: 'Refuse',
};

function App() {
  const path = window.location.pathname;

  if (path === '/postuler') return <ApplyPage />;
  if (path === '/confirmation') return <ConfirmationPage />;
  if (path === '/admin') return <AdminPage />;
  return <HomePage />;
}

function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:pb-24 lg:pt-14">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-[#1e7a4a]/20 bg-[#1e7a4a]/8 px-3 py-1 text-sm font-semibold text-[#1e7a4a]">
            Rejoindre le reseau de tuteurs Etude Alpha
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] text-[#073f5c] sm:text-5xl lg:text-6xl">
            Aidez les eleves a progresser dans un cadre clair, humain et exigeant.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-650">
            Etude Alpha recrute des tuteurs pour accompagner les eleves dans
            leurs devoirs, renforcer leurs acquis et assurer un encadrement
            regulier aupres des familles.
          </p>
          <p className="mt-4 max-w-2xl rounded-md border border-[#ff751f]/25 bg-[#ff751f]/8 px-4 py-3 text-sm font-medium leading-6 text-[#8a3b07]">
            Ce formulaire est une preselection rapide. Les candidats retenus
            recevront ensuite un formulaire plus complet a renseigner sur leur profil.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/postuler" className="brand-button inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-base font-medium">
              Postuler en 2 minutes <ArrowRight className="size-4" />
            </a>
            <a href="#mission" className="inline-flex h-12 items-center justify-center rounded-lg border border-[#085578]/20 px-5 text-base font-medium text-[#085578]">
              Comprendre la mission
            </a>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#1e7a4a]" /> Candidature courte</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-[#ff751f]" /> Reponse rapide</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#085578]" /> Donnees protegees</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#085578]/12 bg-white shadow-[0_24px_80px_rgba(8,85,120,0.13)]">
          <img src="/college.png" alt="Tutrice accompagnant des eleves de college" className="h-64 w-full object-cover sm:h-80" />
          <div className="p-5">
            <div className="rounded-md bg-[#085578] p-6 text-white">
              <p className="text-sm font-semibold text-white/75">Mission</p>
              <h2 className="mt-3 text-3xl font-semibold">Accompagner les jeunes avec methode et attention.</h2>
              <p className="mt-4 leading-7 text-white/78">
                Nous cherchons des profils fiables, pedagogues et ponctuels,
                capables de transformer le temps des devoirs en moment de progression.
              </p>
            </div>
            <div className="mt-5 grid gap-3">
              {strengths.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-[#085578] shadow-sm">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <img src="/lycee.png" alt="Tuteur accompagnant des lyceens pendant leurs devoirs" className="h-full min-h-80 w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-[#ff751f]">Ce que vous apportez</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#073f5c]">Une presence qui aide les eleves a tenir le rythme.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-650">
              Les tuteurs Etude Alpha accompagnent les eleves dans la
              comprehension des consignes, l’organisation du travail et la
              consolidation des apprentissages.
            </p>
            <p className="mt-5 rounded-md bg-[#eaf4ef] px-4 py-3 text-sm font-medium leading-6 text-[#1e7a4a]">
              Cette premiere etape sert uniquement a verifier l’adequation du
              profil. Si votre candidature est retenue, vous serez invite a
              completer un dossier plus detaille.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <a href="/" aria-label="Accueil Etude Alpha">
        <img src="/logo-etude-alpha.png" alt="L'Etude Alpha" className="h-11 w-auto" />
      </a>
      <nav className="flex items-center gap-2">
        <a href="/admin" className="hidden text-sm font-medium text-slate-600 transition hover:text-[#085578] sm:inline">Espace equipe</a>
        <a href="/postuler" className="brand-button inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium">Postuler</a>
      </nav>
    </header>
  );
}

function ApplyPage() {
  return (
    <main className="min-h-screen bg-[#f7faf9] px-5 py-6 text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#085578]"><ArrowLeft className="size-4" /> Retour</a>
        <section className="mt-6 rounded-lg border border-[#085578]/12 bg-white p-5 shadow-[0_18px_60px_rgba(8,85,120,0.10)] sm:p-8">
          <img src="/logo-etude-alpha.png" alt="L'Etude Alpha" className="h-12 w-auto" />
          <div className="mt-8">
            <p className="text-sm font-semibold uppercase text-[#ff751f]">Candidature tuteur</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#073f5c] sm:text-4xl">Postuler en 2 minutes</h1>
            <p className="mt-3 leading-7 text-slate-600">
              Ce formulaire est une premiere preselection. Quelques informations
              suffisent pour que notre equipe puisse etudier votre profil.
            </p>
            <p className="mt-4 rounded-md border border-[#ff751f]/25 bg-[#ff751f]/8 px-4 py-3 text-sm font-medium leading-6 text-[#8a3b07]">
              Si votre candidature est retenue, un formulaire plus complet vous
              sera ensuite demande sur votre profil.
            </p>
          </div>
          <ApplicationForm />
        </section>
      </div>
    </main>
  );
}

function ApplicationForm() {
  const [activity, setActivity] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      firstName: String(form.get('firstName') || '').trim(),
      lastName: String(form.get('lastName') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      city: String(form.get('city') || '').trim(),
      currentActivity: activity,
      profileNote: String(form.get('profileNote') || '').trim(),
      consent,
    };

    try {
      const response = await fetch('/.netlify/functions/applications', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(result?.error || 'Impossible d’envoyer la candidature.');
      }

      window.location.href = '/confirmation';
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Impossible d’envoyer la candidature.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitApplication} className="mt-8 grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prenom" name="firstName" autoComplete="given-name" />
        <Field label="Nom" name="lastName" autoComplete="family-name" />
        <Field label="Adresse e-mail" name="email" type="email" autoComplete="email" />
        <Field label="Numero de telephone" name="phone" type="tel" autoComplete="tel" />
        <Field label="Ville dans laquelle vous souhaitez travailler" name="city" autoComplete="address-level2" />
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Activite actuelle
          <Select value={activity} onValueChange={(value) => setActivity(value || '')} required>
            <SelectTrigger className="h-11 w-full bg-white"><SelectValue placeholder="Choisir une activite" /></SelectTrigger>
            <SelectContent>
              {activities.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Le plus important : Quelques mots sur votre profil
        <Textarea name="profileNote" required className="min-h-32 bg-white" placeholder="Votre parcours, les matieres que vous aimez accompagner, votre experience avec les eleves..." />
      </label>
      <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-[#f7faf9] p-4 text-sm leading-6 text-slate-650">
        <Checkbox checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} required className="mt-1" />
        <span>J’accepte que mes donnees personnelles soient utilisees par Etude Alpha pour traiter ma candidature et me recontacter.</span>
      </label>
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting} className="brand-button h-12 text-base">
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma candidature'} <Send />
      </Button>
    </form>
  );
}

function Field({ label, name, type = 'text', ...props }: React.ComponentProps<'input'> & { label: string; name: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <Input name={name} type={type} required className="h-11 bg-white" {...props} />
    </label>
  );
}

function ConfirmationPage() {
  const platformUrl = import.meta.env.VITE_PLATFORM_URL;
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7faf9] px-5 py-10">
      <section className="w-full max-w-2xl rounded-lg border border-[#085578]/12 bg-white p-6 text-center shadow-[0_18px_60px_rgba(8,85,120,0.10)] sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#1e7a4a]/10 text-[#1e7a4a]"><CheckCircle2 className="size-7" /></div>
        <h1 className="mt-6 text-3xl font-semibold text-[#073f5c]">Candidature envoyee</h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
          Merci pour votre interet. L’equipe Etude Alpha va etudier votre profil
          et reviendra vers vous si votre candidature correspond aux besoins du moment.
          Les candidats retenus recevront ensuite un formulaire plus complet.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/" className="brand-button inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium">Retour a l’accueil</a>
          {platformUrl ? <a href={platformUrl} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#085578]/20 px-5 text-sm font-medium text-[#085578]">Plateforme principale <ArrowRight className="size-4" /></a> : null}
        </div>
      </section>
    </main>
  );
}

function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f7faf9] px-4 py-5 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href="/"><img src="/logo-etude-alpha.png" alt="L'Etude Alpha" className="h-11 w-auto" /></a>
          <a href="/postuler" className="text-sm font-semibold text-[#085578]">Lien direct formulaire</a>
        </header>
        <AdminPanel />
      </div>
    </main>
  );
}

function AdminPanel() {
  const [password, setPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<Status | 'tous'>('tous');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const visibleApplications = useMemo(
    () => filter === 'tous' ? applications : applications.filter((application) => application.status === filter),
    [applications, filter],
  );

  async function loadApplications(secret = savedPassword || password) {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/applications', { headers: { 'x-admin-password': secret } });
      if (!response.ok) throw new Error('Mot de passe invalide ou configuration manquante.');
      const result = (await response.json()) as { applications?: Application[] };
      setApplications(result.applications || []);
      setSavedPassword(secret);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Acces impossible.');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateApplication(id: string, status: Status, adminComment: string) {
    setError('');
    const response = await fetch('/.netlify/functions/applications', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'x-admin-password': savedPassword },
      body: JSON.stringify({ id, status, adminComment }),
    });
    if (!response.ok) {
      setError('La mise a jour a echoue.');
      return;
    }
    setApplications((current) => current.map((application) => application.id === id ? { ...application, status, admin_comment: adminComment } : application));
  }

  if (!savedPassword) {
    return (
      <section className="mt-10 max-w-md rounded-lg border border-[#085578]/12 bg-white p-6 shadow-[0_18px_60px_rgba(8,85,120,0.10)]">
        <div className="flex size-11 items-center justify-center rounded-md bg-[#085578]/10 text-[#085578]"><Lock className="size-5" /></div>
        <h1 className="mt-5 text-3xl font-semibold text-[#073f5c]">Espace equipe</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Connectez-vous avec le mot de passe admin pour consulter et suivre les candidatures.</p>
        <form className="mt-6 grid gap-4" onSubmit={(event) => { event.preventDefault(); loadApplications(password); }}>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" className="h-11 bg-white" required />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button className="brand-button h-11" disabled={isLoading}>{isLoading ? 'Connexion...' : 'Se connecter'}</Button>
        </form>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 rounded-lg border border-[#085578]/12 bg-white p-5 shadow-[0_18px_60px_rgba(8,85,120,0.08)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#073f5c]">Candidatures</h1>
          <p className="mt-1 text-sm text-slate-600">{visibleApplications.length} candidature(s) affichee(s)</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={filter} onValueChange={(value) => setFilter(value as Status | 'tous')}>
            <SelectTrigger className="h-10 w-full bg-white sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{statuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" onClick={() => loadApplications()} className="h-10"><RefreshCcw /> Actualiser</Button>
          <Button onClick={() => { window.location.href = `/.netlify/functions/applications-export?password=${encodeURIComponent(savedPassword)}`; }} className="brand-button h-10"><Download /> Export CSV</Button>
        </div>
      </div>
      {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-5 grid gap-4">
        {visibleApplications.map((application) => <ApplicationRow key={application.id} application={application} onSave={updateApplication} />)}
      </div>
    </section>
  );
}

function ApplicationRow({ application, onSave }: { application: Application; onSave: (id: string, status: Status, adminComment: string) => Promise<void> }) {
  const [status, setStatus] = useState<Status>(application.status);
  const [comment, setComment] = useState(application.admin_comment || '');
  const [isSaving, setIsSaving] = useState(false);

  return (
    <article className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 lg:grid-cols-[1fr_260px]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold text-slate-950">{application.first_name} {application.last_name}</h2>
          <Badge className="rounded-md bg-[#085578]/10 text-[#085578]">{statusLabels[application.status]}</Badge>
        </div>
        <dl className="mt-4 grid gap-3 text-sm text-slate-650 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Ville souhaitee" value={application.city} />
          <Info label="Activite" value={application.current_activity} />
          <Info label="E-mail" value={application.email} />
          <Info label="Telephone" value={application.phone} />
        </dl>
        <div className="mt-5 rounded-md bg-[#f7faf9] p-4">
          <p className="text-sm font-semibold text-[#085578]">Quelques mots sur le profil</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-650">{application.profile_note}</p>
        </div>
        <p className="mt-4 text-xs text-slate-500">Recu le {new Date(application.created_at).toLocaleDateString('fr-FR')}</p>
      </div>
      <div className="grid gap-3">
        <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
          <SelectTrigger className="h-10 w-full bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>{statuses.slice(1).map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
        </Select>
        <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Commentaire interne" className="min-h-24 bg-white" />
        <Button className="brand-button h-10" disabled={isSaving} onClick={async () => { setIsSaving(true); await onSave(application.id, status, comment); setIsSaving(false); }}>
          <Save /> {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-slate-900">{value}</dd>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
