import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  ArrowRight,
  Lock,
  Sparkles,
  Link2,
  Download,
} from 'lucide-react';
import {
  PrintTypeId,
  PRINT_RATE_OPTIONS,
  CAMPUS_HUBS,
  calculatePrintCost,
  detectPdfPageCount,
  formatPrintTypeLabel,
  formatBytes,
  PrintOrderRecord,
} from '../types/printbro';

interface OrderCalculatorFormProps {
  onOrderCreated: (order: PrintOrderRecord) => void;
  onTrackOrderClick: (trackingCode: string) => void;
}

export const OrderCalculatorForm: React.FC<OrderCalculatorFormProps> = ({
  onOrderCreated,
  onTrackOrderClick,
}) => {
  const [printType, setPrintType] = useState<PrintTypeId>('bw_single');
  const [pageCountInput, setPageCountInput] = useState<string>('25');
  const [copiesInput, setCopiesInput] = useState<string>('1');

  // Uploaded file state (100% browser-native, zero cloud setup required)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [autoDetectedPages, setAutoDetectedPages] = useState<number | null>(null);
  const [isDetectingPdf, setIsDetectingPdf] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Optional external file link (e.g., if student wants to paste a Drive/Dropbox link)
  const [externalFileLink, setExternalFileLink] = useState<string>('');

  // Student & delivery inputs
  const [studentName, setStudentName] = useState<string>('');
  const [studentPhone, setStudentPhone] = useState<string>('');
  const [campusHub, setCampusHub] = useState<string>(CAMPUS_HUBS[0]);
  const [bindingOption, setBindingOption] = useState<string>('Corner Staple (Free)');
  const [deliveryNote, setDeliveryNote] = useState<string>('');

  // Submission & confirmation state
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<PrintOrderRecord | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const numericPages = Math.max(1, Math.min(10000, parseInt(pageCountInput, 10) || 1));
  const numericCopies = Math.max(1, Math.min(500, parseInt(copiesInput, 10) || 1));
  const calculation = calculatePrintCost(printType, numericPages, numericCopies);

  const handleFileProcess = async (file: File) => {
    setFormError(null);
    setSelectedFile(file);
    setAutoDetectedPages(null);

    // Create an object URL or Data URL so the file can be downloaded/viewed locally without any cloud server
    if (file.size <= 3 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFileDataUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const blobUrl = URL.createObjectURL(file);
      setFileDataUrl(blobUrl);
    }

    // Automatic PDF page count detection
    if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
      setIsDetectingPdf(true);
      const detected = await detectPdfPageCount(file);
      setIsDetectingPdf(false);
      if (detected && detected >= 1) {
        setAutoDetectedPages(detected);
        setPageCountInput(String(detected));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFileProcess(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileDataUrl('');
    setAutoDetectedPages(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateTrackingCode = (): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `PB-${randomDigits}`;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedLink = externalFileLink.trim();
    if (!selectedFile && !trimmedLink) {
      setFormError('Please select your document file (PDF, DOCX, PPTX, or image) or paste a file link.');
      return;
    }

    const cleanName = studentName.trim().slice(0, 100);
    if (!cleanName) {
      setFormError('Please enter your full name so we can label your printed parcel.');
      return;
    }

    const cleanPhone = studentPhone.trim().slice(0, 30);
    if (cleanPhone.length < 5) {
      setFormError('Please enter a valid mobile or WhatsApp number (at least 5 digits) for delivery confirmation.');
      return;
    }

    const trackingCode = generateTrackingCode();
    const nowIso = new Date().toISOString();
    const cleanCampusHub = campusHub.trim().slice(0, 120);
    const finalFileName = selectedFile
      ? selectedFile.name.slice(0, 255)
      : 'Shared_Document_Link.pdf';
    const finalFileSize = selectedFile ? selectedFile.size : 0;
    const combinedNote = `[Finishing: ${bindingOption}] ${deliveryNote.trim()}`.trim().slice(0, 500);

    const newOrderRecord: PrintOrderRecord = {
      ownerId: 'student',
      trackingCode,
      studentName: cleanName,
      campusHub: cleanCampusHub,
      printType: calculation.printType,
      pageCount: calculation.pageCount,
      copies: calculation.copies,
      unitPrice: calculation.unitPrice,
      totalAmount: calculation.totalAmount,
      fileName: finalFileName,
      fileSize: finalFileSize,
      status: 'received',
      createdAt: nowIso,
      updatedAt: nowIso,
      studentPhone: cleanPhone,
      deliveryNote: combinedNote,
      fileDataUrl,
      driveFileUrl: trimmedLink,
    };

    onOrderCreated(newOrderRecord);
    setSubmittedOrder(newOrderRecord);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const buildWhatsAppUrl = (order: PrintOrderRecord): string => {
    const messageLines = [
      `Hello PrintBro! I have placed a print order:`,
      `• Order Tracking ID: ${order.trackingCode}`,
      `• Student Name: ${order.studentName}`,
      `• Phone: ${order.studentPhone || 'Provided'}`,
      `• Document: ${order.fileName}${order.fileSize ? ` (${formatBytes(order.fileSize)})` : ''}`,
      order.driveFileUrl ? `• File Link: ${order.driveFileUrl}` : '',
      `• Print Type: ${formatPrintTypeLabel(order.printType)}`,
      `• Pages: ${order.pageCount} pages × ${order.copies} copy/copies`,
      `• Rate Applied: ৳${order.unitPrice.toFixed(2)}/page`,
      `• Total Payable: ৳${order.totalAmount.toFixed(2)}`,
      `• Campus Hub: ${order.campusHub}`,
      order.deliveryNote ? `• Notes: ${order.deliveryNote}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/?text=${encodeURIComponent(messageLines)}`;
  };

  const buildGmailComposeUrl = (order: PrintOrderRecord): string => {
    const subject = `PrintBro Order ${order.trackingCode} - ${order.studentName} (${order.pageCount} Pages)`;
    const body = [
      `Hello PrintBro Team,`,
      ``,
      `Please find my print order details below (I am attaching my file "${order.fileName}"):`,
      ``,
      `Order Tracking ID: ${order.trackingCode}`,
      `Student Name: ${order.studentName}`,
      `Phone / WhatsApp: ${order.studentPhone || ''}`,
      `Document Name: ${order.fileName}`,
      order.driveFileUrl ? `File Link: ${order.driveFileUrl}` : '',
      `Print Type: ${formatPrintTypeLabel(order.printType)}`,
      `Page Count: ${order.pageCount} pages`,
      `Copies: ${order.copies}`,
      `Unit Rate: ৳${order.unitPrice.toFixed(2)}`,
      `Total Amount: ৳${order.totalAmount.toFixed(2)}`,
      `Campus Pickup / Delivery Hub: ${order.campusHub}`,
      `Notes: ${order.deliveryNote || 'None'}`,
    ]
      .filter(Boolean)
      .join('\n');

    return `mailto:support.printbro@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (submittedOrder) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 text-emerald-700 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Order Created & Ready for Printing</span>
          </div>

          <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            Your Print Order is Confirmed!
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Save your Tracking ID below to monitor live printing status. Send your order summary on WhatsApp or email your attached file to{' '}
            <span className="font-semibold text-slate-900">support.printbro@gmail.com</span>.
          </p>

          {/* Tracking ID Banner */}
          <div className="mt-6 p-5 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">Official Order Tracking Code</p>
              <p className="mt-1 text-2xl sm:text-3xl font-bold font-mono-tabular tracking-wider text-amber-400">
                {submittedOrder.trackingCode}
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => void handleCopyCode(submittedOrder.trackingCode)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied ID' : 'Copy Tracking ID'}</span>
              </button>
              <button
                type="button"
                onClick={() => onTrackOrderClick(submittedOrder.trackingCode)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Track Live Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Itemized Receipt Breakdown */}
          <div className="mt-6 border border-slate-200 rounded-xl p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Student Name & Phone</span>
              <span className="font-medium text-slate-900">
                {submittedOrder.studentName} · {submittedOrder.studentPhone}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Attached File</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900 truncate max-w-xs">
                  {submittedOrder.fileName}
                  {submittedOrder.fileSize ? ` (${formatBytes(submittedOrder.fileSize)})` : ''}
                </span>
                {submittedOrder.fileDataUrl && (
                  <a
                    href={submittedOrder.fileDataUrl}
                    download={submittedOrder.fileName}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Print Specification</span>
              <span className="font-medium text-slate-900">
                {formatPrintTypeLabel(submittedOrder.printType)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Pages × Copies × Unit Rate</span>
              <span className="font-mono-tabular font-medium text-slate-900">
                {submittedOrder.pageCount} pages × {submittedOrder.copies} × ৳{submittedOrder.unitPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Campus Hub Delivery</span>
              <span className="font-medium text-slate-900">{submittedOrder.campusHub}</span>
            </div>
            <div className="flex items-center justify-between pt-2 text-base">
              <span className="font-semibold text-slate-900">Total Payable Amount</span>
              <span className="text-xl font-bold font-mono-tabular text-blue-700">
                ৳{submittedOrder.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Fast Follow-up Actions matching PrintBro Flyer Step 2 & Step 3 */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={buildWhatsAppUrl(submittedOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors whitespace-nowrap"
            >
              <span>Confirm Order on WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={buildGmailComposeUrl(submittedOrder)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition-colors whitespace-nowrap"
            >
              <span>Email File to support.printbro@gmail.com</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Need to print another lecture slide or assignment?
            </span>
            <button
              type="button"
              onClick={() => {
                setSubmittedOrder(null);
                clearSelectedFile();
                setExternalFileLink('');
              }}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-4 cursor-pointer"
            >
              Place Another Print Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmitOrder}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      {/* Left 7 Columns: Direct File Upload, Print Type, Page Count & Student Details */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Step 01: Direct File Selection */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              01. Upload Your Document File
            </h3>
            <span className="text-xs text-slate-500">
              PDF · DOCX · PPTX · Images
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Select your file directly from your phone or computer. PDF files automatically detect the exact page number.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            id="printbro-file-upload"
          />

          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-3 border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-300 hover:border-blue-600 bg-slate-50/60'
              }`}
            >
              <Upload className="w-8 h-8 text-blue-700 mx-auto" />
              <p className="mt-3 text-sm font-semibold text-slate-900">
                Tap to select your file or drag and drop here
              </p>
              <p className="mt-1 text-xs text-slate-500">
                No account or cloud setup needed · Auto page count for PDF files
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Choose Document File
              </button>
            </div>
          ) : (
            <div className="mt-3 border border-blue-200 bg-blue-50/40 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-8 h-8 text-blue-700 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-600 font-mono-tabular">
                    {formatBytes(selectedFile.size)}
                    {isDetectingPdf && ' · Scanning PDF pages...'}
                    {autoDetectedPages !== null &&
                      ` · Auto-detected ${autoDetectedPages} page${
                        autoDetectedPages > 1 ? 's' : ''
                      }`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={clearSelectedFile}
                className="p-2 text-slate-500 hover:text-red-600 rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Optional File Link input (if student prefers pasting a link) */}
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-600">
              Or paste a shared file link (Optional — Google Drive / OneDrive / Dropbox):
            </label>
            <div className="mt-1 relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={externalFileLink}
                onChange={(e) => setExternalFileLink(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>
        </div>

        {/* Step 02: Select Print Type & Page Count */}
        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              02. Choose Print Type & Page Count
            </h3>
            <span className="text-xs text-slate-500 font-mono-tabular">
              Starting from ৳2.50/page
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRINT_RATE_OPTIONS.map((option) => {
              const isSelected = printType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPrintType(option.id)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-700 bg-blue-50/50 ring-2 ring-blue-700/15'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        option.id === 'color_single' ? 'text-blue-700' : 'text-slate-500'
                      }`}
                    >
                      {option.categoryLabel}
                    </p>
                    <p className="mt-0.5 text-base font-bold text-slate-900">
                      {option.title}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1 text-xs font-mono-tabular">
                    {option.id === 'color_single' ? (
                      <div className="flex items-center justify-between text-slate-900 font-semibold">
                        <span>All pages</span>
                        <span>{option.tier1Rate.toFixed(2)}৳</span>
                      </div>
                    ) : (
                      <>
                        <div
                          className={`flex items-center justify-between ${
                            isSelected && numericPages <= 100
                              ? 'text-blue-800 font-semibold'
                              : 'text-slate-600'
                          }`}
                        >
                          <span>1–100 pages</span>
                          <span>{option.tier1Rate.toFixed(2)}৳</span>
                        </div>
                        <div
                          className={`flex items-center justify-between ${
                            isSelected && numericPages > 100
                              ? 'text-emerald-700 font-semibold'
                              : 'text-slate-600'
                          }`}
                        >
                          <span>100+ pages</span>
                          <span>{option.tier2Rate.toFixed(2)}৳</span>
                        </div>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Page Count & Copies Inputs */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="page-count-input"
                className="block text-xs font-semibold text-slate-700"
              >
                Total Number of Pages
              </label>
              <div className="mt-1.5 flex items-center">
                <button
                  type="button"
                  onClick={() => setPageCountInput(String(Math.max(1, numericPages - 10)))}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-r-0 border-slate-300 rounded-l-lg text-xs font-mono-tabular font-semibold text-slate-700 cursor-pointer"
                >
                  -10
                </button>
                <input
                  id="page-count-input"
                  type="number"
                  min={1}
                  max={10000}
                  value={pageCountInput}
                  onChange={(e) => setPageCountInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 text-center font-mono-tabular font-semibold text-slate-900 text-sm focus:outline-none focus:border-blue-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPageCountInput(String(Math.min(10000, numericPages + 10)))}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-l-0 border-slate-300 rounded-r-lg text-xs font-mono-tabular font-semibold text-slate-700 cursor-pointer"
                >
                  +10
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                <span>Quick presets:</span>
                <div className="flex items-center gap-2 font-mono-tabular">
                  {[10, 50, 101, 250].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPageCountInput(String(preset))}
                      className={`hover:text-blue-700 underline cursor-pointer ${
                        numericPages === preset ? 'text-blue-700 font-semibold' : ''
                      }`}
                    >
                      {preset}p
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="copies-input"
                className="block text-xs font-semibold text-slate-700"
              >
                Number of Copies (Sets)
              </label>
              <div className="mt-1.5 flex items-center">
                <button
                  type="button"
                  onClick={() => setCopiesInput(String(Math.max(1, numericCopies - 1)))}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-r-0 border-slate-300 rounded-l-lg text-xs font-mono-tabular font-semibold text-slate-700 cursor-pointer"
                >
                  -1
                </button>
                <input
                  id="copies-input"
                  type="number"
                  min={1}
                  max={500}
                  value={copiesInput}
                  onChange={(e) => setCopiesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 text-center font-mono-tabular font-semibold text-slate-900 text-sm focus:outline-none focus:border-blue-700"
                  required
                />
                <button
                  type="button"
                  onClick={() => setCopiesInput(String(Math.min(500, numericCopies + 1)))}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-l-0 border-slate-300 rounded-r-lg text-xs font-mono-tabular font-semibold text-slate-700 cursor-pointer"
                >
                  +1
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Ordering for study groups? Increase sets above.
              </p>
            </div>
          </div>
        </div>

        {/* Step 03: Student & Delivery Hub Info */}
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            03. Student & Campus Delivery Details
          </h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Your Full Name *
              </label>
              <input
                type="text"
                maxLength={100}
                placeholder="e.g., Tanvir Ahmed"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Mobile / WhatsApp Number *
              </label>
              <input
                type="tel"
                maxLength={30}
                placeholder="e.g., 017XXXXXXXX"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-mono-tabular text-slate-900 focus:outline-none focus:border-blue-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Campus Hub / Pickup Location *
              </label>
              <select
                value={campusHub}
                onChange={(e) => setCampusHub(e.target.value)}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-700"
              >
                {CAMPUS_HUBS.map((hub) => (
                  <option key={hub} value={hub}>
                    {hub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Stapling / Finishing Preference
              </label>
              <select
                value={bindingOption}
                onChange={(e) => setBindingOption(e.target.value)}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-700"
              >
                <option value="Corner Staple (Free)">Corner Staple (Free)</option>
                <option value="Loose Sheets (No Staple)">Loose Sheets (No Staple)</option>
                <option value="2-Pin Side Staple">2-Pin Side Staple</option>
                <option value="Request Spiral Binding (Pay on Delivery)">
                  Request Spiral Binding (Pay on Delivery)
                </option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                Special Print Instructions / Room or Landmark (Optional)
              </label>
              <input
                type="text"
                maxLength={400}
                placeholder="e.g., Print slides 2 per page, deliver near Library Gate by 2:00 PM"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="mt-1.5 w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>
        </div>

        {formError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
            {formError}
          </div>
        )}
      </div>

      {/* Right 5 Columns: Live Auto Taka Total & Instant Order Summary */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <p className="text-xs text-slate-400">Live Cost Estimator</p>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Auto Price Summary
            </h3>
          </div>
          <span className="text-xs font-mono-tabular text-amber-400">
            BDT (৳)
          </span>
        </div>

        {/* Big Auto Taka Display */}
        <div className="mt-6 p-5 rounded-xl bg-slate-800/90 border border-slate-700">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-300">Total Payable Amount</span>
            <span className="text-xs font-mono-tabular text-amber-400">
              {calculation.unitPrice.toFixed(2)}৳ / page
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-mono-tabular">
            <span className="text-3xl sm:text-4xl font-bold text-amber-400">
              ৳{calculation.totalAmount.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">
              ({calculation.pageCount} pages × {calculation.copies}{' '}
              {calculation.copies > 1 ? 'sets' : 'set'})
            </span>
          </div>

          {calculation.isBulkDiscountApplied ? (
            <p className="mt-2.5 text-xs text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>100+ Pages Bulk Student Discount Automatically Applied!</span>
            </p>
          ) : printType !== 'color_single' ? (
            <p className="mt-2.5 text-xs text-slate-400">
              Tip: Orders over 100 pages automatically drop to{' '}
              <span className="text-white font-mono-tabular font-semibold">
                {printType === 'bw_single' ? '2.50৳' : '3.00৳'}/page
              </span>
              .
            </p>
          ) : (
            <p className="mt-2.5 text-xs text-slate-400">
              Full colour single-sided laser print at flat 4.00৳/page.
            </p>
          )}
        </div>

        {/* Line-item breakdown */}
        <div className="mt-6 space-y-3 text-sm border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between text-slate-300">
            <span>Selected Print Type</span>
            <span className="font-semibold text-white">
              {formatPrintTypeLabel(printType)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Pricing Tier Applied</span>
            <span className="font-mono-tabular text-xs text-slate-200">
              {calculation.tierAppliedLabel}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Cost per Copy ({calculation.pageCount} pages)</span>
            <span className="font-mono-tabular font-semibold text-white">
              ৳{calculation.singleCopySubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Number of Copies</span>
            <span className="font-mono-tabular font-semibold text-white">
              × {calculation.copies}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Selected Document</span>
            <span className="text-xs text-slate-200 truncate max-w-[200px]">
              {selectedFile
                ? selectedFile.name
                : externalFileLink
                ? 'Shared File Link Attached'
                : 'No file selected yet'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Campus Pickup Hub</span>
            <span className="text-xs text-slate-200 truncate max-w-[200px]">
              {campusHub}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <span>Submit Print Order · ৳{calculation.totalAmount.toFixed(2)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>No login or cloud setup required · Instant order & WhatsApp confirmation</span>
        </div>
      </div>
    </form>
  );
};
