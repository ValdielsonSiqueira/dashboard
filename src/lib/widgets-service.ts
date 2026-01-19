export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface SpendingAlert {
  id: string;
  category: string;
  limitAmount: number;
  enabled: boolean;
}

const GOALS_STORAGE_KEY = "valoro-savings-goals";
const ALERTS_STORAGE_KEY = "valoro-spending-alerts";

export function getSavingsGoals(): SavingsGoal[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavingsGoal[];
  } catch (error) {
    console.error("Erro ao ler metas do localStorage:", error);
    return [];
  }
}

export function saveSavingsGoals(goals: SavingsGoal[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error("Erro ao salvar metas no localStorage:", error);
  }
}

export function getSpendingAlerts(): SpendingAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SpendingAlert[];
  } catch (error) {
    console.error("Erro ao ler alertas do localStorage:", error);
    return [];
  }
}

export function saveSpendingAlerts(alerts: SpendingAlert[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch (error) {
    console.error("Erro ao salvar alertas no localStorage:", error);
  }
}
