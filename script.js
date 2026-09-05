// Where the board should "hinge" from when zooming into each quadrant,
// so that quadrant fills the whole screen after scaling up.
const liftPercent = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue('--bottom-row-lift')
) || 0;
const bottomRowTop = 50 - liftPercent;
const bottomRowOriginY = 2 * bottomRowTop;

const ORIGIN = {
  1: '0% 0%',
  2: '100% 0%',
  3: `100% ${bottomRowOriginY}%`,
  4: `0% ${bottomRowOriginY}%`,
};

const ARROW_DESTINATION = {
  '1-left':  'whole',
  '1-right': 2,
  '2-left':  1,
  '2-right': 3,
  '3-left':  4,
  '3-right': 2,
  '4-left':  'whole',
  '4-right': 3,
};

const board = document.getElementById('board');
let currentQuad = 1; // site opens already zoomed into quad 1

function zoomTo(quadNumber) {
  currentQuad = quadNumber;
  board.style.transformOrigin = ORIGIN[quadNumber];
  board.style.transform = 'scale(2)';
}

function zoomOut() {
  currentQuad = null;
  board.style.transform = 'scale(1)';
}

function goToDestination(ownQuad, destination) {
  if (destination === 'whole') {
    if (currentQuad === null) {
      zoomTo(ownQuad);
    } else {
      zoomOut();
    }
    return;
  }
  zoomTo(destination);
}

document.querySelectorAll('.arrow-hit').forEach(hit => {
  const quadNumber = parseInt(hit.closest('.quad').dataset.quad, 10);
  const side = hit.dataset.side;
  const key = `${quadNumber}-${side}`;
  const destination = ARROW_DESTINATION[key];

  hit.addEventListener('click', () => {
    goToDestination(quadNumber, destination);
  });
});

// Slide 1 photo: tap once to swing, tap again to fall away.
const photoUnit = document.getElementById('slide1PhotoUnit');
let photoState = 0; // 0 = resting, 1 = swung, 2 = fallen
photoUnit.addEventListener('click', () => {
  if (photoState === 0) {
    photoState = 1;
    photoUnit.classList.add('is-swinging');
    photoUnit.addEventListener('animationend', () => {
      photoUnit.classList.remove('is-swinging');
    }, { once: true });
  } else if (photoState === 1) {
    photoState = 2;
    photoUnit.classList.add('has-fallen');
  }
});

// Quad 2 pink stickies: front peels first, tap again to smooth back
// down; same for the back one once it's reachable.
document.getElementById('slide2PinkFront').addEventListener('click', function () {
  this.classList.toggle('is-peeled');
});
document.getElementById('slide2PinkBack').addEventListener('click', function () {
  this.classList.toggle('is-peeled');
});

// Initial load: apply the zoomed-in state for quad 1 directly, with
// no transition, so there's no flash of whole-view on first paint.
board.style.transition = 'none';
board.style.transformOrigin = ORIGIN[1];
board.style.transform = 'scale(2)';
board.offsetHeight; // reflow
board.style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
