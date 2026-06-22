(function () {
  const resultsElement = document.getElementById('search-results');
  if (!resultsElement) return;

  const statusElement = document.getElementById('search-status');
  const inputElement = document.getElementById('search-input');
  const indexURL = new URL(resultsElement.dataset.indexUrl || 'index.json', document.baseURI);
  const labels = {
    noResults: resultsElement.dataset.noResults || 'No results found for',
    enterTerm: resultsElement.dataset.enterTerm || 'Enter a search term above.',
    unavailable: resultsElement.dataset.unavailable || 'Search unavailable.',
    resultFor: resultsElement.dataset.resultFor || 'result for',
    resultsFor: resultsElement.dataset.resultsFor || 'results for',
  };

  function appendHighlighted(parent, value, query) {
    const text = String(value || '');
    if (!query) {
      parent.append(document.createTextNode(text));
      return;
    }
    const lowerText = text.toLocaleLowerCase();
    const lowerQuery = query.toLocaleLowerCase();
    let offset = 0;
    let match = lowerText.indexOf(lowerQuery);
    while (match !== -1) {
      parent.append(document.createTextNode(text.slice(offset, match)));
      const mark = document.createElement('mark');
      mark.textContent = text.slice(match, match + query.length);
      parent.append(mark);
      offset = match + query.length;
      match = lowerText.indexOf(lowerQuery, offset);
    }
    parent.append(document.createTextNode(text.slice(offset)));
  }

  function safeRelativeURL(value) {
    try {
      const url = new URL(String(value), document.baseURI);
      return url.origin === window.location.origin ? url.href : null;
    } catch {
      return null;
    }
  }

  function renderResults(results, query) {
    resultsElement.replaceChildren();
    if (!results.length) {
      statusElement.textContent = query ? `${labels.noResults} “${query}”.` : labels.enterTerm;
      return;
    }

    statusElement.textContent = `${results.length} ${
      results.length === 1 ? labels.resultFor : labels.resultsFor
    } “${query}”`;

    for (const result of results) {
      const item = result.item;
      const href = safeRelativeURL(item.url);
      if (!href) continue;

      const article = document.createElement('article');
      article.className = 'search-result';

      const meta = document.createElement('div');
      meta.className = 'search-result-meta';
      const category = document.createElement('span');
      category.className = 'card-category';
      category.textContent = String(item.section || '');
      const date = document.createElement('span');
      date.className = 'search-result-date';
      date.textContent = String(item.date || '');
      meta.append(category, date);

      const heading = document.createElement('h2');
      heading.className = 'search-result-title';
      const link = document.createElement('a');
      link.href = href;
      appendHighlighted(link, item.title, query);
      heading.append(link);
      article.append(meta, heading);

      if (item.description) {
        const description = document.createElement('p');
        description.className = 'search-result-desc';
        appendHighlighted(description, item.description, query);
        article.append(description);
      }
      resultsElement.append(article);
    }
  }

  function initialize(index) {
    const fuse = new Fuse(index, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'description', weight: 0.3 },
        { name: 'content', weight: 0.1 },
      ],
      includeScore: true,
      threshold: 0.35,
      minMatchCharLength: 2,
    });

    const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
    if (initialQuery) {
      inputElement.value = initialQuery;
      renderResults(fuse.search(initialQuery), initialQuery);
    }

    inputElement.addEventListener('input', function () {
      const query = this.value.trim();
      renderResults(query.length >= 2 ? fuse.search(query) : [], query);
      const url = new URL(window.location.href);
      if (query) url.searchParams.set('q', query);
      else url.searchParams.delete('q');
      history.replaceState({}, '', url);
    });
  }

  fetch(indexURL, { credentials: 'same-origin' })
    .then((response) => {
      if (!response.ok) throw new Error('Failed to load search index');
      return response.json();
    })
    .then(initialize)
    .catch(() => {
      statusElement.textContent = labels.unavailable;
    });
})();
