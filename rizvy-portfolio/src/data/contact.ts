import type { IconType } from "react-icons";
import { FaFacebook, FaTelegram, FaWhatsapp } from "react-icons/fa6";
import { profile } from "./profile";

// ✏️ EDIT THIS FILE with your real contact details.

export const contactEmail = "your-email@example.com"; // 👈 placeholder

export interface ContactCard {
  id: string;
  name: string;
  value: string; // text shown on the card
  href: string; // where the card links to
  Icon: IconType;
  color: string; // brand color used for the glow
}

export const contactCards: ContactCard[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    value: "+00 000 000 0000", // 👈 placeholder, shown on the card
    // 👈 placeholder: country code + number, digits only (example: https://wa.me/15551234567)
    href: "https://wa.me/00000000000",
    Icon: FaWhatsapp,
    color: "#25D366",
  },
  {
    id: "facebook",
    name: "Facebook",
    value: "Message me on Facebook",
    href: profile.socials.facebook, // edit the link in data/profile.ts
    Icon: FaFacebook,
    color: "#1877F2",
  },
  {
    id: "telegram",
    name: "Telegram",
    value: "@your_username", // 👈 placeholder
    href: "https://t.me/your_username", // 👈 placeholder
    Icon: FaTelegram,
    color: "#26A5E4",
  },
];