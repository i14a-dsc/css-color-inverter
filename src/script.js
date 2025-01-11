const copy = document.getElementById('copy');
const paste = document.getElementById('paste');

copy.addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('output').value);
});
paste.addEventListener('click', () => {
  navigator.clipboard.readText().then(text => (document.getElementById('input').value = text));
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
  hex = hex.replace('#', '');
  if (hex.length !== 3 && hex.length !== 6 && hex.length !== 8) {
    throw new Error('Invalid hex length. Input: ' + hex);
  }
  if (/^(?![0-9a-fA-F]+$).*$/.test(hex)) {
    throw new Error('Invalid hex characters. Input: ' + hex);
  }
  let r, g, b, a;
  if (hex.length === 3) {
    r = (255 - parseInt(hex[0], 16)).toString(16).padStart(2, '0');
    g = (255 - parseInt(hex[1], 16)).toString(16).padStart(2, '0');
    b = (255 - parseInt(hex[2], 16)).toString(16).padStart(2, '0');
    a = '';
  } else if (hex.length === 6) {
    r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
    a = '';
  } else if (hex.length === 8) {
    r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
    a = hex.slice(6, 8);
  }
  return `#${r}${g}${b}${a}`;
}

function invertRgb(rgb) {
  const val = rgb.match(/\d+/g);
  if (!val || (val.length !== 3 && val.length !== 4)) {
    throw new Error('Invalid RGB/RGBA format. Input: ' + rgb);
  }
  if (/^(?![0-9]+$).*$/.test(val)) {
    throw new Error('Invalid number. Input: ' + val);
  }
  const r = 255 - parseInt(val[0]);
  const g = 255 - parseInt(val[1]);
  const b = 255 - parseInt(val[2]);
  const a = val[3] !== undefined ? val[3] : '';
  return val.length === 4 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
}

function invert() {
  const i = document.getElementById('input').value.trim().toLowerCase();
  const out = document.getElementById('output');
  const prev = document.getElementById('preview');
  const prevSec = document.getElementById('previewSection');

  try {
    let r = '';

    if (i.startsWith('#')) {
      r = invertHex(i);
    } else if (i.startsWith('rgb')) {
      r = invertRgb(i);
    } else {
      throw new Error('Invalid color format. Please use #RRGGBB, #RRGGBBAA, rgb(), or rgba()');
    }

    out.value = r;
    prev.style.backgroundColor = r;
    prevSec.classList.add('active');
  } catch (e) {
    showError(e.message);
  }
}
