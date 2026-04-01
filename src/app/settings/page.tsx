'use client';

import { useState, useEffect, useRef } from 'react';
import { Meal, MealCategory, CATEGORIES, CATEGORY_LABELS, AppSettings } from '@/lib/types';
import { getMeals, addMeal, updateMeal, deleteMeal, generateId, saveMeals, getSettings, saveSettings, exportData, importData } from '@/lib/storage';
import { getSeedMeals } from '@/lib/seed-data';

export default function SettingsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', category: 'desayuno' as MealCategory, calories: '', ingredients: '' });
  const [filter, setFilter] = useState<MealCategory | 'all'>('all');
  const [showLoadConfirm, setShowLoadConfirm] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({ darkMode: false, calorieGoal: 2200 });
  const [importMsg, setImportMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMeals(getMeals());
    setSettings(getSettings());
  }, []);

  const resetForm = () => {
    setForm({ name: '', category: 'desayuno', calories: '', ingredients: '' });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.calories) return;

    const meal: Meal = {
      id: editingId || generateId(),
      name: form.name,
      category: form.category,
      calories: Number(form.calories),
      ingredients: form.ingredients,
    };

    if (editingId) {
      updateMeal(meal);
    } else {
      addMeal(meal);
    }

    setMeals(getMeals());
    resetForm();
  };

  const handleEdit = (meal: Meal) => {
    setForm({
      name: meal.name,
      category: meal.category,
      calories: meal.calories.toString(),
      ingredients: meal.ingredients,
    });
    setEditingId(meal.id);
  };

  const handleDelete = (id: string) => {
    deleteMeal(id);
    setMeals(getMeals());
    if (editingId === id) resetForm();
  };

  const handleLoadSeed = () => {
    const seedMeals = getSeedMeals();
    saveMeals(seedMeals);
    setMeals(seedMeals);
    setShowLoadConfirm(false);
    setLoaded(true);
    setTimeout(() => setLoaded(false), 3000);
  };

  const toggleDarkMode = () => {
    const next = { ...settings, darkMode: !settings.darkMode };
    setSettings(next);
    saveSettings(next);
    document.documentElement.classList.toggle('dark', next.darkMode);
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `que-como-hoy-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importData(ev.target?.result as string);
      setImportMsg(ok ? '✅ Datos importados correctamente' : '❌ Error al importar');
      if (ok) setMeals(getMeals());
      setTimeout(() => setImportMsg(''), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filtered = filter === 'all' ? meals : meals.filter((m) => m.category === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Opciones del nutricionista</h1>

      {/* Dark mode + Data management */}
      <div className="grid grid-cols-1 gap-3">
        {/* Dark mode toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-white">{settings.darkMode ? '🌙' : '☀️'} Modo oscuro</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ideal para la colación nocturna</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.darkMode ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Export / Import */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 space-y-3">
          <p className="font-medium text-gray-800 dark:text-white">💾 Respaldo de datos</p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Exportar JSON
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Importar JSON
            </button>
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
          {importMsg && <p className="text-sm">{importMsg}</p>}
        </div>
      </div>

      {/* Load nutrition plan */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 space-y-3">
        <div>
          <h2 className="font-semibold text-purple-800 dark:text-purple-300">📋 Plan de alimentación</h2>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">2200 kcal · Rendimiento deportivo / Recomposición corporal</p>
        </div>
        {loaded ? (
          <p className="text-sm text-green-600 font-medium">✅ ¡Plan cargado exitosamente! ({meals.length} opciones)</p>
        ) : !showLoadConfirm ? (
          <button
            onClick={() => setShowLoadConfirm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Cargar plan del nutricionista
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-600">⚠️ Esto reemplazará todas las opciones actuales ({meals.length}). ¿Continuar?</p>
            <div className="flex gap-2">
              <button
                onClick={handleLoadSeed}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Sí, reemplazar
              </button>
              <button
                onClick={() => setShowLoadConfirm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-3 border dark:border-gray-700">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200">
          {editingId ? '✏️ Editar opción' : '➕ Agregar opción'}
        </h2>
        <input
          type="text"
          placeholder="Nombre (ej: Avena con frutas)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          required
        />
        <div className="flex gap-2">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as MealCategory })}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Calorías"
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
            className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm w-28 focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
            min="0"
          />
        </div>
        <input
          type="text"
          placeholder="Ingredientes (opcional)"
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            {editingId ? 'Guardar cambios' : 'Agregar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
        >
          Todas ({meals.length})
        </button>
        {CATEGORIES.map((c) => {
          const count = meals.filter((m) => m.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1 rounded-full text-sm ${filter === c ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              {CATEGORY_LABELS[c]} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No hay opciones todavía. ¡Agrega las opciones de tu nutricionista!
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((meal) => (
            <div key={meal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{meal.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {CATEGORY_LABELS[meal.category]} · {meal.calories} kcal
                  {meal.ingredients && ` · ${meal.ingredients}`}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(meal)}
                  className="text-gray-400 hover:text-blue-500 p-1 text-sm"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(meal.id)}
                  className="text-gray-400 hover:text-red-500 p-1 text-sm"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
