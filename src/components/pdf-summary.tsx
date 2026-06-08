"use client";

export function PdfSummary({ title, stats, faqs }: { 
  title: string; 
  stats?: { label: string; value: string }[];
  faqs?: { question: string; answer: string }[];
}) {
  const handlePrint = () => {
    const content = `
      <html>
      <head>
        <title>${title} — KnowledgeKendra Summary</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
          h1 { font-size: 22px; color: #1B6B4A; border-bottom: 2px solid #1B6B4A; padding-bottom: 8px; }
          .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; }
          .stat { background: #f0fdf4; padding: 10px 14px; border-radius: 8px; border-left: 3px solid #1B6B4A; }
          .stat-label { font-size: 11px; color: #666; }
          .stat-value { font-size: 16px; font-weight: 700; color: #1B6B4A; }
          .faq { margin: 10px 0; }
          .faq-q { font-weight: 700; font-size: 13px; color: #1B6B4A; }
          .faq-a { font-size: 13px; color: #444; margin-top: 2px; }
          .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 11px; color: #999; text-align: center; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${stats && stats.length > 0 ? `
          <div class="stats">
            ${stats.map(s => `<div class="stat"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div>`).join('')}
          </div>
        ` : ''}
        ${faqs && faqs.length > 0 ? `
          <h2 style="font-size:16px;color:#1B6B4A;margin-top:20px;">Quick FAQ</h2>
          ${faqs.slice(0, 5).map(f => `
            <div class="faq">
              <div class="faq-q">Q: ${f.question}</div>
              <div class="faq-a">A: ${f.answer.substring(0, 200)}${f.answer.length > 200 ? '...' : ''}</div>
            </div>
          `).join('')}
        ` : ''}
        <div class="footer">
          Downloaded from KnowledgeKendra.com — Free government scheme & exam information<br/>
          Always verify on official portals before taking action
        </div>
      </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(content);
      win.document.close();
      win.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="mt-4 mb-2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-accent/40 text-sm font-semibold text-text-secondary hover:text-text transition-all cursor-pointer"
    >
      📄 Download 1-Page Summary (PDF)
    </button>
  );
}
