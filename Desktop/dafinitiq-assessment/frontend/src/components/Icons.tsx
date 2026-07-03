export function MicIcon({ recording }: { recording: boolean }) {
  const fill = recording ? "#fff" : "currentColor";
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="2" width="6" height="12" rx="3" fill={fill} />
      <path
        d="M5 10a7 7 0 0014 0M12 17v3"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SpeakerIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
      <path
        d="M15.5 8.5a5 5 0 010 7M18 5a9 9 0 010 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
