import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            BGV Platform
          </h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
