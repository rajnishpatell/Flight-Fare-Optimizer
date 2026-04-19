import React from "react";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 ">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-white">
            Flight Fare Optimizer ✈️
          </h3>
          <p className="text-sm mt-2 text-gray-400">
            Find hidden-city routes and save on your next adventure.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5 text-gray-400">
          <a href="#" className="hover:text-white transition-all">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-white transition-all">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-white transition-all">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:text-white transition-all">
            <Github size={20} />
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Flight Fare Optimizer. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
