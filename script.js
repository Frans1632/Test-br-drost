// JavaScript gör sidan interaktiv. Vi hittar först elementen i HTML-filen.
const lever = document.querySelector('#lever');
const toastScene = document.querySelector('#toast-scene');
const toastStatus = document.querySelector('#toast-status');
const launchButton = document.querySelector('#launch');
const rocketScene = document.querySelector('#rocket-scene');
const rocketStatus = document.querySelector('#rocket-status');
const countdown = document.querySelector('#countdown');
const breadButton = document.querySelector('#bread');
const toasterButton = document.querySelector('#toaster');
const rocketButtonLabel = launchButton.textContent;
const rocketButton = document.querySelector('#rocket');
const toastIdleText = toastStatus.textContent;
const rocketIdleText = rocketStatus.textContent;

// En liten väntfunktion. Tiden anges i millisekunder: 1000 = en sekund.
const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));
let toasting = false;
let dragging = false;
let startY = 0;
let dragDistance = 0;
let ignoreNextClick = false;

async function toastBread() {
  if (toasting) return;
  toasting = true;
  setToyBusy(toasterButton, true);
  playToySound('toast');
  fillBackground('toast', toasterButton);
  lever.disabled = true;
  breadButton.disabled = true;
  toasterButton.disabled = true;
  lever.style.top = '62px';
  toastScene.classList.add('toasting');
  toastStatus.textContent = 'Rostar…';
  await wait(900);
  toastScene.classList.remove('toasting');
  toastScene.classList.add('popping');
  lever.style.top = '0px';
  toastStatus.textContent = 'Hopp!';
  await wait(1400);
  toastScene.classList.remove('popping');
  lever.disabled = false;
  breadButton.disabled = false;
  toasterButton.disabled = false;
  toasting = false;
  setToyBusy(toasterButton, false);
  toastStatus.textContent = toastIdleText;
}

breadButton.addEventListener('click', toastBread);
toasterButton.addEventListener('click', toastBread);

// Pointer-händelser fungerar både med mus och med fingret på en mobil.
lever.addEventListener('pointerdown', (event) => {
  if (toasting) return;
  dragging = true;
  startY = event.clientY;
  dragDistance = 0;
  ignoreNextClick = false;
  lever.setPointerCapture(event.pointerId);
});

// Figurerna delar samma klickfunktion, men har egna rörelser och bakgrunder.
const toySettings = {
  balloon: { message: 'Hejdå! Hej igen!', emoji: '🎈' },
  flower: { message: 'Plask! Väx!', emoji: '🌷' },
  egg: { message: 'Pip pip!', emoji: '🥚', surprise: '🐣' },
  gift: { message: 'Tittut!', emoji: '🎁', surprise: '🧸' },
  drum: { message: 'Bum bum!', emoji: '🥁' },
  icecream: { message: 'Strössel! Mums!', emoji: '🍦' },
  wishing: { message: 'Snurr!', emoji: '⭐' },
  frog: { message: 'Kvack! Plask!', emoji: '🐸', duration: 3200 },
  robot: { message: 'Beep boop! Dansa!', emoji: '🤖', duration: 3600 },
  duck: { message: 'Kvack kvack!', emoji: '🦆' },
  butterfly: { message: 'Fladder!', emoji: '🦋' },
  car: { message: 'Tut tut! Brum!', emoji: '🚗', duration: 4400, roam: true },
  bee: { message: 'Bzzzz!', emoji: '🐝' },
  dinosaur: { message: 'Duns! Raaawr!', emoji: '🦖' },
  unicorn: { message: 'Flyg! Magi!', emoji: '🦄', duration: 4400, roam: true },
  snowman: { message: 'Snurr! Snö!', emoji: '⛄' },
  football: { message: 'Boing boing!', emoji: '⚽' },
  rainbow: { message: 'Alla färger!', emoji: '🌈' }
};

document.querySelectorAll('[data-toy]').forEach(button => {
  button.addEventListener('click', async () => {
    if (button.disabled) return;
    const name = button.dataset.toy;
    const settings = toySettings[name];
    const scene = document.querySelector(`[data-scene="${name}"]`);
    const status = document.querySelector(`[data-status="${name}"]`);
    const idleText = status.textContent;
    const object = scene.querySelector('.object');
    button.disabled = true;
    setToyBusy(button, true);
    playToySound(name);
    fillBackground(name, button);
    if (settings.roam && !useGentleMotion()) roamScreen(name, button, scene, settings.duration);
    scene.classList.add('active');
    status.textContent = settings.message;
    if (settings.surprise) {
      await wait(650);
      object.innerHTML = toyArtwork(name === 'egg' ? 'chick' : 'teddy');
      await wait(1150);
    } else {
      await wait(settings.duration || 1800);
    }
    scene.classList.remove('active');
    object.innerHTML = toyArtwork(name);
    button.disabled = false;
    setToyBusy(button, false);
    status.textContent = idleText;
  });
});
lever.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  dragDistance = Math.max(0, Math.min(62, event.clientY - startY));
  lever.style.top = `${dragDistance}px`;
});
lever.addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;
  ignoreNextClick = dragDistance > 8;
  if (dragDistance >= 35) toastBread();
  else lever.style.top = '0px';
});
function cancelDrag() {
  if (!dragging) return;
  dragging = false;
  lever.style.top = '0px';
}
lever.addEventListener('pointercancel', cancelDrag);
lever.addEventListener('lostpointercapture', cancelDrag);
lever.addEventListener('click', () => {
  if (ignoreNextClick) { ignoreNextClick = false; return; }
  toastBread();
});

// Vid ett klick räknar vi 3, 2, 1 och lägger till CSS-animationen.
async function launchRocket() {
  if (launchButton.disabled) return;
  launchButton.disabled = true;
  rocketButton.disabled = true;
  setToyBusy(rocketButton, true);
  playToySound('rocket');
  fillBackground('rocket', rocketButton);
  showLaunchEffects();
  launchButton.textContent = 'Gör dig redo…';
  rocketScene.classList.add('preparing');
  for (let number = 3; number >= 1; number--) {
    countdown.textContent = number;
    rocketStatus.textContent = `Start om ${number}…`;
    await wait(1000);
  }
  countdown.textContent = '';
  rocketScene.classList.remove('preparing');
  rocketScene.classList.add('flying');
  rocketStatus.textContent = 'Woosh!';
  launchButton.textContent = 'På rymdäventyr…';
  await wait(1800);
  rocketScene.classList.remove('flying');
  launchButton.disabled = false;
  rocketButton.disabled = false;
  setToyBusy(rocketButton, false);
  launchButton.textContent = rocketButtonLabel;
  rocketStatus.textContent = rocketIdleText;
}
launchButton.addEventListener('click', launchRocket);
rocketButton.addEventListener('click', launchRocket);

// Dekorationen fångar aldrig klick. Antalet partiklar är begränsat,
// så många snabba klick inte skapar fler och fler element.
const dustLayer = document.querySelector('#stardust');
const launchEffects = document.querySelector('#launch-effects');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function useGentleMotion() { return reducedMotion.matches; }
function setToyBusy(button, busy) {
  const card = button.closest('.toy');
  card.classList.toggle('playing', busy);
  card.setAttribute('aria-busy', String(busy));
}
for (let i = 0; i < 60; i++) {
  const star = document.createElement('span');
  star.textContent = i % 3 === 0 ? '✧' : '✦';
  star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--delay:${Math.random()*.5}s;--size:${12+Math.random()*25}px;--color:${['#f5aa00','#a54df1','#f14395','#06a9be'][i%4]}`;
  dustLayer.append(star);
}
const smokeBed = launchEffects.querySelector('.smoke-bed');
const fireBed = launchEffects.querySelector('.fire-bed');
for (let i = 0; i < 24; i++) {
  const smoke = document.createElement('span');
  smoke.style.cssText = `left:${i*100/23}%;--delay:${(i%5)*.12}s;--drift:${(i%2 ? 1 : -1)*(20+i%4*15)}px`;
  smokeBed.append(smoke);
  const flame = document.createElement('span');
  flame.textContent = '🔥';
  flame.style.cssText = `left:${i*100/23}%;--delay:${(i%4)*.1}s`;
  fireBed.append(flame);
}
let dustTimer;
let fireTimer;
document.addEventListener('click', event => {
  if (event?.target?.closest('.play-controls')) return;
  if (event?.target && !event.target.closest('.toy')) playToySound('stardust');
  clearTimeout(dustTimer);
  dustLayer.classList.remove('shimmering');
  void dustLayer.offsetWidth; // Starta om animationen vid nästa klick.
  dustLayer.classList.add('shimmering');
  dustTimer = setTimeout(() => dustLayer.classList.remove('shimmering'), useGentleMotion() ? 700 : 2400);
});
function showLaunchEffects() {
  clearTimeout(fireTimer);
  launchEffects.classList.add('burning');
  fireTimer = setTimeout(() => launchEffects.classList.remove('burning'), 5200);
}

// Ett klick på kortets tomma yta använder samma knapp som figuren.
// Klick på en riktig knapp hanteras bara av knappen själv.
document.querySelectorAll('.toy').forEach(card => {
  let tapTimer;
  card.addEventListener('pointerdown', () => {
    clearTimeout(tapTimer);
    card.classList.add('tap-pop');
    tapTimer = setTimeout(() => card.classList.remove('tap-pop'), 180);
  });
  card.addEventListener('click', event => {
    if (event.target.closest('button')) return;
    const control = card.querySelector('[data-toy], #toaster, #launch');
    if (control && !control.disabled) control.click();
  });
});

const themeBackground = document.querySelector('#theme-background');
const butterScreen = document.querySelector('#butter-screen');
const screenActors = document.querySelector('#screen-actors');
const backgroundThemes = {
  toast: ['🧈'], rocket: ['🪐','⭐','☄️'], balloon: ['🎈'],
  flower: ['🌼','🌸','🌷','💧'], egg: ['🐣','🐥','🥚'], gift: ['🎁','🧸','🎊'],
  drum: ['♫','♪','🥁'], icecream: ['sprinkle'], wishing: ['⭐','✨','🌟'],
  frog: ['🐸','🐸','💦'], robot: ['🤖','🤖','♫','♪'], duck: ['🦆','💦'],
  butterfly: ['🦋','🌸'], car: ['💨','🏁','🚦'], bee: ['🐝','🌼'],
  dinosaur: ['🦖','🦕','🌿'], unicorn: ['🌈','✨','🦄'],
  snowman: ['❄','⛄','❄'], football: ['⚽','💫'], rainbow: ['🌈','💧','☀️']
};
let backgroundTimer;

function fillBackground(name, source) {
  clearTimeout(backgroundTimer);
  themeBackground.replaceChildren();
  themeBackground.className = `theme-background theme-${name}`;
  butterScreen.classList.toggle('spread', name === 'toast');
  const rect = source.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const palette = ['#ff3e8b','#ffc400','#17bfc5','#8947ef','#ff7045'];
  const particleCount = useGentleMotion() ? 12 : 32;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    const symbols = backgroundThemes[name];
    const symbol = symbols[i % symbols.length];
    const targetX = (i % 8 + .2 + Math.random() * .6) / 8 * window.innerWidth;
    const targetY = (Math.floor(i / 8) + .2 + Math.random() * .6) / Math.ceil(particleCount / 8) * window.innerHeight;
    const duration = name === 'robot' ? 4200 : 4600;
    particle.className = symbol === 'sprinkle' ? 'theme-particle sprinkle-particle' : 'theme-particle';
    if (illustratedSymbols[symbol]) particle.innerHTML = toyArtwork(illustratedSymbols[symbol]);
    else particle.textContent = symbol === 'sprinkle' ? '' : symbol;
    particle.style.cssText = `left:${targetX}px;top:${targetY}px;--from-x:${originX-targetX}px;--from-y:${originY-targetY}px;--drift-x:${(Math.random()-.5)*150}px;--drift-y:${(Math.random()-.5)*150}px;--delay:${i*.008}s;--duration:${duration}ms;--particle-size:${24+Math.random()*30}px;--particle-color:${palette[i%palette.length]};--tilt:${(i%2?1:-1)*(15+i%4*10)}deg`;
    themeBackground.append(particle);
  }
  backgroundTimer = setTimeout(() => {
    themeBackground.replaceChildren();
    butterScreen.classList.remove('spread');
  }, useGentleMotion() ? 1400 : 5200);
}

// Figuren får en kopia i ett lager utanför korten. CSS flyttar den
// mellan punkter på skärmen och tillbaka till dess startposition.
function roamScreen(name, button, scene, duration) {
  const rect = button.getBoundingClientRect();
  const size = Math.min(100, window.innerWidth * .22);
  const startX = rect.left + rect.width / 2 - size / 2;
  const startY = rect.top + rect.height / 2 - size / 2;
  const right = Math.max(12, window.innerWidth - size - 16);
  const bottom = Math.max(12, window.innerHeight - size - 16);
  const actor = document.createElement('span');
  actor.className = `screen-actor roaming-${name}`;
  actor.innerHTML = toyArtwork(name);
  actor.style.cssText = `left:${startX}px;top:${startY}px;--actor-size:${size}px;--duration:${duration}ms;--left-x:${16-startX}px;--right-x:${right-startX}px;--top-y:${16-startY}px;--bottom-y:${bottom-startY}px;--middle-y:${window.innerHeight*.45-startY}px`;
  screenActors.append(actor);
  scene.classList.add('roaming');
  setTimeout(() => {
    actor.remove();
    scene.classList.remove('roaming');
  }, duration);
}

// Samma ritade figur används i kortet, flygturen och bakgrundseffekten.
function toyArtwork(name) {
  return `<svg class="toy-art" viewBox="0 0 160 160" aria-hidden="true" focusable="false"><use href="#toy-${name}"></use></svg>`;
}
const illustratedSymbols = {
  '🧈':'butter', '🚀':'rocket', '🎈':'balloon', '🌼':'flower', '🌸':'flower', '🌷':'flower',
  '🥚':'egg', '🐣':'chick', '🐥':'chick', '🎁':'gift', '🧸':'teddy', '🥁':'drum',
  '🍦':'icecream', '⭐':'wishing', '🌟':'wishing', '🐸':'frog', '🤖':'robot',
  '🦆':'duck', '🦋':'butterfly', '🚗':'car', '🐝':'bee', '🦖':'dinosaur', '🦕':'dinosaur',
  '🦄':'unicorn', '⛄':'snowman', '⚽':'football', '🌈':'rainbow'
};

// Ljuden skapas direkt i webbläsaren. Inga ljudfiler behöver laddas ned.
// Samma ljudfunktion används när man klickar på kortet, figuren eller spaken.
const soundToggle = document.querySelector('#sound-toggle');
let soundEnabled = true;
let audioContext;
let masterVolume;
let noiseBuffer;
const activeSoundSources = new Set();

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) {
    audioContext = new AudioContextClass();
    masterVolume = audioContext.createGain();
    masterVolume.gain.value = soundEnabled ? .14 : 0;
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 8;
    compressor.attack.value = .003;
    compressor.release.value = .2;
    const soften = audioContext.createBiquadFilter();
    soften.type = 'lowpass';
    soften.frequency.value = 3200;
    masterVolume.connect(soften);
    soften.connect(compressor);
    compressor.connect(audioContext.destination);
    noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    const samples = noiseBuffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
  }
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  return audioContext;
}

function trackSound(source, nodes, start, end) {
  // Håll även många snabba klick begränsade till högst 96 ljudkällor.
  if (activeSoundSources.size >= 96) {
    const oldest = activeSoundSources.values().next().value;
    oldest.stop();
    activeSoundSources.delete(oldest);
  }
  activeSoundSources.add(source);
  source.onended = () => {
    activeSoundSources.delete(source);
    nodes.forEach(node => node.disconnect());
  };
  source.start(start);
  source.stop(end);
}

function playToySound(name) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const base = ctx.currentTime + .015;
    // Varje ton och brus får en mjuk start och avslut för att undvika klickljud.
    function tone(freq, delay, duration, type = 'sine', volume = .35, endFreq = freq) {
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      const start = base + delay;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, start);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + duration);
      envelope.gain.setValueAtTime(.0001, start);
      envelope.gain.exponentialRampToValueAtTime(volume, start + Math.min(.03, duration / 4));
      envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(envelope);
      envelope.connect(masterVolume);
      trackSound(oscillator, [oscillator, envelope], start, start + duration + .02);
    }
    function noise(delay, duration, frequency = 900, volume = .3, filterType = 'lowpass') {
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const envelope = ctx.createGain();
      const start = base + delay;
      source.buffer = noiseBuffer;
      source.loop = true;
      filter.type = filterType;
      filter.frequency.value = frequency;
      filter.Q.value = .8;
      envelope.gain.setValueAtTime(.0001, start);
      envelope.gain.exponentialRampToValueAtTime(volume, start + Math.min(.1, duration / 4));
      envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
      source.connect(filter);
      filter.connect(envelope);
      envelope.connect(masterVolume);
      trackSound(source, [source, filter, envelope], start, start + duration + .02);
    }
    function melody(notes, step = .13, delay = 0, type = 'sine') {
      notes.forEach((note, i) => tone(note, delay + i * step, step * 1.6, type, .25));
    }
    function splash(delay = 0) {
      noise(delay, .4, 1500, .45, 'bandpass');
      tone(360, delay, .22, 'sine', .25, 90);
    }
    function quack(delay, frequency = 300) {
      tone(frequency, delay, .23, 'sawtooth', .24, frequency * .55);
      tone(frequency * 1.5, delay + .02, .16, 'triangle', .14, frequency * .75);
    }
    switch (name) {
      case 'stardust': melody([1568,2093,2637], .1); break;
      case 'toast':
        tone(90, 0, .7, 'triangle', .15); noise(0, .75, 450, .12);
        tone(180, .9, .3, 'triangle', .55, 850); tone(1100, 1.12, .35, 'sine', .3, 500); break;
      case 'rocket':
        [0,1,2].forEach(delay => tone(620, delay, .16, 'sine', .3));
        noise(3, 1.8, 1700, .75); tone(55, 3, 1.75, 'sawtooth', .35, 150);
        tone(160, 3, 1.6, 'triangle', .2, 700); break;
      case 'car':
        for (let i=0;i<8;i++) {
          tone(55+i%3*12, i*.5, .52, 'sawtooth', .32, 90+i%3*30);
          tone(110, i*.5, .5, 'triangle', .12, 180);
        }
        noise(0, 4.3, 350, .15); tone(440, .15, .18, 'square', .15); tone(350, .37, .22, 'square', .15); break;
      case 'robot':
        for (let i=0;i<10;i++) {
          tone(95, i*.34, .14, 'sine', .55, 40);
          noise(i*.34+.17, .06, 6000, .12, 'highpass');
        }
        melody([330,440,550,440,660,550,440,330], .36, .05, 'square'); break;
      case 'frog':
        quack(0, 170); quack(.45, 190); tone(140, .9, .3, 'triangle', .3, 480);
        quack(1.5, 150); splash(2.4); break;
      case 'duck': quack(0); quack(.4); quack(.8, 340); splash(1.1); break;
      case 'balloon': tone(350, 0, 1.5, 'sine', .2, 1600); noise(.2, 1.2, 1700, .12, 'bandpass'); break;
      case 'flower': [0,.18,.36,.55].forEach(d => tone(1000, d, .12, 'sine', .2, 350)); melody([523,659,784], .19, .8); break;
      case 'egg': noise(0, .09, 2200, .3); noise(.25, .1, 1800, .3);
        [.7,.95,1.2].forEach(d => tone(1800, d, .13, 'sine', .22, 2600)); break;
      case 'gift': noise(0, .5, 1900, .2, 'bandpass'); melody([392,494,587,784], .16, .6); break;
      case 'drum':
        for (let i=0;i<8;i++) { noise(i*.18, .12, 1800, .4, 'bandpass'); tone(170, i*.18, .15, 'triangle', .3, 65); } break;
      case 'icecream': melody([1300,1000,1600,1100,1800,1300,2100,1600], .14, .1); break;
      case 'wishing': melody([784,988,1175,1568,1175,988], .2); break;
      case 'butterfly': [0,.25,.5,.75,1,1.25].forEach(d => noise(d, .12, 2500, .13, 'bandpass')); melody([880,1175,1320], .25, .3); break;
      case 'bee': tone(145, 0, 1.75, 'sawtooth', .2, 230); tone(290, 0, 1.7, 'triangle', .1, 410); break;
      case 'dinosaur': noise(0, .8, 500, .55); tone(90, 0, .9, 'sawtooth', .35, 35);
        [.6,1.2].forEach(d => {tone(100,d,.22,'sine',.65,30);noise(d,.18,650,.35)}); break;
      case 'unicorn': melody([523,659,784,1047,1319,1047,784,659,523,784,1047,1568], .33); noise(0, 4.2, 2000, .09, 'bandpass'); break;
      case 'snowman': noise(0, 1.65, 3500, .16, 'highpass'); melody([1568,1319,1175,1047], .27, .1); break;
      case 'football': [.12,.62,1.12].forEach((d,i) => {tone(180,d,.2,'sine',.4,55);tone(280+i*90,d+.05,.25,'triangle',.2,650)}); break;
      case 'rainbow': noise(0,.7,3500,.16,'highpass'); melody([523,587,659,698,784,880,988,1047], .14, .2); break;
    }
  } catch {
    // Animationerna fortsätter även om webbläsaren inte kan spela ljud.
  }
}

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundToggle.textContent = soundEnabled ? '🔊 Ljud på' : '🔇 Ljud av';
  if (!soundEnabled) {
    if (masterVolume) {
      masterVolume.gain.cancelScheduledValues(audioContext.currentTime);
      masterVolume.gain.setValueAtTime(0, audioContext.currentTime);
    }
    activeSoundSources.forEach(source => source.stop());
    activeSoundSources.clear();
  } else {
    const ctx = getAudioContext();
    if (ctx && masterVolume) masterVolume.gain.setValueAtTime(.14, ctx.currentTime);
  }
});
