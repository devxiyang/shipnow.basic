"use client";
import { analytics } from "@/config/site.config";
import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
/**
 * Google Analytics
 *
 * https://analytics.google.com
 */
export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const analyticsId = analytics.googleAnalyticsId;
  if (!analyticsId) {
    return null;
  }

  return <NextGoogleAnalytics gaId={analyticsId} />;
}

export function Analytics() {
  return (
    <>
      {/* google analytics */}
      <GoogleAnalytics />
    </>
  );
}