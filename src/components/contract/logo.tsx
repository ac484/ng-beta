import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary"
      >
        <path d="M18 10V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4" />
        <path d="M7 10h10" />
        <path d="M16 18H8" />
        <path d="M12 14v4" />
        <path d="M6 22h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z" />
      </svg>
      <span className="hidden font-bold sm:inline-block text-lg">ConstructTrack</span>
    </Link>
  );
}
