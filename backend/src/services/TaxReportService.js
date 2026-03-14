const PDFDocument = require('pdfkit');
const TaxReport = require('../models/TaxReport');
const Donation = require('../models/Donation');
const User = require('../models/User');
const logger = require('../utils/logger');

function formatUSD(num) {
  if (num === null || num === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(num));
}

function formatDate(dateStr) {
  return new Date(dateStr).toISOString().split('T')[0];
}

function divider(doc) {
  doc.moveDown(0.8);
  doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#cccccc').stroke();
  doc.moveDown(0.8);
}

function sectionTitle(doc, title) {
  doc.fillColor('#1a1a2e').fontSize(12).font('Helvetica-Bold').text(title);
  doc.moveDown(0.4);
}

async function generatePDFReport(walletAddress, year, donations, _orgs, user) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const buffers = [];
    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const totalUsd = donations.reduce((sum, d) => sum + (parseFloat(d.amount_usd) || 0), 0);
    const reportId = `REP-${walletAddress.substring(0, 10)}-${year}-${Date.now()}`;
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const donorName = user && user.first_name
      ? `${user.first_name} ${user.last_name || ''}`.trim()
      : null;

    // ── HEADER ──────────────────────────────────────────────────────────────
    doc.fillColor('#1a1a2e').rect(50, 50, doc.page.width - 100, 80).fill();
    doc.fillColor('white').fontSize(18).font('Helvetica-Bold')
      .text('CHARITABLE DONATIONS TAX REPORT', 60, 65, { align: 'center', width: doc.page.width - 120 });
    doc.fontSize(10)
      .text('CryptoGive Platform  •  cryptogive.org', 60, 95, { align: 'center', width: doc.page.width - 120 });

    // ── DONOR INFORMATION ────────────────────────────────────────────────────
    const infoY = 155;
    doc.fillColor('#333333').fontSize(10).font('Helvetica');

    const left = 50;
    const right = 310;

    // Left column
    doc.font('Helvetica-Bold').text('Tax Year:', left, infoY).font('Helvetica').text(String(year), left + 70, infoY);
    doc.font('Helvetica-Bold').text('Generated:', left, infoY + 16).font('Helvetica').text(generatedDate, left + 70, infoY + 16);
    doc.font('Helvetica-Bold').text('Report ID:', left, infoY + 32).font('Helvetica').text(reportId, left + 70, infoY + 32);

    // Right column — donor details
    doc.font('Helvetica-Bold').text('Donor Name:', right, infoY).font('Helvetica')
      .text(donorName || '(not provided)', right + 85, infoY);
    if (user?.email) {
      doc.font('Helvetica-Bold').text('Email:', right, infoY + 16).font('Helvetica')
        .text(user.email, right + 85, infoY + 16);
    }
    if (user?.tax_number) {
      doc.font('Helvetica-Bold').text('Tax Number:', right, infoY + 32).font('Helvetica')
        .text(user.tax_number, right + 85, infoY + 32);
    }

    // Wallet address (full width)
    doc.font('Helvetica-Bold').text('Wallet Address:', left, infoY + 52).font('Helvetica')
      .text(walletAddress, left + 100, infoY + 52);

    // ── DISCLAIMER ───────────────────────────────────────────────────────────
    doc.moveDown(5);
    doc.fillColor('#b45309').fontSize(9).font('Helvetica-Bold').text('IMPORTANT DISCLAIMER:', left);
    doc.fillColor('#78350f').font('Helvetica').fontSize(8)
      .text(
        'This report is for informational purposes only and does NOT constitute tax advice. ' +
        'Please consult a qualified tax professional. Accuracy depends on blockchain data completeness.',
        left, doc.y, { width: doc.page.width - 100 }
      );

    divider(doc);

    // ── SUMMARY ──────────────────────────────────────────────────────────────
    sectionTitle(doc, 'DONATION SUMMARY');
    doc.fillColor('#333333').fontSize(10).font('Helvetica');
    doc.text(`Total Donations (USD): ${formatUSD(totalUsd)}`);
    doc.text(`Number of Donations:   ${donations.length}`);
    doc.text(`Period:                January 1, ${year} – December 31, ${year}`);

    divider(doc);

    // ── DETAILED DONATIONS TABLE ──────────────────────────────────────────────
    sectionTitle(doc, 'DETAILED DONATION LIST');

    // Column layout
    const cols = {
      date:     { x: 50,  w: 68,  label: 'Date' },
      org:      { x: 118, w: 70,  label: 'Organization' },
      amount:   { x: 188, w: 70,  label: 'Amount' },
      usd:      { x: 258, w: 55,  label: 'USD Value' },
      chain:    { x: 313, w: 55,  label: 'Blockchain' },
      from:     { x: 368, w: 85,  label: 'From Address' },
      to:       { x: 453, w: 85,  label: 'To Address' },
    };

    const tableTop = doc.y;
    doc.fillColor('#1a1a2e').fontSize(7).font('Helvetica-Bold');
    Object.values(cols).forEach(c => doc.text(c.label, c.x, tableTop, { width: c.w }));
    doc.moveTo(50, tableTop + 12).lineTo(doc.page.width - 15, tableTop + 12).strokeColor('#333333').stroke();
    doc.moveDown(0.2);

    donations.forEach((d, idx) => {
      if (doc.y > doc.page.height - 100) doc.addPage();

      const bg = idx % 2 === 0 ? '#f3f4f6' : 'white';
      doc.fillColor(bg).rect(50, doc.y - 1, doc.page.width - 65, 14).fill();

      doc.fillColor('#222222').fontSize(6.5).font('Helvetica');
      const fromShort = d.from_address ? `${d.from_address.slice(0, 8)}...${d.from_address.slice(-6)}` : '—';
      const toShort = d.to_address ? `${d.to_address.slice(0, 8)}...${d.to_address.slice(-6)}` : '—';

      const row = [
        formatDate(d.created_at || d.date),
        d.org_name || '',
        `${parseFloat(d.amount).toFixed(4)} ${d.token}`,
        d.amount_usd ? formatUSD(d.amount_usd) : '—',
        d.blockchain,
        fromShort,
        toShort,
      ];

      Object.values(cols).forEach((c, i) => doc.text(row[i], c.x, doc.y, { width: c.w }));
      doc.moveDown(0.25);
    });

    divider(doc);

    // ── TRANSACTION HASHES ────────────────────────────────────────────────────
    sectionTitle(doc, 'TRANSACTION VERIFICATION');
    doc.fillColor('#333333').fontSize(8).font('Helvetica');

    donations.forEach(d => {
      if (doc.y > doc.page.height - 80) doc.addPage();

      doc.font('Helvetica-Bold').text('TX Hash:', left, doc.y, { continued: true })
        .font('Helvetica').text(`  ${d.tx_hash}`);

      doc.font('Helvetica-Bold').text('From:', left + 20, doc.y, { continued: true })
        .font('Helvetica').text(`  ${d.from_address || '—'}`);

      doc.font('Helvetica-Bold').text('To:', left + 20, doc.y, { continued: true })
        .font('Helvetica').text(`  ${d.to_address}`);

      doc.font('Helvetica-Bold').text('Amount:', left + 20, doc.y, { continued: true })
        .font('Helvetica').text(`  ${parseFloat(d.amount).toFixed(6)} ${d.token}  (${d.amount_usd ? formatUSD(d.amount_usd) : 'USD N/A'})`);

      doc.font('Helvetica-Bold').text('Status:', left + 20, doc.y, { continued: true })
        .font('Helvetica').fillColor(d.tx_status === 'confirmed' ? '#15803d' : '#b45309')
        .text(`  ${d.tx_status === 'confirmed' ? 'Confirmed ✓' : d.tx_status}`)
        .fillColor('#333333');

      doc.moveDown(0.6);
    });

    divider(doc);

    // ── ORGANIZATION INFO ─────────────────────────────────────────────────────
    sectionTitle(doc, 'ORGANIZATION INFORMATION');
    doc.fillColor('#333333').fontSize(9).font('Helvetica');

    // Get unique orgs from donations
    const orgMap = {};
    donations.forEach(d => { if (d.org_name) orgMap[d.org_name] = d; });

    Object.values(orgMap).forEach(d => {
      doc.font('Helvetica-Bold').text(d.org_name || 'Chabad');
      doc.font('Helvetica');
      doc.text(`Tax ID: ${d.org_tax_id || '11-1671182'}`);
      doc.text('Organization Type: 501(c)(3) Charitable Organization');
      doc.text('Website: https://chabad.org');
      doc.moveDown(0.3);
    });

    // ── FOOTER ────────────────────────────────────────────────────────────────
    doc.moveDown(1);
    doc.fontSize(7).fillColor('#888888')
      .text('Generated by CryptoGive  •  This document does not constitute tax advice', { align: 'center' })
      .text(`Report ID: ${reportId}`, { align: 'center' });

    doc.end();
  });
}

function generateCSVReport(walletAddress, year, donations, user) {
  const donorName = user && user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '';

  const header = [
    '# CryptoGive Tax Report',
    `# Donor: ${donorName || walletAddress}`,
    user?.email ? `# Email: ${user.email}` : '',
    user?.tax_number ? `# Tax Number: ${user.tax_number}` : '',
    `# Wallet: ${walletAddress}`,
    `# Year: ${year}`,
    '',
    'date,time_utc,organization,crypto_amount,token,usd_value,blockchain,tx_hash,from_address,to_address,block_number',
  ].filter(l => l !== undefined).join('\n');

  const rows = donations.map(d => {
    const dt = new Date(d.created_at || d.date);
    return [
      dt.toISOString().split('T')[0],
      dt.toISOString().split('T')[1].split('.')[0],
      d.org_name || '',
      parseFloat(d.amount).toFixed(18).replace(/\.?0+$/, ''),
      d.token,
      d.amount_usd || '',
      d.blockchain,
      d.tx_hash,
      d.from_address || '',
      d.to_address || '',
      d.block_number || '',
    ].join(',');
  });

  return header + '\n' + rows.join('\n');
}

async function getReportData(walletAddress, year) {
  const donations = await Donation.findByWallet(walletAddress, { year, status: 'confirmed' });
  if (!donations.length) return null;

  const user = await User.findByWallet(walletAddress).catch(() => null);
  const totalUsd = donations.reduce((sum, d) => sum + (parseFloat(d.amount_usd) || 0), 0);
  await TaxReport.upsert(walletAddress, year, totalUsd, donations.length);

  return { donations, totalUsd, user };
}

module.exports = { generatePDFReport, generateCSVReport, getReportData };
