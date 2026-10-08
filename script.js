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

// Alla åtta nya leksaker använder samma funktion, med olika rörelser i CSS.
const toySettings = {
  balloon: { message: 'Hej då, ballongen! Oj, den kom tillbaka.', emoji: '🎈' },
  flower: { message: 'Plask! Nu växer det så det knakar.', emoji: '🌷' },
  egg: { message: 'Pip pip! En liten kyckling!', emoji: '🥚', surprise: '🐣' },
  gift: { message: 'Tittut! En nalle till dig!', emoji: '🎁', surprise: '🧸' },
  drum: { message: 'Bum, ba, bum! Vilken trumvirvel!', emoji: '🥁' },
  icecream: { message: 'Strösselregn! Alla färger på toppen!', emoji: '🍦' },
  wishing: { message: 'En snurr för din hemliga önskan!', emoji: '⭐' },
  frog: { message: 'Kvack! Jaga flugan, skutta, snurra… PLASK!', emoji: '🐸', duration: 3200 },
  robot: { message: 'Beep boop! Robotdisco!', emoji: '🤖' },
  duck: { message: 'Kvack kvack! Plask i badet!', emoji: '🦆' },
  butterfly: { message: 'Fladder, fladder! En flygtur bland färgerna.', emoji: '🦋' },
  car: { message: 'Tut tut! Full fart och tillbaka!', emoji: '🚗' },
  bee: { message: 'Bzzzz! Där är min favoritblomma!', emoji: '🐝' },
  dinosaur: { message: 'Duns! Duns! Ett litet dinosaurievrål!', emoji: '🦖' },
  unicorn: { message: 'Poff! En hel regnbåge av magi!', emoji: '🦄' },
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
