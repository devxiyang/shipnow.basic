import { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: `Privacy Policy - ${siteConfig.name}`,
  description: `Privacy Policy for ${siteConfig.name}. Learn how we protect your privacy and handle data when using our SaaS platform.`,
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Header />
        
        <div className="space-y-6 pb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground">Last updated: January 1, 2025</p>
              
              <h2>Information We Collect</h2>
              <p>
                When you use {siteConfig.name}, we may collect the following information:
              </p>
              <ul>
                <li>Account information (email, name) when you register</li>
                <li>Payment information for subscription billing</li>
                <li>Usage data and analytics to improve our service</li>
                <li>Technical information such as IP address and browser type</li>
                <li>Data you input or upload to our service</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul>
                <li>Provide and maintain our service</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important service notifications</li>
                <li>Improve our service quality and user experience</li>
                <li>Provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>Data Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information with:
              </p>
              <ul>
                <li>Service providers who help us operate our business</li>
                <li>Payment processors for billing purposes</li>
                <li>Legal authorities when required by law</li>
              </ul>

              <h2>Data Storage and Security</h2>
              <p>
                We store your data securely using industry-standard encryption and security measures. 
                Your data is stored on secure servers and we regularly review and update our 
                security practices.
              </p>

              <h2>Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services 
                and comply with legal obligations. You may request deletion of your account and 
                associated data at any time.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                Our service may integrate with third-party services such as:
              </p>
              <ul>
                <li>Payment processors (Stripe)</li>
                <li>Authentication providers (Google)</li>
                <li>Analytics services</li>
                <li>Cloud hosting providers</li>
              </ul>
              <p>
                These services have their own privacy policies governing their use of your information.
              </p>

              <h2>Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to improve your experience, analyze usage, 
                and provide personalized content. You can control cookie settings through your 
                browser preferences.
              </p>

              <h2>Your Rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data</li>
                <li>Export your data</li>
                <li>Object to data processing</li>
                <li>Withdraw consent</li>
              </ul>

              <h2>Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13 years of age. We do not 
                knowingly collect personal information from children under 13.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of 
                any material changes by email or through our service.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us through our website.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}