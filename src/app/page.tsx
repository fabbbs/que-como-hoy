'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Meal,
  MealTimeSlot,
  CATEGORY_LABELS,
  CALORIE_GOAL,
  WATER_GOAL,
  TIME_SLOTS,
  TIME_SLOT_LABELS,
  SLOT_TO_CATEGORY,
} from '@/lib/types';
import {
  getMealsForSlot,
  addLogEntry,
  removeLogEntry,
  getTodayLog,
  getTodayCalories,
  getTodayWater,
  setTodayWater,
  hasTodayLipid,
  getLipidMeals,
  getTodayLipidEntry,
  hasTodayProteinShake,
  registerProteinShake,
  isTodayComplete,
  markDayComplete,
  unmarkDayComplete,
} from '@/lib/storage';
import Link from 'next/link';

export default function Dashboard() {
  const [activeSlot, setActiveSlot] = useState<MealTimeSlot | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [todayEntries, setTodayEntries] = useState(getTodayLog().entries);
  const [totalCalories, setTotalCalories] = useState(0);
  const [water, setWater] = useState(0);
  const [hasLipid, setHasLipid] = useState(false);
  const [lipidName, setLipidName] = useState<string | null>(null);
  const [showLipidPicker, setShowLipidPicker] = useState(false);
  const [lipidMeals, setLipidMeals] = useState<Meal[]>([]);
  const [hasShake, setHasShake] = useState(false);
  const [dayComplete, setDayComplete] = useState(false);
  const [toast, setToast] = useState<{ message: string; undoTimestamp?: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const refresh = useCallback(() => {
    const log = getTodayLog();
    setTodayEntries(log.entries);
    setTotalCalories(getTodayCalories());
    setWater(getTodayWater());
    setHasLipid(hasTodayLipid());
    setLipidName(getTodayLipidEntry());
    setLipidMeals(getLipidMeals());
    setHasShake(hasTodayProteinShake());
    setDayComplete(isTodayComplete());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (activeSlot) {
      setMeals(getMealsForSlot(activeSlot));
    }
  }, [activeSlot]);

  const showToast = (message: string, undoTimestamp?: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, undoTimestamp });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const handleSelect = (meal: Meal) => {
    addLogEntry(meal);
    refresh();
    setActiveSlot(null);
    showToast(`✅ ${meal.name} registrado`, new Date().toISOString());
  };

  const handleUndo = () => {
    if (toast?.undoTimestamp) {
      // Remove most recent entry
      const log = getTodayLog();
      const last = log.entries[log.entries.length - 1];
      if (last) {
        removeLogEntry(last.timestamp);
        refresh();
      }
    }
    setToast(null);
  };

  const handleRemove = (timestamp: string) => {
    removeLogEntry(timestamp);
    refresh();
  };

  const handleRandom = () => {
    if (!activeSlot) return;
    const slotMeals = getMealsForSlot(activeSlot);
    if (slotMeals.length === 0) return;
    const pick = slotMeals[Math.floor(Math.random() * slotMeals.length)];
    handleSelect(pick);
  };

  const handleWater = (delta: number) => {
    const next = Math.max(0, water + delta);
    setTodayWater(next);
    setWater(next);
  };

  const handleLipidSelect = (meal: Meal) => {
    addLogEntry(meal);
    refresh();
    setShowLipidPicker(false);
    showToast(`✅ ${meal.name} registrado`, new Date().toISOString());
  };

  const handleProteinShake = () => {
    registerProteinShake();
    refresh();
    showToast('✅ Batido nocturno + ZMA registrado', new Date().toISOString());
  };

  const handleDayComplete = () => {
    markDayComplete();
    setDayComplete(true);
  };

  const handleReopenDay = () => {
    unmarkDayComplete();
    setDayComplete(false);
  };

  // Group entries by slot category for timeline
  const getEntriesForSlot = (slot: MealTimeSlot) => {
    const cat = SLOT_TO_CATEGORY[slot];
    return todayEntries.filter((e) => e.meal.category === cat);
  };

  const calPercent = Math.min(100, Math.round((totalCalories / CALORIE_GOAL) * 100));
  const calColor = totalCalories > CALORIE_GOAL ? 'bg-red-500' : totalCalories > CALORIE_GOAL * 0.9 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div className="space-y-5">
      {/* Calorie progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border dark:border-gray-700">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Calorías de hoy</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {totalCalories}
              <span className="text-base font-normal text-gray-400"> / {CALORIE_GOAL} kcal</span>
            </p>
          </div>
          <p className="text-2xl font-bold text-gray-300 dark:text-gray-600">{calPercent}%</p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`${calColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${calPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {totalCalories < CALORIE_GOAL
            ? `Faltan ${CALORIE_GOAL - totalCalories} kcal`
            : totalCalories === CALORIE_GOAL
            ? '¡Meta alcanzada!'
            : `${totalCalories - CALORIE_GOAL} kcal sobre la meta`}
        </p>
      </div>

      {/* Water tracker */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border dark:border-gray-700">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">💧 Hidratación</p>
          <p className="text-xs font-medium text-blue-500">{water * 300} / {WATER_GOAL * 300} ml</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleWater(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center"
          >
            −
          </button>
          <div className="flex-1 flex gap-0.5">
            {Array.from({ length: WATER_GOAL }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-4 rounded-sm transition-colors ${
                  i < water ? 'bg-blue-400' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => handleWater(1)}
            className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-lg hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center justify-center"
          >
            +
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">{water} de {WATER_GOAL} vasos (300ml c/u)</p>
      </div>

      {/* Lipid option */}
      <div>
        <button
          onClick={() => !hasLipid && setShowLipidPicker(!showLipidPicker)}
          className={`w-full rounded-xl p-3 shadow-sm border text-left transition-colors ${
            hasLipid
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
              : showLipidPicker
              ? 'bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-600'
              : 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">🥑 Opción lipídica</p>
              {hasLipid ? (
                <p className="text-sm font-medium text-green-600 dark:text-green-400">✅ {lipidName}</p>
              ) : (
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">⚠️ Pendiente — toca para elegir</p>
              )}
            </div>
            {!hasLipid && (
              <span className="text-amber-400">{showLipidPicker ? '▲' : '▼'}</span>
            )}
          </div>
        </button>
        {showLipidPicker && !hasLipid && (
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {lipidMeals.map((m) => (
              <button
                key={m.id}
                onClick={() => handleLipidSelect(m)}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-2 text-left hover:border-green-400 dark:hover:border-green-600 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.name}</p>
                <p className="text-[10px] text-gray-400">{m.calories} kcal · {m.ingredients}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Protein shake */}
      <button
        onClick={() => !hasShake && handleProteinShake()}
        disabled={hasShake}
        className={`w-full rounded-xl p-3 shadow-sm border text-left transition-colors ${
          hasShake
            ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
            : 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 hover:border-purple-400'
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">🌙 Batido nocturno</p>
            {hasShake ? (
              <p className="text-sm font-medium text-green-600 dark:text-green-400">✅ Proteína + Creatina + ZMA</p>
            ) : (
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Toca para registrar · 130 kcal</p>
            )}
          </div>
          {!hasShake && <span className="text-purple-400 text-lg">+</span>}
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">1 scoop proteína + creatina (7g) + ZMA 30 min antes de dormir</p>
      </button>

      {/* Timeline */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">📅 Mi día</h2>
        <div className="space-y-2">
          {TIME_SLOTS.map((slot) => {
            const slotEntries = getEntriesForSlot(slot);
            // For snack slots, show distributed entries
            const isActive = activeSlot === slot;
            const hasMealsForSlot = slotEntries.length > 0;

            return (
              <div key={slot}>
                <button
                  onClick={() => setActiveSlot(isActive ? null : slot)}
                  className={`w-full rounded-lg p-3 flex items-center justify-between text-left transition-colors ${
                    isActive
                      ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600'
                      : hasMealsForSlot
                      ? 'bg-white dark:bg-gray-800 border dark:border-gray-700'
                      : 'bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      hasMealsForSlot ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {TIME_SLOT_LABELS[slot]}
                    </p>
                    {hasMealsForSlot ? (
                      <div className="mt-0.5">
                        {slotEntries.map((e) => (
                          <p key={e.timestamp} className="text-xs text-gray-500 dark:text-gray-400">
                            {e.meal.name} · {e.meal.calories} kcal
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-gray-600">Sin registrar</p>
                    )}
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">
                    {isActive ? '▲' : hasMealsForSlot ? '✓' : '+'}
                  </span>
                </button>

                {/* Expanded meal options */}
                {isActive && (
                  <div className="mt-2 ml-2 space-y-1">
                    <div className="flex gap-2 mb-2">
                      <button
                        onClick={handleRandom}
                        disabled={meals.length === 0}
                        className="bg-amber-500 text-white rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-amber-600 disabled:opacity-40"
                      >
                        🎲 Sorpréndeme
                      </button>
                    </div>
                    {meals.length === 0 ? (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        <p>No hay opciones para esta categoría</p>
                        <Link href="/settings" className="text-green-600 underline text-xs">
                          Agregar opciones →
                        </Link>
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] text-gray-400">⭐ Priorizando variedad de proteínas y legumbres</p>
                        {meals.slice(0, 8).map((meal) => (
                          <button
                            key={meal.id}
                            onClick={() => handleSelect(meal)}
                            className="w-full bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-2.5 flex items-center justify-between hover:border-green-400 dark:hover:border-green-600 transition-colors text-left"
                          >
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{meal.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {meal.calories} kcal
                                {meal.ingredients && ` · ${meal.ingredients}`}
                              </p>
                            </div>
                            <span className="text-green-500 text-lg">+</span>
                          </button>
                        ))}
                        {meals.length > 8 && (
                          <p className="text-[10px] text-gray-400 text-center">+{meals.length - 8} opciones más</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's log */}
      {todayEntries.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">📝 Detalle de hoy</h2>
          <div className="space-y-1">
            {todayEntries.map((entry) => (
              <div
                key={entry.timestamp}
                className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-2.5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{entry.meal.name}</p>
                  <p className="text-xs text-gray-400">
                    {CATEGORY_LABELS[entry.meal.category]} · {entry.meal.calories} kcal ·{' '}
                    {new Date(entry.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(entry.timestamp)}
                  className="text-gray-300 hover:text-red-500 text-sm transition-colors"
                  title="Quitar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day complete */}
      {todayEntries.length > 0 && !dayComplete && (
        <button
          onClick={handleDayComplete}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-sm"
        >
          ✅ Día listo
        </button>
      )}

      {dayComplete && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center space-y-2">
          <p className="text-lg font-bold text-green-700 dark:text-green-400">🎉 ¡Día completado!</p>
          <p className="text-sm text-green-600 dark:text-green-500">
            {totalCalories} kcal · {todayEntries.length} comidas · {water * 300} ml agua
          </p>
          <button
            onClick={handleReopenDay}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Reabrir día
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-fade-in">
          <span className="text-sm">{toast.message}</span>
          {toast.undoTimestamp && (
            <button
              onClick={handleUndo}
              className="text-amber-400 dark:text-amber-600 font-semibold text-sm hover:underline"
            >
              Deshacer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
