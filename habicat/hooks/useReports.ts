import { useState, useCallback } from 'react';

export type ReportRecord = Record<string, string>;

// streak_days → 猫ステージ（1〜3）
export const getCatStage = (streakDays: number): 1 | 2 | 3 => {
  if (streakDays >= 31) return 3;
  if (streakDays >= 8) return 2;
  return 1;
};

export const useReports = () => {
  const [reports, setReports] = useState<ReportRecord>({});
  const [streakDays, setStreakDays] = useState<number>(0);

  // 日報提出（後でAPI連携に差し替える箇所）
  const addReport = useCallback((dateString: string, memo: string) => {
    setReports(prev => ({ ...prev, [dateString]: memo }));
    // ※ 暫定：提出するたびに+1（API連携後はレスポンスのstreak_daysで更新）
    setStreakDays(prev => prev + 1);
  }, []);

  const catStage = getCatStage(streakDays);
  const totalCount = Object.keys(reports).length;

  return { reports, addReport, streakDays, catStage, totalCount };
};