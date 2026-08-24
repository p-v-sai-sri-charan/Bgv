import { IconShieldCheck } from "@/components/icons";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#e0e7ff,transparent_55%)]"
      />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <IconShieldCheck width={22} height={22} />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            BGV Platform
          </h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
