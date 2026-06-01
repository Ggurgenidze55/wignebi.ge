/** Inline fallback when Tailwind chunk fails — keeps layout readable */
export const criticalCss = `
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--font-inter, system-ui, -apple-system, sans-serif);
    background-color: #f8fafc;
    color: #0f172a;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }
  img { max-width: 100%; height: auto; display: block; }
  a { color: inherit; text-decoration: none; }
  main { display: block; width: 100%; }

  .max-w-page {
    width: 100%;
    max-width: 72rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .site-header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    min-height: 3.5rem;
  }

  .site-nav { display: none; gap: 2rem; align-items: center; }
  @media (min-width: 768px) {
    .site-nav { display: flex; }
  }

  .hero-grid {
    display: grid;
    gap: 3rem;
    align-items: center;
  }
  @media (min-width: 1024px) {
    .hero-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
  }

  .btn-row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 2.5rem; }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    background: #4f46e5;
    color: #fff !important;
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
  }
  .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #0f172a !important;
    font-size: 0.875rem;
  }

  .text-fg { color: #0f172a; }
  .text-fg-muted { color: #64748b; }
`;
