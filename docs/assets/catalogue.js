const catalogue = document.querySelector('.catalogue-tools');
const searchBox = document.getElementById('land-search');
const areaBox = document.getElementById('land-area');
const categoryBox = document.getElementById('land-category');
const sortBox = document.getElementById('land-sort');
const savedFilter = document.getElementById('saved-filter');
const grid = document.querySelector('.catalogue-grid');
const heading = document.getElementById('catalogue-title');
const categoryNote = document.getElementById('category-note');
const catalogueTitle = document.title;
const emptyState = document.querySelector('.no-results');
const params = new URLSearchParams(location.search);
const entries = landInventory.map(property => ({
  property,
  card: grid.querySelector('[data-land="' + property.id + '"]'),
  searchText: [property.title, property.area, property.acres, property.description, ...property.tags, ...property.details].join(' ').toLowerCase()
}));
const sorting = {
  'size-up': (a, b) => a.property.acres - b.property.acres,
  'size-down': (a, b) => b.property.acres - a.property.acres,
  'price-up': (a, b) => a.property.price - b.property.price,
  'price-down': (a, b) => b.property.price - a.property.price
};

function filterLand() {
  const query = searchBox.value.trim().toLowerCase();
  const area = areaBox.value;
  const category = categoryBox.value;
  const savedOnly = savedFilter.getAttribute('aria-pressed') === 'true';
  const order = sorting[sortBox.value];
  const orderedEntries = order ? [...entries].sort(order) : entries;
  let count = 0;

  for (const { property, card, searchText } of orderedEntries) {
    const visible = (!area || property.area === area)
      && (!category || landCategories[property.id].includes(category))
      && searchText.includes(query)
      && (!savedOnly || window.DanloShortlist?.has(property.id));
    card.hidden = !visible;
    count += Number(visible);
    grid.append(card);
  }

  document.getElementById('land-count').textContent = count + (count === 1 ? ' land opportunity' : ' land opportunities');
  emptyState.hidden = count > 0;
  emptyState.textContent = savedOnly
    ? 'No saved land matches these filters. Save a listing using its heart, or show all land.'
    : 'No land matches these filters. Try a different property type, location, or search term.';

  const label = categoryBox.selectedOptions[0].textContent;
  heading.textContent = category ? label : 'Find land that fits your plans.';
  categoryNote.hidden = !category;
  document.title = category ? label + ' | Danlo Properties Ltd' : catalogueTitle;
  document.querySelectorAll('.mega-category').forEach(link => {
    const linkCategory = new URL(link.href).searchParams.get('category');
    if (linkCategory === category) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

for (const [select, key] of [[areaBox, 'location'], [categoryBox, 'category']]) {
  const value = params.get(key);
  if ([...select.options].some(option => option.value === value)) select.value = value;
}
filterLand();

function updateCategoryURL() {
  const url = new URL(location.href);
  if (categoryBox.value) url.searchParams.set('category', categoryBox.value);
  else url.searchParams.delete('category');
  history.replaceState(null, '', url);
}

searchBox.addEventListener('input', filterLand);
areaBox.addEventListener('change', filterLand);
sortBox.addEventListener('change', filterLand);
categoryBox.addEventListener('change', () => {
  updateCategoryURL();
  filterLand();
});
catalogue.addEventListener('submit', event => event.preventDefault());
catalogue.addEventListener('reset', () => {
  savedFilter.setAttribute('aria-pressed', 'false');
  const url = new URL(location.href);
  for (const filter of ['category', 'location', 'saved']) url.searchParams.delete(filter);
  history.replaceState(null, '', url);
  setTimeout(filterLand, 0);
});
