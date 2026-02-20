/**
 * Morphing Blobs - Organic SVG Path Animation
 * 2026 Premium SaaS Trend (Stripe, Framer, Linear, Vercel)
 * 
 * Smooth morphing between blob shapes with gradient fills
 * GPU-accelerated animations for 60fps performance
 */

class MorphingBlobs {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.blobCount = options.blobCount || 3;
    this.colors = options.colors || [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe']
    ];
    this.init();
  }

  init() {
    this.createBlobContainer();
    this.createBlobs();
    this.startMorphing();
    this.handleMouseMovement();
  }

  createBlobContainer() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('morphing-blobs-container');
    this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svg.setAttribute('viewBox', '0 0 1000 1000');

    // Create defs for gradients
    this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.svg.appendChild(this.defs);

    this.container.appendChild(this.svg);
  }

  createBlobs() {
    this.blobs = [];

    for (let i = 0; i < this.blobCount; i++) {
      const blob = this.createBlob(i);
      this.blobs.push(blob);
      this.svg.appendChild(blob.path);
    }
  }

  createBlob(index) {
    const gradient = this.createGradient(index);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    path.setAttribute('fill', `url(#blob-gradient-${index})`);
    path.classList.add('morphing-blob');
    path.setAttribute('opacity', '0.6');

    // Generate initial blob shape
    const initialPath = this.generateBlobPath();
    path.setAttribute('d', initialPath);

    return {
      path,
      currentPath: initialPath,
      targetPath: this.generateBlobPath(),
      progress: 0,
      duration: 8000 + Math.random() * 4000, // 8-12s per morph
      delay: index * 1000
    };
  }

  createGradient(index) {
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    gradient.setAttribute('id', `blob-gradient-${index}`);
    gradient.setAttribute('cx', '50%');
    gradient.setAttribute('cy', '50%');
    gradient.setAttribute('r', '50%');

    const [color1, color2] = this.colors[index % this.colors.length];

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', `stop-color:${color1};stop-opacity:1`);

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', `stop-color:${color2};stop-opacity:0.8`);

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    this.defs.appendChild(gradient);

    return gradient;
  }

  generateBlobPath() {
    // Generate organic blob shape using bezier curves
    const points = 6; // Number of control points
    const angleStep = (Math.PI * 2) / points;
    const centerX = 500;
    const centerY = 500;
    const baseRadius = 250 + Math.random() * 100;

    let path = 'M';
    const controlPoints = [];

    // Generate points around circle with variation
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep;
      const radiusVariation = baseRadius + (Math.random() - 0.5) * 150;
      const x = centerX + Math.cos(angle) * radiusVariation;
      const y = centerY + Math.sin(angle) * radiusVariation;
      controlPoints.push({ x, y });
    }

    // Create smooth bezier path
    for (let i = 0; i < points; i++) {
      const current = controlPoints[i];
      const next = controlPoints[i + 1];

      if (i === 0) {
        path += `${current.x},${current.y} `;
      }

      // Calculate control points for smooth curve
      const cp1x = current.x + (next.x - current.x) * 0.3 + (Math.random() - 0.5) * 50;
      const cp1y = current.y + (next.y - current.y) * 0.3 + (Math.random() - 0.5) * 50;
      const cp2x = next.x - (next.x - current.x) * 0.3 + (Math.random() - 0.5) * 50;
      const cp2y = next.y - (next.y - current.y) * 0.3 + (Math.random() - 0.5) * 50;

      path += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y} `;
    }

    path += 'Z';
    return path;
  }

  startMorphing() {
    const animate = (timestamp) => {
      this.blobs.forEach(blob => {
        blob.progress += 16 / blob.duration; // Assuming 60fps

        if (blob.progress >= 1) {
          // Morph complete, generate new target
          blob.currentPath = blob.targetPath;
          blob.targetPath = this.generateBlobPath();
          blob.progress = 0;
        }

        // Interpolate between current and target path
        const easedProgress = this.easeInOutCubic(blob.progress);
        const interpolatedPath = this.interpolatePaths(
          blob.currentPath,
          blob.targetPath,
          easedProgress
        );

        blob.path.setAttribute('d', interpolatedPath);
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  interpolatePaths(path1, path2, progress) {
    const commands1 = path1.match(/[A-Z][^A-Z]*/g);
    const commands2 = path2.match(/[A-Z][^A-Z]*/g);

    if (!commands1 || !commands2 || commands1.length !== commands2.length) {
      return path1;
    }

    let result = '';
    commands1.forEach((cmd1, i) => {
      const cmd2 = commands2[i];
      const letter1 = cmd1[0];
      const letter2 = cmd2[0];

      if (letter1 !== letter2) {
        result += cmd1;
        return;
      }

      // Z (close path) has no numeric arguments — just append it
      if (letter1 === 'Z') {
        result += 'Z ';
        return;
      }

      const nums1 = cmd1.slice(1).trim().split(/[\s,]+/).filter(s => s.length > 0).map(Number);
      const nums2 = cmd2.slice(1).trim().split(/[\s,]+/).filter(s => s.length > 0).map(Number);

      if (nums1.length === 0) {
        result += cmd1;
        return;
      }

      const interpolated = nums1.map((n1, j) => {
        const n2 = nums2[j] !== undefined ? nums2[j] : n1;
        return n1 + (n2 - n1) * progress;
      });

      result += letter1 + interpolated.join(',') + ' ';
    });

    return result;
  }

  handleMouseMovement() {
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 100 - 50;
      mouseY = (e.clientY / window.innerHeight) * 100 - 50;
    });

    const updatePosition = () => {
      this.blobs.forEach((blob, i) => {
        const offset = (i + 1) * 0.3;
        const x = mouseX * offset * 0.5;
        const y = mouseY * offset * 0.5;
        blob.path.style.transform = `translate(${x}px, ${y}px)`;
      });

      requestAnimationFrame(updatePosition);
    };

    requestAnimationFrame(updatePosition);
  }

  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}

// Auto-initialize on hero sections
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  if (hero) {
    const blobContainer = document.createElement('div');
    blobContainer.className = 'blobs-wrapper';
    hero.insertBefore(blobContainer, hero.firstChild);

    new MorphingBlobs({
      container: blobContainer,
      blobCount: 3,
      colors: [
        ['#667eea', '#764ba2'],
        ['#fa709a', '#fee140'],
        ['#30cfd0', '#330867']
      ]
    });
  }

  // Add to other sections if needed
  const pricingSection = document.querySelector('.pricing-section');
  if (pricingSection) {
    const blobContainer = document.createElement('div');
    blobContainer.className = 'blobs-wrapper blobs-subtle';
    pricingSection.insertBefore(blobContainer, pricingSection.firstChild);

    new MorphingBlobs({
      container: blobContainer,
      blobCount: 2,
      colors: [
        ['#a8edea', '#fed6e3'],
        ['#fbc2eb', '#a6c1ee']
      ]
    });
  }
});

// Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const style = document.createElement('style');
  style.textContent = '.morphing-blob { animation: none !important; }';
  document.head.appendChild(style);
}
