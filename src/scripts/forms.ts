/** Netlify forms that submit in place, falling back to /thank-you/ without JavaScript */
document.querySelectorAll<HTMLFormElement>('form[data-ajax-form]').forEach((form) => {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    button?.setAttribute('disabled', '');
    if (status) status.textContent = 'Sending…';
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      form.dispatchEvent(new CustomEvent('form:sent'));
      window.dataLayer?.push({ event: 'form_submit', form: form.getAttribute('name') });
      if (status) status.textContent = status.dataset.success ?? 'Thank you. Your message is on its way.';
    } catch {
      if (status) status.textContent = 'Something interrupted the connection. Please try again, or write to us by email.';
    } finally {
      button?.removeAttribute('disabled');
    }
  });
});
