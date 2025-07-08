import { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: `Terms of Service - ${siteConfig.name}`,
  description: `Terms of Service for ${siteConfig.name}. Read our terms and conditions for using our SaaS platform.`,
  alternates: {
    canonical: `${siteConfig.url}/terms-of-service`,
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Header />
        
        <div className="space-y-6 pb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground">Last updated: January 1, 2025</p>
              
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing and using {siteConfig.name}, you accept and agree to be bound by the 
                terms and provision of this agreement.
              </p>

              <h2>Use License</h2>
              <p>
                Permission is granted to use {siteConfig.name} for personal and commercial purposes 
                subject to these terms. Under this license you may not:
              </p>
              <ul>
                <li>Attempt to reverse engineer any software</li>
                <li>Use the service to violate any applicable laws</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>

              <h2>Service Description</h2>
              <p>
                {siteConfig.name} is a SaaS platform that provides [describe your service here]. 
                We offer subscription-based access to our features and services.
              </p>

              <h2>User Accounts</h2>
              <p>You are responsible for:</p>
              <ul>
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Providing accurate and complete information</li>
              </ul>

              <h2>Subscription and Billing</h2>
              <p>
                Subscription fees are billed in advance on a recurring basis. You authorize us to charge 
                your payment method for all fees. Subscriptions automatically renew unless cancelled.
              </p>

              <h2>Cancellation and Refunds</h2>
              <p>
                You may cancel your subscription at any time. Cancellations take effect at the end of 
                your current billing period. Refunds are provided on a case-by-case basis.
              </p>

              <h2>Prohibited Uses</h2>
              <p>You may not use our service:</p>
              <ul>
                <li>For any unlawful purpose or to solicit unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations or laws</li>
                <li>To transmit or procure the sending of any unsolicited advertising or promotional material</li>
                <li>To impersonate or attempt to impersonate another person or entity</li>
              </ul>

              <h2>Content and Data</h2>
              <p>
                You retain ownership of your data. We may use your data to provide and improve our services. 
                You grant us a license to use, store, and process your data for these purposes.
              </p>

              <h2>Disclaimer</h2>
              <p>
                The service is provided on an 'as is' basis. We make no warranties, expressed or implied, 
                and hereby disclaim all other warranties including without limitation, implied warranties 
                of merchantability, fitness for a particular purpose, or non-infringement.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                In no event shall {siteConfig.name} be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising out of your use of the service.
              </p>

              <h2>Modifications</h2>
              <p>
                We may revise these terms at any time. We will notify you of any material changes. 
                Continued use of the service after changes constitutes acceptance.
              </p>

              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through our website.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}