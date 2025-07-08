/**
 * 使用次数跟踪器 - 基于localStorage的防篡改实现
 * 
 * 特性：
 * 1. 基于UTC时间的日期键，确保全球时区一致性
 * 2. 签名验证防止用户直接修改localStorage
 * 3. 应用代码可以通过API实时更新数据和签名
 * 4. 数据异常时自动重置，不会卡死
 * 5. 只保留当天数据，每天自动重置
 */

import { getTodayUTCString, formatUTCString, nowUTC } from '@/lib/utils/time';

interface UsageData {
  date: string; // UTC日期 YYYY-MM-DD
  usage: Record<string, number>; // 功能使用次数
  signature: string; // 防篡改签名
  lastUpdate: string; // 最后更新时间 (UTC ISO string)
}

export class UsageTracker {
  private getTodayUTCStringKey(): string {
    return getTodayUTCString(); // 使用UTC时间工具 "2024-01-15"
  }

  /**
   * 检查是否在客户端环境
   */
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * 简单的签名生成（基于内容和密钥）
   * 注意：这不是加密安全的，只是防止简单的localStorage篡改
   */
  private generateSignature(data: string): string {
    // 使用简单的hash生成签名，实际项目可以使用更安全的方法
    let hash = 0;
    const secret = 'usage-tracker-secret-key'; // 可以从环境变量获取
    const content = data + secret;
    
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 验证数据签名
   */
  private verifySignature(data: string, signature: string): boolean {
    return this.generateSignature(data) === signature;
  }

  /**
   * 获取今天的使用数据（UTC时间）
   */
  private getTodayUsage(): UsageData {
    if (!this.isClient()) {
      // 服务端渲染时返回空数据
      return this.createEmptyUsageData(this.getTodayUTCStringKey());
    }

    const today = this.getTodayUTCStringKey();
    const stored = localStorage.getItem('usage-tracker');
    
    if (!stored) {
      return this.createEmptyUsageData(today);
    }

    try {
      const parsed: UsageData = JSON.parse(stored);
      
      // 检查日期，如果不是今天（UTC）则重置
      if (parsed.date !== today) {
        console.debug(`Usage tracker: Date changed from ${parsed.date} to ${today} (UTC), resetting`);
        return this.createEmptyUsageData(today);
      }

      // 验证签名，防止篡改
      const dataToVerify = JSON.stringify({
        date: parsed.date,
        usage: parsed.usage,
        lastUpdate: parsed.lastUpdate
      });
      
      if (!this.verifySignature(dataToVerify, parsed.signature)) {
        console.warn('Usage tracker: Signature verification failed, resetting data');
        return this.createEmptyUsageData(today);
      }

      return parsed;
    } catch (error) {
      console.warn('Usage tracker: Failed to parse stored data, resetting', error);
      return this.createEmptyUsageData(today);
    }
  }

  /**
   * 创建空的使用数据（UTC时间）
   */
  private createEmptyUsageData(date: string): UsageData {
    const now = nowUTC();
    const data = {
      date,
      usage: {},
      lastUpdate: formatUTCString(now)
    };
    
    const dataToSign = JSON.stringify(data);
    const signature = this.generateSignature(dataToSign);
    
    return { ...data, signature };
  }

  /**
   * 保存使用数据（UTC时间）
   */
  private saveUsageData(data: UsageData): void {
    if (!this.isClient()) return; // 服务端渲染时不保存

    try {
      // 更新最后修改时间为当前UTC时间
      data.lastUpdate = formatUTCString(nowUTC());
      
      // 重新生成签名
      const dataToSign = JSON.stringify({
        date: data.date,
        usage: data.usage,
        lastUpdate: data.lastUpdate
      });
      data.signature = this.generateSignature(dataToSign);
      
      localStorage.setItem('usage-tracker', JSON.stringify(data));
    } catch (error) {
      console.error('Usage tracker: Failed to save data', error);
    }
  }

  /**
   * 获取功能的今日使用次数
   */
  getRemainingUsage(feature: string, limit: number): number {
    const data = this.getTodayUsage();
    const used = data.usage[feature] || 0;
    return Math.max(0, limit - used);
  }

  /**
   * 检查是否可以使用功能
   */
  canUse(feature: string, limit: number): boolean {
    return this.getRemainingUsage(feature, limit) > 0;
  }

  /**
   * 消费使用次数
   */
  consumeUsage(feature: string): void {
    if (!this.isClient()) return; // 服务端渲染时不消费

    const data = this.getTodayUsage();
    data.usage[feature] = (data.usage[feature] || 0) + 1;
    this.saveUsageData(data);
  }

  /**
   * 重置所有使用次数（测试用）
   */
  reset(): void {
    if (!this.isClient()) return;

    localStorage.removeItem('usage-tracker');
    console.debug('Usage tracker: Reset all usage data');
  }

  /**
   * 获取所有使用统计（调试用）
   */
  getUsageStats(): Record<string, number> {
    const data = this.getTodayUsage();
    return { ...data.usage };
  }

  /**
   * 管理员功能：手动设置使用次数（用于测试或管理）
   * 注意：这会更新签名，应用可以通过此方法实时修改用户的使用次数
   */
  setUsage(feature: string, count: number): void {
    if (!this.isClient()) return;

    const data = this.getTodayUsage();
    data.usage[feature] = Math.max(0, count);
    this.saveUsageData(data);
    console.debug(`Usage tracker: Set ${feature} usage to ${count} (UTC: ${data.lastUpdate})`);
  }

  /**
   * 获取调试信息
   */
  getDebugInfo(): { date: string; lastUpdate: string; isToday: boolean } {
    const data = this.getTodayUsage();
    const today = this.getTodayUTCStringKey();
    
    return {
      date: data.date,
      lastUpdate: data.lastUpdate,
      isToday: data.date === today
    };
  }
} 