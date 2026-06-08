export type ActionState<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function createSuccess<T>(data?: T): ActionState<T> {
  return { success: true, data };
}

export function createError(error: string): ActionState<never> {
  return { success: false, error };
}

export function handleActionError(err: unknown): ActionState<never> {
  const message = err instanceof Error ? err.message : 'An unexpected error occurred';
  return { success: false, error: message };
}
