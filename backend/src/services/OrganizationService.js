const Organization = require('../models/Organization');

function formatOrganization(org) {
  return {
    id: org.id,
    name: org.name,
    description: org.description,
    logoUrl: org.logo_url,
    website: org.website_url,
    country: org.country,
    city: org.city,
    taxId: org.tax_id,
    taxIdCountry: org.tax_id_country,
    blockchains: (org.blockchain_addresses || []).map(b => ({
      name: b.blockchain,
      network: b.network,
      address: b.address,
    })),
  };
}

async function getAllOrganizations() {
  const orgs = await Organization.findAll();
  return orgs.map(formatOrganization);
}

async function getOrganizationById(id) {
  const org = await Organization.findById(id);
  if (!org) return null;
  return formatOrganization(org);
}

async function getOrgByBlockchainAddress(address, blockchain) {
  const org = await Organization.findByBlockchainAddress(address, blockchain);
  if (!org) return null;
  return formatOrganization(org);
}

async function getAllActiveAddresses() {
  return Organization.getAllActiveAddresses();
}

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  getOrgByBlockchainAddress,
  getAllActiveAddresses,
};
