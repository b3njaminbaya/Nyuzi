import { useState, type FormEvent } from "react";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import { toast } from "sonner";
import { submitNewsletterSignup } from "@/lib/submissions";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    const { error } = await submitNewsletterSignup(email);
    if (error) {
      toast.error("Couldn't subscribe", { description: error });
      return;
    }
    toast.success("Subscribed", { description: "We'll keep you posted." });
    setEmail("");
  };

  return (
    <footer className="bg-[#1B1B1B] text-white pt-12">
      <div className="container mx-auto px-4 grid gap-10 md:grid-cols-4">

        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-2 font-bold text-xl text-gold">
            <span
              className="inline-block h-3 w-3 rounded-full bg-primary shadow"
              aria-hidden
            />
            Nyuzi
          </div>
          <p className="mt-4 text-sm text-gray-300 leading-relaxed">
            Circular fashion made simple. Donate, upcycle, and shop reclaimed
            designs — helping the planet one outfit at a time.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-semibold text-gold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/donate"
                className="hover:text-gold transition-colors"
              >
                Donate
              </a>
            </li>
            <li>
              <a
                href="/marketplace"
                className="hover:text-gold transition-colors"
              >
                Marketplace
              </a>
            </li>
            <li>
              <a
                href="/impact"
                className="hover:text-gold transition-colors"
              >
                Impact
              </a>
            </li>
            <li>
              <a
                href="/partnerwithus"
                className="hover:text-gold transition-colors"
              >
                Partner With Us
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-gold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/privacypolicy"
                className="hover:text-gold transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/termsofservice"
                className="hover:text-gold transition-colors"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold text-gold mb-3">Stay Updated</h4>
          <p className="text-sm text-gray-300 mb-4">
            Subscribe to our newsletter for the latest in sustainable fashion.
          </p>
          <form
            onSubmit={handleSubscribe}
            noValidate
            className="flex flex-col sm:flex-row sm:items-center gap-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">Your email</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Social Media */}
      <div className="mt-10 border-t border-gray-700 pt-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex space-x-5">
            <a
              href="https://facebook.com/Nyuzi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://instagram.com/Nyuzi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://twitter.com/Nyuzi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              <FaXTwitter size={20} />
            </a>
            <a
              href="https://tiktok.com/@Nyuzi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              <FaTiktok size={20} />
            </a>
            <a
              href="https://youtube.com/@Nyuzi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              <Youtube size={20} />
            </a>
            <a
              href="https://linkedin.com/company/Nyuzi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 bg-[#111] py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Nyuzi — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


