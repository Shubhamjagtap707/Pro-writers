interface FABProps {
  /** Material Symbols icon name */
  icon?: string;
  /** Optional tooltip shown on hover (to the left of the button) */
  tooltip?: string;
  onClick?: () => void;
}

/**
 * Canonical Floating Action Button — single style used across all pages.
 * Always: w-16 h-16 · rounded-full · gradient bg · bottom-10 right-10
 * Hover: scale-110   Active: scale-95
 */
export default function FAB({ icon = 'add', tooltip, onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-10 right-10 z-50
        w-16 h-16 rounded-full
        bg-gradient-to-br from-primary to-primary-container
        text-on-primary
        shadow-[0_8px_32px_-4px_rgba(128,131,255,0.45)]
        flex items-center justify-center
        transition-transform duration-200
        hover:scale-110 active:scale-95
        group
      "
      aria-label={tooltip ?? icon}
    >
      {/* Tooltip */}
      {tooltip && (
        <span className="
          absolute right-full mr-4
          px-3 py-1.5 rounded-xl
          bg-surface-container-high text-on-surface
          text-xs font-headline font-bold
          whitespace-nowrap shadow-xl
          opacity-0 pointer-events-none
          group-hover:opacity-100
          transition-opacity duration-200
        ">
          {tooltip}
        </span>
      )}

      <span
        className="material-symbols-outlined text-[28px] transition-transform duration-300 group-hover:rotate-90"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
    </button>
  );
}
