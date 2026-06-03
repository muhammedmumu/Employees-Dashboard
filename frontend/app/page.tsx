import Navbar from "../src/components/Navbar";

const landingLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const portalCardClass =
  "rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-950/80";

function PortalCard({
  icon,
  title,
  description,
  loginHref,
  registerHref,
}: {
  icon: string;
  title: string;
  description: string;
  loginHref: string;
  registerHref: string;
}) {
  return (
    <div className={portalCardClass}>
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-2xl text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">
          {icon}
        </div>
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={loginHref}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 dark:bg-white dark:text-slate-950 dark:focus:ring-slate-800"
            >
              {title.split(" ")[0]} Login
            </a>
            <a
              href={registerHref}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-900"
            >
              {title.split(" ")[0]} Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.1),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef6ff_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.12),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-white">
      <Navbar links={landingLinks} actionLabel="Employee Login" actionHref="/employee/login" />

      <section id="home" className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-16">
        <div className="space-y-8 h-screen">
          <div className="space-y-5 ">
            <span className="inline-flex w-fit items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
              Employee Management System
            </span>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Employee Management System
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                A centralized platform that helps employees and administrators manage information, access, and daily operations with clarity, structure, and confidence.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <PortalCard
              icon="👤"
              title="Employee Portal"
              description="Employees can log in to manage their account, review their details, and stay connected to the system with a simple workflow."
              loginHref="/employee/login"
              registerHref="/employee/register"
            />

            <PortalCard
              icon="🛡️"
              title="Admin Portal"
              description="Administrators can access the control panel to handle employee operations, approvals, and system management tasks."
              loginHref="/admin/login"
              registerHref="/admin/register"
            />
          </div>
        </div>

        <div className="relative ">
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-sky-500/15 via-white to-slate-200/60 blur-3xl dark:from-sky-400/10 dark:via-slate-950 dark:to-slate-900" />
          <div className="flex flex-col items-start justify-center gap-6 ">
            <div className="animate-[float_7s_ease-in-out_infinite] rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950/80">
              <div className="flex h-fit-content flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Admin Desk</span>
                  <span className="rounded-full border border-white/20 px-3 py-1">Secure access</span>
                </div>
                <div className="space-y-3">
                  <div className="text-6xl leading-none">🛡️</div>
                  <div>
                    <h3 className="text-2xl font-semibold">Admin</h3>
                    <p className="mt-1 text-sm text-slate-300">Leadership, oversight, and system control in one place.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-[float_8s_ease-in-out_infinite] rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950/80 sm:mt-0  ">
              <div className="flex h-fit-content flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-400 p-6 text-white">
                <div className="flex items-center justify-between text-sm text-sky-50/90">
                  <span>Employee Hub</span>
                  <span className="rounded-full border border-white/20 px-3 py-1">Fast login</span>
                </div>
                <div className="space-y-3">
                  <div className="text-6xl leading-none">👤</div>
                  <div>
                    <h3 className="text-2xl font-semibold">Employee</h3>
                    <p className="mt-1 text-sm text-sky-50/90">A clean workspace for staff to manage daily information.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className=" h-fit-content grid gap-6 rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              This landing page gives users a clear entry point into the Employee Management System. It keeps the first impression focused on choice, clarity, and simple navigation into the correct portal.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Why it works</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              The design uses a SaaS-style layout, soft gradients, modern cards, and responsive spacing so the page feels polished on both desktop and mobile.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-slate-950 px-8 py-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p className="mt-2 text-sm text-slate-300">Need access help or onboarding support? Use the appropriate portal buttons above to continue.</p>
          </div>
          <a href="/employee/login" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100">
            Go to Employee Login
          </a>
        </div>
      </section>
    </main>
  );
}
