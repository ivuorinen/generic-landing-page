document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('h1');
    const hostname = window.location.hostname || document.title;

    container.textContent = hostname;
    document.title = hostname
});
