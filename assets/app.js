/* Your Free Masterclass — application flow
   Plain JavaScript, no dependencies. */

(function () {
  'use strict';

  var QUESTIONS = [
    {
      text: "What's your age range?",
      choices: ['18–24', '25–34', '35–44', '45–54', '55+']
    },
    {
      text: 'Which best describes you?',
      choices: ['Male', 'Female', 'Prefer not to say']
    },
    {
      text: 'How much experience do you have with selling digital products online?',
      choices: [
        'Complete beginner, never made money online',
        'Dabbled, but no consistent results',
        'Made some sales, want to scale',
        'Already earning $5K+/month online'
      ]
    },
    {
      text: "What's your current monthly income from all sources?",
      choices: ['Under $2,000', '$2,000–$5,000', '$5,000–$10,000', '$10,000+']
    },
    {
      text: 'If you saw a proven system that could work for you, what could you invest to get started?',
      choices: ['Under $500', '$500–$1,000', '$1,000–$2,500', '$2,500+']
    },
    {
      text: 'How soon do you want to start?',
      choices: ['Right now', 'In the next 90 days', 'Sometime this year', 'Just exploring']
    },
    {
      text: "This is a FREE Live Training. If you're accepted, will you show up and stay for the full session?",
      choices: [
        "Yes, I'll be there start to finish",
        'Yes, if it fits my schedule',
        "I'd rather watch a recording",
        'Not sure'
      ]
    }
  ];

  var TOTAL_STEPS = QUESTIONS.length + 1; // contact form + questions
  var state = { step: 0, contact: {}, answers: [] };

  var stage = document.getElementById('stage');
  var ring = document.getElementById('ring');
  var ringLabel = ring.querySelector('span');
  var keyListener = null;

  /* ---------- helpers ---------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  function setProgress() {
    var p = Math.min(state.step, TOTAL_STEPS) / TOTAL_STEPS;
    ring.style.setProperty('--p', p);
    ringLabel.textContent = Math.round(p * 100) + '%';
  }

  function swap(panel) {
    if (keyListener) {
      document.removeEventListener('keydown', keyListener);
      keyListener = null;
    }
    stage.innerHTML = '';
    stage.appendChild(panel);
    window.scrollTo(0, 0);
    setProgress();
  }

  /* ---------- screens ---------- */

  function contactScreen() {
    var fields = {
      first: el('input', { type: 'text', id: 'first', autocomplete: 'given-name', value: state.contact.first || '' }),
      last: el('input', { type: 'text', id: 'last', autocomplete: 'family-name', value: state.contact.last || '' }),
      email: el('input', { type: 'email', id: 'email', autocomplete: 'email', value: state.contact.email || '' })
    };

    function field(id, labelText, input, hint, errorText) {
      var label = el('label', { for: id, text: labelText });
      if (hint) label.appendChild(el('small', { text: ' ' + hint }));
      var kids = [label, input];
      if (errorText) kids.push(el('div', { class: 'error', text: errorText }));
      return el('div', { class: 'field' }, kids);
    }

    var fFirst = field('first', 'First name', fields.first, null, 'Please enter your first name.');
    var fLast = field('last', 'Last name', fields.last, null, 'Please enter your last name.');
    var fEmail = field('email', 'Best email', fields.email, null, 'Enter a valid email address.');

    var button = el('button', { class: 'button', type: 'button', text: 'Start application' });

    var panel = el('section', { class: 'panel' }, [
      el('h1', { text: 'Apply for the Free Live Online Business Training' }),
      el('p', { class: 'lede', text: 'This is a short application about 60 seconds. We use it to make sure the training is the right fit before we hold a seat for you.' }),
      el('div', { class: 'grid-2' }, [fFirst, fLast]),
      fEmail,
      button
    ]);

    function submit() {
      var ok = true;
      [[fFirst, fields.first.value.trim() !== ''],
       [fLast, fields.last.value.trim() !== ''],
       [fEmail, validEmail(fields.email.value.trim())]].forEach(function (pair) {
        pair[0].classList.toggle('invalid', !pair[1]);
        if (!pair[1] && ok) { ok = false; pair[0].querySelector('input').focus(); }
      });
      if (!ok) return;
      state.contact = {
        first: fields.first.value.trim(),
        last: fields.last.value.trim(),
        email: fields.email.value.trim()
      };
      state.step = 1;
      render();
    }

    button.addEventListener('click', submit);
    panel.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    swap(panel);
    fields.first.focus();
  }

  function questionScreen(index) {
    var q = QUESTIONS[index];
    var list = el('ul', { class: 'options' });
    var buttons = [];

    q.choices.forEach(function (choice, i) {
      var btn = el('button', { class: 'option', type: 'button' }, [
        el('span', { class: 'rail' }),
        el('span', { class: 'idx', text: String.fromCharCode(65 + i) }),
        el('span', { text: choice })
      ]);
      if (state.answers[index] === choice) btn.classList.add('selected');
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        state.answers[index] = choice;
        setTimeout(function () { state.step += 1; render(); }, 240);
      });
      buttons.push(btn);
      list.appendChild(el('li', null, [btn]));
    });

    var back = el('button', { class: 'link-button', type: 'button', text: 'Back' });
    back.addEventListener('click', function () { state.step -= 1; render(); });

    var panel = el('section', { class: 'panel' }, [
      el('div', { class: 'eyebrow', text: 'Question ' + (index + 1) + ' of ' + QUESTIONS.length }),
      el('h1', { text: q.text }),
      list,
      el('div', { class: 'nav' }, [back, el('span', { class: 'hint', text: 'Press A–' + String.fromCharCode(64 + q.choices.length) + ' to answer' })])
    ]);

    swap(panel);
    buttons[0].focus({ preventScroll: true });

    keyListener = function (e) {
      if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
      var n = e.key.toUpperCase().charCodeAt(0) - 65;
      if (n >= 0 && n < buttons.length) buttons[n].click();
    };
    document.addEventListener('keydown', keyListener);
  }

  function completeScreen() {
    var slot = el('div', { class: 'registration' });
    var check = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    check.setAttribute('viewBox', '0 0 24 24');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M5 12.5l4.5 4.5L19 7');
    check.appendChild(path);

    var panel = el('section', { class: 'panel complete' }, [
      el('div', { class: 'seal' }, [check]),
      el('h1', { text: 'Congratulations, you have qualified for the FREE Live Training for the Your Free Masterclass.' }),
      el('p', { class: 'lede', text: 'Choose your session below and we’ll hold your seat.' }),
      slot
    ]);

    swap(panel);

    // Move the pre-loaded registration form into place and pass the
    // applicant's details on its URL so the form is pre-populated.
    var holder = document.getElementById('registration-holder');
    while (holder.firstChild) slot.appendChild(holder.firstChild);
    prefillRegistration(slot);

    window.APPLICATION = { contact: state.contact, answers: state.answers };
    reportConversion();
    confetti();
  }

  function prefillRegistration(root) {
    var params = new URLSearchParams();
    var c = state.contact;
    if (c.first) params.set('first_name', c.first);
    if (c.last) params.set('last_name', c.last);
    if (c.email) params.set('email', c.email);
    var query = params.toString();
    if (!query) return;

    var tries = 0;
    (function attempt() {
      var frame = root.querySelector('iframe');
      if (frame && frame.src && !frame.dataset.prefilled) {
        frame.dataset.prefilled = '1';
        frame.src += (frame.src.indexOf('?') > -1 ? '&' : '?') + query;
        return;
      }
      if (!frame && tries++ < 40) setTimeout(attempt, 250);
    })();
  }

  /* ---------- Google Ads conversion ---------- */

  // Fired once, only when the applicant reaches the congratulations screen.
  // The email is passed for enhanced conversions; Google hashes it client-side.
  function reportConversion() {
    if (typeof window.gtag !== 'function' || state.conversionSent) return;
    state.conversionSent = true;
    window.gtag('set', 'user_data', {
      email: state.contact.email,
      address: { first_name: state.contact.first, last_name: state.contact.last }
    });
    window.gtag('event', 'conversion', { send_to: 'AW-18415020373/tFRzCLyMo5sdENXS-8xE' });
  }

  /* ---------- confetti ---------- */

  function confetti() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var canvas = document.getElementById('confetti');
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var W, H;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var palette = ['#0f7a46', '#7fcfa3', '#111111', '#f5c518', '#ffffff'];
    var pieces = [];
    for (var i = 0; i < 180; i++) {
      pieces.push({
        x: W / 2 + (Math.random() - 0.5) * 80,
        y: H * 0.35,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 14 - 4,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: palette[i % palette.length],
        alpha: 1
      });
    }

    var start = performance.now();
    (function frame(now) {
      ctx.clearRect(0, 0, W, H);
      var alive = false;
      pieces.forEach(function (p) {
        p.vy += 0.35; p.vx *= 0.98;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        if (now - start > 2400) p.alpha -= 0.02;
        if (p.alpha > 0 && p.y < H + 20) alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.color === '#ffffff') { ctx.strokeStyle = '#111111'; ctx.lineWidth = 1; ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h); }
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (alive) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(start);
  }

  /* ---------- router ---------- */

  function render() {
    if (state.step === 0) return contactScreen();
    if (state.step > QUESTIONS.length) return completeScreen();
    questionScreen(state.step - 1);
  }

  render();
})();
