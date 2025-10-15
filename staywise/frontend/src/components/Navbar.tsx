'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, clearAuth } from '@/lib/auth';
import { User } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              StayWise
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/properties"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Properties
            </Link>
            {user && (
              <Link
                href="/bookings"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Bookings
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 text-sm">
                  Hello, <span className="font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        aria-label="Toggle menu"
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
          <div className="py-2">
            <Link href="/properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Properties</Link>
            {user && (
              <Link href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Bookings</Link>
            )}
            <div className="border-t my-1" />
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-700">Hello, <span className="font-semibold">{user.name}</span></div>
                <button onClick={() => { onLogout(); setOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Login</Link>
                <Link href="/signup" className="block px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}