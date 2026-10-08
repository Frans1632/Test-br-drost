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
  fillBackground('toast', toasterButton);
  lever.disabled = true;
  breadButton.disabled = true;
  toasterButton.disabled = true;
  lever.style.top = '62px';
  toastScene.classList.add('toasting');
  toastStatus.textContent = 'Rostar… håll i hatten!';
  await wait(900);
  toastScene.classList.remove('toasting');
  toastScene.classList.add('popping');
  lever.style.top = '0px';
  toastStatus.textContent = 'Hopp! Frukosten flyger!';
  await wait(1400);
  toastScene.classList.remove('popping');
  lever.disabled = false;
  breadButton.disabled = false;
  toasterButton.disabled = false;
  toasting = false;
  toastStatus.textContent = 'En gång till?';
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
  balloon: { message: 'Hej då, ballongen! Oj, den kom tillbaka.', emoji: '🎈' },
  flower: { message: 'Plask! Nu växer det så det knakar.', emoji: '🌷' },
  egg: { message: 'Pip pip! En liten kyckling!', emoji: '🥚', surprise: '🐣' },
  gift: { message: 'Tittut! En nalle till dig!', emoji: '🎁', surprise: '🧸' },
  drum: { message: 'Bum, ba, bum! Vilken trumvirvel!', emoji: '🥁' },
  icecream: { message: 'Strösselregn! Alla färger på toppen!', emoji: '🍦' },
  wishing: { message: 'En snurr för din hemliga önskan!', emoji: '⭐' },
  frog: { message: 'Kvack! Jaga flugan, skutta, snurra… PLASK!', emoji: '🐸', duration: 3200 },
  robot: { message: 'Beep boop! Robotarna kommer fram — dags för disco!', emoji: '🤖', duration: 3600 },
  duck: { message: 'Kvack kvack! Plask i badet!', emoji: '🦆' },
  butterfly: { message: 'Fladder, fladder! En flygtur bland färgerna.', emoji: '🦋' },
  car: { message: 'Tut tut! Ut ur kortet, runt skärmen och hem igen!', emoji: '🚗', duration: 4400, roam: true },
  bee: { message: 'Bzzzz! Där är min favoritblomma!', emoji: '🐝' },
  dinosaur: { message: 'Duns! Duns! Ett litet dinosaurievrål!', emoji: '🦖' },
  unicorn: { message: 'Flyg, lilla enhörning! En magisk tur runt skärmen!', emoji: '🦄', duration: 4400, roam: true },
  snowman: { message: 'Snurr och snö! Vilket vinterkalas!', emoji: '⛄' },
  football: { message: 'Boing, boing, boing!', emoji: '⚽' },
  rainbow: { message: 'Regn, sol och alla regnbågens färger!', emoji: '🌈' }
};

document.querySelectorAll('[data-toy]').forEach(button => {
  button.addEventListener('click', async () => {
    if (button.disabled) return;
    const name = button.dataset.toy;
    const settings = toySettings[name];
    const scene = document.querySelector(`[data-scene="${name}"]`);
    const status = document.querySelector(`[data-status="${name}"]`);
    const object = scene.querySelector('.object');
    button.disabled = true;
    fillBackground(name, button);
    if (settings.roam && !reducedMotion.matches) roamScreen(name, button, scene, settings.duration);
    scene.classList.add('active');
    status.textContent = settings.message;
    if (settings.surprise) {
      await wait(650);
      object.textContent = settings.surprise;
      await wait(1150);
    } else {
      await wait(settings.duration || 1800);
    }
    scene.classList.remove('active');
    object.textContent = settings.emoji;
    button.disabled = false;
    status.textContent = 'En gång till?';
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
  rocketStatus.textContent = 'Woosh! Mot stjärnorna!';
  launchButton.textContent = 'På rymdäventyr…';
  await wait(1800);
  rocketScene.classList.remove('flying');
  launchButton.disabled = false;
  rocketButton.disabled = false;
  launchButton.textContent = rocketButtonLabel;
  rocketStatus.textContent = 'Tillbaka för ett nytt äventyr.';
}
launchButton.addEventListener('click', launchRocket);
rocketButton.addEventListener('click', launchRocket);

// Dekorationen fångar aldrig klick. Antalet partiklar är begränsat,
// så många snabba klick inte skapar fler och fler element.
const dustLayer = document.querySelector('#stardust');
const launchEffects = document.querySelector('#launch-effects');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
for (let i = 0; i < 90; i++) {
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
document.addEventListener('click', () => {
  clearTimeout(dustTimer);
  dustLayer.classList.remove('shimmering');
  void dustLayer.offsetWidth; // Starta om animationen vid nästa klick.
  dustLayer.classList.add('shimmering');
  dustTimer = setTimeout(() => dustLayer.classList.remove('shimmering'), reducedMotion.matches ? 700 : 2400);
});
function showLaunchEffects() {
  clearTimeout(fireTimer);
  launchEffects.classList.add('burning');
  fireTimer = setTimeout(() => launchEffects.classList.remove('burning'), 5200);
}

// Ett klick på kortets tomma yta använder samma knapp som figuren.
// Klick på en riktig knapp hanteras bara av knappen själv.
document.querySelectorAll('.toy').forEach(card => {
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
  for (let i = 0; i < 48; i++) {
    const particle = document.createElement('span');
    const symbols = backgroundThemes[name];
    const symbol = symbols[i % symbols.length];
    const targetX = (i % 8 + .2 + Math.random() * .6) / 8 * window.innerWidth;
    const targetY = (Math.floor(i / 8) + .2 + Math.random() * .6) / 6 * window.innerHeight;
    const duration = name === 'robot' ? 4200 : 4600;
    particle.className = symbol === 'sprinkle' ? 'theme-particle sprinkle-particle' : 'theme-particle';
    particle.textContent = symbol === 'sprinkle' ? '' : symbol;
    particle.style.cssText = `left:${targetX}px;top:${targetY}px;--from-x:${originX-targetX}px;--from-y:${originY-targetY}px;--drift-x:${(Math.random()-.5)*150}px;--drift-y:${(Math.random()-.5)*150}px;--delay:${i*.008}s;--duration:${duration}ms;--particle-size:${24+Math.random()*30}px;--particle-color:${palette[i%palette.length]};--tilt:${(i%2?1:-1)*(15+i%4*10)}deg`;
    themeBackground.append(particle);
  }
  backgroundTimer = setTimeout(() => {
    themeBackground.replaceChildren();
    butterScreen.classList.remove('spread');
  }, reducedMotion.matches ? 1400 : 5200);
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
  actor.textContent = toySettings[name].emoji;
  actor.style.cssText = `left:${startX}px;top:${startY}px;--actor-size:${size}px;--duration:${duration}ms;--left-x:${16-startX}px;--right-x:${right-startX}px;--top-y:${16-startY}px;--bottom-y:${bottom-startY}px;--middle-y:${window.innerHeight*.45-startY}px`;
  screenActors.append(actor);
  scene.classList.add('roaming');
  setTimeout(() => {
    actor.remove();
    scene.classList.remove('roaming');
  }, duration);
}
