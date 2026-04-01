'use client';

import { useState, useEffect } from 'react';
import { DailyLog, CATEGORY_LABELS, CALORIE_GOAL } from '@/lib/types';
import { getAllLogs, getWeeklySummary, WeeklySummary } from '@/lib/storage';

export default function HistoryPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [summary, setSummary] = useState<WeeklySummary | null>(null);

  useEffect(() => {
    const allLogs = getAllLogs().sort((a, b) => b.date.localeCompare(a.date));
    setLogs(allLogs);
    setSummary(getWeeklySummary());
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Hoy';
    if (dateStr === yesterday) return 'Ayer';

    return date.toLocaleDateString('es', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📅</p>
        <p>No hay registros todavía</p>
        <p className="text-sm mt-1">Empieza eligiendo qué comer hoy</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Historial</h1>

      {/* Weekly summary */}
      {summary && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <h2 className="font-bold mb-3">📊 Resumen semanal</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-80">Promedio diario</p>
              <p className="text-xl font-bold">{summary.avgCalories} <span className="text-sm font-normal">kcal</span></p>
              <p className="text-[10px] opacity-60">Meta: {CALORIE_GOAL} kcal</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Días registrados</p>
              <p className="text-xl font-bold">{summary.daysTracked} <span className="text-sm font-normal">días</span></p>
              <p className="text-[10px] opacity-60">{summary.totalEntries} comidas total</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Variedad de proteínas</p>
              <p className="text-sm font-medium">
                {summary.proteinVariety.length > 0 ? summary.proteinVariety.join(', ') : 'Sin datos'}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-80">Legumbres</p>
              <p className="text-xl font-bold">{summary.legumeDays} <span className="text-sm font-normal">días</span></p>
              <p className="text-[10px] opacity-60">{summary.legumeDays >= 2 ? '✅ Meta cumplida (2/sem)' : '⚠️ Meta: 2 veces/sem'}</p>
            </div>
          </div>
        </div>
      )}

      {logs.map((log) => {
        const totalCal = log.entries.reduce((sum, e) => sum + e.meal.calories, 0);
        return (
          <div key={log.date} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 flex justify-between items-center border-b dark:border-gray-600">
              <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{formatDate(log.date)}</span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">{totalCal} kcal</span>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {log.entries.map((entry, i) => (
                <div key={i} className="px-4 py-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{entry.meal.name}</p>
                    <p className="text-xs text-gray-400">
                      {CATEGORY_LABELS[entry.meal.category]} ·{' '}
                      {new Date(entry.timestamp).toLocaleTimeString('es', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{entry.meal.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
