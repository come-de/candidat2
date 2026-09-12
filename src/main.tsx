import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  GraduationCap,
  HeartHandshake,
  Lock,
  RefreshCcw,
  Save,
  Send,
  ShieldCheck,
  UserCheck,
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

type Status = 'nouveau' | 'a_contacter' | 'accepte' | 'refuse' | 'ecarte';

type Application = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  current_activity: string;
  referral_source?: string;
  profile_note: string;
  status: Status;
  admin_comment: string | null;
  platform_applied?: boolean;
  created_at: string;
};

const strengths = [
  {
    icon: BookOpenCheck,
    title: 'Du CP à la terminale',
    text: 'Intervenir auprès d’élèves de niveaux variés, toujours avec une exigence adaptée.',
  },
  {
    icon: HeartHandshake,
    title: 'Un cadre scolaire',
    text: 'Toutes les missions ont lieu dans des établissements scolaires partenaires.',
  },
  {
    icon: GraduationCap,
    title: 'Une équipe sur place',
    text: 'Dans l’école, une personne est présente pour aider, orienter et guider les intervenants.',
  },
];

const activities = [
  'Étudiant',
  'Enseignant',
  'Salarié',
  'Indépendant',
  'En recherche d’emploi',
  'Autre',
];

const statuses: { value: Status | 'tous'; label: string }[] = [
  { value: 'tous', label: 'Liste principale' },
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'a_contacter', label: 'À contacter' },
  { value: 'accepte', label: 'Accepté' },
  { value: 'refuse', label: 'Refusé' },
  { value: 'ecarte', label: 'Écartées' },
];

const statusLabels: Record<Status, string> = {
  nouveau: 'Nouveau',
  a_contacter: 'À contacter',
  accepte: 'Accepté',
  refuse: 'Refusé',
  ecarte: 'Écartée',
};

const editableStatuses = statuses.filter((status) => status.value !== 'tous' && status.value !== 'ecarte') as { value: Status; label: string }[];

const ADMIN_PASSWORD_STORAGE_KEY = 'etude-alpha-admin-password';

const selectionSteps = [
  {
    title: 'Présélection rapide',
    text: 'Vous nous transmettez l’essentiel de votre profil, sans CV à cette étape.',
  },
  {
    title: 'Échange avec l’équipe',
    text: 'Si votre profil correspond, vous recevrez probablement un appel de nos services.',
  },
  {
    title: 'Parcours Alpha Education',
    text: 'Vous complétez ensuite votre profil, découvrez l’Étude Alpha en ligne et passez un entretien.',
  },
];

const candidateQualities = [
  'Fiabilité et ponctualité',
  'Pédagogie claire',
  'Sens du cadre',
  'Communication sérieuse',
];

const schoolFacts = [
  'Missions uniquement en établissements scolaires',
  'Élèves accompagnés du CP à la terminale',
  'Un référent présent dans l’école pour aider et guider',
];

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

      <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pb-8 pt-3 sm:px-8 sm:pt-7 lg:grid-cols-[0.95fr_1.05fr] lg:pb-12 lg:pt-10">
        <div className="mobile-hero-card sm:hidden">
          <img src="/college.png" alt="Tutrice accompagnant des élèves de collège" />
          <div className="mobile-hero-overlay">
            <p className="eyebrow text-white/80">Recrutement Étude Alpha</p>
            <h1>Devenir tuteur ou surveillant Alpha</h1>
            <p>Missions en établissements scolaires, du CP à la terminale.</p>
            <a href="/postuler" className="brand-button mobile-full-cta inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold">
              Postuler en 2 minutes <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="hidden max-w-3xl sm:block">
          <p className="eyebrow mb-4 inline-flex rounded-full border border-[#1e7a4a]/20 bg-[#1e7a4a]/8 px-3 py-1 text-[#1e7a4a]">
            Rejoindre le réseau de tuteurs Étude Alpha
          </p>
          <h1 className="max-w-3xl hero-title text-[#073f5c]">
            Devenir tuteur ou surveillant Alpha.
          </h1>
          <p className="mt-6 max-w-2xl body-large text-slate-650">
            Choisissez vos missions et votre emploi du temps depuis l’application
            Étude Alpha. Vous pouvez travailler très régulièrement, ou ne prendre
            aucune mission pendant plusieurs semaines, selon vos disponibilités.
          </p>
          <p className="mt-5 max-w-2xl rounded-md border border-[#ff751f]/25 bg-[#fff7f0] px-4 py-3 text-sm font-semibold leading-6 text-[#8a3b07]">
            Cette étape est volontairement courte : aucun CV n’est demandé. Si
            votre profil est retenu, la suite du parcours peut souvent être
            réalisée en moins de 24h.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/postuler" className="brand-button mobile-full-cta inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-[0.95rem] font-semibold">
              Postuler en 2 minutes <ArrowRight className="size-4" />
            </a>
            <a href="#mission" className="hidden h-12 items-center justify-center rounded-lg border border-[#085578]/20 px-5 text-[0.95rem] font-semibold text-[#085578] sm:inline-flex">
              Comprendre la mission
            </a>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#1e7a4a]" /> Présélection rapide</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="size-4 text-[#ff751f]" /> Du CP à la terminale</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#085578]" /> En établissement</span>
          </div>
        </div>

        <figure className="hero-media compact-hero-media hidden sm:block">
          <img src="/college.png" alt="Tutrice accompagnant des élèves de collège" className="h-56 w-full object-cover sm:h-72 lg:h-80" />
          <figcaption className="grid gap-2 p-4 text-sm text-slate-650 sm:grid-cols-3">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#1e7a4a]" /> Établissements</span>
            <span className="inline-flex items-center gap-2"><BookOpenCheck className="size-4 text-[#085578]" /> CP à terminale</span>
            <span className="inline-flex items-center gap-2"><UserCheck className="size-4 text-[#ff751f]" /> Référent sur place</span>
          </figcaption>
        </figure>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-6 sm:px-8">
        <div className="official-banner">
          <span className="official-badge"><ShieldCheck className="size-4" /> Sous-domaine officiel</span>
          <p>
            Ce site d’Alpha Education est dédié à la présélection des candidats.
            Les missions ont lieu uniquement dans des établissements scolaires.
            Les profils retenus finalisent ensuite leur candidature sur{' '}
            <a href="https://www.alphaeducation.fr" className="font-semibold text-[#085578]">
              www.alphaeducation.fr
            </a>
            .
          </p>
        </div>
        <div className="school-strip mt-3">
          {schoolFacts.map((fact) => (
            <div key={fact} className="school-strip-item">
              <CheckCircle2 className="size-4 text-[#1e7a4a]" />
              <span>{fact}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7faf9]">
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-10 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <figure className="app-card">
            <img src="/application-etude-alpha.png" alt="Application Étude Alpha pour gérer ses missions et disponibilités" />
            <figcaption>
              L’application Étude Alpha permet de consulter les informations utiles,
              les séances à venir, les disponibilités et les missions proposées.
            </figcaption>
          </figure>
          <div>
            <p className="eyebrow text-[#1e7a4a]">Organisation flexible</p>
            <h2 className="mt-3 section-title text-[#073f5c]">Vous choisissez votre rythme depuis l’application Étude Alpha.</h2>
            <p className="mt-5 body-large text-slate-650">
              Les missions sont proposées dans l’application. Vous pouvez les
              accepter selon vos disponibilités, votre ville, votre niveau
              d’aisance et le type de mission souhaité : étude, tutorat ou
              surveillance.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="flex-card">
                <CalendarCheck className="size-5 text-[#1e7a4a]" />
                <span>Travailler tous les jours si votre planning le permet.</span>
              </div>
              <div className="flex-card">
                <Clock3 className="size-5 text-[#ff751f]" />
                <span>Faire une pause complète pendant un mois si vous n’êtes pas disponible.</span>
              </div>
              <div className="flex-card">
                <UserCheck className="size-5 text-[#085578]" />
                <span>Choisir uniquement les missions qui correspondent à votre profil.</span>
              </div>
            </div>
            <a href="/postuler" className="brand-button mobile-full-cta mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold">
              Postuler en 2 minutes <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow text-[#ff751f]">Établissements scolaires</p>
            <h2 className="mt-3 section-title text-[#073f5c]">Un cadre identifié, avec une personne présente sur place.</h2>
            <p className="mt-5 body-large text-slate-650">
              Les missions de tutorat, d’étude ou de surveillance se déroulent
              exclusivement dans des établissements scolaires partenaires. Sur
              place, un référent peut aider les intervenants, répondre aux
              questions et faciliter l’organisation.
            </p>
            <a href="/postuler" className="brand-button mobile-full-cta mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold">
              Commencer la présélection <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="school-proof-grid">
            {strengths.map((item) => (
              <article key={item.title} className="school-proof-card">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#f7faf9] text-[#085578]">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-[#073f5c]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7faf9]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="eyebrow text-[#ff751f]">Parcours candidat</p>
              <h2 className="mt-3 section-title text-[#073f5c]">Une sélection claire, sans lourdeur inutile.</h2>
              <p className="mt-5 body-large text-slate-650">
                Le formulaire sert uniquement à repérer les profils les plus
                adaptés. Les informations détaillées, la présentation de l’Étude
                Alpha en ligne et l’entretien interviennent ensuite pour les
                candidats présélectionnés.
              </p>
            </div>
            <div className="grid gap-3">
              {selectionSteps.map((step, index) => (
                <article key={step.title} className="step-card">
                  <span className="step-number">{index + 1}</span>
                  <div>
                    <h3 className="text-[1.05rem] font-semibold text-[#073f5c]">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-650">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <CtaBand text="Prêt à nous transmettre votre profil ?" />
        </div>
      </section>

      <section id="mission" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-10 sm:px-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <img src="/lycee.png" alt="Tuteur accompagnant des lycéens pendant leurs devoirs" className="h-64 w-full object-cover sm:h-80 lg:h-full" />
          </div>
          <div>
            <p className="eyebrow text-[#ff751f]">Ce que vous apportez</p>
            <h2 className="mt-3 section-title text-[#073f5c]">Une présence structurante, attentive et responsable.</h2>
            <p className="mt-5 body-large text-slate-650">
              Les tuteurs Étude Alpha accompagnent les élèves dans la
              compréhension des consignes, l’organisation du travail, la
              consolidation des apprentissages et la mise en place de bonnes
              habitudes. Les missions se déroulent du CP à la terminale,
              exclusivement dans des établissements scolaires. La mission exige
              de la clarté, de la patience et une réelle qualité de suivi.
            </p>
            <p className="mt-5 rounded-md bg-[#eaf4ef] px-4 py-3 text-sm font-medium leading-6 text-[#1e7a4a]">
              Dans chaque établissement, une personne est présente pour aider,
              orienter et guider les intervenants. Vous n’êtes pas livré à
              vous-même : le cadre est organisé, identifié et suivi.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-[#085578]/15 bg-white p-5 shadow-[0_14px_42px_rgba(8,85,120,0.06)]">
                <div className="flex size-10 items-center justify-center rounded-md bg-white text-[#085578] shadow-sm">
                  <BookOpenCheck className="size-5" />
                </div>
                <h3 className="mt-4 text-[1.05rem] font-semibold text-[#073f5c]">
                  Tutorat
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Accompagner les élèves dans leurs devoirs, reprendre les
                  notions essentielles et installer une méthode de travail
                  solide.
                </p>
              </div>
              <div className="rounded-md border border-[#ff751f]/20 bg-white p-5 shadow-[0_14px_42px_rgba(255,117,31,0.08)]">
                <div className="flex size-10 items-center justify-center rounded-md bg-white text-[#ff751f] shadow-sm">
                  <Eye className="size-5" />
                </div>
                <h3 className="mt-4 text-[1.05rem] font-semibold text-[#073f5c]">
                  Surveillance
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Assurer un cadre calme, attentif et responsable lors des temps
                  d’étude, afin que chaque élève puisse travailler dans de bonnes
                  conditions.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-md border border-[#ff751f]/25 bg-[#ff751f]/8 p-5">
              <p className="eyebrow text-[#ff751f]">Rémunération</p>
              <p className="mt-2 text-[1.05rem] font-semibold text-[#073f5c]">
                14 à 19 € par heure, selon le lieu et la mission.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-650">
                Les missions sont réalisées sous statut micro-entrepreneur. Les
                modalités précises sont présentées aux candidats retenus lors de
                la suite du processus.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 bg-[#f7faf9] p-5">
                <p className="panel-title text-[#073f5c]">1500</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  tuteurs travaillent déjà avec nous dans un cadre structuré et
                  exigeant.
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-[#f7faf9] p-5">
                <p className="panel-title text-[#073f5c]">60</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  villes en France sont couvertes par notre réseau
                  d’accompagnement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow text-[#ff751f]">Réseau national</p>
            <h2 className="mt-3 section-title text-[#073f5c]">Des missions encadrées dans une soixantaine de villes.</h2>
            <p className="mt-5 body-large text-slate-650">
              Étude Alpha travaille avec un réseau d’établissements scolaires en
              France. Les missions, qu’il s’agisse de tutorat ou de surveillance,
              ont lieu dans ce cadre identifié, avec une organisation locale et
              une personne présente dans l’école pour accompagner les intervenants.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-[#085578]/12 bg-[#f7faf9] p-4">
                <p className="text-[1.35rem] font-bold text-[#073f5c]">1500 tuteurs</p>
                <p className="mt-1 text-sm leading-6 text-slate-650">déjà engagés auprès des élèves.</p>
              </div>
              <div className="rounded-md border border-[#1e7a4a]/16 bg-[#eaf4ef] p-4">
                <p className="text-[1.35rem] font-bold text-[#123f2b]">CP à terminale</p>
                <p className="mt-1 text-sm leading-6 text-[#1e7a4a]">dans des établissements scolaires uniquement.</p>
              </div>
            </div>
          </div>
          <figure className="map-card">
            <img src="/carte-reseau-alpha.png" alt="Carte du réseau Étude Alpha en France" className="h-full w-full object-cover" />
            <figcaption>
              Implantations et missions Étude Alpha sur le territoire français.
            </figcaption>
          </figure>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
          <CtaBand text="Rejoignez un réseau déjà actif dans toute la France." />
        </div>
      </section>

      <section className="bg-[#f7faf9]">
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow text-[#1e7a4a]">Profils recherchés</p>
            <h2 className="mt-3 section-title text-[#073f5c]">De l’exigence, mais un cadre simple pour candidater.</h2>
            <p className="mt-5 body-large text-slate-650">
              Nous ne cherchons pas seulement des connaissances scolaires. Nous
              recherchons des personnes capables d’être présentes, fiables et
              attentives, avec une vraie tenue dans la relation aux élèves, du
              CP à la terminale.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {candidateQualities.map((quality) => (
              <div key={quality} className="quality-card">
                <UserCheck className="size-5 text-[#1e7a4a]" />
                <span>{quality}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8">
          <CtaBand text="La première étape ne prend que quelques minutes." />
        </div>
      </section>
    </main>
  );
}

function CtaBand({ text }: { text: string }) {
  return (
    <div className="cta-band mt-8">
      <div>
        <p className="eyebrow text-[#ff751f]">Candidature rapide</p>
        <p className="mt-1 font-semibold text-[#073f5c]">{text}</p>
      </div>
      <a href="/postuler" className="brand-button mobile-full-cta inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold">
        Postuler en 2 minutes <ArrowRight className="size-4" />
      </a>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <a href="/" aria-label="Accueil Étude Alpha">
        <img src="/logo-etude-alpha.png" alt="L'Étude Alpha" className="h-11 w-auto" />
      </a>
      <nav className="flex items-center gap-2">
        <a href="/admin" className="hidden text-sm font-medium text-slate-600 transition hover:text-[#085578] sm:inline">Espace équipe</a>
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
          <img src="/logo-etude-alpha.png" alt="L'Étude Alpha" className="h-12 w-auto" />
          <div className="mt-8">
            <p className="eyebrow text-[#ff751f]">Candidature tuteur</p>
            <h1 className="mt-2 section-title text-[#073f5c]">Formulaire de présélection</h1>
            <p className="mt-3 body-large text-slate-600">
              Cette première étape nous permet d’identifier les profils les
              plus en phase avec les exigences d’Étude Alpha : sérieux,
              pédagogie, fiabilité et capacité à accompagner ou surveiller les
              élèves avec régularité, dans un établissement scolaire.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <p className="rounded-md border border-[#1e7a4a]/20 bg-[#eaf4ef] px-4 py-3 text-sm font-semibold leading-6 text-[#1e7a4a]">
                Aucun CV n’est demandé à cette étape.
              </p>
              <p className="rounded-md border border-[#ff751f]/25 bg-[#fff7f0] px-4 py-3 text-sm font-semibold leading-6 text-[#8a3b07]">
                Si votre profil est retenu, vous recevrez probablement un appel
                de nos services.
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-650">
              Les candidats présélectionnés seront ensuite invités à compléter
              un profil plus détaillé sur Alpha Education, avec leurs
              disponibilités, leurs matières et les éléments utiles à
              l’entretien.
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
      referralSource: String(form.get('referralSource') || '').trim(),
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
        <Field label="Prénom" name="firstName" autoComplete="given-name" />
        <Field label="Nom" name="lastName" autoComplete="family-name" />
        <Field label="Adresse e-mail" name="email" type="email" autoComplete="email" />
        <Field label="Numéro de téléphone" name="phone" type="tel" autoComplete="tel" />
        <Field label="Ville dans laquelle vous souhaitez travailler" name="city" autoComplete="address-level2" />
        <Field label="Comment nous avez-vous connu ?" name="referralSource" placeholder="Ami, école, affiche, réseau social..." />
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Activité actuelle
          <Select value={activity} onValueChange={(value) => setActivity(value || '')} required>
            <SelectTrigger className="h-11 w-full bg-white"><SelectValue placeholder="Choisir une activité" /></SelectTrigger>
            <SelectContent>
              {activities.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Le plus important : quelques mots sur votre profil
        <Textarea name="profileNote" required className="min-h-36 bg-white text-[0.98rem] leading-7" placeholder="Présentez brièvement votre parcours, votre rapport à la pédagogie et les matières que vous pourriez accompagner. Indiquez impérativement les études que vous avez suivies, les établissements concernés et les années ou périodes correspondantes." />
      </label>
      <label className="flex items-start gap-3 rounded-md border border-slate-200 bg-[#f7faf9] p-4 text-sm leading-6 text-slate-650">
        <Checkbox checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} required className="mt-1" />
        <span>J’accepte que mes données personnelles soient utilisées par Étude Alpha pour traiter ma candidature et me recontacter.</span>
      </label>
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <Button type="submit" disabled={isSubmitting} className="brand-button h-12 text-[0.95rem] font-semibold">
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
        <h1 className="mt-6 section-title text-[#073f5c]">Candidature bien reçue</h1>
        <p className="mx-auto mt-4 max-w-xl body-large text-slate-600">
          Merci pour votre intérêt. L’équipe Étude Alpha examinera votre profil
          avec attention et reviendra vers vous si votre candidature correspond
          au niveau d’exigence attendu. Les candidats retenus recevront ensuite
          un formulaire plus complet sur le site d’Alpha Education, puis seront
          orientés vers une présentation de l’Étude Alpha en ligne et un
          entretien. Cette suite peut se dérouler en moins de 24h, avec un appel
          probable de nos services.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/" className="brand-button inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium">Retour à l’accueil</a>
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
          <a href="/"><img src="/logo-etude-alpha.png" alt="L'Étude Alpha" className="h-11 w-auto" /></a>
          <a href="/postuler" className="text-sm font-semibold text-[#085578]">Lien direct du formulaire</a>
        </header>
        <AdminPanel />
      </div>
    </main>
  );
}

function AdminPanel() {
  const [password, setPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || '';
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<Status | 'tous'>('tous');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const visibleApplications = useMemo(
    () => filter === 'tous'
      ? applications.filter((application) => application.status !== 'ecarte')
      : applications.filter((application) => application.status === filter),
    [applications, filter],
  );

  const mainApplicationsCount = applications.filter((application) => application.status !== 'ecarte').length;
  const discardedApplicationsCount = applications.filter((application) => application.status === 'ecarte').length;

  useEffect(() => {
    if (savedPassword) {
      loadApplications(savedPassword);
    }
  }, []);

  async function loadApplications(secret = savedPassword || password) {
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/applications', { headers: { 'x-admin-password': secret } });
      if (!response.ok) throw new Error('Mot de passe invalide ou configuration manquante.');
      const result = (await response.json()) as { applications?: Application[] };
      setApplications(result.applications || []);
      setSavedPassword(secret);
      window.localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, secret);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Accès impossible.');
      window.localStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);
      setSavedPassword('');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateApplication(id: string, status: Status, adminComment: string, platformApplied: boolean) {
    setError('');
    const response = await fetch('/.netlify/functions/applications', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', 'x-admin-password': savedPassword },
      body: JSON.stringify({ id, status, adminComment, platformApplied }),
    });
    if (!response.ok) {
      setError('La mise à jour a échoué.');
      return false;
    }
    setApplications((current) => current.map((application) => application.id === id ? { ...application, status, admin_comment: adminComment, platform_applied: platformApplied } : application));
    return true;
  }

  if (!savedPassword) {
    return (
      <section className="mt-10 max-w-md rounded-lg border border-[#085578]/12 bg-white p-6 shadow-[0_18px_60px_rgba(8,85,120,0.10)]">
        <div className="flex size-11 items-center justify-center rounded-md bg-[#085578]/10 text-[#085578]"><Lock className="size-5" /></div>
        <h1 className="mt-5 section-title text-[#073f5c]">Espace équipe</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Connectez-vous avec le mot de passe administrateur pour consulter, qualifier et suivre les candidatures.</p>
        <form className="mt-6 grid gap-4" onSubmit={(event) => { event.preventDefault(); loadApplications(password); }}>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" className="h-11 bg-white" required />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="submit" className="brand-button h-11" disabled={isLoading}>{isLoading ? 'Connexion...' : 'Se connecter'}</Button>
        </form>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 rounded-lg border border-[#085578]/12 bg-white p-5 shadow-[0_18px_60px_rgba(8,85,120,0.08)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="section-title text-[#073f5c]">Suivi des candidatures</h1>
          <p className="mt-1 text-sm text-slate-600">
            {visibleApplications.length} candidature(s) affichée(s)
          </p>
        </div>
        <div className="grid gap-2 sm:flex-row">
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant={filter === 'tous' ? 'default' : 'outline'} onClick={() => setFilter('tous')} className={filter === 'tous' ? 'brand-button h-10' : 'h-10'}>
              Liste principale ({mainApplicationsCount})
            </Button>
            <Button type="button" variant={filter === 'ecarte' ? 'default' : 'outline'} onClick={() => setFilter('ecarte')} className={filter === 'ecarte' ? 'brand-button h-10' : 'h-10'}>
              Écartées ({discardedApplicationsCount})
            </Button>
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value as Status | 'tous')}>
            <SelectTrigger className="h-10 w-full bg-white sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{statuses.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}</SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={() => loadApplications()} className="h-10"><RefreshCcw /> Actualiser</Button>
            <Button type="button" onClick={() => { window.location.href = `/.netlify/functions/applications-export?password=${encodeURIComponent(savedPassword)}`; }} className="brand-button h-10"><Download /> Export CSV</Button>
          </div>
        </div>
      </div>
      {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="mt-4 grid gap-2">
        {visibleApplications.map((application) => <ApplicationRow key={application.id} application={application} onSave={updateApplication} />)}
      </div>
    </section>
  );
}

function ApplicationRow({ application, onSave }: { application: Application; onSave: (id: string, status: Status, adminComment: string, platformApplied: boolean) => Promise<boolean> }) {
  const [status, setStatus] = useState<Status>(application.status);
  const [comment, setComment] = useState(application.admin_comment || '');
  const [platformApplied, setPlatformApplied] = useState(application.platform_applied === true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdminFields, setShowAdminFields] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function saveChanges(nextStatus = status, nextPlatformApplied = platformApplied) {
    setIsSaving(true);
    const saved = await onSave(application.id, nextStatus, comment, nextPlatformApplied);
    if (saved) {
      setStatus(nextStatus);
      setPlatformApplied(nextPlatformApplied);
    }
    setIsSaving(false);
  }

  async function discardApplication() {
    const confirmation = window.prompt('Pour écarter cette candidature, tapez ECARTER.');
    if (confirmation !== 'ECARTER') return;
    await saveChanges('ecarte', platformApplied);
  }

  const hasLongProfile = application.profile_note.length > 180;
  const profileText = isExpanded || !hasLongProfile
    ? application.profile_note
    : `${application.profile_note.slice(0, 180).trim()}...`;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-[0_6px_18px_rgba(8,85,120,0.04)]">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-950">{application.first_name} {application.last_name}</h2>
            <Badge className="rounded-md bg-[#085578]/10 text-[#085578]">{statusLabels[application.status]}</Badge>
          {platformApplied ? <Badge className="rounded-md bg-[#1e7a4a]/10 text-[#1e7a4a]">Candidature plateforme finalisée</Badge> : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-650">
            <span><strong className="text-slate-700">Ville :</strong> {application.city}</span>
            <span><strong className="text-slate-700">Activité :</strong> {application.current_activity}</span>
            <span><strong className="text-slate-700">Origine :</strong> {application.referral_source || 'Non renseigné'}</span>
            <a className="font-medium text-[#085578]" href={`mailto:${application.email}`}>{application.email}</a>
            <a className="font-medium text-[#085578]" href={`tel:${application.phone}`}>{application.phone}</a>
          </div>
          <p className="mt-2 text-xs text-slate-500">Reçu le {new Date(application.created_at).toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button type="button" variant="outline" className="h-8 px-3 text-xs" onClick={() => setShowAdminFields((current) => !current)}>
            {showAdminFields ? 'Masquer les détails' : 'Voir détails'}
          </Button>
          {application.status === 'ecarte' ? (
            <Button type="button" variant="outline" className="h-8 border-[#1e7a4a]/25 px-3 text-xs text-[#1e7a4a] hover:bg-[#eaf4ef]" disabled={isSaving} onClick={() => saveChanges('nouveau', platformApplied)}>
              Remettre dans la liste principale
            </Button>
          ) : (
            <Button type="button" variant="outline" className="h-8 border-red-200 px-3 text-xs text-red-700 hover:bg-red-50" disabled={isSaving} onClick={discardApplication}>
              Écarter : retirer de la liste principale
            </Button>
          )}
          <Button type="button" variant="outline" className="h-8 px-3 text-xs" disabled={isSaving || platformApplied} onClick={() => saveChanges(status, true)}>
            <CheckCircle2 /> {platformApplied ? 'Candidature plateforme déjà finalisée' : 'Marquer : candidature plateforme finalisée'}
          </Button>
        </div>
      </div>

      {showAdminFields ? (
        <div className="mt-3 grid gap-3 border-t border-slate-200 pt-3 lg:grid-cols-[1fr_240px]">
          <div className="rounded-md bg-[#f7faf9] p-3">
            <p className="text-sm font-semibold text-[#085578]">Quelques mots sur le profil</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-650">{profileText}</p>
            {hasLongProfile ? (
              <button type="button" onClick={() => setIsExpanded((current) => !current)} className="mt-2 text-sm font-semibold text-[#085578]">
                {isExpanded ? 'Voir moins' : 'Voir plus'}
              </button>
            ) : null}
          </div>
          <div className="grid gap-2">
            {application.status === 'ecarte' ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                Candidature masquée de la liste principale
              </p>
            ) : (
              <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                <SelectTrigger className="h-9 w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{editableStatuses.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
              </Select>
            )}
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Commentaire interne
              <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Notes, relance, avis sur le profil..." className="min-h-20 bg-white" />
            </label>
            <Button type="button" className="brand-button h-9" disabled={isSaving} onClick={() => saveChanges()}>
              <Save /> {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      ) : null}
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
