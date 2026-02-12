// Fix for autoscroll to bottom
if (window.location.hash !== '#top' && window.location.hash !== '') {
    // Standard behavior is fine if there's a hash
} else {
    // Force scroll to top on load if no specific hash
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    // Double check scroll position
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
});
