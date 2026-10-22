import { ArrowUp } from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { profile } from "../data/profile";

const socials = [
  { label: "LinkedIn", href: profile.socials.linkedin, Icon: FaLinkedinIn },
  { label: "Twitter", href: profile.socials.twitter, Icon: FaXTwitter },
  { label: "Facebook", href: profile.socials.facebook, Icon: FaFacebookF },
  { label: "GitHub", href: profile.socials.github, Icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line px-6 pb-28 pt-12 md:pb-10 md:pr-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <div className="rounded-2xl border border-white/10 bg-black/60 px-3 py-2">
            <img src={profile.logo} alt={`${profile.name} logo`} className="h-8 w-auto" />
          </div>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>

        <ul className="flex gap-3">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="glass grid h-11 w-11 place-items-center rounded-full text-muted transition hover:-translate-y-1 hover:border-brand-cyan hover:text-brand-cyan"
              >
                <Icon size={17} />
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition hover:border-brand-cyan"
        >
          Back to top
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}