// ── Validation constants ──
const MAX_TITLE_LENGTH = 150;
const MAX_PROJECT_NAME_LENGTH = 100;
const MAX_USER_NAME_LENGTH = 50;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

// ── Custom error class for service-layer validation ──
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// ── Validators ──

export function validateRequiredString(value: string, fieldName: string, maxLength: number): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ValidationError(`${fieldName} es requerido.`);
  }
  if (trimmed.length > maxLength) {
    throw new ValidationError(`${fieldName} debe tener ${maxLength} caracteres o menos.`);
  }
  return trimmed;
}

export function validateTaskTitle(title: string): string {
  return validateRequiredString(title, "Título de la tarea", MAX_TITLE_LENGTH);
}

export function validateProjectName(name: string): string {
  return validateRequiredString(name, "Nombre del proyecto", MAX_PROJECT_NAME_LENGTH);
}

export function validateUserName(name: string): string {
  return validateRequiredString(name, "Nombre", MAX_USER_NAME_LENGTH);
}

export function validatePassword(password: string): void {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new ValidationError(`La contraseña no puede tener más de ${MAX_PASSWORD_LENGTH} caracteres.`);
  }
}

export function validateImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new ValidationError(
      `El tipo de archivo "${file.type}" no es válido. Los tipos permitidos son: ${ALLOWED_IMAGE_TYPES.join(", ")}.`
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    throw new ValidationError(`El archivo es muy grande (${sizeMB} MB). El máximo permitido es 5 MB.`);
  }
}

export function validateId(id: string, fieldName: string): void {
  if (!id || !id.trim()) {
    throw new ValidationError(`${fieldName} es requerido.`);
  }
}
