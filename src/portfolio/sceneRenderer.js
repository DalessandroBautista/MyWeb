/**
 * sceneRenderer.js
 * High-craft Canvas 2D scene renderer for the insular portfolio.
 * 
 * Aesthetic direction: Rocket Power / Vice City coastal sunset.
 * Palette: Coral, lavender, violet, teal, amber sunset with deep ocean tones.
 * Logical viewport: 1280x720.
 *
 * Export: named `renderScene(ctx, state)`
 */

// --- Math Helpers ---
// Strictly zero per-frame Math.random() for deterministic 60fps rendering without jitter or GC pressure.
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// --- Visual Color Palette (Rocket Power / Vice City Sunset) ---
const PALETTE = {
  skyTop: '#191136',
  skyUpper: '#32194d',
  skyMid: '#68255b',
  skyCoral: '#c94462',
  skyAmber: '#f97658',
  skyHorizon: '#ffba6b',
  skyGlow: '#ffe094',

  sunCore: '#fff7d9',
  sunInner: '#ffd67a',
  sunOuter: '#ff8452',
  sunCorona: 'rgba(255, 140, 80, 0.22)',

  cloudDark: 'rgba(54, 28, 70, 0.55)',
  cloudMid: 'rgba(128, 45, 88, 0.60)',
  cloudLight: 'rgba(225, 102, 110, 0.70)',
  cloudHighlight: 'rgba(255, 210, 150, 0.85)',

  distantHills: '#251b47',
  distantHillsFront: '#1b2d4b',

  oceanDeep: '#062338',
  oceanMid: '#0a3d4f',
  oceanSurface: '#105a6b',
  oceanTeal: '#1c7d8a',
  oceanShine: '#32adb0',
  sunRibbon: 'rgba(255, 185, 110, 0.45)',
  sunRibbonBright: 'rgba(255, 240, 190, 0.75)',

  sandBase: '#bd8058',
  sandMid: '#dfa26d',
  sandHighlight: '#f7cf8e',
  rockDark: '#231d36',
  rockMid: '#3c3052',
  rockHighlight: '#5d4b7a',
  rockRim: '#926a88',

  vegetationDark: '#123d37',
  vegetationMid: '#1a6152',
  vegetationBright: '#2fa37f',
  vegetationLime: '#64cc92',

  woodDark: '#3a201c',
  woodMid: '#693e32',
  woodLight: '#945d47',
  woodRope: '#d8ab76',

  coralAccent: '#ff4b6e',
  coralDeep: '#cc224b',
  neonTeal: '#00f5d4',
  neonCyan: '#2ee6c8',
  pureWhite: '#fdfbfa',
  hullOffWhite: '#f2f4f8',
  darkMetal: '#141a29',
  racingTurquoise: '#18c8b4'
};

// --- Layer 1: Sky & Solar Horizon ---
function drawSkyAndSun(ctx, time, cameraX) {
  // Sunset linear gradient - extended to prevent empty borders on taller/wider views
  const skyGrad = ctx.createLinearGradient(0, -300, 0, 490);
  skyGrad.addColorStop(0.0, PALETTE.skyTop);
  skyGrad.addColorStop(0.22, PALETTE.skyUpper);
  skyGrad.addColorStop(0.48, PALETTE.skyMid);
  skyGrad.addColorStop(0.70, PALETTE.skyCoral);
  skyGrad.addColorStop(0.88, PALETTE.skyAmber);
  skyGrad.addColorStop(0.97, PALETTE.skyHorizon);
  skyGrad.addColorStop(1.0, PALETTE.skyGlow);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(-1000, -600, 3280, 1100);

  // Sun Position: gently low on the horizon, softly offset by subtle camera parallax
  const sunX = 640 - cameraX * 0.025;
  const sunY = 270;
  const sunRadius = 68;

  // Outer coronal flare
  const coronaGrad = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 3.2);
  coronaGrad.addColorStop(0.0, 'rgba(255, 230, 150, 0.5)');
  coronaGrad.addColorStop(0.35, 'rgba(255, 120, 90, 0.28)');
  coronaGrad.addColorStop(0.75, 'rgba(150, 40, 90, 0.10)');
  coronaGrad.addColorStop(1.0, 'rgba(30, 10, 40, 0)');
  ctx.fillStyle = coronaGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 3.2, 0, Math.PI * 2);
  ctx.fill();

  // Sun disc with crisp Vice City retro glow
  const sunGrad = ctx.createLinearGradient(sunX, sunY - sunRadius, sunX, sunY + sunRadius);
  sunGrad.addColorStop(0.0, PALETTE.sunCore);
  sunGrad.addColorStop(0.4, PALETTE.sunInner);
  sunGrad.addColorStop(1.0, PALETTE.sunOuter);
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // Subtle atmospheric heat horizontal slits through lower half of sun
  ctx.fillStyle = 'rgba(104, 37, 91, 0.75)';
  for (let s = 1; s <= 5; s++) {
    const slitY = sunY + 14 + s * 9;
    const slitHeight = 1.8 + s * 0.7;
    const chordHalfWidth = Math.sqrt(Math.max(0, sunRadius * sunRadius - Math.pow(slitY - sunY, 2)));
    if (chordHalfWidth > 6) {
      ctx.fillRect(sunX - chordHalfWidth, slitY, chordHalfWidth * 2, slitHeight);
    }
  }
}

// --- Layer 2: Organic Parallax Clouds ---
function drawClouds(ctx, time, cameraX, reducedMotion) {
  const cloudSpeed = reducedMotion ? 0 : time * 4.0;
  
  // Three tiered cloud decks for rich depth
  const cloudDecks = [
    { y: 85, scale: 0.9, speedMult: 0.04, count: 5, fill: PALETTE.cloudDark, rim: PALETTE.cloudMid },
    { y: 155, scale: 1.15, speedMult: 0.08, count: 6, fill: PALETTE.cloudMid, rim: PALETTE.cloudLight },
    { y: 220, scale: 1.35, speedMult: 0.14, count: 5, fill: PALETTE.cloudLight, rim: PALETTE.cloudHighlight }
  ];

  ctx.save();
  for (let d = 0; d < cloudDecks.length; d++) {
    const deck = cloudDecks[d];
    const offsetX = (cameraX * deck.speedMult + cloudSpeed * (0.8 + d * 0.4)) % 1600;

    for (let c = -1; c < deck.count + 2; c++) {
      const baseX = c * 380 - offsetX;
      const baseY = deck.y + Math.sin(c * 2.3) * 18;
      const w = 240 * deck.scale;

      ctx.save();
      ctx.translate(baseX, baseY);

      // Cloud body - multiple overlapping rounded lobes
      ctx.fillStyle = deck.fill;
      ctx.beginPath();
      ctx.arc(-w * 0.35, 0, 32 * deck.scale, 0, Math.PI * 2);
      ctx.arc(-w * 0.12, -18 * deck.scale, 42 * deck.scale, 0, Math.PI * 2);
      ctx.arc(w * 0.18, -12 * deck.scale, 36 * deck.scale, 0, Math.PI * 2);
      ctx.arc(w * 0.40, 4 * deck.scale, 26 * deck.scale, 0, Math.PI * 2);
      ctx.fill();

      // Cloud flat base
      ctx.beginPath();
      ctx.ellipse(0, 10 * deck.scale, w * 0.48, 14 * deck.scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Top sunset highlight fringe
      ctx.fillStyle = deck.rim;
      ctx.beginPath();
      ctx.arc(-w * 0.12, -20 * deck.scale, 38 * deck.scale, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(w * 0.18, -14 * deck.scale, 32 * deck.scale, Math.PI * 1.1, Math.PI * 1.9);
      ctx.fill();

      ctx.restore();
    }
  }
  ctx.restore();
}

// --- Layer 3: Distant Horizon Island Silhouettes ---
function drawDistantArchipelago(ctx, cameraX) {
  // Far distant mountain/island silhouette layer (parallax 0.08)
  const farOffset = (cameraX * 0.08) % 1800;
  ctx.fillStyle = PALETTE.distantHills;
  ctx.beginPath();
  ctx.moveTo(-600, 380);
  for (let x = -600; x <= 1880; x += 40) {
    const worldX = x + farOffset;
    const h = Math.sin(worldX * 0.0035) * 28 + Math.cos(worldX * 0.009) * 14 + 355;
    ctx.lineTo(x, h);
  }
  ctx.lineTo(1880, 440);
  ctx.lineTo(-600, 440);
  ctx.closePath();
  ctx.fill();

  // Mid-distant island silhouettes (parallax 0.18)
  const midOffset = (cameraX * 0.18) % 2400;
  ctx.fillStyle = PALETTE.distantHillsFront;
  ctx.beginPath();
  ctx.moveTo(-600, 395);
  for (let x = -600; x <= 1880; x += 32) {
    const worldX = x + midOffset;
    const h = Math.sin(worldX * 0.005) * 22 + Math.sin(worldX * 0.012 + 1.2) * 10 + 372;
    ctx.lineTo(x, h);
  }
  ctx.lineTo(1880, 450);
  ctx.lineTo(-600, 450);
  ctx.closePath();
  ctx.fill();
}

// --- Layer 4: Layered Sunset Ocean with Wave Highlights & Solar Ribbon ---
function drawOcean(ctx, time, cameraX, reducedMotion) {
  const horizonY = 385;
  const oceanH = 1000;

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, horizonY, 0, 950);
  oceanGrad.addColorStop(0.0, PALETTE.oceanMid);
  oceanGrad.addColorStop(0.18, PALETTE.oceanSurface);
  oceanGrad.addColorStop(0.55, PALETTE.oceanDeep);
  oceanGrad.addColorStop(1.0, '#041624');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(-1000, horizonY, 3280, oceanH);

  // Vertical Sun Reflection Column / Solar Ribbon
  const sunX = 640 - cameraX * 0.025;
  const ribbonGrad = ctx.createLinearGradient(sunX - 110, 0, sunX + 110, 0);
  ribbonGrad.addColorStop(0.0, 'rgba(255, 140, 80, 0)');
  ribbonGrad.addColorStop(0.3, 'rgba(255, 175, 100, 0.25)');
  ribbonGrad.addColorStop(0.5, 'rgba(255, 230, 160, 0.55)');
  ribbonGrad.addColorStop(0.7, 'rgba(255, 175, 100, 0.25)');
  ribbonGrad.addColorStop(1.0, 'rgba(255, 140, 80, 0)');

  ctx.save();
  ctx.fillStyle = ribbonGrad;
  ctx.beginPath();
  ctx.moveTo(sunX - 35, horizonY);
  ctx.lineTo(sunX + 35, horizonY);
  ctx.lineTo(sunX + 180, 1000);
  ctx.lineTo(sunX - 180, 1000);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Tiered organic waves with deterministic sinusoidal motion
  const waveLayers = 9;
  const waveTime = reducedMotion ? 0 : time * 1.6;

  for (let l = 0; l < waveLayers; l++) {
    const norm = l / (waveLayers - 1);
    const layerY = horizonY + 12 + Math.pow(norm, 1.45) * (700 - horizonY);
    const waveAmp = 2.2 + norm * 4.2;
    const waveFreq = 0.014 - norm * 0.006;
    const waveSpeed = (1.2 + norm * 1.8) * (l % 2 === 0 ? 1 : -0.85);

    ctx.save();
    ctx.lineWidth = 1.6 + norm * 2.2;

    // Solar ribbon specular highlight inside sun column
    for (let seg = 0; seg < 18; seg++) {
      const segRatio = (seg / 17);
      const spanCenter = sunX + (segRatio - 0.5) * (80 + norm * 160);
      const segWidth = 22 + norm * 45;
      const glitterOffset = Math.sin(waveTime * 3.0 + seg * 1.7 + l) * 8;

      ctx.strokeStyle = seg % 2 === 0 ? PALETTE.sunRibbonBright : PALETTE.sunRibbon;
      ctx.beginPath();
      ctx.moveTo(spanCenter - segWidth * 0.5 + glitterOffset, layerY);
      ctx.quadraticCurveTo(
        spanCenter + glitterOffset,
        layerY - waveAmp * 0.9,
        spanCenter + segWidth * 0.5 + glitterOffset,
        layerY
      );
      ctx.stroke();
    }

    // Wide atmospheric ocean swell lines
    const swellStep = 55 + Math.floor(norm * 45);
    ctx.strokeStyle = l % 3 === 0 ? PALETTE.oceanTeal : PALETTE.oceanShine;
    ctx.globalAlpha = 0.45 + norm * 0.35;

    for (let wx = -600; wx < 1880; wx += swellStep) {
      const curX = wx + (Math.sin(l * 4.7) * 40);
      const phase = curX * waveFreq + waveTime * waveSpeed + l * 1.4;
      const yWave = layerY + Math.sin(phase) * waveAmp;

      ctx.beginPath();
      ctx.moveTo(curX, yWave);
      ctx.quadraticCurveTo(curX + swellStep * 0.5, yWave - waveAmp * 1.2, curX + swellStep, yWave);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// --- Layer 5: Elaborate Palm Trees ---
function drawPalmTree(ctx, x, y, scale, angle, flip) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.rotate(angle);

  // Curved segmented trunk
  const trunkHeight = 110 * scale;
  const bend = 34 * scale;

  // Trunk gradient (shadow to warm amber sunset edge)
  ctx.strokeStyle = PALETTE.woodMid;
  ctx.lineWidth = 9 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(bend * 0.4, -trunkHeight * 0.5, bend, -trunkHeight);
  ctx.stroke();

  // Bark rings
  ctx.strokeStyle = PALETTE.woodDark;
  ctx.lineWidth = 10 * scale;
  for (let r = 0.15; r < 0.95; r += 0.11) {
    const rx = bend * 0.4 * (2 * (1 - r) * r) + bend * r * r;
    const ry = -trunkHeight * (2 * (1 - r) * r * 0.5 + r * r);
    ctx.beginPath();
    ctx.arc(rx, ry, 5 * scale, 0, Math.PI * 0.8);
    ctx.stroke();
  }

  // Trunk highlight from sunset
  ctx.strokeStyle = PALETTE.sandHighlight;
  ctx.lineWidth = 2.2 * scale;
  ctx.beginPath();
  ctx.moveTo(2 * scale, 0);
  ctx.quadraticCurveTo(bend * 0.4 + 2 * scale, -trunkHeight * 0.5, bend + 2 * scale, -trunkHeight);
  ctx.stroke();

  // Coconuts cluster
  const crownX = bend;
  const crownY = -trunkHeight;
  ctx.fillStyle = '#422214';
  ctx.beginPath();
  ctx.arc(crownX - 4 * scale, crownY + 2 * scale, 4.5 * scale, 0, Math.PI * 2);
  ctx.arc(crownX + 4 * scale, crownY + 3 * scale, 4.5 * scale, 0, Math.PI * 2);
  ctx.arc(crownX, crownY + 7 * scale, 4.2 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Majestic palm fronds with cascading leaves
  const frondCount = 7;
  const frondColors = [
    PALETTE.vegetationDark,
    PALETTE.vegetationMid,
    PALETTE.vegetationBright,
    PALETTE.vegetationLime
  ];

  for (let f = 0; f < frondCount; f++) {
    const frondAngle = -Math.PI * 0.85 + (f / (frondCount - 1)) * Math.PI * 1.7;
    const frondLen = (62 + (f % 3) * 14) * scale;
    const frondDroop = (38 + (f % 2) * 16) * scale;

    ctx.save();
    ctx.translate(crownX, crownY);
    ctx.rotate(frondAngle);

    // Main spine
    ctx.strokeStyle = frondColors[f % frondColors.length];
    ctx.lineWidth = 3.5 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(frondLen * 0.5, -12 * scale, frondLen, frondDroop);
    ctx.stroke();

    // Leaf leaflets along the spine
    ctx.fillStyle = frondColors[(f + 1) % frondColors.length];
    for (let l = 10; l < frondLen - 5; l += 8 * scale) {
      const progress = l / frondLen;
      const lx = l;
      const ly = -12 * scale * (4 * progress * (1 - progress)) + frondDroop * progress * progress;
      const leafLen = (18 * (1 - progress * 0.4)) * scale;

      // Top leaflet
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.quadraticCurveTo(lx + 4 * scale, ly - leafLen * 0.7, lx + 7 * scale, ly - leafLen);
      ctx.lineTo(lx + 6 * scale, ly);
      ctx.closePath();
      ctx.fill();

      // Bottom leaflet
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.quadraticCurveTo(lx + 3 * scale, ly + leafLen * 0.7, lx + 6 * scale, ly + leafLen);
      ctx.lineTo(lx + 5 * scale, ly);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();
}

// --- Layer 6: Island Base (Organic Terrain, Sand, Rocks & Vegetation) ---
function drawIslandBase(ctx, islandX, islandY) {
  ctx.save();
  ctx.translate(islandX, islandY);

  // Underwater coral / sand glow reflection
  ctx.fillStyle = 'rgba(28, 125, 138, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 68, 260, 48, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wet shoreline sand band
  ctx.fillStyle = PALETTE.sandBase;
  ctx.beginPath();
  ctx.ellipse(0, 52, 240, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Golden warm sunset beach
  ctx.fillStyle = PALETTE.sandMid;
  ctx.beginPath();
  ctx.ellipse(0, 38, 222, 38, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sun-kissed beach ridge
  ctx.fillStyle = PALETTE.sandHighlight;
  ctx.beginPath();
  ctx.ellipse(-6, 26, 198, 30, -0.015, 0, Math.PI * 2);
  ctx.fill();

  // Rocky bluff outcrops (stratified sedimentary rock)
  ctx.fillStyle = PALETTE.rockDark;
  ctx.beginPath();
  ctx.moveTo(-165, 20);
  ctx.quadraticCurveTo(-140, -42, -95, -55);
  ctx.quadraticCurveTo(-35, -45, 0, -58);
  ctx.quadraticCurveTo(55, -48, 115, -46);
  ctx.quadraticCurveTo(155, -30, 168, 20);
  ctx.quadraticCurveTo(120, 24, 0, 26);
  ctx.quadraticCurveTo(-110, 24, -165, 20);
  ctx.closePath();
  ctx.fill();

  // Rock facets & warm highlights
  ctx.fillStyle = PALETTE.rockMid;
  ctx.beginPath();
  ctx.moveTo(-135, 12);
  ctx.lineTo(-105, -38);
  ctx.lineTo(-45, -35);
  ctx.lineTo(-75, 16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = PALETTE.rockHighlight;
  ctx.beginPath();
  ctx.moveTo(-45, -35);
  ctx.lineTo(25, -46);
  ctx.lineTo(45, 12);
  ctx.lineTo(-35, 16);
  ctx.closePath();
  ctx.fill();

  // Rock top rims catching warm sunset orange light
  ctx.strokeStyle = PALETTE.rockRim;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-145, 5);
  ctx.quadraticCurveTo(-100, -48, -40, -40);
  ctx.quadraticCurveTo(20, -52, 110, -42);
  ctx.stroke();

  // Lush tropical vegetation mounds
  ctx.fillStyle = PALETTE.vegetationDark;
  ctx.beginPath();
  ctx.ellipse(-85, -28, 72, 26, -0.05, 0, Math.PI * 2);
  ctx.ellipse(35, -28, 88, 30, 0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PALETTE.vegetationMid;
  ctx.beginPath();
  ctx.ellipse(-75, -36, 62, 22, -0.05, 0, Math.PI * 2);
  ctx.ellipse(45, -36, 74, 25, 0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PALETTE.vegetationBright;
  ctx.beginPath();
  ctx.ellipse(-65, -44, 48, 17, -0.05, 0, Math.PI * 2);
  ctx.ellipse(55, -44, 56, 18, 0.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// --- Layer 7: Island Pier / Dock (Aligned with Boat at x=640, y=535) ---
function drawPier(ctx, islandX, islandY, time, reducedMotion) {
  ctx.save();
  ctx.translate(islandX, islandY);

  // The boat rest position is at world boatX = 640, boatY = 535.
  // Island center is at y = 420.
  // Relative to island (0, 0), the boat sits at (0, 115).
  // The pier extends forward from the shore (y ≈ 35) to y ≈ 100 right next to the boat!

  const pierX = -32;
  const pierWidth = 64;
  const pierStartY = 28;
  const pierEndY = 96;

  // Underwater timber pilings (dark stained posts with moss/barnacle bases)
  const pilings = [
    { x: pierX + 8, y: pierEndY - 2 },
    { x: pierX + pierWidth - 8, y: pierEndY - 2 },
    { x: pierX + 8, y: (pierStartY + pierEndY) * 0.5 },
    { x: pierX + pierWidth - 8, y: (pierStartY + pierEndY) * 0.5 },
    { x: pierX + 8, y: pierStartY + 6 },
    { x: pierX + pierWidth - 8, y: pierStartY + 6 }
  ];

  for (let p = 0; p < pilings.length; p++) {
    const post = pilings[p];
    // Shadow reflection into water
    ctx.fillStyle = 'rgba(6, 28, 42, 0.55)';
    ctx.fillRect(post.x - 3, post.y + 12, 8, 22);

    // Wood post
    ctx.fillStyle = PALETTE.woodDark;
    ctx.fillRect(post.x - 3, post.y, 7, 24);

    // Post cap highlight
    ctx.fillStyle = PALETTE.woodLight;
    ctx.fillRect(post.x - 3, post.y, 7, 3);
  }

  // Pier deck planks
  ctx.fillStyle = PALETTE.woodMid;
  ctx.fillRect(pierX, pierStartY, pierWidth, pierEndY - pierStartY);

  // Individual wood plank lines
  ctx.strokeStyle = PALETTE.woodDark;
  ctx.lineWidth = 1.6;
  for (let py = pierStartY + 6; py < pierEndY; py += 7) {
    ctx.beginPath();
    ctx.moveTo(pierX, py);
    ctx.lineTo(pierX + pierWidth, py);
    ctx.stroke();
  }

  // Pier edges / stringer beams
  ctx.fillStyle = PALETTE.woodLight;
  ctx.fillRect(pierX - 2, pierStartY, 3, pierEndY - pierStartY);
  ctx.fillRect(pierX + pierWidth - 1, pierStartY, 3, pierEndY - pierStartY);

  // Dock bollards / mooring cleats at pier head
  ctx.fillStyle = '#1a1f2e';
  ctx.fillRect(pierX + 4, pierEndY - 4, 7, 6);
  ctx.fillRect(pierX + pierWidth - 11, pierEndY - 4, 7, 6);

  // Mooring rope coil on dock
  ctx.strokeStyle = PALETTE.woodRope;
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.ellipse(pierX + 16, pierEndY - 8, 5, 3.5, 0.2, 0, Math.PI * 2);
  ctx.stroke();

  // Life preserver ring hanging on dock piling
  const buoyX = pierX + pierWidth + 4;
  const buoyY = pierEndY - 16;
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.beginPath();
  ctx.arc(buoyX, buoyY, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.pureWhite;
  ctx.beginPath();
  ctx.arc(buoyX, buoyY, 3.8, 0, Math.PI * 2);
  ctx.fill();
  // Quarter white stripes
  ctx.fillStyle = PALETTE.pureWhite;
  ctx.fillRect(buoyX - 8, buoyY - 1.5, 16, 3);
  ctx.fillRect(buoyX - 1.5, buoyY - 8, 3, 16);

  // Warm dock lantern on wooden post
  const lanternPostX = pierX - 6;
  const lanternPostY = pierEndY - 20;
  ctx.fillStyle = PALETTE.woodDark;
  ctx.fillRect(lanternPostX - 2, lanternPostY, 4, 22);

  // Glow
  const glowAlpha = reducedMotion ? 0.35 : 0.35 + Math.sin(time * 3.5) * 0.08;
  const lanternGlow = ctx.createRadialGradient(lanternPostX, lanternPostY, 1, lanternPostX, lanternPostY, 24);
  lanternGlow.addColorStop(0, `rgba(255, 210, 110, ${glowAlpha})`);
  lanternGlow.addColorStop(1, 'rgba(255, 150, 60, 0)');
  ctx.fillStyle = lanternGlow;
  ctx.beginPath();
  ctx.arc(lanternPostX, lanternPostY, 24, 0, Math.PI * 2);
  ctx.fill();

  // Lantern fixture
  ctx.fillStyle = '#ffcf68';
  ctx.fillRect(lanternPostX - 3, lanternPostY - 4, 6, 8);
  ctx.strokeStyle = '#221a14';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(lanternPostX - 3.5, lanternPostY - 4.5, 7, 9);

  ctx.restore();
}

// --- Specific Landmark 1: Home Island (Lighthouse & Coastal Cabin) ---
function drawLandmarkHome(ctx, islandX, islandY, time, reducedMotion) {
  ctx.save();
  ctx.translate(islandX, islandY);

  // --- Lighthouse (left bluff) ---
  const lhX = -92;
  const lhY = -48;
  const lhHeight = 118;
  const lhTopWidth = 19;
  const lhBottomWidth = 32;

  // Cast shadow
  ctx.fillStyle = 'rgba(18, 14, 34, 0.45)';
  ctx.beginPath();
  ctx.ellipse(lhX + 16, lhY + 4, 38, 10, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Tapered tower body
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(lhX - lhBottomWidth * 0.5, lhY);
  ctx.lineTo(lhX - lhTopWidth * 0.5, lhY - lhHeight);
  ctx.lineTo(lhX + lhTopWidth * 0.5, lhY - lhHeight);
  ctx.lineTo(lhX + lhBottomWidth * 0.5, lhY);
  ctx.closePath();
  ctx.clip();

  // Base white masonry
  ctx.fillStyle = PALETTE.pureWhite;
  ctx.fillRect(lhX - lhBottomWidth, lhY - lhHeight, lhBottomWidth * 2, lhHeight);

  // Red/coral spiral or horizontal bands
  ctx.fillStyle = PALETTE.coralAccent;
  const bandHeight = lhHeight / 5;
  ctx.fillRect(lhX - lhBottomWidth, lhY - bandHeight * 4, lhBottomWidth * 2, bandHeight);
  ctx.fillRect(lhX - lhBottomWidth, lhY - bandHeight * 2, lhBottomWidth * 2, bandHeight);

  // Tower shading gradient (3D cylinder volume)
  const lhGrad = ctx.createLinearGradient(lhX - lhBottomWidth * 0.5, 0, lhX + lhBottomWidth * 0.5, 0);
  lhGrad.addColorStop(0.0, 'rgba(30, 20, 50, 0.45)');
  lhGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
  lhGrad.addColorStop(1.0, 'rgba(255, 140, 90, 0.35)');
  ctx.fillStyle = lhGrad;
  ctx.fillRect(lhX - lhBottomWidth, lhY - lhHeight, lhBottomWidth * 2, lhHeight);
  ctx.restore();

  // Gallery walkway & railing
  const galleryY = lhY - lhHeight;
  ctx.fillStyle = '#221d2d';
  ctx.fillRect(lhX - 16, galleryY - 4, 32, 5);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(lhX - 15, galleryY - 11);
  ctx.lineTo(lhX + 15, galleryY - 11);
  for (let b = -14; b <= 14; b += 7) {
    ctx.moveTo(lhX + b, galleryY - 11);
    ctx.lineTo(lhX + b, galleryY - 4);
  }
  ctx.stroke();

  // Glass lantern room
  ctx.fillStyle = '#fffae0';
  ctx.fillRect(lhX - 10, galleryY - 24, 20, 14);
  ctx.fillStyle = '#3a3248';
  ctx.fillRect(lhX - 1.5, galleryY - 24, 3, 14);
  ctx.fillRect(lhX - 10, galleryY - 17, 20, 2);

  // Copper dome roof & weathervane
  ctx.fillStyle = PALETTE.vegetationDark;
  ctx.beginPath();
  ctx.arc(lhX, galleryY - 24, 11, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = '#e0c068';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lhX, galleryY - 35);
  ctx.lineTo(lhX, galleryY - 43);
  ctx.moveTo(lhX - 4, galleryY - 39);
  ctx.lineTo(lhX + 4, galleryY - 39);
  ctx.stroke();

  // Revolving atmospheric light beam
  if (!reducedMotion) {
    const beamAngle = time * 0.9;
    const beamCos = Math.cos(beamAngle);
    if (beamCos > -0.2) {
      ctx.save();
      const beamGrad = ctx.createRadialGradient(lhX, galleryY - 17, 4, lhX + beamCos * 260, galleryY - 17, 180);
      beamGrad.addColorStop(0, 'rgba(255, 250, 180, 0.7)');
      beamGrad.addColorStop(0.35, 'rgba(255, 220, 120, 0.25)');
      beamGrad.addColorStop(1, 'rgba(255, 180, 70, 0)');

      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(lhX, galleryY - 17);
      ctx.lineTo(lhX + beamCos * 380, galleryY - 45);
      ctx.lineTo(lhX + beamCos * 420, galleryY + 25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // --- Coastal Wood Cabin / Shack (right side) ---
  const cabinX = 52;
  const cabinY = -40;
  const cabinW = 68;
  const cabinH = 46;

  // Cabin walls (weathered teal wood siding)
  ctx.fillStyle = '#21545e';
  ctx.fillRect(cabinX - cabinW * 0.5, cabinY - cabinH, cabinW, cabinH);

  // Horizontal wood siding planks
  ctx.strokeStyle = '#153940';
  ctx.lineWidth = 1.4;
  for (let sy = cabinY - cabinH + 6; sy < cabinY; sy += 7) {
    ctx.beginPath();
    ctx.moveTo(cabinX - cabinW * 0.5, sy);
    ctx.lineTo(cabinX + cabinW * 0.5, sy);
    ctx.stroke();
  }

  // Gable pitched roof
  ctx.fillStyle = '#b0433e';
  ctx.beginPath();
  ctx.moveTo(cabinX - cabinW * 0.5 - 6, cabinY - cabinH);
  ctx.lineTo(cabinX, cabinY - cabinH - 22);
  ctx.lineTo(cabinX + cabinW * 0.5 + 6, cabinY - cabinH);
  ctx.closePath();
  ctx.fill();

  // Roof trim highlight
  ctx.strokeStyle = '#ffd89a';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(cabinX - cabinW * 0.5 - 8, cabinY - cabinH + 1);
  ctx.lineTo(cabinX, cabinY - cabinH - 23);
  ctx.lineTo(cabinX + cabinW * 0.5 + 8, cabinY - cabinH + 1);
  ctx.stroke();

  // Cozy glowing warm windows
  const winGlowAlpha = reducedMotion ? 0.75 : 0.75 + Math.sin(time * 2.2) * 0.1;
  ctx.fillStyle = `rgba(255, 218, 128, ${winGlowAlpha})`;
  ctx.fillRect(cabinX - 24, cabinY - 32, 16, 16);
  ctx.fillRect(cabinX + 8, cabinY - 32, 16, 16);

  // Window mullions
  ctx.strokeStyle = '#321f1d';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(cabinX - 24, cabinY - 32, 16, 16);
  ctx.strokeRect(cabinX + 8, cabinY - 32, 16, 16);
  ctx.beginPath();
  ctx.moveTo(cabinX - 16, cabinY - 32);
  ctx.lineTo(cabinX - 16, cabinY - 16);
  ctx.moveTo(cabinX - 24, cabinY - 24);
  ctx.lineTo(cabinX - 8, cabinY - 24);
  ctx.moveTo(cabinX + 16, cabinY - 32);
  ctx.lineTo(cabinX + 16, cabinY - 16);
  ctx.moveTo(cabinX + 8, cabinY - 24);
  ctx.lineTo(cabinX + 24, cabinY - 24);
  ctx.stroke();

  // Rustic front door
  ctx.fillStyle = '#6e3928';
  ctx.fillRect(cabinX - 5, cabinY - 26, 10, 26);
  ctx.fillStyle = '#e8c078';
  ctx.beginPath();
  ctx.arc(cabinX + 2, cabinY - 12, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Decorative strings of colorful beach bunting between lighthouse and cabin
  ctx.strokeStyle = '#e0c8b0';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(lhX + 14, galleryY - 6);
  ctx.quadraticCurveTo(0, -78, cabinX - 18, cabinY - cabinH - 12);
  ctx.stroke();

  // Pennant flags along the line
  const flagColors = [PALETTE.coralAccent, PALETTE.neonTeal, '#ffd166', '#a06cd5'];
  for (let f = 0; f < 8; f++) {
    const t = 0.14 + (f / 8) * 0.74;
    const fx = (1 - t) * (lhX + 14) + t * (cabinX - 18);
    const fy = (1 - t) * (1 - t) * (galleryY - 6) + 2 * (1 - t) * t * (-78) + t * t * (cabinY - cabinH - 12);
    ctx.fillStyle = flagColors[f % flagColors.length];
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 6, fy + 8);
    ctx.lineTo(fx - 4, fy + 7);
    ctx.closePath();
    ctx.fill();
  }

  // Palms on Home Island
  drawPalmTree(ctx, -145, 12, 0.95, 0.18, false);
  drawPalmTree(ctx, -162, 18, 0.78, 0.32, false);
  drawPalmTree(ctx, 138, 14, 0.92, -0.22, true);

  ctx.restore();
}

// --- Specific Landmark 2: Agenda Island ("QUÉ HAY" Festival Pavilion & Kiosk) ---
function drawLandmarkAgenda(ctx, islandX, islandY, time, reducedMotion) {
  ctx.save();
  ctx.translate(islandX, islandY);

  const pavX = 0;
  const pavY = -42;
  const pavW = 126;
  const pavH = 54;

  // Deck platform
  ctx.fillStyle = '#523429';
  ctx.fillRect(pavX - pavW * 0.5 - 8, pavY - 6, pavW + 16, 12);
  ctx.fillStyle = '#8f5745';
  ctx.fillRect(pavX - pavW * 0.5 - 8, pavY - 6, pavW + 16, 3);

  // Stage back wall with gradient sunset glow
  const wallGrad = ctx.createLinearGradient(0, pavY - pavH, 0, pavY);
  wallGrad.addColorStop(0, '#2d1e4a');
  wallGrad.addColorStop(1, '#662254');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(pavX - pavW * 0.5, pavY - pavH, pavW, pavH);

  // Bold neo-coastal striped canopy (coral & mint turquoise stripes)
  const canopyTopY = pavY - pavH - 24;
  const canopyBottomY = pavY - pavH;
  const stripeCount = 9;
  const stripeWidth = (pavW + 28) / stripeCount;

  ctx.save();
  for (let s = 0; s < stripeCount; s++) {
    const sx = pavX - (pavW + 28) * 0.5 + s * stripeWidth;
    ctx.fillStyle = s % 2 === 0 ? PALETTE.coralAccent : PALETTE.neonTeal;
    ctx.beginPath();
    ctx.moveTo(sx, canopyBottomY);
    ctx.lineTo(sx + stripeWidth * 0.5, canopyTopY);
    ctx.lineTo(sx + stripeWidth * 1.5, canopyTopY);
    ctx.lineTo(sx + stripeWidth, canopyBottomY);
    ctx.closePath();
    ctx.fill();

    // Scalloped awning edge
    ctx.beginPath();
    ctx.arc(sx + stripeWidth * 0.5, canopyBottomY, stripeWidth * 0.5, 0, Math.PI);
    ctx.fill();
  }
  ctx.restore();

  // Canopy ridge line
  ctx.strokeStyle = '#fff0d0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pavX - (pavW + 28) * 0.5, canopyTopY);
  ctx.lineTo(pavX + (pavW + 28) * 0.5, canopyTopY);
  ctx.stroke();

  // Neon Marquee Sign: "QUÉ HAY"
  ctx.save();
  const signY = canopyTopY - 14;
  const agendaTitle = 'QUÉ HAY · EVENTOS';
  ctx.font = '900 12px system-ui, sans-serif';
  const agendaMetrics = ctx.measureText(agendaTitle);
  const signW = Math.max(164, Math.ceil(agendaMetrics.width + 30));
  const signH = 24;

  ctx.fillStyle = '#17112b';
  ctx.fillRect(pavX - signW * 0.5, signY - signH * 0.5, signW, signH);
  ctx.strokeStyle = PALETTE.neonTeal;
  ctx.lineWidth = 2;
  ctx.strokeRect(pavX - signW * 0.5, signY - signH * 0.5, signW, signH);

  // Glowing neon text with maxWidth safety
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE.neonTeal;
  ctx.shadowColor = PALETTE.neonTeal;
  ctx.shadowBlur = reducedMotion ? 4 : 8 + Math.sin(time * 4) * 3;
  ctx.fillText(agendaTitle, pavX, signY, signW - 16);
  ctx.restore();

  // Festoon Bistro String Lights across the front
  ctx.strokeStyle = '#443834';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(pavX - pavW * 0.5 - 6, canopyBottomY + 4);
  ctx.quadraticCurveTo(pavX, canopyBottomY + 18, pavX + pavW * 0.5 + 6, canopyBottomY + 4);
  ctx.stroke();

  const lightBulbs = 9;
  for (let b = 0; b < lightBulbs; b++) {
    const t = (b + 0.5) / lightBulbs;
    const bx = (1 - t) * (pavX - pavW * 0.5 - 6) + t * (pavX + pavW * 0.5 + 6);
    const by = (1 - t) * (1 - t) * (canopyBottomY + 4) + 2 * (1 - t) * t * (canopyBottomY + 18) + t * t * (canopyBottomY + 4);

    const bulbGlow = reducedMotion ? 0.8 : 0.8 + Math.sin(time * 5 + b) * 0.2;
    ctx.fillStyle = `rgba(255, 230, 130, ${bulbGlow})`;
    ctx.beginPath();
    ctx.arc(bx, by + 3, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Interior stage elements: DJ decks & sound speaker stacks
  // Left speaker stack
  ctx.fillStyle = '#151824';
  ctx.fillRect(pavX - pavW * 0.5 + 8, pavY - 38, 16, 34);
  ctx.fillStyle = '#ff6b4a';
  ctx.beginPath();
  ctx.arc(pavX - pavW * 0.5 + 16, pavY - 28, 5, 0, Math.PI * 2);
  ctx.arc(pavX - pavW * 0.5 + 16, pavY - 14, 6, 0, Math.PI * 2);
  ctx.fill();

  // Right speaker stack
  ctx.fillStyle = '#151824';
  ctx.fillRect(pavX + pavW * 0.5 - 24, pavY - 38, 16, 34);
  ctx.fillStyle = '#ff6b4a';
  ctx.beginPath();
  ctx.arc(pavX + pavW * 0.5 - 16, pavY - 28, 5, 0, Math.PI * 2);
  ctx.arc(pavX + pavW * 0.5 - 16, pavY - 14, 6, 0, Math.PI * 2);
  ctx.fill();

  // DJ table & turntables
  ctx.fillStyle = '#2a3148';
  ctx.fillRect(pavX - 22, pavY - 24, 44, 20);
  ctx.fillStyle = '#11141f';
  ctx.beginPath();
  ctx.arc(pavX - 11, pavY - 24, 6, 0, Math.PI * 2);
  ctx.arc(pavX + 11, pavY - 24, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.neonTeal;
  ctx.beginPath();
  ctx.arc(pavX - 11, pavY - 24, 2, 0, Math.PI * 2);
  ctx.arc(pavX + 11, pavY - 24, 2, 0, Math.PI * 2);
  ctx.fill();

  // Surfboards planted organically in the sand
  const drawSurfboard = (sx, sy, rot, colorA, colorB) => {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rot);
    ctx.fillStyle = colorA;
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colorB;
    ctx.fillRect(-2, -26, 4, 52);
    ctx.restore();
  };

  drawSurfboard(-98, 14, 0.22, PALETTE.coralAccent, '#ffffff');
  drawSurfboard(-84, 18, 0.35, PALETTE.neonTeal, '#2b1b4d');
  drawSurfboard(104, 16, -0.28, '#ffd166', PALETTE.coralAccent);

  // Palms framing Agenda Pavilion
  drawPalmTree(ctx, -148, 14, 0.92, 0.24, false);
  drawPalmTree(ctx, 142, 12, 0.94, -0.26, true);

  ctx.restore();
}

// --- Specific Landmark 3: Copa Island ("COPA DEL PUEBLO" Coastal Pitch & Stadium Lights) ---
function drawLandmarkCopa(ctx, islandX, islandY, time, reducedMotion) {
  ctx.save();
  ctx.translate(islandX, islandY);

  const fieldX = 0;
  const fieldY = -34;
  const fieldW = 158;
  const fieldH = 64;

  // Stadium base mound
  ctx.fillStyle = '#223832';
  ctx.beginPath();
  ctx.ellipse(fieldX, fieldY + 8, fieldW * 0.58, fieldH * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vibrant striped green turf pitch (perspective slant)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(fieldX - fieldW * 0.44, fieldY - fieldH * 0.5);
  ctx.lineTo(fieldX + fieldW * 0.44, fieldY - fieldH * 0.5);
  ctx.lineTo(fieldX + fieldW * 0.52, fieldY + fieldH * 0.5);
  ctx.lineTo(fieldX - fieldW * 0.52, fieldY + fieldH * 0.5);
  ctx.closePath();
  ctx.clip();

  // Striped lawn mower bands
  const grassStripes = 7;
  const stripeW = fieldW / grassStripes;
  for (let g = 0; g < grassStripes; g++) {
    ctx.fillStyle = g % 2 === 0 ? '#1b7a5a' : '#279872';
    ctx.fillRect(fieldX - fieldW * 0.55 + g * stripeW, fieldY - fieldH, stripeW, fieldH * 2);
  }

  // Crisp white field touchlines & penalty box
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2.0;

  // Outer boundary
  ctx.strokeRect(fieldX - fieldW * 0.42, fieldY - fieldH * 0.42, fieldW * 0.84, fieldH * 0.84);

  // Center half-way line & circle
  ctx.beginPath();
  ctx.moveTo(fieldX, fieldY - fieldH * 0.42);
  ctx.lineTo(fieldX, fieldY + fieldH * 0.42);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(fieldX, fieldY, 16, 12, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Center penalty spot & soccer ball
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(fieldX, fieldY, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1c1c24';
  ctx.beginPath();
  ctx.arc(fieldX, fieldY, 1.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Coastal soccer goal net with angled perspective netting (left side)
  const goalX = fieldX - fieldW * 0.42 - 12;
  const goalY = fieldY - 14;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.strokeRect(goalX, goalY, 14, 26);
  // Netting mesh
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.0;
  for (let ny = goalY + 4; ny < goalY + 26; ny += 5) {
    ctx.beginPath();
    ctx.moveTo(goalX, ny);
    ctx.lineTo(goalX + 14, ny);
    ctx.stroke();
  }

  // Corner flags
  const drawCornerFlag = (cx, cy) => {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - 14);
    ctx.stroke();
    ctx.fillStyle = PALETTE.coralAccent;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 14);
    ctx.lineTo(cx + 8, cy - 10);
    ctx.lineTo(cx, cy - 6);
    ctx.closePath();
    ctx.fill();
  };
  drawCornerFlag(fieldX - fieldW * 0.42, fieldY + fieldH * 0.42);
  drawCornerFlag(fieldX + fieldW * 0.42, fieldY + fieldH * 0.42);

  // Tall Stadium Lattice Floodlight Towers
  const drawFloodlight = (fx, fy) => {
    ctx.save();
    ctx.strokeStyle = '#4b5568';
    ctx.lineWidth = 2;
    // Lattice mast
    ctx.beginPath();
    ctx.moveTo(fx - 5, fy);
    ctx.lineTo(fx - 2, fy - 72);
    ctx.lineTo(fx + 2, fy - 72);
    ctx.lineTo(fx + 5, fy);
    ctx.stroke();

    // Cross braces
    ctx.lineWidth = 1.2;
    for (let h = fy - 14; h > fy - 68; h -= 14) {
      ctx.beginPath();
      ctx.moveTo(fx - 4, h);
      ctx.lineTo(fx + 4, h);
      ctx.stroke();
    }

    // Light bank
    ctx.fillStyle = '#222736';
    ctx.fillRect(fx - 14, fy - 80, 28, 9);
    // Glowing lamps
    const lampGlow = reducedMotion ? 0.9 : 0.85 + Math.sin(time * 3 + fx) * 0.15;
    ctx.fillStyle = `rgba(255, 245, 180, ${lampGlow})`;
    for (let l = -10; l <= 10; l += 5) {
      ctx.beginPath();
      ctx.arc(fx + l, fy - 75, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Atmospheric stadium light cone down toward field
    ctx.save();
    const coneGrad = ctx.createLinearGradient(fx, fy - 75, fx, fy + 20);
    coneGrad.addColorStop(0, 'rgba(255, 245, 180, 0.28)');
    coneGrad.addColorStop(1, 'rgba(255, 245, 180, 0)');
    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(fx - 12, fy - 75);
    ctx.lineTo(fx + (fx < 0 ? 55 : -55), fy + 15);
    ctx.lineTo(fx + (fx < 0 ? -15 : 15), fy + 15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
  };

  drawFloodlight(-96, -42);
  drawFloodlight(96, -42);

  // Retro Neon Marquee Sign: "COPA DEL PUEBLO"
  ctx.save();
  const signY = -94;
  const titleText = 'COPA DEL PUEBLO';
  ctx.font = '900 12px system-ui, sans-serif';
  const textMetrics = ctx.measureText(titleText);
  const textW = textMetrics.width;

  // Icon geometry and separation (vector trophy to avoid emoji font-overlap)
  const iconW = 14;
  const iconGap = 10;
  const contentW = iconW + iconGap + textW;

  // Enlarge marquee sign so there's plenty of breathing room and no clipping
  const signW = Math.max(190, Math.ceil(contentW + 36));
  const signH = 26;
  const signLeft = fieldX - signW * 0.5;

  ctx.fillStyle = '#17112b';
  ctx.fillRect(signLeft, signY - signH * 0.5, signW, signH);
  ctx.strokeStyle = PALETTE.coralAccent;
  ctx.lineWidth = 2;
  ctx.strokeRect(signLeft, signY - signH * 0.5, signW, signH);

  // Position calculations
  const startX = fieldX - contentW * 0.5;
  const iconCenterX = startX + iconW * 0.5;
  const textX = startX + iconW + iconGap;

  // Stylized trophy icon on the left, strictly separated from the letter "C"
  ctx.save();
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.strokeStyle = PALETTE.coralAccent;
  ctx.shadowColor = PALETTE.coralAccent;
  ctx.shadowBlur = reducedMotion ? 3 : 6 + Math.sin(time * 4) * 2;

  // Trophy cup body
  ctx.beginPath();
  ctx.moveTo(iconCenterX - 5, signY - 6.5);
  ctx.lineTo(iconCenterX + 5, signY - 6.5);
  ctx.lineTo(iconCenterX + 3.5, signY);
  ctx.quadraticCurveTo(iconCenterX, signY + 3.5, iconCenterX - 3.5, signY);
  ctx.closePath();
  ctx.fill();

  // Trophy golden rim
  ctx.fillStyle = '#ffd67a';
  ctx.fillRect(iconCenterX - 5.5, signY - 7.5, 11, 1.6);

  // Trophy handles
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(iconCenterX - 4.2, signY - 3.5, 2.2, Math.PI * 0.6, Math.PI * 1.5, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(iconCenterX + 4.2, signY - 3.5, 2.2, Math.PI * 1.5, Math.PI * 0.4, false);
  ctx.stroke();

  // Trophy stem and base
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.fillRect(iconCenterX - 1.2, signY + 3, 2.4, 2.5);
  ctx.fillRect(iconCenterX - 4.5, signY + 5.5, 9, 2);
  ctx.restore();

  // Marquee text with explicit maxWidth and guaranteed separation from icon
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.shadowColor = PALETTE.coralAccent;
  ctx.shadowBlur = reducedMotion ? 4 : 8 + Math.sin(time * 4) * 3;
  const maxTitleW = (signLeft + signW - 8) - textX;
  ctx.fillText(titleText, textX, signY, maxTitleW);
  ctx.restore();

  // Tropical palms framing Copa pitch
  drawPalmTree(ctx, -145, 14, 0.88, 0.22, false);
  drawPalmTree(ctx, 140, 12, 0.90, -0.24, true);

  ctx.restore();
}

// --- Specific Landmark 4: Code / Tech Workshop Island (Fallback & Additional Projects) ---
function drawLandmarkCode(ctx, islandX, islandY, project, time, reducedMotion) {
  ctx.save();
  ctx.translate(islandX, islandY);

  const labX = 0;
  const labY = -40;
  const labW = 110;
  const labH = 50;

  // Stilt posts
  ctx.fillStyle = PALETTE.woodDark;
  ctx.fillRect(labX - labW * 0.45, labY - 10, 8, 30);
  ctx.fillRect(labX + labW * 0.45 - 8, labY - 10, 8, 30);
  ctx.fillRect(labX - 4, labY - 10, 8, 30);

  // Lab building
  ctx.fillStyle = '#212d45';
  ctx.fillRect(labX - labW * 0.5, labY - labH, labW, labH);

  // Tech roof with solar panels & antenna
  ctx.fillStyle = '#141c2c';
  ctx.fillRect(labX - labW * 0.5 - 6, labY - labH - 8, labW + 12, 9);

  // Solar panel angled grid
  ctx.fillStyle = '#1c4d72';
  ctx.fillRect(labX - 35, labY - labH - 18, 70, 10);
  ctx.strokeStyle = '#2ee6c8';
  ctx.lineWidth = 1;
  ctx.strokeRect(labX - 35, labY - labH - 18, 70, 10);

  // Radio antenna with blinking red beacon
  ctx.strokeStyle = '#ccd6e0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(labX + 38, labY - labH - 8);
  ctx.lineTo(labX + 38, labY - labH - 36);
  ctx.stroke();

  const beaconAlpha = reducedMotion ? 0.9 : 0.5 + Math.sin(time * 6) * 0.5;
  ctx.fillStyle = `rgba(255, 60, 80, ${beaconAlpha})`;
  ctx.beginPath();
  ctx.arc(labX + 38, labY - labH - 37, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Illuminated terminal glass window with glowing code lines
  ctx.fillStyle = '#0a101d';
  ctx.fillRect(labX - 42, labY - 38, 84, 28);
  ctx.strokeStyle = PALETTE.neonTeal;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(labX - 42, labY - 38, 84, 28);

  // Glowing synthetic code lines
  const codeColors = [PALETTE.neonTeal, PALETTE.coralAccent, '#ffd166'];
  for (let c = 0; c < 4; c++) {
    const lineY = labY - 32 + c * 6.5;
    const lineW = 32 + ((c * 17) % 38);
    ctx.fillStyle = codeColors[c % codeColors.length];
    ctx.fillRect(labX - 36, lineY, lineW, 3);
  }

  // Label sign
  ctx.save();
  const label = (project && project.title) ? project.title.toUpperCase() : 'DEV LAB';
  ctx.font = 'bold 10px system-ui, sans-serif';
  const labelMetrics = ctx.measureText(label);
  const codeSignW = Math.max(110, Math.ceil(labelMetrics.width + 24));
  const codeSignH = 18;
  const codeSignY = labY - labH - 21;

  ctx.fillStyle = '#17112b';
  ctx.fillRect(labX - codeSignW * 0.5, codeSignY - codeSignH * 0.5, codeSignW, codeSignH);
  ctx.strokeStyle = PALETTE.neonCyan;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(labX - codeSignW * 0.5, codeSignY - codeSignH * 0.5, codeSignW, codeSignH);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE.neonCyan;
  ctx.fillText(label, labX, codeSignY, codeSignW - 12);
  ctx.restore();

  // Framing palms
  drawPalmTree(ctx, -140, 14, 0.88, 0.20, false);
  drawPalmTree(ctx, 138, 12, 0.90, -0.22, true);

  ctx.restore();
}

// --- Specific Landmark 5: Contact Island ("CONTACTO" Lifeguard Shack, Mailbox & Message in a Bottle) ---
function drawLandmarkContact(ctx, islandX, islandY, time, reducedMotion, style) {
  ctx.save();
  ctx.translate(islandX, islandY);

  const isPixel = style === 'pixel';

  // --- 1. Lifeguard Watchtower on Stilts (Caseta sobre pilotes) ---
  const towerX = 0;
  const groundY = -34;
  const deckY = -84;
  const deckW = 96;
  const deckH = 8;
  const cabinW = 56;
  const cabinH = 46;
  const cabinY = deckY; // cabin sits from deckY - cabinH to deckY

  // Ground shadow under the tower
  ctx.fillStyle = 'rgba(18, 14, 34, 0.45)';
  ctx.beginPath();
  ctx.ellipse(towerX, groundY + 8, 54, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Heavy timber stilts / pilings
  const stiltPosts = [-36, -14, 14, 36];
  for (let s = 0; s < stiltPosts.length; s++) {
    const px = towerX + stiltPosts[s];
    // Stilt post
    ctx.fillStyle = PALETTE.woodDark;
    ctx.fillRect(px - 3, deckY, 6, groundY - deckY + 6);
    // Sun highlight on right edge
    ctx.fillStyle = PALETTE.woodLight;
    ctx.fillRect(px + 1, deckY, 2, groundY - deckY + 6);
  }

  // Sturdy diagonal cross braces (X-struts) between stilts
  ctx.strokeStyle = PALETTE.woodMid;
  ctx.lineWidth = 2.4;
  // Left X-brace
  ctx.beginPath();
  ctx.moveTo(towerX - 36, deckY + 8);
  ctx.lineTo(towerX - 14, groundY - 2);
  ctx.moveTo(towerX - 14, deckY + 8);
  ctx.lineTo(towerX - 36, groundY - 2);
  // Right X-brace
  ctx.moveTo(towerX + 14, deckY + 8);
  ctx.lineTo(towerX + 36, groundY - 2);
  ctx.moveTo(towerX + 36, deckY + 8);
  ctx.lineTo(towerX + 14, groundY - 2);
  ctx.stroke();

  // Access ladder on the far left
  const ladderX = towerX - 38;
  ctx.strokeStyle = PALETTE.woodDark;
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(ladderX - 4, groundY + 4);
  ctx.lineTo(ladderX - 4, deckY);
  ctx.moveTo(ladderX + 4, groundY + 4);
  ctx.lineTo(ladderX + 4, deckY);
  ctx.stroke();
  // Rungs
  ctx.strokeStyle = PALETTE.woodLight;
  ctx.lineWidth = 1.8;
  for (let ry = deckY + 8; ry < groundY; ry += 8) {
    ctx.beginPath();
    ctx.moveTo(ladderX - 4, ry);
    ctx.lineTo(ladderX + 4, ry);
    ctx.stroke();
  }

  // Lookout deck platform
  ctx.fillStyle = PALETTE.woodMid;
  ctx.fillRect(towerX - deckW * 0.5, deckY, deckW, deckH);
  ctx.fillStyle = PALETTE.woodLight;
  ctx.fillRect(towerX - deckW * 0.5, deckY, deckW, 2.5);

  // Deck railing & balusters
  const railTopY = deckY - 14;
  ctx.strokeStyle = PALETTE.pureWhite;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(towerX - deckW * 0.5 + 4, railTopY);
  ctx.lineTo(towerX + deckW * 0.5 - 4, railTopY);
  ctx.stroke();
  for (let bx = towerX - deckW * 0.5 + 8; bx <= towerX + deckW * 0.5 - 8; bx += 12) {
    ctx.beginPath();
    ctx.moveTo(bx, railTopY);
    ctx.lineTo(bx, deckY);
    ctx.stroke();
  }

  // Torpedo rescue buoy (coral/orange rescue can) hanging on railing
  const buoyX = towerX - 22;
  const buoyY = deckY - 7;
  ctx.save();
  ctx.translate(buoyX, buoyY);
  ctx.rotate(0.35);
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-2, -1, 4, 2); // grip handle
  ctx.restore();

  // Watchtower Cabin Body
  const cabinLeft = towerX - cabinW * 0.5;
  const cabinTop = cabinY - cabinH;
  // Weathered coastal teal wood siding
  ctx.fillStyle = '#1c525a';
  ctx.fillRect(cabinLeft, cabinTop, cabinW, cabinH);

  // Horizontal siding planks
  ctx.strokeStyle = '#12373c';
  ctx.lineWidth = 1.2;
  for (let py = cabinTop + 6; py < cabinY; py += 7) {
    ctx.beginPath();
    ctx.moveTo(cabinLeft, py);
    ctx.lineTo(cabinLeft + cabinW, py);
    ctx.stroke();
  }

  // Coral accent corner trims
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.fillRect(cabinLeft, cabinTop, 3, cabinH);
  ctx.fillRect(cabinLeft + cabinW - 3, cabinTop, 3, cabinH);

  // Observation Window: wide wraparound bay lookout window
  const winW = 34;
  const winH = 16;
  const winX = towerX - winW * 0.5;
  const winY = cabinTop + 10;
  // Glowing warm interior sunset light
  const interiorGlow = reducedMotion || isPixel ? 0.8 : 0.8 + Math.sin(time * 2.5) * 0.12;
  ctx.fillStyle = `rgba(255, 222, 132, ${interiorGlow})`;
  ctx.fillRect(winX, winY, winW, winH);
  // Window frame & mullions
  ctx.strokeStyle = '#221915';
  ctx.lineWidth = 1.6;
  ctx.strokeRect(winX, winY, winW, winH);
  ctx.beginPath();
  ctx.moveTo(winX + winW * 0.5, winY);
  ctx.lineTo(winX + winW * 0.5, winY + winH);
  ctx.stroke();

  // Cabin Door with round brass porthole
  const doorX = towerX + 14;
  const doorY = cabinY - 24;
  ctx.fillStyle = '#6e3826';
  ctx.fillRect(doorX - 6, doorY, 12, 24);
  // Porthole glass
  ctx.fillStyle = '#7dd3fc';
  ctx.beginPath();
  ctx.arc(doorX, doorY + 8, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Hip Roof with wide overhanging eaves
  const roofOverhang = 8;
  const roofBottomY = cabinTop;
  const roofTopY = cabinTop - 16;
  ctx.fillStyle = '#b44139';
  ctx.beginPath();
  ctx.moveTo(cabinLeft - roofOverhang, roofBottomY);
  ctx.lineTo(towerX - 10, roofTopY);
  ctx.lineTo(towerX + 10, roofTopY);
  ctx.lineTo(cabinLeft + cabinW + roofOverhang, roofBottomY);
  ctx.closePath();
  ctx.fill();
  // Roof fascia highlight
  ctx.strokeStyle = '#fcd34d';
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(cabinLeft - roofOverhang - 1, roofBottomY);
  ctx.lineTo(towerX - 10, roofTopY);
  ctx.lineTo(towerX + 10, roofTopY);
  ctx.lineTo(cabinLeft + cabinW + roofOverhang + 1, roofBottomY);
  ctx.stroke();

  // --- 2. Flagpole & Waving Signal Flag (Bandera) ---
  const flagMastX = towerX + 18;
  const flagMastTopY = roofTopY - 28;
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(flagMastX, roofTopY);
  ctx.lineTo(flagMastX, flagMastTopY);
  ctx.stroke();
  // Brass finial ball
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(flagMastX, flagMastTopY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Dynamic waving pennant flag
  const flagW = 22;
  const flagH = 13;
  const flagTopY = flagMastTopY + 2;
  const flutter = reducedMotion || isPixel ? 0 : Math.sin(time * 6) * 2.5;

  ctx.save();
  ctx.fillStyle = PALETTE.neonTeal;
  ctx.beginPath();
  ctx.moveTo(flagMastX, flagTopY);
  ctx.quadraticCurveTo(flagMastX + flagW * 0.5, flagTopY + flutter, flagMastX + flagW, flagTopY + 4 + flutter);
  ctx.lineTo(flagMastX + flagW - 6, flagTopY + flagH * 0.5 + flutter);
  ctx.lineTo(flagMastX + flagW, flagTopY + flagH + flutter);
  ctx.quadraticCurveTo(flagMastX + flagW * 0.5, flagTopY + flagH + flutter, flagMastX, flagTopY + flagH);
  ctx.closePath();
  ctx.fill();
  // Flag coral stripe accent
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.beginPath();
  ctx.moveTo(flagMastX + 3, flagTopY + 2);
  ctx.lineTo(flagMastX + 8, flagTopY + 2);
  ctx.lineTo(flagMastX + 8, flagTopY + flagH - 2);
  ctx.lineTo(flagMastX + 3, flagTopY + flagH - 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // --- 3. Mailbox on Wooden Post (Buzón) ---
  const mbPostX = towerX + 54;
  const mbPostY = groundY;
  // Rustic post
  ctx.fillStyle = PALETTE.woodDark;
  ctx.fillRect(mbPostX - 2.5, mbPostY - 24, 5, 26);
  // Mailbox body (curved barrel top)
  const mbW = 16;
  const mbH = 11;
  const mbX = mbPostX - mbW * 0.5;
  const mbY = mbPostY - 35;
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function' && !isPixel) {
    ctx.roundRect(mbX, mbY, mbW, mbH, [5, 5, 2, 2]);
  } else {
    ctx.rect(mbX, mbY, mbW, mbH);
  }
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // Raised red outgoing mail flag
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.fillRect(mbX + mbW - 1, mbY - 5, 2, 8);
  ctx.beginPath();
  ctx.moveTo(mbX + mbW + 1, mbY - 5);
  ctx.lineTo(mbX + mbW + 7, mbY - 2.5);
  ctx.lineTo(mbX + mbW + 1, mbY);
  ctx.closePath();
  ctx.fill();

  // White mail envelope peeking from slot
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(mbX + 2, mbY + 4, 7, 5);
  ctx.strokeStyle = PALETTE.coralAccent;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(mbX + 2, mbY + 4);
  ctx.lineTo(mbX + 5.5, mbY + 7);
  ctx.lineTo(mbX + 9, mbY + 4);
  ctx.stroke();

  // --- 4. Message in a Bottle floating near the pier (Botella con mensaje) ---
  // The pier is at x: [-32, 32], y: [28, 96].
  // Float the bottle at x = -48, y = 82 near the pier pilings!
  const bottleBaseX = -48;
  const bottleBaseY = 82;
  const bob = reducedMotion ? 0 : Math.sin(time * 2.8) * 3.0;
  const rock = reducedMotion ? 0 : Math.sin(time * 2.2) * 0.14;

  ctx.save();
  ctx.translate(bottleBaseX, bottleBaseY + bob);
  ctx.rotate(0.28 + rock);

  // Water ripple ring around bottle
  ctx.save();
  ctx.rotate(-0.28 - rock); // keep ripple flat on water surface
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, 5, 9, 3.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Bottle Glass Body (translucent aquamarine teal)
  const glassColor = isPixel ? 'rgba(46, 230, 200, 0.85)' : 'rgba(46, 230, 200, 0.65)';
  ctx.fillStyle = glassColor;
  ctx.beginPath();
  // Bottle base and body
  if (typeof ctx.roundRect === 'function' && !isPixel) {
    ctx.roundRect(-4.5, -3, 9, 14, [0, 0, 3, 3]);
  } else {
    ctx.rect(-4.5, -3, 9, 14);
  }
  ctx.fill();
  // Bottle neck
  ctx.fillRect(-2, -9, 4, 7);
  // Bottle collar lip
  ctx.fillRect(-3, -10, 6, 2);

  // Cork Stopper
  ctx.fillStyle = '#b8864a';
  ctx.fillRect(-2, -13, 4, 3.5);

  // Rolled parchment letter inside
  ctx.fillStyle = '#fff4db';
  ctx.fillRect(-2.5, 0, 5, 8);
  // Red ribbon tied around scroll
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.fillRect(-3, 3.5, 6, 1.8);

  // Glass highlight shine
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(3, -2);
  ctx.lineTo(3, 8);
  ctx.stroke();
  ctx.restore();

  // --- 5. Neon Marquee Sign: "CONTACTO" with measureText/maxWidth ---
  ctx.save();
  const signY = roofTopY - 24;
  const titleText = 'CONTACTO';
  ctx.font = '900 12px system-ui, sans-serif';
  const textMetrics = ctx.measureText(titleText);
  const textW = textMetrics.width;

  // Vector send/paper airplane icon
  const iconW = 13;
  const iconGap = 9;
  const contentW = iconW + iconGap + textW;

  const signW = Math.max(140, Math.ceil(contentW + 34));
  const signH = 24;
  const signLeft = towerX - signW * 0.5;

  // Support posts anchoring sign to roof
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(signLeft + 20, signY);
  ctx.lineTo(signLeft + 20, roofTopY);
  ctx.moveTo(signLeft + signW - 20, signY);
  ctx.lineTo(signLeft + signW - 20, roofTopY);
  ctx.stroke();

  // Backing box
  ctx.fillStyle = '#17112b';
  ctx.fillRect(signLeft, signY - signH * 0.5, signW, signH);
  ctx.strokeStyle = PALETTE.neonTeal;
  ctx.lineWidth = 2;
  ctx.strokeRect(signLeft, signY - signH * 0.5, signW, signH);

  // Neon glowing icon & text
  const startX = towerX - contentW * 0.5;
  const iconCenterX = startX + iconW * 0.5;
  const textX = startX + iconW + iconGap;

  // Vector envelope/send icon
  ctx.save();
  ctx.fillStyle = PALETTE.neonTeal;
  ctx.strokeStyle = PALETTE.neonTeal;
  if (!isPixel) {
    ctx.shadowColor = PALETTE.neonTeal;
    ctx.shadowBlur = reducedMotion ? 3 : 6 + Math.sin(time * 4) * 2;
  }
  // Paper airplane / message send icon
  ctx.beginPath();
  ctx.moveTo(iconCenterX - 6, signY - 5);
  ctx.lineTo(iconCenterX + 6, signY);
  ctx.lineTo(iconCenterX - 6, signY + 5);
  ctx.lineTo(iconCenterX - 2, signY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Measured Neon Text with strict maxWidth
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = PALETTE.neonTeal;
  if (!isPixel) {
    ctx.shadowColor = PALETTE.neonTeal;
    ctx.shadowBlur = reducedMotion ? 4 : 8 + Math.sin(time * 4) * 3;
  }
  const maxTitleW = (signLeft + signW - 8) - textX;
  ctx.fillText(titleText, textX, signY, maxTitleW);
  ctx.restore();

  ctx.restore();

  // Framing lush coastal palms
  drawPalmTree(ctx, -145, 14, 0.90, 0.22, false);
  drawPalmTree(ctx, 140, 12, 0.92, -0.24, true);

  ctx.restore();
}

// --- Layer 8: Prominent Legible Dock Signboard (Always facing front, never inverted) ---
function drawDockSignboard(ctx, islandX, islandY, project, isSelected, isHovered, style, time, reducedMotion) {
  ctx.save();
  ctx.translate(islandX, islandY);

  // Placed right beside the pier at the foreground (x = 56, y = 66)
  const signX = 56;
  const signY = 66;
  const signW = 130;
  const signH = 36;

  // Signpost wooden legs
  ctx.fillStyle = PALETTE.woodDark;
  ctx.fillRect(signX - 40, signY + signH * 0.5, 5, 26);
  ctx.fillRect(signX + 35, signY + signH * 0.5, 5, 26);

  // Glow cálido en hover: estrictamente por FUERA del cartel para no oscurecerlo
  if (isHovered) {
    ctx.save();
    if (style !== 'pixel') {
      const pulse = reducedMotion ? 0.85 : 0.85 + Math.sin(time * 4) * 0.15;
      const auraGrad = ctx.createRadialGradient(signX, signY, signH * 0.45, signX, signY, signW * 0.95);
      auraGrad.addColorStop(0.0, `rgba(255, 220, 130, ${pulse * 0.65})`);
      auraGrad.addColorStop(0.35, `rgba(255, 160, 70, ${pulse * 0.35})`);
      auraGrad.addColorStop(0.70, `rgba(255, 120, 50, ${pulse * 0.14})`);
      auraGrad.addColorStop(1.0, 'rgba(255, 100, 40, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.ellipse(signX, signY, signW * 0.85, signH * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // En modo pixel, halo sólido perimetral exterior cálido
      ctx.fillStyle = 'rgba(255, 195, 115, 0.75)';
      ctx.fillRect(signX - signW * 0.5 - 2, signY - signH * 0.5 - 2, signW + 4, signH + 4);
    }
    ctx.restore();
  }

  // Backing card: fondo nítido y luminoso en hover (nunca oscuro/negro)
  ctx.save();
  if (isHovered) {
    const cardGrad = ctx.createLinearGradient(signX, signY - signH * 0.5, signX, signY + signH * 0.5);
    cardGrad.addColorStop(0, '#2c3c5c');
    cardGrad.addColorStop(1, '#202d46');
    ctx.fillStyle = cardGrad;
  } else {
    ctx.fillStyle = isSelected ? '#1e283c' : '#161e2c';
  }
  ctx.fillRect(signX - signW * 0.5, signY - signH * 0.5, signW, signH);
  ctx.restore();

  // Border highlight: trazo nítido sin sombras interiores que oscurezcan el texto
  ctx.save();
  if (isHovered) {
    ctx.strokeStyle = '#ffe49e';
    ctx.lineWidth = style === 'pixel' ? 2 : 2.4;
  } else {
    ctx.strokeStyle = isSelected ? PALETTE.coralAccent : '#3b4d66';
    ctx.lineWidth = isSelected ? 2.0 : 1.4;
  }
  ctx.strokeRect(signX - signW * 0.5, signY - signH * 0.5, signW, signH);
  ctx.restore();

  // Corner rivets
  ctx.fillStyle = isHovered ? '#ffe49e' : isSelected ? PALETTE.coralAccent : '#94a3b8';
  ctx.beginPath();
  ctx.arc(signX - signW * 0.5 + 4, signY - signH * 0.5 + 4, 1.8, 0, Math.PI * 2);
  ctx.arc(signX + signW * 0.5 - 4, signY - signH * 0.5 + 4, 1.8, 0, Math.PI * 2);
  ctx.arc(signX - signW * 0.5 + 4, signY + signH * 0.5 - 4, 1.8, 0, Math.PI * 2);
  ctx.arc(signX + signW * 0.5 - 4, signY + signH * 0.5 - 4, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Category badge & Project title
  const projectTitle = (project && project.title) ? project.title : 'Destino';
  const projectKind = (project && project.kind === 'contact')
    ? 'CONTACTO'
    : ((project && project.kind) ? project.kind.toUpperCase() : 'PROYECTO');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Category Tag
  ctx.font = 'bold 8.5px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isHovered ? '#ffe49e' : isSelected ? PALETTE.neonTeal : '#94a3b8';
  ctx.fillText(projectKind, signX, signY - 7, signW - 14);

  // Main Title: blanco puro de alto contraste, legible en todo momento
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(projectTitle, signX, signY + 6, signW - 14);

  // --- Burbuja de acción en hover: ~18px lógicos en negrita, alto contraste, nítida en 2D y Pixel ---
  if (isHovered) {
    const bubbleLabel = isSelected ? 'Entrar ↵' : 'Navegar →';
    const bob = (reducedMotion || style === 'pixel') ? 0 : Math.sin(time * 4) * 2;

    ctx.save();
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    const labelMetrics = ctx.measureText(bubbleLabel);
    const labelW = labelMetrics.width;

    // Dimensiones generosas para legibilidad inmediata en móvil 375px y alta densidad
    const bubbleW = Math.max(isSelected ? 130 : 150, Math.ceil(labelW + 36));
    const bubbleH = 36;
    const bubbleCenterX = style === 'pixel' ? Math.round(signX / 2) * 2 : signX;
    const bubbleCenterY = style === 'pixel'
      ? Math.round(signY - signH * 0.5 - bubbleH * 0.5 - 10)
      : (signY - signH * 0.5 - bubbleH * 0.5 - 10 + bob);
    const bx = bubbleCenterX - bubbleW * 0.5;
    const by = bubbleCenterY - bubbleH * 0.5;

    // Sombra exterior suave sólo en 2D
    if (style !== 'pixel') {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;
    }

    // Fondo oscuro profundo para máximo contraste con el texto blanco y el contorno cálido
    ctx.fillStyle = '#080d1a';
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function' && style !== 'pixel') {
      ctx.roundRect(bx, by, bubbleW, bubbleH, 6);
    } else {
      ctx.rect(bx, by, bubbleW, bubbleH);
    }
    ctx.fill();

    // Contorno cálido ámbar/dorado de alta visibilidad
    ctx.strokeStyle = '#ffd56b';
    ctx.lineWidth = style === 'pixel' ? 2 : 2.2;
    ctx.stroke();

    // Pico apuntando al cartel
    const picoHalfW = style === 'pixel' ? 5 : 6;
    const picoH = 6;
    ctx.fillStyle = '#080d1a';
    ctx.beginPath();
    ctx.moveTo(bubbleCenterX - picoHalfW, by + bubbleH);
    ctx.lineTo(bubbleCenterX, by + bubbleH + picoH);
    ctx.lineTo(bubbleCenterX + picoHalfW, by + bubbleH);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffd56b';
    ctx.lineWidth = style === 'pixel' ? 2 : 2.2;
    ctx.beginPath();
    ctx.moveTo(bubbleCenterX - picoHalfW, by + bubbleH);
    ctx.lineTo(bubbleCenterX, by + bubbleH + picoH);
    ctx.lineTo(bubbleCenterX + picoHalfW, by + bubbleH);
    ctx.stroke();

    // Texto de la burbuja: 18px en negrita, blanco puro
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bubbleLabel, bubbleCenterX, bubbleCenterY + 1, bubbleW - 12);

    ctx.restore();
  }

  ctx.restore();
}

// --- Layer 9: Offshore Performance Speedboat (Proa Afilada Blanca Coral) ---
function drawOffshoreBoat(ctx, boatX, boatY, moving, direction, progress, time, reducedMotion) {
  ctx.save();

  // Subtle natural water heave/bobbing
  const bobbing = reducedMotion ? 0 : Math.sin(time * 2.1) * 3.2;
  const pitch = moving
    ? -0.075 * direction * Math.sin(progress * Math.PI)
    : (reducedMotion ? 0 : Math.sin(time * 1.6) * 0.024);

  ctx.translate(boatX, boatY + bobbing);
  ctx.rotate(pitch);

  // Flip horizontally according to travel direction (1: moving right, -1: moving left)
  if (direction < 0) {
    ctx.scale(-1, 1);
  }

  // --- Dynamic Wakes and Water Spray (during navigation) ---
  if (moving) {
    ctx.save();
    const sprayTime = time * 12;

    // Twin Stern Froth and V-Wake stretching backward from transom (x = -75)
    for (let w = 0; w < 16; w++) {
      const dist = 32 + w * 16;
      const spread = 8 + w * 5.2;
      const particleY = 16 + Math.sin(sprayTime + w) * 3;

      // Upper & lower wake arms
      ctx.fillStyle = w % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(46, 230, 200, 0.65)';
      ctx.beginPath();
      ctx.ellipse(-75 - dist, particleY - spread, 5 + w * 0.6, 2.5 + w * 0.3, -0.15, 0, Math.PI * 2);
      ctx.ellipse(-75 - dist, particleY + spread * 0.4, 5 + w * 0.6, 2.5 + w * 0.3, 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    // High-speed bow spray sheets (proa afilada at x = 75)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let s = 0; s < 7; s++) {
      const sprayX = 60 + s * 4;
      const sprayY = 8 - Math.sin(sprayTime * 0.8 + s) * 9;
      ctx.beginPath();
      ctx.arc(sprayX, sprayY, 2.5 + (s % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else {
    // Idle gentle water disturbance ripples
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.4;
    const rippleW = 88 + Math.sin(time * 1.8) * 8;
    ctx.beginPath();
    ctx.ellipse(0, 19, rippleW, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // --- Hull Shadow onto Water ---
  ctx.fillStyle = 'rgba(4, 18, 30, 0.58)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 76, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- Twin Outboard Performance Racing Engines (Popa / Transom at x = -72) ---
  const engineSpacing = 11;
  const engineTops = [-engineSpacing * 0.5, engineSpacing * 0.5];

  for (let e = 0; e < 2; e++) {
    const ey = engineTops[e];
    ctx.save();
    ctx.translate(-76, ey + 2);

    // Motor bracket / transom mount
    ctx.fillStyle = '#0f141f';
    ctx.fillRect(-2, 0, 6, 8);

    // Streamlined Outboard Cowling (Dark Slate with Turquoise racing badge)
    ctx.fillStyle = '#1a2233';
    ctx.beginPath();
    ctx.moveTo(-16, -6);
    ctx.lineTo(2, -6);
    ctx.lineTo(4, 14);
    ctx.lineTo(-12, 16);
    ctx.closePath();
    ctx.fill();

    // Top racing stripe on engine
    ctx.fillStyle = PALETTE.coralAccent;
    ctx.fillRect(-14, -4, 14, 3);

    // Mid turquoise accent
    ctx.fillStyle = PALETTE.racingTurquoise;
    ctx.fillRect(-12, 2, 13, 2);

    // Lower drive unit & propeller shaft
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(-10, 16, 6, 12);
    ctx.beginPath();
    ctx.moveTo(-10, 28);
    ctx.lineTo(-4, 28);
    ctx.lineTo(-7, 33);
    ctx.closePath();
    ctx.fill();

    // Propeller spinning blur / spray when moving
    if (moving && !reducedMotion) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.ellipse(-7, 31, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Offshore Monohull (Sharp Racing Bow / Proa Afilada) ---
  // Lower Hull (Deep V bottom)
  ctx.fillStyle = '#152132';
  ctx.beginPath();
  ctx.moveTo(-74, 12);
  ctx.lineTo(60, 10);
  ctx.lineTo(82, 0); // sharp bow point
  ctx.lineTo(58, 17);
  ctx.lineTo(-70, 19);
  ctx.closePath();
  ctx.fill();

  // Main Topsides Hull (Brilliant Alpine White with subtle shading)
  const hullGrad = ctx.createLinearGradient(0, -12, 0, 14);
  hullGrad.addColorStop(0, PALETTE.pureWhite);
  hullGrad.addColorStop(0.65, PALETTE.hullOffWhite);
  hullGrad.addColorStop(1.0, '#cbd5e1');
  ctx.fillStyle = hullGrad;
  ctx.beginPath();
  ctx.moveTo(-72, 3);
  ctx.quadraticCurveTo(-20, -7, 56, -4);
  ctx.lineTo(82, 0); // razor proa
  ctx.lineTo(62, 12);
  ctx.quadraticCurveTo(0, 17, -72, 13);
  ctx.closePath();
  ctx.fill();

  // Iconic Coral Racing Stripe (Rocket Power / Vice City offshore aesthetic)
  ctx.fillStyle = PALETTE.coralAccent;
  ctx.beginPath();
  ctx.moveTo(-68, 6);
  ctx.quadraticCurveTo(0, 11, 62, 5);
  ctx.lineTo(76, 1);
  ctx.lineTo(60, 12);
  ctx.quadraticCurveTo(0, 17, -68, 12);
  ctx.closePath();
  ctx.fill();

  // High-contrast Neon Turquoise Pinstripe
  ctx.fillStyle = PALETTE.neonTeal;
  ctx.beginPath();
  ctx.moveTo(-66, 4);
  ctx.quadraticCurveTo(0, 8, 62, 3);
  ctx.lineTo(68, 1);
  ctx.lineTo(58, 6);
  ctx.quadraticCurveTo(0, 10, -66, 6);
  ctx.closePath();
  ctx.fill();

  // Top Deck & Foredeck (Long, sleek, aerodynamic proa)
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(-70, 3);
  ctx.quadraticCurveTo(-15, -6, 55, -4);
  ctx.lineTo(82, 0);
  ctx.lineTo(54, 4);
  ctx.quadraticCurveTo(-15, 2, -70, 3);
  ctx.closePath();
  ctx.fill();

  // Chrome deck cleats & bow rail
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(35, -4);
  ctx.lineTo(76, -1);
  ctx.stroke();

  // --- Recessed Racing Cockpit ---
  const cockX = -8;
  const cockY = 2;
  const cockW = 54;
  const cockH = 14;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(cockX - cockW * 0.5, cockY - cockH * 0.5, cockW, cockH, 4);
  } else {
    ctx.rect(cockX - cockW * 0.5, cockY - cockH * 0.5, cockW, cockH);
  }
  ctx.fill();

  // Racing Bucket Seats (Coral & Dark Slate)
  const drawSeat = (sx) => {
    ctx.fillStyle = PALETTE.coralDeep;
    ctx.fillRect(sx - 5, cockY - 8, 10, 8);
    ctx.fillStyle = PALETTE.coralAccent;
    ctx.fillRect(sx - 4, cockY - 7, 8, 4);
    // Headrest
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(sx, cockY - 9, 3, 0, Math.PI * 2);
    ctx.fill();
  };
  drawSeat(-22); // Navigator seat
  drawSeat(-6);  // Pilot seat

  // Console dashboard glow & stainless wheel
  ctx.fillStyle = PALETTE.neonTeal;
  ctx.fillRect(6, cockY - 4, 6, 2);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(8, cockY - 3, 3, 0, Math.PI * 2);
  ctx.stroke();

  // --- Aerodynamic Racing Windshield (Tinted Slate & Cyan Glass Flare) ---
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(-4, -16);
  ctx.lineTo(19, -15);
  ctx.lineTo(34, 1);
  ctx.closePath();
  ctx.fill();

  // Curved glass glare / turquoise horizon reflection
  const glassGrad = ctx.createLinearGradient(-4, -16, 28, 0);
  glassGrad.addColorStop(0.0, 'rgba(46, 230, 200, 0.85)');
  glassGrad.addColorStop(0.45, 'rgba(0, 245, 212, 0.35)');
  glassGrad.addColorStop(1.0, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.moveTo(-12, -2);
  ctx.lineTo(-3, -14);
  ctx.lineTo(16, -13);
  ctx.lineTo(26, -1);
  ctx.closePath();
  ctx.fill();

  // Windshield black racing frame rim
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(-4, -16);
  ctx.lineTo(19, -15);
  ctx.lineTo(34, 1);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// --- Main Exported Function: renderScene ---
/**
 * Renders the full multi-island sunset archipelago scene onto a 1280x720 canvas.
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context (caller manages transform/DPR).
 * @param {Object} state - Application state matching IMPLEMENTATION_CONTRACT.md.
 */
export function renderScene(ctx, state) {
  if (!ctx) return;

  // Defensive defaults matching contract
  const time = typeof state?.time === 'number' ? state.time : 0;
  const cameraX = typeof state?.cameraX === 'number' ? state.cameraX : 0;
  const boatX = typeof state?.boatX === 'number' ? state.boatX : 640;
  const boatY = typeof state?.boatY === 'number' ? state.boatY : 535;
  const moving = Boolean(state?.moving);
  const direction = state?.direction === -1 ? -1 : 1;
  const progress = typeof state?.progress === 'number' ? clamp(state.progress, 0, 1) : 0;
  const reducedMotion = Boolean(state?.reducedMotion);
  const projects = Array.isArray(state?.projects) ? state.projects : [];
  const selectedIndex = typeof state?.selectedIndex === 'number' ? state.selectedIndex : 0;
  const style = state?.style === 'pixel' ? 'pixel' : '2d';
  const hoveredIndex = typeof state?.hoveredIndex === 'number' ? state.hoveredIndex : null;

  // Preserve caller's canvas context state
  ctx.save();

  // Crisp or smooth pixel rendering according to style preference
  if (style === 'pixel') {
    ctx.imageSmoothingEnabled = false;
  }

  // Clear viewport (extended to prevent artifacts on wider/taller views)
  ctx.clearRect(-1000, -600, 3280, 2000);

  // 1. Sky & Sun
  drawSkyAndSun(ctx, time, cameraX);

  // 2. Parallax Sunset Clouds
  drawClouds(ctx, time, cameraX, reducedMotion);

  // 3. Distant Mountain/Island Silhouettes
  drawDistantArchipelago(ctx, cameraX);

  // 4. Layered Sunset Ocean with Wave Highlights & Sun Ribbon
  drawOcean(ctx, time, cameraX, reducedMotion);

  // 5. Islands
  // According to contract:
  // "World island i tiene x = 640 + i * 1600 - cameraX, y = 420. cameraX = selectedIndex * 1600 al llegar."
  // Only render islands that intersect visible horizontal viewport [-600, 1880]
  const islandCount = Math.max(projects.length, 4);

  for (let i = 0; i < islandCount; i++) {
    const islandX = 640 + i * 1600 - cameraX;
    const islandY = 420;

    // Viewport frustum culling (each island spans ~360px width)
    if (islandX < -600 || islandX > 1880) {
      continue;
    }

    const project = projects[i] || {
      kind: i === 0 ? 'home' : i === 1 ? 'agenda' : i === 2 ? 'copa' : i === 3 ? 'contact' : 'code',
      title: i === 3 ? 'Contacto' : `Parada ${i + 1}`
    };
    const kind = project.kind || (i === 0 ? 'home' : i === 1 ? 'agenda' : i === 2 ? 'copa' : i === 3 ? 'contact' : 'code');
    const isSelected = i === selectedIndex;
    const isHovered = i === hoveredIndex;

    // Draw organic terrain base, sand and bluffs
    drawIslandBase(ctx, islandX, islandY);

    // Draw thematic landmark based on contract kind
    if (kind === 'home') {
      drawLandmarkHome(ctx, islandX, islandY, time, reducedMotion);
    } else if (kind === 'agenda') {
      drawLandmarkAgenda(ctx, islandX, islandY, time, reducedMotion);
    } else if (kind === 'copa') {
      drawLandmarkCopa(ctx, islandX, islandY, time, reducedMotion);
    } else if (kind === 'contact') {
      drawLandmarkContact(ctx, islandX, islandY, time, reducedMotion, style);
    } else {
      drawLandmarkCode(ctx, islandX, islandY, project, time, reducedMotion);
    }

    // Draw dock/pier connecting island to boat
    drawPier(ctx, islandX, islandY, time, reducedMotion);

    // Draw legible dock signboard (never inverted, always front-facing)
    drawDockSignboard(ctx, islandX, islandY, project, isSelected, isHovered, style, time, reducedMotion);
  }

  // 6. Offshore Performance Speedboat (Proa Afilada Blanca Coral)
  // Contract: boat is positioned at boatX=640, boatY=535, aligned right in front of the active dock!
  drawOffshoreBoat(ctx, boatX, boatY, moving, direction, progress, time, reducedMotion);

  // Restore caller's canvas context state
  ctx.restore();
}
