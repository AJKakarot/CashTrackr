export function Logo({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stylized interlocking C / infinity symbol */}
      <path
        d="M7 12C7 9.5 8.5 7 12 7C15.5 7 17 9.5 17 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17 12C17 14.5 15.5 17 12 17C8.5 17 7 14.5 7 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
