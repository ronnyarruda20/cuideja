// Helpers para ler FormData de forma segura nas Server Actions.

export function texto(fd: FormData, campo: string): string | null {
  const v = fd.get(campo);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export function textoObrig(fd: FormData, campo: string): string {
  const v = texto(fd, campo);
  if (v === null) throw new Error(`Campo obrigatório ausente: ${campo}`);
  return v;
}

export function inteiro(fd: FormData, campo: string): number | null {
  const v = texto(fd, campo);
  if (v === null) return null;
  const n = parseInt(v.replace(/\D/g, ""), 10);
  return Number.isNaN(n) ? null : n;
}

export function booleano(fd: FormData, campo: string): boolean {
  return fd.get(campo) != null;
}

/** Tri-estado para perguntas Sim/Não/Não sei (retorna null quando "nao_sei"). */
export function simNao(fd: FormData, campo: string): boolean | null {
  const v = texto(fd, campo);
  if (v === "sim") return true;
  if (v === "nao") return false;
  return null;
}

/** Junta os valores marcados (checkboxes de mesmo name) num CSV. */
export function listaCsv(fd: FormData, campo: string): string | null {
  const vs = fd.getAll(campo).filter((v) => typeof v === "string") as string[];
  const limpos = vs.map((v) => v.trim()).filter(Boolean);
  return limpos.length ? limpos.join(",") : null;
}

export function data(fd: FormData, campo: string): Date | null {
  const v = texto(fd, campo);
  if (v === null) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
