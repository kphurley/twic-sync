import { checkUrlsForSync } from './fileHandlers';

const TWIC_URL = 'https://theweekinchess.com';
const TWIC_HTML_FOLDER = 'html'
const TWIC_ZIPS_FOLDER = 'zips';
const TWIC_HTML_FORMAT_REGEX = 'twic\\d+\\.html';
const TWIC_PGN_FORMAT_REGEX = 'twic\\d+g\\.zip';
const TWIC_CBV_FORMAT_REGEX = 'twic\\d+c6\\.zip';

const PGN_FORMAT = new RegExp(`${TWIC_URL}/${TWIC_ZIPS_FOLDER}/${TWIC_PGN_FORMAT_REGEX}`, 'g');

// Unused for now
const HTML_FORMAT = new RegExp(`${TWIC_URL}/${TWIC_HTML_FOLDER}/${TWIC_HTML_FORMAT_REGEX}`, 'g');
const CBV_FORMAT = new RegExp(`${TWIC_URL}/${TWIC_ZIPS_FOLDER}/${TWIC_CBV_FORMAT_REGEX}`, 'g');

// Note that we can use fetch here because this is consumed by a browser
const getTwicUrlStatuses = (dir) => {
  return fetch('https://theweekinchess.com/twic').then((res) => {
    return res.text();
  }).then((htmlText) => {
    const doc = parseIntoDocument(htmlText);
    const anchorElemHrefs = [...doc.getElementsByTagName('a')].map((el) => el.href);
    
    const pgnUrls = anchorElemHrefs.filter((href) => PGN_FORMAT.test(href));

    // Enable these only if option is selected
    // const htmlUrls = anchorElemHrefs.filter((href) => HTML_FORMAT.test(href));
    // const cbvUrls = anchorElemHrefs.filter((href) => CBV_FORMAT.test(href));

    // Testing for now, maybe not the right place for this
    const urlSyncStatuses = checkUrlsForSync(pgnUrls, dir);

    // We get back a JSON string, parse to an object
    return JSON.parse(urlSyncStatuses);
  }).catch((err) => {
    console.warn('Something went wrong.', err);
  });
};

const parseIntoDocument = (str) => {
  const parser = new DOMParser();
  return parser.parseFromString(str, "text/html");
}

export {
  getTwicUrlStatuses
};
