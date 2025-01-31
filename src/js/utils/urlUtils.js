export function getStepFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const step = urlParams.get('step');
    return step ? parseInt(step, 10) : null;
} 