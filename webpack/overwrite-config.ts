import TenantSassResolver from './tenant-sass-resolver';

const baseExtensions = ['js', 'jsx', 'ts', 'tsx'];

export default function overwriteConfig(tenant, config) {
  if (!tenant) {
    return config;
  }
  const prevExtensions = config.resolve.extensions;
  const tenantExtensions = baseExtensions.filter(Boolean).map(ext => `.${tenant}.${ext}`);

  config.resolve.extensions = [...tenantExtensions, ...prevExtensions];
  config.resolve.plugins = [new TenantSassResolver({ tenant })];
  config.entry = {
    'swag-bundle': config.entry['swag-bundle'],
  };
  // config.optimization.splitChunks.cacheGroups = {
  //   'swag-vendor': config.optimization.splitChunks.cacheGroups['swag-vendor'],
  // };

  return config;
}
