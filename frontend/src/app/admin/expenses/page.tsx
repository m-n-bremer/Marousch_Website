"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ExpenseItem {
  id: number;
  description: string;
  cost: number;
  createdAt: string;
}

interface EquipmentItem {
  id: number;
  name: string;
  createdAt: string;
  expenses: ExpenseItem[];
  total: number;
}

export default function ExpensesPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [newEquipName, setNewEquipName] = useState("");
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [newDesc, setNewDesc] = useState("");
  const [newCost, setNewCost] = useState("");
  const [editingExpense, setEditingExpense] = useState<number | null>(null);
  const [editDesc, setEditDesc] = useState("");
  const [editCost, setEditCost] = useState("");
  const [editingEquip, setEditingEquip] = useState<number | null>(null);
  const [editEquipName, setEditEquipName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    api.get("/expenses/").then((r) => {
      setEquipment(r.data.equipment || []);
      setGrandTotal(r.data.grandTotal || 0);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const addEquipment = async () => {
    if (!newEquipName.trim()) return;
    try {
      await api.post("/expenses/equipment", { name: newEquipName.trim() });
      setNewEquipName("");
      load();
      toast.success("Equipment added!");
    } catch { toast.error("Failed to add equipment."); }
  };

  const renameEquipment = async (id: number) => {
    if (!editEquipName.trim()) return;
    try {
      await api.put(`/expenses/equipment/${id}`, { name: editEquipName.trim() });
      setEditingEquip(null);
      load();
      toast.success("Equipment renamed!");
    } catch { toast.error("Failed to rename."); }
  };

  const deleteEquipment = async (id: number) => {
    if (!confirm("Delete this equipment and all its expenses?")) return;
    try {
      await api.delete(`/expenses/equipment/${id}`);
      load();
    } catch { toast.error("Failed to delete."); }
  };

  const addExpense = async (equipmentId: number) => {
    const cost = parseFloat(newCost);
    if (!newDesc.trim() || isNaN(cost) || cost <= 0) return;
    try {
      await api.post("/expenses/expense", { equipmentId, description: newDesc.trim(), cost });
      setNewDesc("");
      setNewCost("");
      load();
      toast.success("Expense saved!");
    } catch { toast.error("Failed to add expense."); }
  };

  const handleNewBlur = (equipmentId: number) => {
    const cost = parseFloat(newCost);
    if (newDesc.trim() && !isNaN(cost) && cost > 0) {
      addExpense(equipmentId);
    }
  };

  const startEdit = (exp: ExpenseItem) => {
    setEditingExpense(exp.id);
    setEditDesc(exp.description);
    setEditCost(exp.cost.toString());
  };

  const saveEdit = async (expenseId: number) => {
    const cost = parseFloat(editCost);
    if (!editDesc.trim() || isNaN(cost) || cost <= 0) {
      toast.error("Enter a valid description and cost.");
      return;
    }
    try {
      await api.put(`/expenses/expense/${expenseId}`, { description: editDesc.trim(), cost });
      setEditingExpense(null);
      load();
      toast.success("Expense updated!");
    } catch { toast.error("Failed to update expense."); }
  };

  const deleteExpense = async (id: number) => {
    try {
      await api.delete(`/expenses/expense/${id}`);
      load();
    } catch { toast.error("Failed to delete expense."); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d8e4dc] border-t-[#2d6a4f]" /></div>;

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#1b4332]">Expenses</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <input value={newEquipName} onChange={(e) => setNewEquipName(e.target.value)} placeholder="Equipment name..."
          onKeyDown={(e) => e.key === "Enter" && addEquipment()}
          className="flex-1 border border-[#d8e4dc] rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#52b788]" />
        <button onClick={addEquipment} className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white px-5 py-2 rounded-lg text-sm font-medium">
          + Add Equipment
        </button>
      </div>

      {equipment.length === 0 ? (
        <p className="text-[#636e72] bg-white p-4 rounded-lg border border-[#d8e4dc]">No equipment added yet.</p>
      ) : (
        <div className="space-y-4">
          {equipment.map((eq) => (
            <div key={eq.id} className="bg-white rounded-lg border border-[#d8e4dc] overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-[#f0f4f1]">
                {editingEquip === eq.id ? (
                  <div className="flex items-center gap-2">
                    <input value={editEquipName} onChange={(e) => setEditEquipName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && renameEquipment(eq.id)}
                      className="border border-[#d8e4dc] rounded px-3 py-1 text-sm font-semibold focus:ring-1 focus:ring-[#52b788]" />
                    <button onClick={() => renameEquipment(eq.id)} className="text-[#2d6a4f] text-sm font-medium hover:text-[#52b788]">Save</button>
                    <button onClick={() => setEditingEquip(null)} className="text-[#636e72] text-sm hover:text-[#2d3436]">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#1b4332] text-lg">{eq.name}</h3>
                    <button onClick={() => { setEditingEquip(eq.id); setEditEquipName(eq.name); }}
                      className="text-[#636e72] text-xs hover:text-[#2d6a4f]">Edit</button>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#2d6a4f]">Total: ${eq.total.toFixed(2)}</span>
                  <button onClick={() => deleteEquipment(eq.id)} className="text-red-500 text-sm hover:text-red-700">Delete</button>
                </div>
              </div>

              {eq.expenses.length > 0 && (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#d8e4dc]">
                      <th className="text-left p-3 text-xs font-medium text-[#636e72]">Description</th>
                      <th className="text-right p-3 text-xs font-medium text-[#636e72] w-28">Cost</th>
                      <th className="text-right p-3 text-xs font-medium text-[#636e72] w-36">Date</th>
                      <th className="w-32 p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {eq.expenses.map((exp, i) => (
                      <tr key={exp.id} className={`border-b border-[#d8e4dc] last:border-0 ${i % 2 === 1 ? "bg-[#f8faf9]" : ""}`}>
                        {editingExpense === exp.id ? (
                          <>
                            <td className="p-2">
                              <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                                className="w-full border border-[#d8e4dc] rounded px-2 py-1 text-sm focus:ring-1 focus:ring-[#52b788]" />
                            </td>
                            <td className="p-2">
                              <input type="number" value={editCost} onChange={(e) => setEditCost(e.target.value)} step="0.01" min="0"
                                className="w-full border border-[#d8e4dc] rounded px-2 py-1 text-sm text-right focus:ring-1 focus:ring-[#52b788]" />
                            </td>
                            <td className="p-2 text-sm text-right text-[#636e72]">
                              {new Date(exp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="p-2 text-right">
                              <div className="flex gap-1 justify-end">
                                <button onClick={() => saveEdit(exp.id)} className="text-[#2d6a4f] text-xs font-medium hover:text-[#52b788]">Save</button>
                                <button onClick={() => setEditingExpense(null)} className="text-[#636e72] text-xs hover:text-[#2d3436]">Cancel</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 text-sm">{exp.description}</td>
                            <td className="p-3 text-sm text-right font-medium">${exp.cost.toFixed(2)}</td>
                            <td className="p-3 text-sm text-right text-[#636e72]">
                              {new Date(exp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => startEdit(exp)} className="text-[#2d6a4f] text-xs hover:text-[#52b788]">Edit</button>
                                <button onClick={() => deleteExpense(exp.id)} className="text-red-400 text-xs hover:text-red-600">Remove</button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="p-3 border-t border-[#d8e4dc]">
                {addingTo === eq.id ? (
                  <div className="flex gap-2">
                    <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description"
                      onBlur={() => handleNewBlur(eq.id)}
                      className="flex-1 border border-[#d8e4dc] rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-[#52b788]" />
                    <input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} placeholder="Cost" step="0.01" min="0"
                      onBlur={() => handleNewBlur(eq.id)}
                      onKeyDown={(e) => e.key === "Enter" && addExpense(eq.id)}
                      className="w-28 border border-[#d8e4dc] rounded px-3 py-1.5 text-sm text-right focus:ring-1 focus:ring-[#52b788]" />
                    <button onClick={() => addExpense(eq.id)} className="bg-[#52b788] hover:bg-[#40916c] text-white px-3 py-1.5 rounded text-sm">Save</button>
                    <button onClick={() => { setAddingTo(null); setNewDesc(""); setNewCost(""); }}
                      className="bg-white border border-[#d8e4dc] px-3 py-1.5 rounded text-sm hover:bg-[#f0f4f1]">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingTo(eq.id)} className="text-[#2d6a4f] text-sm hover:text-[#52b788]">+ Add Expense</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6 bg-[#2d6a4f] text-white px-6 py-3 rounded-lg shadow-lg text-lg font-bold">
        All Expenses: ${grandTotal.toFixed(2)}
      </div>
    </div>
  );
}
