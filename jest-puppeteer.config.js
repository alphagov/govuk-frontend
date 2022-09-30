module.exports = {
  browserContext: 'incognito',
  browserPerWorker: true,
  launch: {
    // we use --no-sandbox --disable-setuid-sandbox as a workaround for the
    // 'No usable sandbox! Update your kernel' error
    // see more https://github.com/Googlechrome/puppeteer/issues/290
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  }
}
