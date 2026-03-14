const OrganizationService = require('../services/OrganizationService');
const logger = require('../utils/logger');

async function getOrganizations(req, res, next) {
  try {
    const orgs = await OrganizationService.getAllOrganizations();
    res.json({ status: 'success', data: orgs });
  } catch (err) {
    next(err);
  }
}

async function getOrganizationById(req, res, next) {
  try {
    const org = await OrganizationService.getOrganizationById(req.params.id);
    if (!org) {
      return res.status(404).json({ status: 'error', code: 'ORG_NOT_FOUND', message: 'Organization not found' });
    }
    res.json({ status: 'success', data: org });
  } catch (err) {
    next(err);
  }
}

module.exports = { getOrganizations, getOrganizationById };
