declare module "@FIAP/util" {
  // transactions-service
  export interface Transaction {
    id: number;
    transaction: string;
    value: number;
    type: "Receita" | "Despesa";
    category: string;
    date: string;
    effectiveValue: number;
    attachment?: string;
  }

  export function initializeStorage(defaultData: Transaction[]): void;
  export function getTransactions(): Transaction[];
  export function createTransaction(data: {
    nome: string;
    valor: string;
    tipo: string;
    categoria: string;
    data: Date | undefined;
    attachment?: string;
  }): Transaction | null;
  export function updateTransaction(
    id: number,
    data: {
      nome: string;
      valor: string;
      tipo: string;
      categoria: string;
      data: Date | undefined;
      attachment?: string;
    }
  ): Transaction | null;
  export function deleteTransaction(id: number): boolean;
  export function deleteTransactions(ids: number[]): boolean;

  // widgets-service
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
  export function getSavingsGoals(): SavingsGoal[];
  export function saveSavingsGoals(goals: SavingsGoal[]): void;
  export function getSpendingAlerts(): SpendingAlert[];
  export function saveSpendingAlerts(alerts: SpendingAlert[]): void;

  // user-service
  export interface UserProfile {
    name: string;
    email: string;
    avatar: string;
  }
  export function getUserProfile(): UserProfile;
  export function saveUserProfile(user: UserProfile): void;

  // category-colors
  export function getCategoryColor(category: string): string;
  export function isCategoryOutline(category: string): boolean;
  export const CATEGORY_COLORS: Record<string, string>;

  // custom-categories
  export interface CustomCategory {
    value: string;
    label: string;
    color?: string;
  }
  export function loadCustomCategories(): CustomCategory[];
  export function saveCustomCategories(categories: CustomCategory[]): void;
  export function addCustomCategory(category: CustomCategory): void;
  export function loadCustomCategoryColors(): Record<string, string>;
  export function saveCustomCategoryColor(
    categoryLabel: string,
    color: string
  ): void;
  export function normalizeCategoryValue(label: string): string;

  // utils
  // Use any or define ClassValue locally to avoid top-level import
  type ClassValue = any;
  export function cn(...inputs: ClassValue[]): string;
}
