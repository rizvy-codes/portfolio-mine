import type { Skill } from "../../data/skills";

export default function Marquee({
  skills,
  reverse = false,
  duration = 40,
}: {
  skills: Skill[];
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div className="marquee overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div
        className="marquee-track flex w-max"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {/* 4 copies so it never shows a gap, even on very wide screens */}
        {[0, 1, 2, 3].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy > 0}
            className="flex shrink-0 gap-4 pr-4"
          >
            {skills.map(({ name, Icon, color }) => (
              <li
                key={name}
                className="glass flex items-center gap-3 rounded-full px-5 py-3"
              >
                <Icon size={22} style={{ color: color ?? undefined }} />
                <span className="whitespace-nowrap text-sm font-medium">{name}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}