import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password · Universal Auth",
  description: "Reset your Universal Auth account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}