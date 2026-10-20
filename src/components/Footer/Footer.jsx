import React, { useEffect, useState } from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaGithub,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { supabase } from "../../lib/supabase";

const DEFAULT_LINKS = {
  linkedin_url: "https://in.linkedin.com/in/lokesh-gembali-74b574305",
  instagram_url: "https://www.instagram.com/lokeshsai_04",
  email: "Gembali.lokesh2004@gmail.com",
  github_url: "https://github.com/Lokesh-04-code",
  leetcode_url: "https://leetcode.com/u/Lokesh738/",
  name: "Lokesh Gembali",
};

const Footer = () => {
  const [profile, setProfile] = useState(DEFAULT_LINKS);

  useEffect(() => {
    supabase.from("profile").select("name,linkedin_url,instagram_url,email,github_url,leetcode_url").single()
      .then(({ data }) => { if (data) setProfile({ ...DEFAULT_LINKS, ...data }); });
  }, []);

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const socials = [
    { icon: <FaLinkedin />, link: profile.linkedin_url, label: "LinkedIn" },
    { icon: <FaInstagram />, link: profile.instagram_url, label: "Instagram" },
    { icon: <FaEnvelope />, link: `mailto:${profile.email}`, label: "Email" },
  ];

  return (
    <footer className="text-white py-8 px-[12vw] md:px-[7vw] lg:px-[20vw]">
      <div className="container mx-auto text-center">
        {/* Name / Logo */}
        <h2 className="text-xl font-semibold text-purple-500">{profile.name}</h2>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mt-4">
          {[
            { name: "About", id: "about" },
            { name: "Skills", id: "skills" },
            { name: "Experience", id: "experience" },
            { name: "Projects", id: "work" },
            { name: "Education", id: "education" },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => handleScroll(item.id)}
              className="hover:text-purple-500 text-sm sm:text-base my-1"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Social Media Icons */}
        <div className="flex flex-wrap justify-center space-x-4 mt-6">
          {socials.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="text-xl hover:text-purple-500 transition-transform transform hover:scale-110"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Copyright Text */}
        <p className="text-sm text-gray-400 mt-6">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
