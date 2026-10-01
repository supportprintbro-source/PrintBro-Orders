import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Mail,
  ExternalLink,
  Download,
} from 'lucide-react';
import { PrintBroLogo } from './components/PrintBroLogo';
import { OrderCalculatorForm } from './components/OrderCalculatorForm';
import { OrderTracker } from './components/OrderTracker';
import { AboutUsSection } from './components/AboutUsSection';
import { downloadStandaloneGitHubPagesHtml } from './utils/exportStandaloneHtml';
import {
  PRINT_RATE_OPTIONS,
  PrintOrderRecord,
  OrderStatus,
} from './types/printbro';

import heroCampusPrintingImg from './assets/images/hero_campus_printing_1790868396025.jpg';
import printQualityShowcaseImg from './assets/images/print_quality_showcase_1790868411016.jpg';
import aboutCampusHubImg from './assets/images/about_campus_hub_1790868423676.jpg';

const LOCAL_STORAGE_KEY = 'printbro_student_orders_v1';

const INITIAL_DEMO_ORDER: PrintOrderRecord = {
  ownerId: 'student',
  trackingCode: 'PB-849210',
  studentName: 'Nafis Rahman',
  campusHub: 'Central Library Pickup Point',
  printType: 'bw_single',
  pageCount: 120,
  copies: 1,
  unitPrice: 2.5,
  totalAmount: 300.0,
  fileName: 'CSE301_Algorithms_Lecture_Notes.pdf',
  fileSize: 1843200,
  status: 'printing',
  createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  studentPhone: '01711-000000',
  deliveryNote: '[Finishing: Corner Staple (Free)] Deliver at Central Library desk',
};

export default function App() {
  const [orders, setOrders] = useState<PrintOrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial sample
    }
    return [INITIAL_DEMO_ORDER];
  });

  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('PB-849210');

  useEffect(() => {
    try {
      // Store lightweight order metadata in localStorage (strip oversized data URLs to prevent quota issues)
      const serializable = orders.map((o) => ({
        ...o,
        fileDataUrl: o.fileDataUrl && o.fileDataUrl.length < 350000 ? o.fileDataUrl : '',
      }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  const handleOrderCreated = (newOrder: PrintOrderRecord) => {
    setOrders((prev) => [
      newOrder,
      ...prev.filter((o) => o.trackingCode !== newOrder.trackingCode),
    ]);
    setActiveTrackingCode(newOrder.trackingCode);
  };

  const handleTrackOrderNavigate = (trackingCode: string) => {
    setActiveTrackingCode(trackingCode);
    const el = document.getElementById('track');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateLocalOrderStatus = (trackingCode: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.trackingCode === trackingCode
          ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Strictly 1 row, 3 zones (Brand Wordmark | 4-5 Nav Links | 1-2 Actions) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Single Brand Element */}
          <a
            href="#"
            className="text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap"
          >
            PrintBro
          </a>

          {/* Zone 2: Clean Typography Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="#order"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Order Print
            </a>
            <a
              href="#pricing"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Rate Card
            </a>
            <a
              href="#how-it-works"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              How It Works
            </a>
            <a
              href="#track"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Track Order
            </a>
            <a
              href="#about"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              About Us
            </a>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3">
            <a
              href="#track"
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Track Status
            </a>
            <a
              href="#order"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
            >
              Order Now
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-white border-b border-slate-200 py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left 7 Columns: Value Proposition */}
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <span>Smart Printing for Smart Students</span>
                  <span aria-hidden="true">·</span>
                  <span>Made for Students, By Students</span>
                </div>

                <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.08]">
                  Print Smart. Save Time. Focus on <span className="text-blue-700">Success.</span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-[62ch]">
                  Fast, reliable, student-friendly document printing at campus hubs. Upload your PDF or DOCX directly from your phone, get an instant auto Taka calculation starting at{' '}
                  <span className="font-mono-tabular font-bold text-slate-900">৳2.50/page</span>, and track your delivery in real time.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#order"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
                  >
                    <span>Upload File & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#track"
                    className="inline-flex items-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
                  >
                    <span>Track Existing Order</span>
                  </a>
                </div>

                {/* 4 Pillars from PrintBro Poster */}
                <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-bold text-slate-900">01. Fast</p>
                    <p className="mt-0.5 text-xs text-slate-500">Quick & On-Time</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">02. Reliable</p>
                    <p className="mt-0.5 text-xs text-slate-500">Quality You Can Trust</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">03. Affordable</p>
                    <p className="mt-0.5 text-xs text-slate-500">From ৳2.50 / Page</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">04. Secure</p>
                    <p className="mt-0.5 text-xs text-slate-500">Your Privacy Matters</p>
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: Official Uploaded PrintBro Logo Card + Studio Visual */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center">
                  <PrintBroLogo variant="vertical" size="lg" showTagline={true} theme="navy" />
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video">
                  <img
                    src={heroCampusPrintingImg}
                    alt="High-speed desktop printer outputting crisp PrintBro student documents"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex items-end p-5">
                    <div className="w-full flex items-end justify-between text-white">
                      <div>
                        <p className="text-xs text-slate-300">Campus Hub Delivery</p>
                        <p className="text-sm font-bold">We Print & Deliver to You</p>
                      </div>
                      <div className="text-right font-mono-tabular">
                        <p className="text-xs text-amber-300">Starting from</p>
                        <p className="text-xl font-bold text-amber-400">৳2.50/page</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ORDER & FILE UPLOAD SECTION */}
        <section id="order" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-blue-700">
                Direct Web Order & Instant Price Calculator
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Upload Your File & Get Instant Auto Total in Taka
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Select your document, choose your print type and page count, and your total cost updates automatically based on our official student rate card.
              </p>
            </div>

            <OrderCalculatorForm
              onOrderCreated={handleOrderCreated}
              onTrackOrderClick={handleTrackOrderNavigate}
            />
          </div>
        </section>

        {/* OFFICIAL RATE CARD & HOW IT WORKS SECTION */}
        <section id="pricing" className="py-16 sm:py-24 bg-white border-t border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8">
                <p className="text-xs font-semibold text-blue-700">
                  Official Student Rate Card
                </p>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Transparent Per-Page Campus Pricing
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600">
                  No hidden charges. Bulk orders over 100 pages automatically unlock discounted student rates.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {PRINT_RATE_OPTIONS.map((rate, index) => (
                    <div
                      key={rate.id}
                      className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-xs font-mono-tabular text-slate-500">
                          0{index + 1} · {rate.categoryLabel}
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-slate-900">
                          {rate.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {rate.subtitle}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-200 space-y-2.5 text-sm font-mono-tabular">
                        {rate.id === 'color_single' ? (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">All pages</span>
                            <span className="text-lg font-bold text-blue-700">
                              {rate.tier1Rate.toFixed(2)}৳
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">1–100 pages</span>
                              <span className="font-bold text-slate-900">
                                {rate.tier1Rate.toFixed(2)}৳
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600">100+ pages</span>
                              <span className="text-lg font-bold text-blue-700">
                                {rate.tier2Rate.toFixed(2)}৳
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 4 Columns: Print Quality Showcase */}
              <div className="lg:col-span-4 border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 text-white">
                <div className="aspect-[4/3] bg-slate-800">
                  <img
                    src={printQualityShowcaseImg}
                    alt="Crisp laser-printed university thesis pages and full-color diagrams"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs text-amber-400 font-semibold">
                    Paper & Print Standard
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    Sharp Laser Text & Vibrant Diagrams
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Every single-sided and duplex order is printed on high-brightness academic paper with zero smudge and free corner stapling on request.
                  </p>
                </div>
              </div>
            </div>

            {/* HOW IT WORKS (4 Steps from Flyer) */}
            <div id="how-it-works" className="mt-16 pt-16 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-blue-700">
                    Simple 4-Step Workflow
                  </p>
                  <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
                    How PrintBro Works
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Convenient · Hassle-free · On time
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                  <p className="text-xs font-mono-tabular font-bold text-blue-700">01</p>
                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    Fill the Form
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Select your document file, choose print type and page count, and see your auto Taka total immediately.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                  <p className="text-xs font-mono-tabular font-bold text-blue-700">02</p>
                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    Email Your File
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Attach your PDF/DOCX in the web form or send it directly to support.printbro@gmail.com.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                  <p className="text-xs font-mono-tabular font-bold text-blue-700">03</p>
                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    Confirm on WhatsApp
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Send your auto-generated order summary and Tracking ID to us on WhatsApp with one click.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-2xl p-6 bg-white">
                  <p className="text-xs font-mono-tabular font-bold text-blue-700">04</p>
                  <h4 className="mt-2 text-base font-bold text-slate-900">
                    Done! We Print & Deliver
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    Monitor your printing status below and receive your neatly printed documents at your campus hub.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE ORDER TRACKING SECTION */}
        <section id="track" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <p className="text-xs font-semibold text-blue-700">
                Live Campus Fulfillment Monitor
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Order Tracking System
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Monitor your print job from initial file verification through high-speed printing and campus hub delivery.
              </p>
            </div>

            <OrderTracker
              orders={orders}
              activeTrackingCode={activeTrackingCode}
              onSelectTrackingCode={(code) => setActiveTrackingCode(code)}
              onUpdateLocalOrderStatus={handleUpdateLocalOrderStatus}
            />
          </div>
        </section>

        {/* ABOUT US & LEADERSHIP SECTION */}
        <AboutUsSection campusHubImage={aboutCampusHubImg} />
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-800/80">
            <div>
              <PrintBroLogo variant="horizontal" size="sm" theme="light" />
              <p className="mt-2 text-xs text-slate-400 max-w-sm">
                Smart Printing for Smart Students · Low-cost campus document printing and hub delivery service.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300">
              <a href="#order" className="hover:text-white transition-colors">
                Order & Upload
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Rate Card
              </a>
              <a href="#track" className="hover:text-white transition-colors">
                Track Order
              </a>
              <a href="#about" className="hover:text-white transition-colors">
                About Leadership
              </a>
              <a
                href="mailto:support.printbro@gmail.com"
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>support.printbro@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} PrintBro. Founded by Salman Chowdhury (Founder & CEO) and A.K.M Rafi Chowdhury (Co-Founder & CEO).
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={downloadStandaloneGitHubPagesHtml}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Download a single index.html file to upload directly to your free GitHub Pages repository"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Free GitHub Pages HTML (0৳ Hosting)</span>
              </button>
              <a
                href="https://supportprintbro-source.github.io/PrintBro/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-slate-300 transition-colors"
              >
                <span>supportprintbro-source.github.io/PrintBro</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
