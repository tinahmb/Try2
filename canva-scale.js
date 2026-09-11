/*
  canvas-scale.js
  --------------------------------------------------------
  Makes a fixed-size design canvas scale uniformly to fit
  the viewport, instead of reflowing content. Works for two
  modes, set via data-fit on the .canvas element:

    data-fit="width"   -> scale = viewportWidth / designWidth
                           (canvas may be taller/shorter than
                           the screen; page scrolls vertically)

    data-fit="contain" -> scale = min(vw/designW, vh/designH)
                           (whole canvas always visible,
                           letterboxed, no scroll)

  Design size comes from data-width / data-height attributes
  on the .canvas element itself, so every page can declare
  its own native pixel size without touching this file.
--------------------------------------------------------- */
(function () {
  function initCanvas(canvas) {
    const designWidth = parseFloat(canvas.dataset.width, 10);
    const designHeight = parseFloat(canvas.dataset.height, 10);
    const fitMode = canvas.dataset.fit || 'width';

    // Spacer reserves the correct on-screen footprint so
    // normal document scrolling / layout stays correct.
    let spacer = canvas.parentElement;
    if (!spacer.classList.contains('canvas-spacer')) {
      spacer = document.createElement('div');
      spacer.className = 'canvas-spacer';
      canvas.parentNode.insertBefore(spacer, canvas);
      spacer.appendChild(canvas);
    }

    canvas.style.width = designWidth + 'px';
    canvas.style.height = designHeight + 'px';
    canvas.style.transformOrigin = 'top left';
    canvas.style.position = 'relative';

    function applyScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let scale;

      if (fitMode === 'contain') {
        scale = Math.min(vw / designWidth, vh / designHeight);
      } else {
        scale = vw / designWidth;
      }

      canvas.style.transform = `scale(${scale})`;

      const scaledW = designWidth * scale;
      const scaledH = designHeight * scale;

      spacer.style.width = scaledW + 'px';
      spacer.style.height = scaledH + 'px';
      spacer.style.margin = fitMode === 'contain' ? 'auto' : '0 auto';
      spacer.style.overflow = 'hidden';

      if (fitMode === 'contain') {
        spacer.style.position = 'fixed';
        spacer.style.top = '50%';
        spacer.style.left = '50%';
        spacer.style.transform = 'translate(-50%, -50%)';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } else {
        spacer.style.display = 'block';
      }
    }

    applyScale();
    window.addEventListener('resize', applyScale);
    window.addEventListener('orientationchange', applyScale);
  }

  document.querySelectorAll('.canvas').forEach(initCanvas);
})();
