const fs = require("fs");
const p = "components/landing/LandingView.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r?\n\s*\{\/\* SITE_IMAGES\.img1[\s\S]*?<\/div>\r?\n\r?\n\s*<section className="proof-strip"/, "\n\n        <section className=\"proof-strip\"");
const teaser = /\r?\n\s*\{\/\* Reflections teaser on home[\s\S]*?<\/section>\r?\n\r?\n/;
if (!teaser.test(t)) { console.error("teaser fail"); process.exit(1); }
t = t.replace(teaser, "\n");
const tm = /\r?\n\s*<section className="section testimonials-section">[\s\S]*?<div className="testimonials-layout">[\s\S]*?<div className="testimonials-image animate-in">[\s\S]*?<\/div>\r?\n\r?\n\s*<div className="animate-in">\r?\n\s*<div className="section--narrow"/;
// too fragile
