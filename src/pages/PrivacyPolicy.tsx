import Seo from "@/components/Seo";
import { FaShieldAlt, FaDatabase, FaUserShield, FaEnvelope, FaRegClock } from "react-icons/fa";

const PrivacyPolicy = () => {
    const updated = new Date().toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Seo
                title="Privacy Policy — Nyuzi"
                description="Learn how Nyuzi collects, uses, and protects your data."
                canonical="/privacypolicy"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: "Privacy Policy — Nyuzi",
                    url: "/privacypolicy",
                }}
            />

            {/* Header */}
            <section className="bg-primary text-primary-foreground py-12 px-6 text-center">
                <h1 className="text-4xl font-bold">Privacy Policy</h1>
                <p className="mt-2 text-gold">Last updated: {updated}</p>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/70">
                    At Nyuzi, we value your trust and are committed to safeguarding your personal information.
                </p>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-10 space-y-12 max-w-5xl">

                {/* Intro */}
                <section className="bg-card border border-border shadow-sm p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-primary text-2xl" />
                        <h2 className="text-2xl font-semibold text-primary">Our Commitment</h2>
                    </div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        This Privacy Policy explains how Nyuzi collects, uses, stores, and protects your data.
                        We are transparent about our practices, and we respect your right to control your personal information.
                    </p>
                </section>

                {/* Information We Collect */}
                <section className="bg-card border border-border shadow-sm p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FaDatabase className="text-primary text-2xl" />
                        <h2 className="text-2xl font-semibold text-primary">Information We Collect</h2>
                    </div>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                        <li>Account details such as your name, email address, and password (securely hashed).</li>
                        <li>Donation and purchase information, including item descriptions and delivery addresses.</li>
                        <li>Usage data such as pages visited, time spent, and device/browser details.</li>
                        <li>Images and media you upload to our platform.</li>
                        <li>Communication records from emails or messages sent to our support team.</li>
                    </ul>
                </section>

                {/* How We Use It */}
                <section className="bg-card border border-border shadow-sm p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FaUserShield className="text-primary text-2xl" />
                        <h2 className="text-2xl font-semibold text-primary">How We Use Your Information</h2>
                    </div>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                        <li>Facilitate donations, upcycling projects, and product purchases.</li>
                        <li>Provide personalized recommendations and enhance your experience.</li>
                        <li>Process transactions and manage your account.</li>
                        <li>Improve security, detect fraud, and ensure platform reliability.</li>
                        <li>Comply with legal and regulatory requirements.</li>
                    </ul>
                </section>

                {/* Your Rights */}
                <section className="bg-card border border-border shadow-sm p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FaEnvelope className="text-primary text-2xl" />
                        <h2 className="text-2xl font-semibold text-primary">Your Rights & Choices</h2>
                    </div>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                        <li>Access and review your personal data at any time.</li>
                        <li>Update or correct your information through your account settings.</li>
                        <li>Request data deletion or restriction of processing.</li>
                        <li>Opt out of non-essential marketing communications.</li>
                        <li>Request a copy of your data for portability purposes.</li>
                    </ul>
                </section>

                {/* Data Retention */}
                <section className="bg-card border border-border shadow-sm p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                        <FaRegClock className="text-primary text-2xl" />
                        <h2 className="text-2xl font-semibold text-primary">Data Retention & Security</h2>
                    </div>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        We retain your data only as long as necessary for the purposes outlined in this policy.
                        Advanced encryption, firewalls, and monitoring tools are used to ensure your data’s safety.
                        While we take strong precautions, no method of transmission over the internet is 100% secure.
                    </p>
                </section>

                {/* Contact */}
                <section className="bg-card border border-border shadow-sm p-6 rounded-lg text-center">
                    <h2 className="text-2xl font-semibold text-primary">Contact Us</h2>
                    <p className="mt-4 text-muted-foreground">
                        If you have questions about our privacy practices, feel free to reach out to us.
                    </p>
                    <p className="mt-2 font-semibold text-primary">
                        Email: <a href="mailto:benitofashions2021@gmail.com" className="hover:underline">benitofashions2021@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
