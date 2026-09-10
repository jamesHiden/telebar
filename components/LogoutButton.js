'use client';

import { logout } from '@/app/actions/auth';

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-sm text-[var(--muted)] hover:text-red-600 transition"
    >
      خروج
    </button>
  );
}
