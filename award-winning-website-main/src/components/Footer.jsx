import { FaDiscord, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";

const socialLinks = [
  { href: "https://discord.com", icon: <FaDiscord /> },
  { href: "https://twitter.com", icon: <FaTwitter /> },
  { href: "https://youtube.com", icon: <FaYoutube /> },
  { href: "https://medium.com", icon: <FaMedium /> },
];

const Footer = () => {
  return (
    <footer className="w-screen bg-[#5542ff] py-4 text-black">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm font-light md:text-left">
          ©ZeroThreat 2024. All rights reserved
        </p>

        <div className="flex justify-center gap-4  md:justify-start">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black transition-colors duration-500 ease-in-out hover:text-white"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <a
          href="#about-us"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          About Us
        </a>
        <a
          href="#careers"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          Careers
        </a>
        <a
          href="#contact"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          Contact
        </a>
        <a
          href="#newsletter"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          Newsletter
        </a>
        <a
          href="#ebook"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          E-book
        </a>
        <a
          href="#press"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          Press
        </a>
        <a
          href="#privacy"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          Privacy
        </a>
        <a
          href="#legal"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          Legal
        </a>
        <p className="text-center text-xs mt-2">Website created by ZEROThreat Team</p>
      </div>
    </footer>
  );
};

export default Footer;
