// export default function SavingsBadge() {
//   return (
//     <span className="bg-green-500 text-white text-xs px-1 py-1 rounded">
//       Hidden-City Deal 🎉
//     </span>
//   );
// }
export default function SavingsBadge({ saving }) {
  return (
    <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {saving}
    </span>
  );
}
