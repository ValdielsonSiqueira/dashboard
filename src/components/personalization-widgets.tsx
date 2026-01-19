"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@valoro/ui";
import {
  IconTarget,
  IconAlertTriangle,
  IconSettings,
} from "@tabler/icons-react";

import {
  Transaction,
  getSavingsGoals,
  saveSavingsGoals,
  getSpendingAlerts,
  saveSpendingAlerts,
  SavingsGoal,
  SpendingAlert,
} from "@FIAP/util";

interface PersonalizationWidgetsProps {
  transactions: Transaction[];
}

import { useVisibility } from "../contexts/visibility-context";

const DEFAULT_CATEGORIES = [
  "Salário",
  "Assinaturas",
  "Cartão de Crédito",
  "Comida",
  "Mercado",
  "Financiamento",
  "Internet",
  "Casa",
  "Pensão",
  "Reserva",
  "Investimentos",
  "Entretenimento",
  "Educação",
  "Transferência",
  "Depósito",
];

export function PersonalizationWidgets({
  transactions,
}: PersonalizationWidgetsProps) {
  const { isVisible } = useVisibility();
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [spendingAlerts, setSpendingAlerts] = useState<SpendingAlert[]>([]);

  React.useEffect(() => {
    setSavingsGoals(getSavingsGoals());
    setSpendingAlerts(getSpendingAlerts());
  }, []);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dialogStep, setDialogStep] = useState<"select" | "goal" | "alert">(
    "select"
  );
  const [newGoal, setNewGoal] = useState({ name: "", target: "", current: "" });
  const [newAlert, setNewAlert] = useState({ category: "", limit: "" });

  React.useEffect(() => {
    if (!isSettingsOpen) {
      setTimeout(() => {
        setDialogStep("select");
        setNewGoal({ name: "", target: "", current: "" });
        setNewAlert({ category: "", limit: "" });
      }, 300);
    }
  }, [isSettingsOpen]);

  const calculateCategorySpending = (category: string) => {
    return transactions
      .filter((t) => t.type === "Despesa" && t.category === category)
      .reduce((sum, t) => sum + Math.abs(t.value), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    const newGoalObj: SavingsGoal = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGoal.name,
      targetAmount: Number(newGoal.target),
      currentAmount: Number(newGoal.current) || 0,
    };

    setSavingsGoals((prev) => {
      const updated = [...prev, newGoalObj];
      saveSavingsGoals(updated);
      return updated;
    });
    setIsSettingsOpen(false);
  };

  const handleAddAlert = () => {
    if (!newAlert.category || !newAlert.limit) return;

    setSpendingAlerts((prev) => {
      let updated: SpendingAlert[];
      const existing = prev.find((a) => a.category === newAlert.category);

      if (existing) {
        updated = prev.map((a) =>
          a.category === newAlert.category
            ? { ...a, limitAmount: Number(newAlert.limit), enabled: true }
            : a
        );
      } else {
        updated = [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            category: newAlert.category,
            limitAmount: Number(newAlert.limit),
            enabled: true,
          },
        ];
      }

      saveSpendingAlerts(updated);
      return updated;
    });
    setIsSettingsOpen(false);
  };

  const toggleAlert = (id: string, checked: boolean) => {
    setSpendingAlerts((prev) => {
      const updated = prev.map((a) =>
        a.id === id ? { ...a, enabled: checked } : a
      );
      saveSpendingAlerts(updated);
      return updated;
    });
  };

  const categories = React.useMemo(() => {
    const transactionCats = new Set(transactions.map((t) => t.category));
    const allCats = new Set([
      ...DEFAULT_CATEGORIES,
      ...Array.from(transactionCats),
    ]);
    return Array.from(allCats).sort();
  }, [transactions]);

  const hasGoals = savingsGoals.length > 0;
  const hasAlerts = spendingAlerts.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {hasGoals && (
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Metas de Economia
            </CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {savingsGoals.map((goal) => {
              const progress = Math.min(
                (goal.currentAmount / goal.targetAmount) * 100,
                100
              );
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span
                      className={`text-muted-foreground transition-all duration-300 ${
                        !isVisible ? "blur-sm select-none" : ""
                      }`}
                    >
                      {formatCurrency(goal.currentAmount)} /{" "}
                      {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className={`h-2 transition-all duration-300 ${
                      !isVisible ? "blur-sm" : ""
                    }`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
      {hasAlerts && (
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas de Gastos
            </CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {spendingAlerts
              .filter((a) => a.enabled)
              .map((alert) => {
                const spent = calculateCategorySpending(alert.category);
                const percentage = Math.min(
                  (spent / alert.limitAmount) * 100,
                  100
                );
                const isOverLimit = spent > alert.limitAmount;

                return (
                  <div key={alert.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{alert.category}</span>
                      <span
                        className={`transition-all duration-300 ${
                          !isVisible ? "blur-sm select-none" : ""
                        } ${
                          isOverLimit
                            ? "text-destructive font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatCurrency(spent)} /{" "}
                        {formatCurrency(alert.limitAmount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 transition-all duration-300 ${
                        !isVisible ? "blur-sm" : ""
                      }`}
                      indicatorClassName={
                        isOverLimit ? "bg-destructive" : undefined
                      }
                    />
                    {isOverLimit && (
                      <p className="text-xs text-destructive">
                        Você excedeu o limite em{" "}
                        {formatCurrency(spent - alert.limitAmount)}!
                      </p>
                    )}
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}

      <Card
        className="col-span-1 flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-muted/50 transition-colors min-h-[150px]"
        onClick={() => setIsSettingsOpen(true)}
      >
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <IconSettings className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            Personalizar Widgets
          </p>
        </CardContent>
      </Card>

      {/* --- Settings Dialog --- */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Personalizar Dashboard</DialogTitle>
            <DialogDescription>
              {dialogStep === "select"
                ? "Escolha qual widget deseja adicionar ao seu dashboard."
                : dialogStep === "goal"
                ? "Defina uma nova meta de economia."
                : "Crie um alerta de gastos para uma categoria."}
            </DialogDescription>
          </DialogHeader>

          {dialogStep === "select" && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setDialogStep("goal")}
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <IconTarget className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">Meta de Economia</span>
              </button>
              <button
                type="button"
                className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setDialogStep("alert")}
              >
                <div className="rounded-full bg-orange-500/10 p-3">
                  <IconAlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
                <span className="text-sm font-medium">Alerta de Gastos</span>
              </button>
            </div>
          )}

          {dialogStep === "goal" && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-name">Nome da Meta</Label>
                <Input
                  id="goal-name"
                  placeholder="Ex: Viagem, Carro Novo"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="goal-target">Valor Alvo (R$)</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    placeholder="0,00"
                    value={newGoal.target}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, target: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="goal-current">Valor Atual (R$)</Label>
                  <Input
                    id="goal-current"
                    type="number"
                    placeholder="0,00"
                    value={newGoal.current}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, current: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {dialogStep === "alert" && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="alert-category">Categoria</Label>
                <Select
                  value={newAlert.category}
                  onValueChange={(value) =>
                    setNewAlert({ ...newAlert, category: value })
                  }
                >
                  <SelectTrigger id="alert-category" className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="alert-limit">Limite Mensal (R$)</Label>
                <Input
                  id="alert-limit"
                  type="number"
                  placeholder="0,00"
                  value={newAlert.limit}
                  onChange={(e) =>
                    setNewAlert({ ...newAlert, limit: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {dialogStep === "select" ? (
              <Button
                variant="outline"
                onClick={() => setIsSettingsOpen(false)}
              >
                Cancelar
              </Button>
            ) : (
              <div className="flex w-full justify-between">
                <Button variant="ghost" onClick={() => setDialogStep("select")}>
                  Voltar
                </Button>
                <Button
                  onClick={
                    dialogStep === "goal" ? handleAddGoal : handleAddAlert
                  }
                >
                  {dialogStep === "goal" ? "Criar Meta" : "Criar Alerta"}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
