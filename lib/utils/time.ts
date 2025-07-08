/**
 * Time utilities module - Using UTC standard consistently
 * 
 * Important principles:
 * 1. All server-side time operations use UTC
 * 2. Database stores time as UTC+timezone info (TIMESTAMPTZ)
 * 3. Stripe timestamps are uniformly converted to UTC for storage
 * 4. Time comparisons and calculations are performed in UTC
 */

/**
 * Get current UTC time
 */
export function nowUTC(): Date {
  return new Date(); // JavaScript Date objects are UTC when created, display converts based on system timezone
}

/**
 * Convert Stripe Unix timestamp to UTC Date object
 * Stripe timestamps are UTC second-level timestamps
 */
export function stripeTimestampToUTC(unixTimestamp: number): Date {
  return new Date(unixTimestamp * 1000); // Convert to milliseconds
}

/**
 * 将任意Date对象转换为UTC Date（确保一致性）
 */
export function toUTC(date: Date): Date {
  return new Date(date.getTime()); // 复制时间戳，确保UTC
}

/**
 * 安全的时间比较：确保两个时间都按UTC比较
 */
export function isAfterUTC(date1: Date, date2: Date): boolean {
  return toUTC(date1).getTime() > toUTC(date2).getTime();
}

/**
 * 安全的时间比较：确保两个时间都按UTC比较
 */
export function isBeforeUTC(date1: Date, date2: Date): boolean {
  return toUTC(date1).getTime() < toUTC(date2).getTime();
}

/**
 * 计算时间差（毫秒）
 */
export function timeDiffUTC(date1: Date, date2: Date): number {
  return toUTC(date1).getTime() - toUTC(date2).getTime();
}

/**
 * 根据计划周期计算查询时间范围
 * 使用精确的月份计算，避免固定天数的问题
 */
export function getQueryTimeRangeUTC(now: Date = nowUTC()) {
  const nowUtc = toUTC(now);
  
  // 月度计划：查询过去2个月
  const monthlyRange = new Date(nowUtc);
  monthlyRange.setUTCMonth(monthlyRange.getUTCMonth() - 2);
  
  // 年度计划：查询过去13个月  
  const annuallyRange = new Date(nowUtc);
  annuallyRange.setUTCMonth(annuallyRange.getUTCMonth() - 13);
  
  return { monthlyRange, annuallyRange, now: nowUtc };
}

/**
 * 根据计划周期计算一次性购买的有效期
 * 使用精确的月份/年份计算，处理月份天数差异
 */
export function getOneTimePurchaseExpiryUTC(completedAt: Date, interval: string): Date {
  const completedUtc = toUTC(completedAt);
  const expiry = new Date(completedUtc);
  
  if (interval === 'MONTHLY') {
    // 月度：加1个月
    expiry.setUTCMonth(expiry.getUTCMonth() + 1);
  } else {
    // 年度：加1年
    expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);
  }
  
  return expiry;
}

/**
 * 获取今天的UTC日期字符串 (YYYY-MM-DD)
 * 用于使用次数跟踪的日期键
 */
export function getTodayUTCString(): string {
  return nowUTC().toISOString().split('T')[0];
}

/**
 * 检查两个日期是否是同一天（UTC）
 */
export function isSameDayUTC(date1: Date, date2: Date): boolean {
  const d1 = toUTC(date1);
  const d2 = toUTC(date2);
  
  return d1.getUTCFullYear() === d2.getUTCFullYear() &&
         d1.getUTCMonth() === d2.getUTCMonth() &&
         d1.getUTCDate() === d2.getUTCDate();
}

/**
 * 格式化UTC时间为ISO字符串（用于日志和调试）
 */
export function formatUTCString(date: Date): string {
  return toUTC(date).toISOString();
}

/**
 * 从ISO字符串解析UTC时间
 */
export function parseUTCString(isoString: string): Date {
  return new Date(isoString);
}

/**
 * 时区安全的时间创建：从年月日创建UTC时间
 */
export function createUTCDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second)); // month从0开始
}

/**
 * 调试工具：输出时间的UTC信息
 */
export function debugTimeUTC(date: Date, label: string = 'Time'): void {
  const utc = toUTC(date);
  console.debug(`${label}: ${formatUTCString(utc)} (${utc.getTime()}ms)`);
} 