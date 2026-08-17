const fs = require('fs');
const path = 'c:/Users/suchi pujar/OneDrive/Desktop/major project/vibe/frontend/src/index.css';
let content = fs.readFileSync(path, 'utf8');

const footerSocialsCSS = `
.foot-socials {
  display: flex;
  gap: 12px;
  margin-top: 1.5rem;
}
.foot-socials a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
}
.foot-socials a:hover {
  background: var(--accent);
  transform: translateY(-2px);
}

`;

content = content.replace('.foot-grid {', footerSocialsCSS + '.foot-grid {');

const startMarker = '/* ══════════════════════════════════════════════════════\r\n   CONFIRMATION PAGE\r\n   ══════════════════════════════════════════════════════ */';
const endMarker = '/* ══════════════════════════════════════════════════════\r\n   ANIMATIONS\r\n   ══════════════════════════════════════════════════════ */';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newConfirmationCSS = startMarker + `
.cf-main {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg);
}

.cf-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background-image: radial-gradient(circle at 50% 50%, var(--accent-light) 2px, transparent 2px);
  background-size: 100px 100px;
  opacity: 0.1;
  animation: confettiFall 10s linear infinite;
}

@keyframes confettiFall {
  0% { background-position: 0 0; }
  100% { background-position: 100px 1000px; }
}

.cf-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.cf-bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13, 18, 32, 0.85);
  backdrop-filter: blur(8px);
}

.cf-content-wrap {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600px;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cf-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #fff;
}

.cf-success-mark {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 0 0 8px rgba(var(--accent-rgb), 0.2);
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.cf-success-mark svg {
  width: 32px;
  height: 32px;
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.cf-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.cf-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 1.5rem;
}

.cf-reference-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.cf-reference-badge span {
  font-weight: 700;
  color: var(--accent-light);
}

.cf-ticket-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  overflow: hidden;
  margin-bottom: 2.5rem;
  position: relative;
}

.cf-ticket-top {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
}

.cf-ticket-dest {
  display: flex;
  flex-direction: column;
}

.cf-ticket-city {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a24;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.cf-ticket-country {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cf-ticket-mood-tag {
  background: var(--accent);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cf-ticket-divider {
  height: 2px;
  background: repeating-linear-gradient(90deg, #e0e0e0, #e0e0e0 8px, transparent 8px, transparent 16px);
  margin: 0;
  position: relative;
}
.cf-ticket-divider::before,
.cf-ticket-divider::after {
  content: '';
  position: absolute;
  top: -10px;
  width: 20px;
  height: 20px;
  background: #0d1220;
  border-radius: 50%;
}
.cf-ticket-divider::before { left: -10px; }
.cf-ticket-divider::after { right: -10px; }

.cf-ticket-body {
  padding: 2rem;
  background: #fdfdfd;
}

.cf-ticket-row {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}
.cf-ticket-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cf-ticket-icon {
  font-size: 1.5rem;
  margin-right: 1.5rem;
  color: #333;
}

.cf-ticket-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cf-ticket-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  margin-bottom: 0.25rem;
}

.cf-ticket-value {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
}

.cf-ticket-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.cf-ticket-tag {
  background: #f0f0f0;
  color: #444;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.cf-ticket-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
}

.cf-ticket-footer {
  background: #f4f5f7;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eaeaea;
}

.cf-ticket-total-label {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
}

.cf-ticket-total-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--accent);
}

.cf-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cf-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cf-btn-primary {
  background: var(--accent);
  color: #fff;
  flex: 1;
  min-width: 200px;
}
.cf-btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.cf-btn-secondary {
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}
.cf-btn-secondary:hover {
  background: rgba(255,255,255,0.25);
}

.cf-btn-outline {
  background: transparent;
  color: rgba(255,255,255,0.7);
}
.cf-btn-outline:hover {
  color: #fff;
}

.cf-next-steps {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cf-step {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: #fff;
}

.cf-step-icon {
  font-size: 1.25rem;
  margin-right: 1rem;
}

.cf-step-text {
  font-size: 0.95rem;
  opacity: 0.9;
}

` + '\r\n\r\n' + endMarker;

  content = content.substring(0, startIndex) + newConfirmationCSS + content.substring(endIndex + endMarker.length);
  fs.writeFileSync(path, content);
  console.log('Success with \\r\\n');
} else {
  // Try finding with \n only
  const startMarker2 = '/* ══════════════════════════════════════════════════════\n   CONFIRMATION PAGE\n   ══════════════════════════════════════════════════════ */';
  const endMarker2 = '/* ══════════════════════════════════════════════════════\n   ANIMATIONS\n   ══════════════════════════════════════════════════════ */';

  const startIndex2 = content.indexOf(startMarker2);
  const endIndex2 = content.indexOf(endMarker2);
  
  if (startIndex2 !== -1 && endIndex2 !== -1) {
    const newConfirmationCSS = startMarker2 + `
.cf-main {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--bg);
}

.cf-confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background-image: radial-gradient(circle at 50% 50%, var(--accent-light) 2px, transparent 2px);
  background-size: 100px 100px;
  opacity: 0.1;
  animation: confettiFall 10s linear infinite;
}

@keyframes confettiFall {
  0% { background-position: 0 0; }
  100% { background-position: 100px 1000px; }
}

.cf-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.cf-bg-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13, 18, 32, 0.85);
  backdrop-filter: blur(8px);
}

.cf-content-wrap {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600px;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cf-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #fff;
}

.cf-success-mark {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 0 0 8px rgba(var(--accent-rgb), 0.2);
  animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.cf-success-mark svg {
  width: 32px;
  height: 32px;
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.cf-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.cf-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 1.5rem;
}

.cf-reference-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.cf-reference-badge span {
  font-weight: 700;
  color: var(--accent-light);
}

.cf-ticket-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  overflow: hidden;
  margin-bottom: 2.5rem;
  position: relative;
}

.cf-ticket-top {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
}

.cf-ticket-dest {
  display: flex;
  flex-direction: column;
}

.cf-ticket-city {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a24;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.cf-ticket-country {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cf-ticket-mood-tag {
  background: var(--accent);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cf-ticket-divider {
  height: 2px;
  background: repeating-linear-gradient(90deg, #e0e0e0, #e0e0e0 8px, transparent 8px, transparent 16px);
  margin: 0;
  position: relative;
}
.cf-ticket-divider::before,
.cf-ticket-divider::after {
  content: '';
  position: absolute;
  top: -10px;
  width: 20px;
  height: 20px;
  background: #0d1220;
  border-radius: 50%;
}
.cf-ticket-divider::before { left: -10px; }
.cf-ticket-divider::after { right: -10px; }

.cf-ticket-body {
  padding: 2rem;
  background: #fdfdfd;
}

.cf-ticket-row {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}
.cf-ticket-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cf-ticket-icon {
  font-size: 1.5rem;
  margin-right: 1.5rem;
  color: #333;
}

.cf-ticket-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cf-ticket-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  margin-bottom: 0.25rem;
}

.cf-ticket-value {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
}

.cf-ticket-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.cf-ticket-tag {
  background: #f0f0f0;
  color: #444;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.cf-ticket-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
}

.cf-ticket-footer {
  background: #f4f5f7;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eaeaea;
}

.cf-ticket-total-label {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
}

.cf-ticket-total-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--accent);
}

.cf-actions {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cf-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cf-btn-primary {
  background: var(--accent);
  color: #fff;
  flex: 1;
  min-width: 200px;
}
.cf-btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.cf-btn-secondary {
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
}
.cf-btn-secondary:hover {
  background: rgba(255,255,255,0.25);
}

.cf-btn-outline {
  background: transparent;
  color: rgba(255,255,255,0.7);
}
.cf-btn-outline:hover {
  color: #fff;
}

.cf-next-steps {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cf-step {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: #fff;
}

.cf-step-icon {
  font-size: 1.25rem;
  margin-right: 1rem;
}

.cf-step-text {
  font-size: 0.95rem;
  opacity: 0.9;
}

` + '\n\n' + endMarker2;
    content = content.substring(0, startIndex2) + newConfirmationCSS + content.substring(endIndex2 + endMarker2.length);
    fs.writeFileSync(path, content);
    console.log('Success with \\n only');
  } else {
    console.log('Could not find markers');
  }
}
