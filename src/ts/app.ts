type QueryElement = Element | null;

const selectOne = <T extends Element>(selector: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(selector);

const selectAll = <T extends Element>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(selector));

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = selectOne<HTMLButtonElement>('[data-menu-toggle]');
  const navigation = selectOne<HTMLElement>('[data-navigation]');
  const header = selectOne<HTMLElement>('[data-header]');

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const opened = navigation.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(opened));
    });
  }

  selectAll<HTMLButtonElement>('[data-dropdown-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest<HTMLElement>('[data-dropdown]');
      if (!group) return;
      const opened = group.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(opened));
      selectAll<HTMLElement>('[data-dropdown]').forEach((other) => {
        if (other !== group) {
          other.classList.remove('is-open');
          selectOne<HTMLButtonElement>('[data-dropdown-toggle]', other)?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });

  const updateHeader = (): void => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  selectAll<HTMLElement>('[data-char-count]').forEach((counter) => {
    const targetId = counter.getAttribute('data-char-count');
    const field = targetId ? selectOne<HTMLInputElement | HTMLTextAreaElement>(`#${CSS.escape(targetId)}`) : null;
    if (!field) return;
    const update = (): void => { counter.textContent = String(field.value.length); };
    field.addEventListener('input', update);
    update();
  });

  selectAll<HTMLFormElement>('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }
      const submit = selectOne<HTMLButtonElement>('button[type="submit"]', form);
      if (submit) {
        submit.dataset.originalText = submit.innerHTML;
        submit.disabled = true;
        submit.textContent = 'Submitting…';
      }
    });
  });

  // Give remote images an accessible fallback if a legacy media URL is unavailable.
  selectAll<HTMLImageElement>('img').forEach((image) => {
    image.addEventListener('error', () => {
      image.classList.add('image-unavailable');
      image.alt = image.alt ? `${image.alt} (image unavailable)` : 'Image unavailable';
    }, { once: true });
  });
});
