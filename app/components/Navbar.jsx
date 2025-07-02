'use client';

import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/courses', label: 'Courses' },
  { href: '/faculty_panel', label: 'Faculty' },
  { href: '/reports', label: 'Reports' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          🎓 GainEdu
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-700 hover:text-blue-600 py-1"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
