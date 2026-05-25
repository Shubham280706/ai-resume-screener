'use client';

const companies = [
  'Acme Corp',
  'TechStart',
  'InnovateLabs',
  'DataFlow',
  'CloudNine',
  'PixelStudio',
  'NexGen AI',
  'ByteForce',
];

export default function Marquee() {
  return (
    <section className="py-16 px-6 border-y border-[#1a1a1f] bg-[#050507]">
      <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-8">
        Trusted by leading companies
      </p>

      <div className="overflow-hidden">
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .marquee-left {
            animation: scroll-left 30s linear infinite;
          }
          .marquee-right {
            animation: scroll-right 30s linear infinite;
          }
        `}</style>

        <div className="flex marquee-left space-x-8">
          {[...companies, ...companies].map((company, i) => (
            <div
              key={i}
              className="px-8 py-3 rounded-full bg-[#0d0d10] border border-[#1a1a1f] text-sm text-gray-300 whitespace-nowrap"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
