/**
 * Grid Blueprint JavaScript
 * 
 * Dynamic grid generation and animation system for technical precision aesthetic.
 * Creates procedural SVG grids with perspective effects and animated scan lines.
 * 
 * Features:
 * - Procedural SVG grid generation
 * - Responsive grid density
 * - Animated scan lines
 * - Coordinate system overlay
 * - Performance-optimized RAF loop
 * - Mobile-safe progressive enhancement
 */

class GridBlueprint {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      gridSize: options.gridSize || 40,
      color: options.color || 'primary',
      showScanline: options.showScanline !== false,
      showCoordinates: options.showCoordinates !== false,
      showDots: options.showDots !== false,
      theme: options.theme || 'default',
      intensity: options.intensity || 'normal',
      ...options
    };
    
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }
  
  init() {
    // Create wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.className = `grid-blueprint-wrapper grid-blueprint-wrapper--${this.options.color}`;
    
    if (this.options.intensity === 'subtle') {
      this.wrapper.classList.add('grid-blueprint-wrapper--subtle');
    } else if (this.options.intensity === 'vibrant') {
      this.wrapper.classList.add('grid-blueprint-wrapper--vibrant');
    } else if (this.options.intensity === 'hero') {
      this.wrapper.classList.add('grid-blueprint-wrapper--hero');
    }
    
    // Generate SVG grid
    this.createSVGGrid();
    
    // Add scan line
    if (this.options.showScanline && !this.isMobile && !this.prefersReducedMotion) {
      this.createScanline();
    }
    
    // Add coordinates
    if (this.options.showCoordinates && !this.isMobile) {
      this.createCoordinates();
    }
    
    // Add dot grid overlay
    if (this.options.showDots) {
      this.createDotGrid();
    }
    
    // Add perspective fade
    this.createPerspectiveFade();
    
    // Add glow lines
    if (!this.isMobile && !this.prefersReducedMotion) {
      this.createGlowLines();
    }
    
    // Make container position relative if needed
    const position = window.getComputedStyle(this.container).position;
    if (position === 'static') {
      this.container.style.position = 'relative';
    }
    
    // Ensure container has overflow hidden
    this.container.style.overflow = 'hidden';
    
    // Insert at the beginning
    this.container.insertBefore(this.wrapper, this.container.firstChild);
  }
  
  createSVGGrid() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('grid-blueprint-svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    const containerRect = this.container.getBoundingClientRect();
    const width = containerRect.width || 1200;
    const height = containerRect.height || 800;
    
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    
    // Adjust grid size for mobile
    const gridSize = this.isMobile ? this.options.gridSize * 1.5 : this.options.gridSize;
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x);
      line.setAttribute('y1', 0);
      line.setAttribute('x2', x);
      line.setAttribute('y2', height);
      line.classList.add('grid-line');
      
      // Major lines every 5th
      if (x % (gridSize * 5) === 0) {
        line.classList.add('grid-line--major');
      }
      
      // Accent lines (random selection)
      if (Math.random() > 0.85) {
        line.classList.add('grid-line--accent');
      }
      
      svg.appendChild(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', 0);
      line.setAttribute('y1', y);
      line.setAttribute('x2', width);
      line.setAttribute('y2', y);
      line.classList.add('grid-line');
      
      // Major lines every 5th
      if (y % (gridSize * 5) === 0) {
        line.classList.add('grid-line--major');
      }
      
      // Accent lines (random selection)
      if (Math.random() > 0.85) {
        line.classList.add('grid-line--accent');
      }
      
      svg.appendChild(line);
    }
    
    this.wrapper.appendChild(svg);
  }
  
  createScanline() {
    const scanline = document.createElement('div');
    scanline.className = 'grid-scanline';
    
    // Randomize animation delay for variety
    scanline.style.animationDelay = `${Math.random() * 4}s`;
    
    this.wrapper.appendChild(scanline);
  }
  
  createCoordinates() {
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    
    positions.forEach((pos, index) => {
      const coords = document.createElement('div');
      coords.className = `grid-coordinates grid-coordinates--${pos}`;
      
      // Generate random-looking technical coordinates
      const lat = (Math.random() * 180 - 90).toFixed(4);
      const lng = (Math.random() * 360 - 180).toFixed(4);
      const alt = (Math.random() * 1000).toFixed(0);
      
      coords.innerHTML = `
        <span>LAT ${lat}°</span>
        <span>LNG ${lng}°</span>
        <span>ALT ${alt}m</span>
      `;
      
      this.wrapper.appendChild(coords);
    });
  }
  
  createDotGrid() {
    const dots = document.createElement('div');
    dots.className = 'grid-dots';
    this.wrapper.appendChild(dots);
  }
  
  createPerspectiveFade() {
    const fade = document.createElement('div');
    fade.className = 'grid-blueprint-fade';
    this.wrapper.appendChild(fade);
  }
  
  createGlowLines() {
    // Create 2-3 animated glow lines
    const lineCount = 2 + Math.floor(Math.random() * 2);
    
    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      const isHorizontal = Math.random() > 0.5;
      
      line.className = `grid-glow-line grid-glow-line--${isHorizontal ? 'horizontal' : 'vertical'}`;
      
      // Random positioning
      if (isHorizontal) {
        line.style.top = `${Math.random() * 100}%`;
      } else {
        line.style.left = `${Math.random() * 100}%`;
      }
      
      // Random animation delay
      line.style.animationDelay = `${Math.random() * 6}s`;
      line.style.animationDuration = `${6 + Math.random() * 4}s`;
      
      this.wrapper.appendChild(line);
    }
  }
  
  destroy() {
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
  }
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Hero section - vibrant primary grid
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    new GridBlueprint(heroSection, {
      color: 'primary',
      intensity: 'hero',
      gridSize: 50,
      showScanline: true,
      showCoordinates: true,
      showDots: true
    });
  }
  
  // Pricing section - subtle secondary grid
  const pricingSection = document.querySelector('.pricing-section');
  if (pricingSection) {
    new GridBlueprint(pricingSection, {
      color: 'secondary',
      intensity: 'subtle',
      gridSize: 60,
      showScanline: true,
      showCoordinates: false,
      showDots: false
    });
  }
  
  // Booking section - accent grid
  const bookingSection = document.querySelector('.booking-section');
  if (bookingSection) {
    new GridBlueprint(bookingSection, {
      color: 'accent',
      intensity: 'subtle',
      gridSize: 70,
      showScanline: false,
      showCoordinates: false,
      showDots: true
    });
  }
  
  // Features section - white grid for contrast
  const featuresSection = document.querySelector('.features-section');
  if (featuresSection) {
    new GridBlueprint(featuresSection, {
      color: 'white',
      intensity: 'normal',
      gridSize: 55,
      showScanline: true,
      showCoordinates: false,
      showDots: false
    });
  }
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GridBlueprint;
}
