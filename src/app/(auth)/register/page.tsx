import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | TaskFlow",
};

export default function RegisterPage() {
  return <RegisterForm />;
}