const TaxReportService = require('../services/TaxReportService');
const { isValidWalletAddress, isValidYear } = require('../utils/validators');
const logger = require('../utils/logger');

async function getTaxReport(req, res, next) {
  try {
    const { walletAddress } = req.params;
    const year = parseInt(req.query.year, 10);
    const format = req.query.format || 'pdf';

    if (!isValidWalletAddress(walletAddress)) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_WALLET_ADDRESS',
        message: 'Invalid wallet address format',
      });
    }

    if (!year || !isValidYear(year)) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_YEAR',
        message: 'Valid year is required (e.g., ?year=2024)',
      });
    }

    const reportData = await TaxReportService.getReportData(walletAddress, year);

    if (!reportData) {
      return res.status(404).json({
        status: 'error',
        code: 'NO_DONATIONS_FOUND',
        message: `No confirmed donations found for wallet ${walletAddress} in year ${year}`,
      });
    }

    logger.info(`Generating ${format.toUpperCase()} report for ${walletAddress} year=${year}`);

    if (format === 'csv') {
      const csv = TaxReportService.generateCSVReport(walletAddress, year, reportData.donations, reportData.user);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="tax_report_${walletAddress.substring(0, 10)}_${year}.csv"`);
      return res.send(csv);
    }

    // PDF
    const pdfBuffer = await TaxReportService.generatePDFReport(
      walletAddress, year, reportData.donations, [], reportData.user
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="tax_report_${walletAddress.substring(0, 10)}_${year}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTaxReport };
