const copy = document.getElementById('copy');
const paste = document.getElementById('paste');
const logo = document.getElementById('mdi-invert');
const preview = document.getElementById('preview');
const previewInput = document.getElementById('preview-input');
const input = document.getElementById('input');
const output = document.getElementById('output');
const out = document.getElementById('output');
const prevSec = document.getElementById('previewSection');

if (
  !copy ||
  !paste ||
  !logo ||
  !preview ||
  !previewInput ||
  !input ||
  !output ||
  !out ||
  !prevSec
) {
  throw new Error('Element not found.');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    invert();
  }

  if (e.key === 'Escape') {
    prevSec.classList.add('hidden');
    document.body.style.setProperty('background-color', 'var(--bg-main)');
  }
});

logo.addEventListener('click', () => {
  navigator.clipboard.writeText(location.href);
});

copy.addEventListener('click', () => {
  navigator.clipboard.writeText(output.value);
});
paste.addEventListener('click', () => {
  navigator.clipboard.readText().then(text => (input.value = text));
});

preview.addEventListener('click', () => {
  console.log(preview.dataset.color);
  document.body.style.setProperty('background-color', preview.dataset.color ?? 'var(--bg-main)');
});

previewInput.addEventListener('click', () => {
  console.log(previewInput.dataset.color);
  document.body.style.setProperty(
    'background-color',
    previewInput.dataset.color ?? 'var(--bg-main)'
  );
});

const notificationsModule = new MNModule({
  container: '#notifications',
});

function showError(message) {
  notificationsModule.pushNotification({
    title: 'Error',
    message: 'An error occurred: ' + message,
    animation: 'fade',
    closeInMS: 7000,
    type: 'error',
  });
}

function invertHex(hex) {
  let hash = false;
  if (hex.startsWith('#')) {
    hash = true;
    hex = hex.slice(1);
  }
  if (hex.startsWith('0x')) hex = hex.slice(2);

  if (hex.length !== 3 && hex.length !== 6 && hex.length !== 8) {
    throw new Error('Invalid hex length.');
  }
  if (/^(?![0-9a-fA-F]+$).*$/.test(hex)) {
    throw new Error('Invalid hex characters.');
  }
  let r, g, b;
  if (hex.length === 3) {
    r = (255 - parseInt(hex[0] + hex[0], 16)).toString(16).padStart(2, '0');
    g = (255 - parseInt(hex[1] + hex[1], 16)).toString(16).padStart(2, '0');
    b = (255 - parseInt(hex[2] + hex[2], 16)).toString(16).padStart(2, '0');
  } else if (hex.length === 6) {
    r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
  } else if (hex.length === 8) {
    r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
  }
  return `${hash ? '#' : '0x'}${r}${g}${b}`;
}

function invertRgb(rgb) {
  const val = rgb.match(/\d+/g);
  console.log(val);
  if (!val || (val.length !== 3 && val.length !== 4)) {
    throw new Error('Invalid RGB/RGBA format.');
  }
  if (val.some(v => /^(?![0-9]+$).*$/.test(v))) {
    throw new Error('Invalid number.');
  }
  let [r, g, b] = val;

  r = (255 - parseInt(r)).toString();
  g = (255 - parseInt(g)).toString();
  b = (255 - parseInt(b)).toString();
  const a = val[3] !== undefined ? val[3] : undefined;

  return a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  let hash = false;
  if (hex.startsWith('#')) {
    hash = true;
    hex = hex.slice(1);
  }
  if (hex.startsWith('0x')) hex = hex.slice(2);

  if (hex.length !== 3 && hex.length !== 6 && hex.length !== 8) {
    throw new Error('Invalid hex length.');
  }
  if (/^(?![0-9a-fA-F]+$).*$/.test(hex)) {
    throw new Error('Invalid hex characters.');
  }
  let r, g, b;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function invert() {
  const i = input.value.trim().toLowerCase();

  try {
    let r = '';

    if (i.startsWith('#') || i.startsWith('0x')) {
      r = invertHex(i);
    } else if (i.startsWith('rgb')) {
      r = invertRgb(i);
    } else {
      throw new Error('Invalid color format.');
    }

    if (r.startsWith('0x')) {
      r = '#' + r.slice(2);
    }

    console.log('solid ' + r);
    out.value = r;
    previewInput.style.setProperty(
      'background-color',
      i ? (i.startsWith('rgb') ? i : hexToRgb(i)) : 'var(--bg-main)'
    );
    previewInput.dataset.color = i ? (i.startsWith('rgb') ? i : hexToRgb(i)) : 'var(--bg-main)';
    preview.style.setProperty(
      'background-color',
      r ? (r.startsWith('rgb') ? r : hexToRgb(r)) : 'var(--bg-main)'
    );
    preview.dataset.color = r ? (r.startsWith('rgb') ? r : hexToRgb(r)) : 'var(--bg-main)';
    prevSec.classList.add('active');
    prevSec.classList.remove('hidden');
  } catch (e) {
    showError(e.message);
  }
}
