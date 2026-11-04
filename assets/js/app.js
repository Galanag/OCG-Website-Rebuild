"use strict";
const selectOne = (selector, root = document) => root.querySelector(selector);
const selectAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = selectOne('[data-menu-toggle]');
    const navigation = selectOne('[data-navigation]');
    const header = selectOne('[data-header]');
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', () => {
            const opened = navigation.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(opened));
        });
    }
    selectAll('[data-dropdown-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const group = button.closest('[data-dropdown]');
            if (!group)
                return;
            const opened = group.classList.toggle('is-open');
            button.setAttribute('aria-expanded', String(opened));
            selectAll('[data-dropdown]').forEach((other) => {
                if (other !== group) {
                    other.classList.remove('is-open');
                    selectOne('[data-dropdown-toggle]', other)?.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });
    const updateHeader = () => {
        if (header)
            header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    selectAll('[data-char-count]').forEach((counter) => {
        const targetId = counter.getAttribute('data-char-count');
        const field = targetId ? selectOne(`#${CSS.escape(targetId)}`) : null;
        if (!field)
            return;
        const update = () => { counter.textContent = String(field.value.length); };
        field.addEventListener('input', update);
        update();
    });
    selectAll('form').forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                form.reportValidity();
                return;
            }
            const submit = selectOne('button[type="submit"]', form);
            if (submit) {
                submit.dataset.originalText = submit.innerHTML;
                submit.disabled = true;
                submit.textContent = 'Submitting…';
            }
        });
    });
    // Give remote images an accessible fallback if a legacy media URL is unavailable.
    selectAll('img').forEach((image) => {
        image.addEventListener('error', () => {
            image.classList.add('image-unavailable');
            image.alt = image.alt ? `${image.alt} (image unavailable)` : 'Image unavailable';
        }, { once: true });
    });
});
