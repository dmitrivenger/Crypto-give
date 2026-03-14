const PDFDocument = require('pdfkit');
const TaxReport = require('../models/TaxReport');
const Donation = require('../models/Donation');
const logger = require('../utils/logger');

function formatUSD(num) {
  if (num === null || num === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(num));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

function formatCryptoAmount(amount, token) {
  const num = parseFloat(amount);
  const decimals = token === 'USDC' || token === 'USDT' ? 2 : 6;
  return `${num.toFixed(decimals)} ${token}`;
}

async function generatePDFReport(walletAddress, year, donations, organizations) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
    const buffers = [];

    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const totalUsd = donations.reduce((sum, d) => sum + (parseFloat(d.amount_usd) || 0), 0);
    const reportId = `REP-${walletAddress.substring(0, 10)}-${year}-${Date.now()}`;
    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    // Header
    doc.fillColor('#1a1a2e').rect(50, 50, doc.page.width - 100, 80).fill();
    doc.fillColor('white')
      .fontSize(20).font('Helvetica-Bold')
      .text('CHARITABLE DONATIONS TAX REPORT', 60, 65, { align: 'center', width: doc.page.width - 120 });
    doc.fontSize(10)
      .text('CryptoGive Platform', 60, 95, { align: 'center', width: doc.page.width - 120 });

    doc.moveDown(2);

    // Report meta
    doc.fillColor('#333333').fontSize(11).font('Helvetica');
    const metaY = 155;
    doc.text(`Tax Year: ${year}`, 50, metaY);
    doc.text(`Report Generated: ${generatedDate}`, 50, metaY + 18);
    doc.text(`Donor Wallet: ${walletAddress}`, 50, metaY + 36);
    doc.text(`Report ID: ${reportId}`, 50, metaY + 54);

    // Disclaimer
    doc.moveDown(4);
    doc.fillColor('#b45309').fontSize(10).font('Helvetica-Bold').text('IMPORTANT DISCLAIMER:', 50);
    doc.fillColor('#78350f').font('Helvetica').fontSize(9)
      .text(
        'This report is generated for informational purposes only and does NOT constitute tax advice. ' +
        'Please consult with a qualified tax professional to determine the tax implications of your ' +
        'cryptocurrency donations. The accuracy of this report depends on the completeness of blockchain data.',
        50, doc.y, { width: doc.page.width - 100 }
      );

    // Divider
    doc.moveDown(1.5);
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(1);

    // Summary
    doc.fillColor('#1a1a2e').fontSize(13).font('Helvetica-Bold').text('DONATION SUMMARY');
    doc.moveDown(0.5);
    doc.fillColor('#333333').fontSize(11).font('Helvetica');
    doc.text(`Total Donations (USD): ${formatUSD(totalUsd)}`);
    doc.text(`Number of Donations: ${donations.length}`);
    doc.text(`Period: January 1, ${year} – December 31, ${year}`);

    // Divider
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(1);

    // Detailed donations table
    doc.fillColor('#1a1a2e').fontSize(13).font('Helvetica-Bold').text('DETAILED DONATION LIST');
    doc.moveDown(0.5);

    // Table header
    const tableTop = doc.y;
    const colWidths = [80, 90, 90, 60, 80, 80];
    const colX = [50, 130, 220, 310, 370, 450];
    const headers = ['Date', 'Organization', 'Amount', 'Token', 'USD Value', 'Blockchain'];

    doc.fillColor('#1a1a2e').fontSize(9).font('Helvetica-Bold');
    headers.forEach((h, i) => doc.text(h, colX[i], tableTop, { width: colWidths[i] }));

    doc.moveTo(50, tableTop + 14).lineTo(doc.page.width - 50, tableTop + 14).strokeColor('#333333').stroke();
    doc.moveDown(0.3);

    // Table rows
    donations.forEach((d, idx) => {
      const rowY = doc.y;
      if (rowY > doc.page.height - 120) {
        doc.addPage();
      }

      const bg = idx % 2 === 0 ? '#f9fafb' : 'white';
      doc.fillColor(bg).rect(50, doc.y - 2, doc.page.width - 100, 16).fill();

      doc.fillColor('#333333').fontSize(8).font('Helvetica');
      const rowData = [
        formatDate(d.created_at || d.date),
        d.org_name || d.organization || '',
        parseFloat(d.amount).toFixed(6),
        d.token,
        d.amount_usd ? formatUSD(d.amount_usd) : 'N/A',
        d.blockchain,
      ];
      rowData.forEach((val, i) => doc.text(val, colX[i], doc.y, { width: colWidths[i] }));
      doc.moveDown(0.3);
    });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(1);

    // Organization info
    const orgs = [...new Map(donations.map(d => [d.org_id, d])).values()];
    doc.fillColor('#1a1a2e').fontSize(13).font('Helvetica-Bold').text('ORGANIZATION INFORMATION');
    doc.moveDown(0.5);
    doc.fillColor('#333333').fontSize(10).font('Helvetica');
    doc.text(`Name: Chabad`);
    doc.text(`Tax ID: 11-1671182`);
    doc.text(`Country: United States`);
    doc.text(`Organization Type: 501(c)(3) Charitable Organization`);
    doc.text(`Website: https://chabad.org`);

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(1);

    // Transaction hashes
    doc.fillColor('#1a1a2e').fontSize(13).font('Helvetica-Bold').text('TRANSACTION VERIFICATION');
    doc.moveDown(0.5);
    doc.fillColor('#333333').fontSize(9).font('Helvetica');
    donations.forEach(d => {
      doc.text(`${d.tx_hash}  →  ${d.tx_status === 'confirmed' ? 'Confirmed ✓' : d.tx_status}`);
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).fillColor('#666666')
      .text(`Generated by CryptoGive (https://cryptogive.org)`, { align: 'center' })
      .text(`Report ID: ${reportId}`, { align: 'center' });

    doc.end();
  });
}

function generateCSVReport(walletAddress, year, donations) {
  const header = 'date,time_utc,organization,crypto_amount,token,usd_value_at_time,blockchain,transaction_hash,block_number\n';
  const rows = donations.map(d => {
    const dt = new Date(d.created_at || d.date);
    const date = dt.toISOString().split('T')[0];
    const time = dt.toISOString().split('T')[1].split('.')[0];
    return [
      date,
      time,
      d.org_name || d.organization || '',
      parseFloat(d.amount).toFixed(18).replace(/\.?0+$/, ''),
      d.token,
      d.amount_usd || '',
      d.blockchain,
      d.tx_hash,
      d.block_number || '',
    ].join(',');
  });
  return header + rows.join('\n');
}

async function getReportData(walletAddress, year) {
  const donations = await Donation.findByWallet(walletAddress, { year, status: 'confirmed' });
  if (!donations.length) return null;

  const totalUsd = donations.reduce((sum, d) => sum + (parseFloat(d.amount_usd) || 0), 0);
  await TaxReport.upsert(walletAddress, year, totalUsd, donations.length);

  return { donations, totalUsd };
}

module.exports = { generatePDFReport, generateCSVReport, getReportData };
