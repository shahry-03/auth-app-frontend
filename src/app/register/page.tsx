import { RegisterForm } from "universal-auth-nextjs";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <RegisterForm />
    </main>
  );
}
