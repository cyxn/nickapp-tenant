import path from 'path';
import fs from 'fs';
import util from 'util';

const checkFileExists = util.promisify(fs.exists);

export default class TenantSassResolver {
  source;
  target;
  tenant;

  constructor(options) {
    this.source = 'resolve';
    this.target = 'resolve';
    this.tenant = options.tenant;
  }

  apply(resolver) {
    const target = resolver.ensureHook(this.target);
    resolver
      .getHook(this.source)
      .tapAsync('TenantSassResolver', async (request, resolveContext, callback) => {
        if (/\.scss$/.test(request.request)) {
          const fileExtension = path.extname(request.request);
          const fullPathToFile = path.resolve(request.path, request.request);
          const nextFilename = request.request.replace(
            /\.\w+$/,
            `.${this.tenant}${fileExtension}`,
          );
          const fullPathToFileToCheck = fullPathToFile.replace(
            /\.\w+$/,
            `.${this.tenant}${fileExtension}`,
          );
          if (await checkFileExists(fullPathToFileToCheck)) {
            const obj = Object.assign({}, request, {
              request: nextFilename,
            });
            return resolver.doResolve(target, obj, null, resolveContext, callback);
          }
        }
        callback();
      });
  }
}
