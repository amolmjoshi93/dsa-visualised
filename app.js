/* ===== DSA Visualised — shared code ===== */

const PAGES = [
  { f: 'index.html', t: 'Home' },
  { f: 'why-it-matters.html', t: 'Why it matters', e: '🚀', g: 'intro', d: 'See how speed explodes with size' },
  // data structures
  { f: 'arrays.html', t: 'Arrays', e: '📦', g: 'ds', d: 'Numbered boxes in a row' },
  { f: 'linked-lists.html', t: 'Linked Lists', e: '🔗', g: 'ds', d: 'A treasure hunt of clues' },
  { f: 'stacks.html', t: 'Stacks', e: '🥞', g: 'ds', d: 'Last in, first out' },
  { f: 'queues.html', t: 'Queues', e: '🎟️', g: 'ds', d: 'First come, first served' },
  { f: 'hash-tables.html', t: 'Hash Tables', e: '🗂️', g: 'ds', d: 'Jump straight to what you want' },
  { f: 'trees.html', t: 'Trees', e: '🌳', g: 'ds', d: 'Hierarchies and fast search' },
  { f: 'graphs.html', t: 'Graphs', e: '🕸️', g: 'ds', d: 'Networks of connections' },
  // searching
  { f: 'linear-search.html', t: 'Linear Search', e: '🔦', g: 'search', d: 'Check one by one' },
  { f: 'binary-search.html', t: 'Binary Search', e: '✂️', g: 'search', d: 'Halve the problem each step' },
  // sorting
  { f: 'bubble-sort.html', t: 'Bubble Sort', e: '🫧', g: 'sort', d: 'Swap neighbours until sorted' },
  { f: 'selection-sort.html', t: 'Selection Sort', e: '🎯', g: 'sort', d: 'Pick the smallest, every time' },
  { f: 'insertion-sort.html', t: 'Insertion Sort', e: '🃏', g: 'sort', d: 'Sort like playing cards' },
  { f: 'merge-sort.html', t: 'Merge Sort', e: '🧩', g: 'sort', d: 'Split, sort, merge' },
  { f: 'quick-sort.html', t: 'Quick Sort', e: '⚡', g: 'sort', d: 'Pick a pivot and partition' },
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

function chrome() {
  const cur = location.pathname.split('/').pop() || 'index.html';
  const hd = $('#site-header');
  if (hd) hd.innerHTML = `<header class="top"><div class="wrap">
    <a class="brand" href="index.html">🧠 DSA Visualised</a>
    <nav><a href="why-it-matters.html">Why it matters</a><a href="index.html#ds">Data structures</a><a href="index.html#search">Searching</a><a href="index.html#sort">Sorting</a></nav>
  </div></header>`;
  const ft = $('#site-footer');
  if (ft) {
    const i = Math.max(0, PAGES.findIndex(p => p.f === cur));
    const prev = PAGES[i - 1], next = PAGES[i + 1];
    ft.innerHTML = `<footer class="foot"><div class="wrap">
      <div class="pn">${prev ? `<a href="${prev.f}">← ${prev.t}</a>` : '<span></span>'}${next ? `<a href="${next.f}">${next.t} →</a>` : '<span></span>'}</div>
      <p class="small">Made for learning — play with every demo, break things, and try again.</p></div></footer>`;
  }
  $$('[data-cards]').forEach(el => {
    el.innerHTML = PAGES.filter(p => p.g === el.dataset.cards)
      .map(p => `<a class="tile" href="${p.f}"><div class="e">${p.e}</div><b>${p.t}</b><span>${p.d}</span></a>`).join('');
  });
}

/* ---------- Sorting algorithms as step-by-step generators ---------- */
const cmp = (a, i, j) => ({ t: 'cmp', i, j, x: a[i], y: a[j] });
const swp = (a, i, j) => { const x = a[i], y = a[j]; a[i] = y; a[j] = x; return { t: 'swap', i, j, x, y }; };

function* mergeSortRec(a, l, r) {
  if (l >= r) return;
  const m = (l + r) >> 1;
  yield* mergeSortRec(a, l, m);
  yield* mergeSortRec(a, m + 1, r);
  yield { t: 'range', l, r };
  const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1);
  let x = 0, y = 0, k = l;
  while (x < L.length && y < R.length) {
    yield { t: 'cmp', i: l + x, j: m + 1 + y, x: L[x], y: R[y] };
    if (L[x] <= R[y]) a[k] = L[x++]; else a[k] = R[y++];
    yield { t: 'set', i: k, v: a[k] }; k++;
  }
  while (x < L.length) { a[k] = L[x++]; yield { t: 'set', i: k, v: a[k] }; k++; }
  while (y < R.length) { a[k] = R[y++]; yield { t: 'set', i: k, v: a[k] }; k++; }
}

function* quickSortRec(a, lo, hi) {
  if (lo > hi) return;
  if (lo === hi) { yield { t: 'done', i: lo }; return; }
  yield { t: 'range', l: lo, r: hi };
  const p = a[hi];
  yield { t: 'pivot', i: hi, x: p };
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    yield cmp(a, j, hi);
    if (a[j] < p) { i++; if (i !== j) yield swp(a, i, j); }
  }
  if (i + 1 !== hi) yield swp(a, i + 1, hi);
  yield { t: 'done', i: i + 1 };
  yield* quickSortRec(a, lo, i);
  yield* quickSortRec(a, i + 2, hi);
}

const SortAlgos = {
  *bubble(a) {
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let sw = false;
      for (let j = 0; j < n - 1 - i; j++) {
        yield cmp(a, j, j + 1);
        if (a[j] > a[j + 1]) { yield swp(a, j, j + 1); sw = true; }
      }
      yield { t: 'done', i: n - 1 - i };
      if (!sw) break;
    }
    yield { t: 'all' };
  },
  *selection(a) {
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let m = i;
      for (let j = i + 1; j < n; j++) {
        yield cmp(a, m, j);
        if (a[j] < a[m]) m = j;
      }
      if (m !== i) yield swp(a, i, m);
      yield { t: 'done', i };
    }
    yield { t: 'all' };
  },
  *insertion(a) {
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0) {
        yield cmp(a, j - 1, j);
        if (a[j - 1] > a[j]) { yield swp(a, j - 1, j); j--; } else break;
      }
    }
    yield { t: 'all' };
  },
  *merge(a) { yield* mergeSortRec(a, 0, a.length - 1); yield { t: 'all' }; },
  *quick(a) { yield* quickSortRec(a, 0, a.length - 1); yield { t: 'all' }; },
};

/* ---------- Sort visualiser ---------- */
class SortViz {
  constructor(root) {
    this.root = root; this.algo = root.dataset.algo; this.tok = 0; this.playing = false;
    root.classList.add('viz');
    root.innerHTML = `
      <div class="viz-bars"></div>
      <div class="viz-msg" aria-live="polite">Press <b>Play</b> to watch, or <b>Step</b> to go one move at a time.</div>
      <div class="viz-stats"><span>Comparisons: <b class="c">0</b></span><span>Swaps / writes: <b class="s">0</b></span></div>
      <div class="viz-controls">
        <button class="btn primary play">▶ Play</button>
        <button class="btn step">Step ⏭</button>
        <button class="btn fresh">🔀 New data</button>
        <label>Data <select class="preset">
          <option value="random">Random</option><option value="nearly">Nearly sorted</option>
          <option value="reversed">Reversed</option><option value="few">Few distinct values</option></select></label>
        <label>Items <input type="range" class="size" min="5" max="60" value="${root.dataset.n || 14}"></label>
        <label>Speed <input type="range" class="speed" min="1" max="100" value="65"></label>
      </div>
      <div class="legend"><span><i class="d cmp"></i>comparing</span><span><i class="d swap"></i>swapping / writing</span><span><i class="d pivot"></i>pivot</span><span><i class="d sorted"></i>in final place</span></div>`;
    this.q = s => $(s, root);
    this.q('.play').onclick = () => this.playing ? this.pause() : this.play();
    this.q('.step').onclick = () => { this.pause(); this.step(); };
    this.q('.fresh').onclick = () => this.init();
    this.q('.preset').onchange = () => this.init();
    this.q('.size').oninput = () => this.init();
    this.init();
  }
  ms() { return Math.round(900 * Math.pow(1 - this.q('.speed').value / 101, 2)) + 2; }
  init() {
    this.pause();
    const n = +this.q('.size').value, p = this.q('.preset').value;
    let d = Array.from({ length: n }, () => rand(8, 100));
    if (p === 'nearly') {
      d.sort((a, b) => a - b);
      for (let k = 0; k < Math.max(1, n >> 3); k++) { const i = rand(0, n - 2); [d[i], d[i + 1]] = [d[i + 1], d[i]]; }
    }
    if (p === 'reversed') d.sort((a, b) => b - a);
    if (p === 'few') d = d.map(() => [25, 50, 75, 100][rand(0, 3)]);
    this.data = d; this.gen = SortAlgos[this.algo](this.data);
    this.c = 0; this.s = 0; this.sorted = new Set(); this.range = null; this.pivot = -1; this.finished = false;
    const box = this.q('.viz-bars'); box.innerHTML = '';
    this.bars = d.map(() => { const b = document.createElement('div'); b.innerHTML = '<span></span>'; box.appendChild(b); return b; });
    this.q('.viz-msg').innerHTML = 'Press <b>Play</b> to watch, or <b>Step</b> to go one move at a time.';
    this.stats(); this.render();
  }
  stats() { this.q('.c').textContent = this.c; this.q('.s').textContent = this.s; }
  render(hl = {}) {
    const show = this.data.length <= (innerWidth < 640 ? 12 : 24);
    this.bars.forEach((b, i) => {
      b.style.height = (this.data[i] * 0.88) + '%';
      let c = 'bar';
      if (this.sorted.has(i)) c += ' sorted';
      if (i === this.pivot) c += ' pivot';
      if (hl.cmp && hl.cmp.includes(i)) c += ' cmp';
      if (hl.swap && hl.swap.includes(i)) c += ' swap';
      if (this.range && (i < this.range[0] || i > this.range[1])) c += ' dim';
      b.className = c;
      b.firstChild.textContent = show ? this.data[i] : '';
    });
  }
  step() {
    if (this.finished) return false;
    const r = this.gen.next();
    if (r.done) { this.finished = true; return false; }
    const e = r.value; let hl = {}, msg = '';
    switch (e.t) {
      case 'cmp': this.c++; hl.cmp = [e.i, e.j]; msg = `Compare <b>${e.x}</b> with <b>${e.y}</b>`; break;
      case 'swap': this.s++; hl.swap = [e.i, e.j]; msg = `Swap <b>${e.x}</b> and <b>${e.y}</b> — they were in the wrong order`; break;
      case 'set': this.s++; hl.swap = [e.i]; msg = `Write <b>${e.v}</b> into position ${e.i + 1}`; break;
      case 'pivot': this.pivot = e.i; msg = `Pivot is <b>${e.x}</b>. Smaller values will go to its left, bigger ones to its right.`; break;
      case 'range': this.range = [e.l, e.r]; msg = `Now working on positions ${e.l + 1} to ${e.r + 1}`; break;
      case 'done': this.sorted.add(e.i); this.pivot = -1; msg = `<b>${this.data[e.i]}</b> is now in its final place`; break;
      case 'all': this.data.forEach((_, i) => this.sorted.add(i)); this.range = null; this.pivot = -1; this.finished = true;
        msg = `Sorted! 🎉 ${this.c} comparisons and ${this.s} swaps/writes for ${this.data.length} items.`; break;
    }
    this.q('.viz-msg').innerHTML = msg; this.stats(); this.render(hl);
    if (this.finished) this.pause();
    return true;
  }
  async play() {
    if (this.finished) this.init();
    this.playing = true; this.q('.play').textContent = '⏸ Pause';
    const tok = ++this.tok;
    while (this.playing && tok === this.tok && !this.finished) { this.step(); await sleep(this.ms()); }
  }
  pause() { this.playing = false; this.tok++; const b = this.q('.play'); if (b) b.textContent = '▶ Play'; }
}

/* ---------- Search visualiser ---------- */
function* linearSearchGen(a, t) {
  for (let i = 0; i < a.length; i++) {
    yield { t: 'check', i, v: a[i] };
    if (a[i] === t) { yield { t: 'found', i }; return; }
  }
  yield { t: 'missing' };
}
function* binarySearchGen(a, t) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    yield { t: 'check', i: mid, v: a[mid], lo, hi };
    if (a[mid] === t) { yield { t: 'found', i: mid }; return; }
    if (a[mid] < t) { lo = mid + 1; yield { t: 'go', lo, hi, dir: 'right' }; }
    else { hi = mid - 1; yield { t: 'go', lo, hi, dir: 'left' }; }
  }
  yield { t: 'missing' };
}

class SearchViz {
  constructor(root) {
    this.root = root; this.mode = root.dataset.mode; this.tok = 0; this.playing = false;
    root.classList.add('viz');
    root.innerHTML = `
      <div class="cells"></div>
      <div class="viz-msg" aria-live="polite"></div>
      <div class="viz-stats"><span>Steps taken: <b class="n">0</b></span><span class="note"></span></div>
      <div class="viz-controls">
        <label>Find <input type="number" class="target" min="1" max="99"></label>
        <button class="btn primary play">▶ Find it</button>
        <button class="btn step">Step ⏭</button>
        <button class="btn pick">🎲 Pick a number from the list</button>
        <button class="btn fresh">🔀 New list</button>
      </div>
      <div class="legend"><span><i class="d cmp"></i>being checked</span><span><i class="d sorted"></i>found</span><span>faded = ruled out</span></div>`;
    this.q = s => $(s, root);
    this.q('.play').onclick = () => this.playing ? this.pause() : this.play();
    this.q('.step').onclick = () => { this.pause(); this.step(); };
    this.q('.fresh').onclick = () => this.init();
    this.q('.pick').onclick = () => { this.q('.target').value = this.data[rand(0, this.data.length - 1)]; this.restart(); };
    this.q('.target').oninput = () => this.restart();
    this.init();
  }
  init() {
    const n = this.mode === 'binary' ? 20 : 16, s = new Set();
    while (s.size < n) s.add(rand(1, 99));
    this.data = [...s]; if (this.mode === 'binary') this.data.sort((a, b) => a - b);
    this.q('.target').value = this.data[rand(0, n - 1)];
    this.restart();
  }
  restart() {
    this.pause(); this.gen = null; this.steps = 0; this.cur = -1; this.found = -1; this.seen = new Set();
    this.lo = 0; this.hi = this.data.length - 1; this.finished = false;
    this.q('.viz-msg').innerHTML = this.mode === 'binary'
      ? 'The list is <b>sorted</b>. Press <b>Find it</b> and watch how much of it gets thrown away each step.'
      : 'The list is in <b>no particular order</b>. Press <b>Find it</b> and watch every box get checked.';
    this.q('.note').textContent = '';
    this.draw();
  }
  draw() {
    this.q('.n').textContent = this.steps;
    this.q('.cells').innerHTML = this.data.map((v, i) => {
      let c = 'cell';
      if (i === this.found) c += ' found'; else if (i === this.cur) c += ' cur';
      else if (this.mode === 'binary' && (i < this.lo || i > this.hi)) c += ' out';
      else if (this.seen.has(i)) c += ' seen';
      return `<div class="cellw"><div class="cell ${c.slice(5)}">${v}</div><div class="idx">${i}</div></div>`;
    }).join('');
  }
  step() {
    if (this.finished) return false;
    const t = +this.q('.target').value;
    if (!this.gen) this.gen = (this.mode === 'binary' ? binarySearchGen : linearSearchGen)(this.data, t);
    const r = this.gen.next();
    if (r.done) { this.finished = true; return false; }
    const e = r.value; let msg = '';
    if (e.t === 'check') {
      this.steps++; this.cur = e.i; this.seen.add(e.i);
      if (this.mode === 'binary') { this.lo = e.lo; this.hi = e.hi; }
      if (e.v === t) msg = `Look at <b>${e.v}</b>… that's the one!`;
      else if (this.mode === 'binary') msg = `Peek at the middle: <b>${e.v}</b>. ${e.v < t ? `${t} is bigger, so everything on the left can go.` : `${t} is smaller, so everything on the right can go.`}`;
      else msg = `Is <b>${e.v}</b> equal to ${t}? No — move to the next box.`;
    } else if (e.t === 'go') {
      this.lo = e.lo; this.hi = e.hi; this.cur = -1;
      const left = Math.max(0, e.hi - e.lo + 1);
      msg = `Throw away the ${e.dir === 'right' ? 'left' : 'right'} half. Only <b>${left}</b> candidate${left === 1 ? '' : 's'} left.`;
    } else if (e.t === 'found') {
      this.found = e.i; this.finished = true;
      msg = `🎉 Found <b>${t}</b> at position ${e.i} in just <b>${this.steps}</b> step${this.steps === 1 ? '' : 's'}.`;
      this.q('.note').textContent = `List size: ${this.data.length}`;
    } else if (e.t === 'missing') {
      this.cur = -1; this.finished = true;
      msg = `<b>${t}</b> is not in the list. We needed ${this.steps} step${this.steps === 1 ? '' : 's'} to be sure.`;
    }
    this.q('.viz-msg').innerHTML = msg; this.draw();
    if (this.finished) this.pause();
    return true;
  }
  async play() {
    if (this.finished) this.restart();
    this.playing = true; this.q('.play').textContent = '⏸ Pause';
    const tok = ++this.tok;
    while (this.playing && tok === this.tok && !this.finished) { this.step(); await sleep(this.mode === 'binary' ? 950 : 600); }
  }
  pause() { this.playing = false; this.tok++; const b = this.q('.play'); if (b) b.textContent = '▶ Find it'; }
}

/* ---------- boot ---------- */
chrome();
$$('[data-algo]').forEach(el => new SortViz(el));
$$('[data-mode]').forEach(el => new SearchViz(el));
