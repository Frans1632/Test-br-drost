// JavaScript gör sidan interaktiv. Vi hittar först elementen i HTML-filen.
const lever = document.querySelector('#lever');
const toastScene = document.querySelector('#toast-scene');
const toastStatus = document.querySelector('#toast-status');
const launchButton = document.querySelector('#launch');
const rocketScene = document.querySelector('#rocket-scene');
const rocketStatus = document.querySelector('#rocket-status');
const countdown = document.querySelector('#countdown');

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
  toasting = false;
  toastStatus.textContent = 'En gång till?';
}

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
  icecream: { message: 'Ett körsbär på toppen. Mums!', emoji: '🍦' },
  wishing: { message: 'En snurr för din hemliga önskan!', emoji: '⭐' },
  frog: { message: 'Kvack! Ett jätteskutt och ett litet.', emoji: '🐸' }
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
      await wait(1800);
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
launchButton.addEventListener('click', async () => {
  if (launchButton.disabled) return;
  launchButton.disabled = true;
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
  launchButton.textContent = 'Flyg igen!';
  rocketStatus.textContent = 'Tillbaka för ett nytt äventyr.';
});
