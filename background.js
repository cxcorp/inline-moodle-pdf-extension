const isContentDisposition = str => /^Content-Disposition$/gi.test(str);

const attachmentRegex = /^attachment/gi;
const replaceAttachmentWithInline = header => {
  if (!attachmentRegex.test(header.value)) {
    return header;
  }

  const { name, value } = header;
  return {
    name,
    value: value.replace(attachmentRegex, "inline")
  };
};

const isContentTypePdf = responseHeaders => {
  const contentTypeHeader = responseHeaders.find(({ name }) =>
    /^Content-Type$/gi.test(name)
  );

  if (!contentTypeHeader) {
    return false;
  }

  return /^application\/pdf$/gi.test(contentTypeHeader.value);
};

const isPathExtensionPdf = responseUrl => {
  const url = new URL(responseUrl);
  return /\.pdf$/gi.test(url.pathname);
};

const isPdf = details =>
  isContentTypePdf(details.responseHeaders) || isPathExtensionPdf(details.url);

const isMainOrSubFrame = type => type === "main_frame" || type === "sub_frame";

chrome.webRequest.onHeadersReceived.addListener(
  details => {
    if (!isPdf(details)) {
      return;
    }

    // limit rewriting to main_frame and sub_frame requests to minimize
    // possible unintended side-effects
    if (!isMainOrSubFrame(details.type)) {
      return;
    }

    const newHeaders = details.responseHeaders.map(header =>
      isContentDisposition(header.name)
        ? replaceAttachmentWithInline(header)
        : header
    );

    return { responseHeaders: newHeaders };
  },
  { urls: ["https://moodle.helsinki.fi/*"] },
  ["blocking", "responseHeaders"]
);
