import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
import { PrintBroLogo } from './PrintBroLogo';

interface AboutUsSectionProps {
  campusHubImage: string;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({ campusHubImage }) => {
  const leadershipTeam = [
    {
      name: 'Salman Chowdhury',
      role: 'Founder and CEO',
      initials: 'SC',
      focus: 'Campus Operations, Vision & Student Accessibility',
      statement:
        'We started PrintBro because no student should have to stand in a crowded shop queue before an exam or pay inflated per-page rates for their lecture notes and thesis papers.',
    },
    {
      name: 'A.K.M Rafi Chowdhury',
      role: 'Co-Founder and CEO',
      initials: 'RC',
      focus: 'Technology, Fulfillment Systems & Quality Assurance',
      statement:
        'By combining mobile document uploads, transparent automated Taka pricing, and campus hub delivery, PrintBro turns a 45-minute errand into a 60-second mobile order.',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Editorial Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold text-blue-700">
              Made for Students · By Students
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Smart Printing Built Around Campus Life
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-[68ch]">
              PrintBro is a student-focused, low-cost academic printing service enabling fast, secure document uploads directly from mobile devices and laptops. Whether you are printing a 15-page lab report, full-colour project diagrams, or a 300-page reference textbook, our automated workflow calculates your exact rate instantly and delivers crisp prints right to your campus hub.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-200">
              <div>
                <p className="text-2xl font-bold font-mono-tabular text-slate-900">
                  ৳2.50
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Starting per-page bulk student rate
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono-tabular text-slate-900">
                  80 GSM
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Bright high-opacity academic bond paper
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono-tabular text-slate-900">
                  100%
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Document privacy & zero USB virus risk
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono-tabular text-slate-900">
                  4 Steps
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Upload, calculate, confirm & receive
                </p>
              </div>
            </div>
          </div>

          {/* Official Uploaded PrintBro Emblem Showcase Card */}
          <div className="lg:col-span-5">
            <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50/60 flex flex-col items-center text-center">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-8 w-full flex items-center justify-center">
                <PrintBroLogo variant="vertical" size="xl" showTagline={true} theme="navy" />
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Official PrintBro Identity · Precision Ink, Academic DNA & Digital Automation
              </p>
            </div>
          </div>
        </div>

        {/* Executive Leadership Section */}
        <div className="mt-16 pt-16 border-t border-slate-200">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-blue-700">
              Executive Leadership
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
              Meet the Founders Behind PrintBro
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Dedicated to making high-quality academic printing affordable, transparent, and effortless for every student on campus.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadershipTeam.map((leader) => (
              <div
                key={leader.name}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-bold text-lg shrink-0">
                      {leader.initials}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">
                        {leader.name}
                      </h4>
                      <p className="text-sm font-semibold text-blue-700 mt-0.5">
                        {leader.role} · PrintBro
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Focus: {leader.focus}
                  </p>

                  <blockquote className="mt-5 pt-5 border-t border-slate-200/80 text-sm text-slate-700 leading-relaxed italic">
                    “{leader.statement}”
                  </blockquote>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span>PrintBro Campus Network</span>
                  <a
                    href="mailto:support.printbro@gmail.com"
                    className="inline-flex items-center gap-1.5 font-semibold text-slate-900 hover:text-blue-700 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Leadership</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Hub Visual Showcase */}
        <div className="mt-16 border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-slate-900 text-white">
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center">
            <p className="text-xs font-semibold text-amber-400">
              We Print & Deliver to You
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
              Convenient. Hassle-Free. On Time.
            </h3>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Skip the flash-drive queues between lectures. Upload your PDF or DOCX from anywhere on campus, confirm your order summary, and pick up your neatly stapled printouts at your nearest campus hub.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <a
                href="mailto:support.printbro@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg font-semibold text-white transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>support.printbro@gmail.com</span>
              </a>
              <a
                href="https://supportprintbro-source.github.io/PrintBro/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white underline underline-offset-4 whitespace-nowrap"
              >
                <span>Official Portal Reference</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-6 relative min-h-[260px] bg-slate-800">
            <img
              src={campusHubImage}
              alt="PrintBro campus hub desk with neatly stacked academic printouts"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
