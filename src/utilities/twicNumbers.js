export function extractTwicNumberFromUrl(url) {
  // Format is expected to be: "https://theweekinchess.com/zips/twic1436g.zip"
  const twicNumberMatches = url.match(/\d+/);
  const twicNumber = twicNumberMatches.length > 0 && twicNumberMatches[0];

  return parseInt(twicNumber);
}
