/**
 * Generates and downloads a complete, single-file standalone `index.html` version of PrintBro
 * that can be uploaded directly to GitHub Pages (https://supportprintbro-source.github.io/PrintBro/)
 * or Netlify Drop for 100% FREE hosting with zero credit card or billing setup required.
 */
export function downloadStandaloneGitHubPagesHtml(): void {
  const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PrintBro — Smart Printing for Smart Students</title>
  <meta name="description" content="PrintBro low-cost student printing service with auto Taka price calculator, file upload, and order tracking." />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; color: #0f172a; scroll-behavior: smooth; }
    h1, h2, h3, .font-display { font-family: 'Outfit', sans-serif; }
    .font-mono-tabular { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="#" class="text-xl font-bold tracking-tight text-slate-900 font-display">PrintBro</a>
      <nav class="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
        <a href="#order" class="hover:text-slate-900">Order Print</a>
        <a href="#pricing" class="hover:text-slate-900">Rate Card</a>
        <a href="#track" class="hover:text-slate-900">Track Order</a>
        <a href="#about" class="hover:text-slate-900">About Us</a>
      </nav>
      <a href="#order" class="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg">Order Now</a>
    </div>
  </header>

  <main class="flex-1">
    <section class="bg-white border-b border-slate-200 py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div class="lg:col-span-7">
          <p class="text-xs font-semibold text-blue-700">Smart Printing for Smart Students · Made for Students, By Students</p>
          <h1 class="mt-3 text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">Print Smart. Save Time. Focus on <span class="text-blue-700">Success.</span></h1>
          <p class="mt-4 text-base text-slate-600 max-w-2xl">Fast, reliable, student-friendly document printing at campus hubs. Select your PDF or DOCX file, get an instant auto Taka calculation starting at <strong class="font-mono-tabular">৳2.50/page</strong>, and track your delivery status.</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <a href="#order" class="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl">Upload File & Place Order</a>
            <a href="#track" class="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold rounded-xl">Track Order</a>
          </div>
        </div>
        <div class="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center text-center">
          <svg width="120" height="115" viewBox="0 0 220 210" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M68 26 C67 52, 28 72, 28 106 C28 138, 66 155, 43 185 C58 164, 62 140, 40 112 C24 91, 68 62, 68 26 Z" fill="#0B1F5C"/>
            <path d="M52 49 C69 72, 74 96, 56 124 C42 145, 36 160, 43 185 C33 160, 44 136, 60 114 C72 95, 65 72, 48 53 Z" fill="#0B1F5C"/>
            <rect x="40" y="79" width="20" height="3.5" rx="1.75" fill="#0B1F5C"/>
            <rect x="37" y="92" width="25" height="3.5" rx="1.75" fill="#0B1F5C"/>
            <rect x="38" y="105" width="24" height="3.5" rx="1.75" fill="#0B1F5C"/>
            <rect x="42" y="118" width="17" height="3.5" rx="1.75" fill="#0B1F5C"/>
            <rect x="81" y="12" width="58" height="58" rx="7" fill="#0B1F5C"/>
            <circle cx="126" cy="26" r="6" fill="#FFFFFF"/>
            <rect x="89" y="48" width="22" height="4.5" fill="#FFFFFF"/>
            <rect x="89" y="57" width="32" height="5" fill="#FFFFFF"/>
            <rect x="125" y="56" width="6.5" height="6.5" fill="#FFFFFF"/>
            <path d="M84 74 H136 L116 101 H104 L84 74 Z" fill="#0B1F5C"/>
            <path d="M110 105 C110 105, 94 129, 94 140 C94 149, 101.2 156, 110 156 C118.8 156, 126 149, 126 140 C126 129, 110 105, 110 105 Z" fill="#0B1F5C"/>
            <path d="M104 123 C99 132, 98.5 141, 104 148 C101.5 142, 102.5 133, 106.5 125 Z" fill="#FFFFFF"/>
            <circle cx="110" cy="180" r="19.5" fill="#0B1F5C"/>
            <g stroke="#0B1F5C" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="176" y1="45" x2="176" y2="85"/>
              <path d="M176 74 L164 74 L164 67" fill="none"/>
              <circle cx="164" cy="62" r="4.5" fill="#FFFFFF" stroke="#0B1F5C" stroke-width="3.2"/>
              <path d="M198 95 L168 95 L157 106 L150 106" fill="none"/>
              <circle cx="145" cy="106" r="4.5" fill="#FFFFFF" stroke="#0B1F5C" stroke-width="3.2"/>
              <path d="M168 95 L176 104 L161 120 L157 125" fill="none"/>
              <circle cx="153" cy="129" r="4.5" fill="#FFFFFF" stroke="#0B1F5C" stroke-width="3.2"/>
              <path d="M198 106 L181 106 L176 112 L176 196" fill="none"/>
              <path d="M187 57 L187 84 L198 84" fill="none"/>
              <path d="M185 132 L185 162" fill="none"/>
              <path d="M185 117 L199 117" fill="none"/>
              <path d="M190 144 L190 183" fill="none"/>
              <path d="M190 144 L200 144" fill="none"/>
            </g>
          </svg>
          <div class="mt-2 text-3xl font-display text-[#0B1F5C]"><span class="font-bold">Print </span><span>Bro</span></div>
          <p class="mt-1 text-xs text-slate-600">Smart Printing for Smart Students.</p>
        </div>
      </div>
    </section>

    <section id="order" class="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-slate-900">Upload File & Auto Taka Calculator</h2>
      <form id="orderForm" class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div>
            <label class="block text-sm font-bold text-slate-900">01. Select Document File (PDF / DOCX / Image)</label>
            <input type="file" id="fileInput" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" class="mt-2 block w-full text-sm text-slate-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800" required />
            <p id="fileDetectInfo" class="mt-1.5 text-xs text-blue-700 font-mono-tabular"></p>
          </div>

          <div class="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700">Print Type</label>
              <select id="printType" class="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white">
                <option value="bw_single">B&W Single Sided (3.00৳ / 2.50৳)</option>
                <option value="bw_double">B&W Both Sides (4.00৳ / 3.00৳)</option>
                <option value="color_single">Full Colour Single (4.00৳)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700">Total Pages</label>
              <input type="number" id="pageCount" value="25" min="1" max="10000" class="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-mono-tabular" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700">Copies (Sets)</label>
              <input type="number" id="copies" value="1" min="1" max="500" class="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-mono-tabular" required />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700">Your Full Name *</label>
              <input type="text" id="studentName" placeholder="e.g., Tanvir Ahmed" class="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700">Mobile / WhatsApp Number *</label>
              <input type="tel" id="studentPhone" placeholder="017XXXXXXXX" class="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-mono-tabular" required />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-700">Campus Hub / Pickup Point</label>
              <input type="text" id="campusHub" value="Main Campus Gate Hub" class="mt-1 w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm" required />
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 space-y-5">
          <h3 class="text-xl font-bold">Auto Price Summary</h3>
          <div class="p-4 rounded-xl bg-slate-800 border border-slate-700">
            <div class="text-xs text-slate-300 flex justify-between">
              <span>Total Payable Amount</span>
              <span id="unitRateLabel" class="font-mono-tabular text-amber-400">3.00৳ / page</span>
            </div>
            <div id="totalAmountDisplay" class="mt-1 text-3xl font-bold font-mono-tabular text-amber-400">৳75.00</div>
          </div>
          <button type="submit" class="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl cursor-pointer">Submit Print Order</button>
          <div id="confirmationBox" class="hidden p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs space-y-2"></div>
        </div>
      </form>
    </section>

    <section id="pricing" class="py-14 bg-white border-t border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-slate-900">Official Print Rate Card</h2>
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tabular text-sm">
          <div class="p-5 border border-slate-200 rounded-xl">
            <p class="text-xs text-slate-500">BLACK & WHITE</p>
            <h3 class="text-lg font-bold text-slate-900 mt-0.5">Single Sided</h3>
            <p class="mt-3 flex justify-between"><span>1–100 pages</span><strong>3.00৳</strong></p>
            <p class="mt-1 flex justify-between text-blue-700"><span>100+ pages</span><strong>2.50৳</strong></p>
          </div>
          <div class="p-5 border border-slate-200 rounded-xl">
            <p class="text-xs text-slate-500">BLACK & WHITE</p>
            <h3 class="text-lg font-bold text-slate-900 mt-0.5">Both Sides</h3>
            <p class="mt-3 flex justify-between"><span>1–100 pages</span><strong>4.00৳</strong></p>
            <p class="mt-1 flex justify-between text-blue-700"><span>100+ pages</span><strong>3.00৳</strong></p>
          </div>
          <div class="p-5 border border-slate-200 rounded-xl">
            <p class="text-xs text-blue-700">FULL COLOUR</p>
            <h3 class="text-lg font-bold text-slate-900 mt-0.5">Single Sided</h3>
            <p class="mt-3 flex justify-between text-blue-700"><span>All pages</span><strong>4.00৳</strong></p>
          </div>
        </div>
      </div>
    </section>

    <section id="track" class="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-slate-900">Order Tracking System</h2>
      <div id="orderList" class="mt-4 space-y-3"></div>
    </section>

    <section id="about" class="py-14 bg-white border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-semibold text-blue-700">Executive Leadership</p>
        <h2 class="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">About PrintBro</h2>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 border border-slate-200 rounded-2xl bg-slate-50">
            <h3 class="text-xl font-bold text-slate-900">Salman Chowdhury</h3>
            <p class="text-sm font-semibold text-blue-700">Founder and CEO · PrintBro</p>
            <p class="mt-3 text-xs text-slate-600 leading-relaxed">Leading campus operations, student accessibility, and low-cost academic document fulfillment.</p>
          </div>
          <div class="p-6 border border-slate-200 rounded-2xl bg-slate-50">
            <h3 class="text-xl font-bold text-slate-900">A.K.M Rafi Chowdhury</h3>
            <p class="text-sm font-semibold text-blue-700">Co-Founder and CEO · PrintBro</p>
            <p class="mt-3 text-xs text-slate-600 leading-relaxed">Leading platform technology, automated pricing workflows, and quality assurance across campus hubs.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-slate-950 text-slate-400 py-8 text-center text-xs">
    <p>© ${new Date().getFullYear()} PrintBro · Founded by Salman Chowdhury (Founder & CEO) & A.K.M Rafi Chowdhury (Co-Founder & CEO) · support.printbro@gmail.com</p>
  </footer>

  <script>
    const printTypeEl = document.getElementById('printType');
    const pageCountEl = document.getElementById('pageCount');
    const copiesEl = document.getElementById('copies');
    const unitRateLabel = document.getElementById('unitRateLabel');
    const totalAmountDisplay = document.getElementById('totalAmountDisplay');
    const fileInput = document.getElementById('fileInput');
    const fileDetectInfo = document.getElementById('fileDetectInfo');
    const orderList = document.getElementById('orderList');
    const confirmationBox = document.getElementById('confirmationBox');

    function calc() {
      const type = printTypeEl.value;
      const pages = Math.max(1, parseInt(pageCountEl.value || '1', 10));
      const copies = Math.max(1, parseInt(copiesEl.value || '1', 10));
      let rate = 3.0;
      if (type === 'bw_single') rate = pages > 100 ? 2.5 : 3.0;
      else if (type === 'bw_double') rate = pages > 100 ? 3.0 : 4.0;
      else rate = 4.0;
      const total = pages * rate * copies;
      unitRateLabel.textContent = rate.toFixed(2) + '৳ / page';
      totalAmountDisplay.textContent = '৳' + total.toFixed(2);
      return { rate, total, pages, copies, type };
    }

    printTypeEl.addEventListener('change', calc);
    pageCountEl.addEventListener('input', calc);
    copiesEl.addEventListener('input', calc);

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const buf = await file.arrayBuffer();
        const txt = new TextDecoder('latin1').decode(buf);
        const m = txt.match(/\\/Type\\s*\\/Page\\b(?!s)/g);
        if (m && m.length > 0) {
          pageCountEl.value = m.length;
          fileDetectInfo.textContent = 'Auto-detected ' + m.length + ' pages from PDF';
          calc();
        }
      }
    });

    function renderOrders() {
      const orders = JSON.parse(localStorage.getItem('pb_orders') || '[]');
      if (!orders.length) {
        orderList.innerHTML = '<p class="text-xs text-slate-500">No orders placed yet on this device.</p>';
        return;
      }
      orderList.innerHTML = orders.map(o => \`
        <div class="p-4 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4 text-sm">
          <div>
            <span class="font-mono-tabular font-bold text-blue-700">\${o.code}</span> · <strong>\${o.file}</strong>
            <p class="text-xs text-slate-500">\${o.name} (\${o.phone}) · \${o.pages} pages × \${o.copies} · Total: ৳\${o.total.toFixed(2)}</p>
          </div>
          <span class="text-xs font-semibold text-emerald-700">Status: \${o.status}</span>
        </div>
      \`).join('');
    }
    renderOrders();

    document.getElementById('orderForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const c = calc();
      const file = fileInput.files[0] ? fileInput.files[0].name : 'Document.pdf';
      const name = document.getElementById('studentName').value;
      const phone = document.getElementById('studentPhone').value;
      const hub = document.getElementById('campusHub').value;
      const code = 'PB-' + Math.floor(100000 + Math.random() * 900000);
      const orders = JSON.parse(localStorage.getItem('pb_orders') || '[]');
      orders.unshift({ code, file, name, phone, hub, pages: c.pages, copies: c.copies, total: c.total, status: 'Order Received' });
      localStorage.setItem('pb_orders', JSON.stringify(orders));
      renderOrders();
      const msg = encodeURIComponent(\`Hello PrintBro! Order \${code}\\nName: \${name}\\nPhone: \${phone}\\nFile: \${file}\\nPages: \${c.pages} x \${c.copies}\\nTotal: ৳\${c.total.toFixed(2)}\\nHub: \${hub}\`);
      confirmationBox.classList.remove('hidden');
      confirmationBox.innerHTML = \`
        <p class="font-bold text-amber-300">Order Confirmed! Tracking ID: \${code}</p>
        <div class="flex flex-wrap gap-2 pt-2">
          <a href="https://wa.me/?text=\${msg}" target="_blank" class="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold">Confirm on WhatsApp</a>
          <a href="mailto:support.printbro@gmail.com?subject=PrintBro Order \${code}" class="px-3 py-1.5 bg-white text-slate-900 rounded-lg font-semibold">Email File to Gmail</a>
        </div>
      \`;
    });
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
