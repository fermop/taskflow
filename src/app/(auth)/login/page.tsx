import { LoginForm } from "@/features/auth/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | TaskFlow",
};

export default function LoginPage() {
  return <LoginForm />;
}