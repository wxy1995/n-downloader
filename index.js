const fs = require('fs');
const urlparser = require('url');
const path = require('path');
const process = require('process');
const mkdirp = require('mkdirp');
const got = require('got');
const getStream = require('get-stream');
const extName = require('ext-name');
const ora = require('ora');
const logger = require('./logger');
const { isUndefined } = require('./utils');

const package = require('./package.json');
const defaultFilename = package.name;

function errorHandler(error) {
  if (error) {
    throw error;
  }
}

function getExtnameFromMime(mime) {
  if (!mime) {
    return null;
  }
  const exts = extName.mime(mime);
  if (exts.length !== 1) {
    for (let i = 0; i < exts.length; i++) {
      let pattern = new RegExp(`/${exts[i].ext}`);
      if (pattern.test(exts[i].mime)) {
        return exts[i].ext;
      }
    }
    return null;
  }
  return exts[0].ext;
}

function getFilenameFromUrl(url) {
  return path.basename(urlparser.parse(url).pathname);
}

function getFilename(res) {
  let filename = getFilenameFromUrl(res.requestUrl) || defaultFilename;
  if (!path.extname(filename)) {
    const mimetype = res.headers['content-type'];
    const extname = getExtnameFromMime(mimetype);
    if (extname) {
      filename = `${filename}.${extname}`;
    }
  }
  return filename;
}

function promisify(req) {
  return new Promise((resolve, reject) => {
    req
      .on('response', resolve)
      .on('error', reject);
  });
}

function nDownloader(url, output, options = {}) {
  options = Object.assign(
    {
      logger: {},
      request: {}
    },
    options
  );
  logger.setOptions({
    ...options.logger,
  });

  const spinner = ora().start(`[Downloading] ${url}\n`);

  const encoding = options.request.encoding || 'buffer';
  const stream = got.stream(url, options.request);
  const promise = Promise.all([getStream(stream, { encoding }), promisify(stream)])
    .then(result => {
      const [data, res] = result;

      if (isUndefined(output)) {
        spinner.stop();
        logger.success(`[Fetched] ${url}\n`);
        return data;
      }

      output = path.resolve(process.cwd(), output);
      let dir = path.dirname(output);
      if (!path.extname(output)) {
        dir = output;
        output += `/${getFilename(res)}`;
      }

      mkdirp(dir, errorHandler);

      let outputFile = path.resolve(process.cwd(), output);
      fs.writeFile(outputFile, data, errorHandler);

      spinner.stop();
      logger.success(`[Saved] ${url} => ${outputFile}\n`);
      return data;
    }, errorHandler)
    .catch(error => {
      spinner.stop();
      logger.error(`[Failed] ${url}\n${error.stack}\n`);
    });

  stream.then = promise.then.bind(promise);
  stream.catch = promise.catch.bind(promise);

  return stream;
}

module.exports = nDownloader;