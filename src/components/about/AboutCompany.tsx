"use client";

import { useEffect, useRef, useState } from "react";
import { EditableImage, EditableText } from "@/components/cms";
import { ABOUT_US_PLACEHOLDER } from "@/lib/aboutUsDefaults";
import { resolveImageSrc } from "@/lib/imageFallback";

const STATS = [
  {
    value: 20,
    suffix: "+",
    label: "Team Members",
    path: "company.stat1Label",
    className: "left-0 top-3 -translate-x-1 sm:-translate-x-4 lg:-translate-x-6",
  },
  {
    value: 50,
    suffix: " m²",
    label: "Workshop",
    path: "company.stat2Label",
    className: "right-0 top-2 translate-x-1 sm:translate-x-3 lg:translate-x-5",
  },
  {
    value: 10,
    suffix: "",
    label: "Years International Trade",
    path: "company.stat3Label",
    className: "left-0 top-1/2 -translate-x-1 -translate-y-1/2 sm:-translate-x-5 lg:-translate-x-8",
  },
  {
    value: 100,
    suffix: "+",
    label: "Materials",
    path: "company.stat4Label",
    className: "right-0 top-1/2 translate-x-1 -translate-y-1/2 sm:translate-x-4 lg:translate-x-6",
  },
  {
    value: 5,
    suffix: "+",
    label: "Manufacturing Suppliers",
    path: "company.stat5Label",
    className: "bottom-2 left-1/2 -translate-x-1/2 sm:-bottom-3",
  },
] as const;

const MEMBERS = [
  {
    key: "kevi",
    name: "Kevi",
    role: "Marketing & Growth",
    bio: "Handles SuhuCustom’s website, SEO, content, and marketing.",
  },
  {
    key: "carki",
    name: "Carki",
    role: "Business Development",
    bio: "Works with customers, understands their requirements, and coordinates projects.",
  },
  {
    key: "chenxiaomei",
    name: "Chenxiaomei",
    role: "Product Development",
    bio: "Helps turn product ideas and specifications into workable products.",
  },
  {
    key: "wangyi",
    name: "Wangyi",
    role: "Sampling",
    bio: "Coordinates sample development and follows product details through the sampling stage.",
  },
  {
    key: "linzhongshu",
    name: "Linzhongshu",
    role: "Production",
    bio: "Coordinates with suppliers and follows orders through production.",
  },
  {
    key: "chenyike",
    name: "Chen Yike",
    role: "Quality & Operations",
    bio: "Handles quality checks, order coordination, packing, and shipment preparation.",
  },
] as const;

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, durationMs]);

  return value;
}

function StatTag({
  value,
  suffix,
  label,
  path,
  className,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  path: string;
  className: string;
  active: boolean;
}) {
  const counted = useCountUp(value, active);

  return (
    <div
      className={`absolute z-10 rounded-2xl border border-white/70 bg-white/95 px-3.5 py-2.5 shadow-lg shadow-slate-900/10 backdrop-blur-sm sm:px-4 sm:py-3 ${className}`}
    >
      <p className="text-lg font-bold tabular-nums text-amber-600 sm:text-xl">
        {counted}
        {suffix}
      </p>
      <p className="mt-0.5 text-[11px] font-medium leading-snug text-slate-500 sm:text-xs">
        <EditableText path={path} value={label} />
      </p>
    </div>
  );
}

export default function AboutCompany() {
  const visualRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
              <EditableText path="company.eyebrow" value="About the Company" />
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              <EditableText
                path="company.title"
                value="Learn More about our company"
              />
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-600 sm:text-[17px]">
              <p>
                <EditableText
                  path="company.body"
                  value="Founded in 2025, SuhuCustom is based in Humen, Dongguan, China, with a 50-square-meter workshop and a team backed by 5 years of marketing experience and 10 years of international trade experience. Beyond our own workshop, we manage a network of manufacturing suppliers to support different product types, order volumes, and production requirements."
                />
              </p>
            </div>
          </div>

          <div ref={visualRef} className="relative mx-auto w-full max-w-xl px-4 sm:px-8 lg:mx-0 lg:max-w-none">
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-slate-200/80 sm:aspect-[3/2]">
              <EditableImage
                path="company.image"
                src={resolveImageSrc(ABOUT_US_PLACEHOLDER)}
                alt="SuhuCustom company workshop in Humen, Dongguan"
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
            </div>

            {STATS.map((stat) => (
              <StatTag
                key={stat.path}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                path={stat.path}
                className={stat.className}
                active={statsActive}
              />
            ))}
          </div>
        </div>

        <div className="mt-20 lg:mt-28">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
              <EditableText path="company.teamEyebrow" value="Our People" />
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              <EditableText path="company.teamTitle" value="Meet Our Team" />
            </h3>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {MEMBERS.map((member) => (
              <li
                key={member.key}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                  <EditableImage
                    path={`company.members.${member.key}.image`}
                    src={resolveImageSrc(ABOUT_US_PLACEHOLDER)}
                    alt={`${member.name} — ${member.role}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-slate-900">
                    <EditableText
                      path={`company.members.${member.key}.name`}
                      value={member.name}
                    />
                    <span className="font-medium text-slate-400"> — </span>
                    <span className="font-semibold text-amber-700">
                      <EditableText
                        path={`company.members.${member.key}.role`}
                        value={member.role}
                      />
                    </span>
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    <EditableText
                      path={`company.members.${member.key}.bio`}
                      value={member.bio}
                    />
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
