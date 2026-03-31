/**
 * TTS Prompt Decoder
 * Decodes base64 + gzip compressed TTS prompt XML from Five9 IVR files
 */
import pako from 'pako';

export function decodeTTSPrompt(base64String) {
  if (!base64String || base64String.trim() === '') return null;

  try {
    // Decode base64 to binary
    const binaryString = atob(base64String.trim());
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Inflate gzip
    const inflated = pako.inflate(bytes, { to: 'string' });

    // Parse the inner XML to extract readable text
    return extractPromptText(inflated);
  } catch (e) {
    console.warn('Failed to decode TTS prompt:', e);
    return { raw: base64String, text: '[Unable to decode prompt]', xml: '' };
  }
}

function extractPromptText(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  const result = {
    xml: xmlString,
    segments: [],
    text: ''
  };

  // Try to find <text> or <value> elements with actual prompt text
  // Five9 TTS XML typically has <speak> or <prompt> elements
  const speakEl = doc.querySelector('speak');
  if (speakEl) {
    result.text = speakEl.textContent.trim();
    result.segments.push({ type: 'speak', content: result.text });
    return result;
  }

  // Try <prompt> elements
  const promptEls = doc.querySelectorAll('prompt');
  for (const p of promptEls) {
    const text = p.textContent.trim();
    if (text) {
      result.segments.push({ type: 'prompt', content: text });
    }
  }

  // Try any text content in the doc
  if (result.segments.length === 0) {
    // Look for file references (audio prompts)
    const fileEls = doc.querySelectorAll('file, audio');
    for (const f of fileEls) {
      const src = f.getAttribute('src') || f.textContent.trim();
      if (src) {
        result.segments.push({ type: 'audio', content: src });
      }
    }

    // Look for TTS text nodes
    const walker = doc.createTreeWalker(doc, NodeFilter.SHOW_TEXT, null);
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (text && text.length > 2) {
        result.segments.push({ type: 'text', content: text });
      }
    }
  }

  result.text = result.segments.map(s => s.content).join(' ');

  // If nothing could be extracted, show the raw XML
  if (!result.text) {
    result.text = xmlString;
  }

  return result;
}
