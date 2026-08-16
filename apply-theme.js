const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Typography
  { from: /text-cyan-400/g, to: 'text-sac-orange' },
  { from: /text-cyan-300/g, to: 'text-sac-orange' },
  { from: /text-cyan-500/g, to: 'text-sac-orange' },
  { from: /text-amber-400/g, to: 'text-sac-blue' },
  { from: /text-amber-300/g, to: 'text-sac-blue' },
  { from: /text-white\/80/g, to: 'text-slate-600' },
  { from: /text-white\/60/g, to: 'text-slate-500' },
  { from: /text-white/g, to: 'text-slate-900' },
  { from: /text-slate-200/g, to: 'text-slate-700' },
  { from: /text-slate-300/g, to: 'text-slate-600' },
  { from: /text-slate-400/g, to: 'text-slate-500' },
  
  // Backgrounds & Glassmorphism
  { from: /bg-slate-950\/80/g, to: 'bg-white/90' },
  { from: /bg-slate-900\/60/g, to: 'bg-white/80' },
  { from: /bg-slate-950/g, to: 'bg-white' },
  { from: /bg-slate-900/g, to: 'bg-slate-50' },
  { from: /bg-slate-800/g, to: 'bg-slate-100' },
  { from: /bg-cyan-950\/60/g, to: 'bg-sac-orange/10' },
  { from: /bg-amber-950\/40/g, to: 'bg-sac-blue/10' },
  { from: /glass-panel-cyan/g, to: 'surface-card' },
  { from: /glass-panel-gold/g, to: 'surface-card' },
  { from: /glass-panel/g, to: 'surface-card' },
  { from: /glass-input/g, to: 'premium-input' },
  { from: /bg-cyan-500\/10/g, to: 'bg-sac-orange/10' },
  { from: /bg-cyan-500\/20/g, to: 'bg-sac-orange/20' },

  // Borders
  { from: /border-white\/10/g, to: 'border-slate-200' },
  { from: /border-white\/5/g, to: 'border-slate-200' },
  { from: /border-cyan-500\/30/g, to: 'border-sac-orange/30' },
  { from: /border-cyan-500\/50/g, to: 'border-sac-orange/50' },
  { from: /border-amber-500\/30/g, to: 'border-sac-blue/30' },

  // Gradients
  { from: /from-cyan-500 via-blue-600 to-indigo-700/g, to: 'from-sac-orange to-sac-orange-light' },
  { from: /from-white via-slate-100 to-cyan-300/g, to: 'from-sac-navy to-sac-navy-light' },
  { from: /from-cyan-400 via-cyan-300 to-teal-300/g, to: 'from-sac-orange to-sac-orange-light' },
  { from: /from-cyan-400 to-teal-300/g, to: 'from-sac-orange to-sac-orange-light' },
  { from: /from-cyan-500\/0 via-cyan-500 to-cyan-500\/0/g, to: 'from-sac-orange/0 via-sac-orange to-sac-orange/0' },
  { from: /from-transparent via-cyan-400 to-transparent/g, to: 'from-transparent via-sac-orange to-transparent' },

  // Shadows
  { from: /shadow-\[0_8px_32px_rgba\(0,0,0,0\.6\)\]/g, to: 'shadow-soft' },
  { from: /shadow-\[0_0_18px_rgba\(6,182,212,0\.4\)\]/g, to: 'shadow-md' },
  { from: /shadow-\[0_0_14px_rgba\(6,182,212,0\.2\)\]/g, to: 'shadow-sm' },
  { from: /shadow-\[0_0_20px_rgba\(6,182,212,0\.4\)\]/g, to: 'shadow-md' },
  { from: /shadow-\[0_0_28px_rgba\(6,182,212,0\.6\)\]/g, to: 'shadow-lg' },
  { from: /shadow-\[0_0_25px_rgba\(6,182,212,0\.35\)\]/g, to: 'shadow-md' },
  
  // Hovers
  { from: /hover:text-white/g, to: 'hover:text-sac-orange' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-slate-100' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-slate-200' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log("Done applying theme replacements.");
