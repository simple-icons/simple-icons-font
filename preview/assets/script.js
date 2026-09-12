document.addEventListener('DOMContentLoaded', () => {
  const $body = document.querySelector('body');
  const $icons = document.getElementsByTagName('i');
  const $backgroundModeButton = document.querySelector('.background-mode');
  const $iconsColorButton = document.querySelector('.icons-color');
  const $iconSearchInput = document.querySelector('.icon-search');
  const $gridIcons = Array.from(document.querySelectorAll('.grid i'));
  const $iconsCount = document.querySelector('.icons-count');
  const $emptySearch = document.querySelector('.empty-search');
  const $iconsStyleInputs = document.querySelectorAll(
    'input[name="icons-style"]',
  );
  const iconStyleClasses = ['si', 'si-fit', 'si-code'];
  const formatIconsCount = (count) =>
    `${count} ${count === 1 ? 'icon' : 'icons'}`;

  // Background dark/light mode toggler
  $backgroundModeButton.addEventListener('click', () => {
    if ($body.classList.contains('dark')) {
      $backgroundModeButton.innerText = 'Dark background';
    } else {
      $backgroundModeButton.innerText = 'Light background';
    }
    $body.classList.toggle('dark');
  });

  // Icons black/colored toggle
  $iconsColorButton.addEventListener('click', () => {
    if ($icons[0].classList.contains('si--color')) {
      $iconsColorButton.innerText = 'Colored icons';
    } else {
      $iconsColorButton.innerText = 'Colorless icons';
    }

    for (let i = 0; i < $icons.length; i++) {
      $icons[i].classList.toggle('si--color');
    }
  });

  // Icons style switcher
  const setIconsStyle = (style) => {
    for (let i = 0; i < $icons.length; i++) {
      if ($icons[i].classList.contains('style-immutable')) {
        continue;
      }

      $icons[i].classList.remove(...iconStyleClasses);
      $icons[i].classList.add(style);
    }
  };

  $iconsStyleInputs.forEach(($input) => {
    $input.addEventListener('change', (event) => {
      if (event.target.checked) {
        setIconsStyle(event.target.value);
      }
    });
  });

  // Icons search
  const filterIcons = () => {
    const query = $iconSearchInput.value.trim().toLowerCase();
    let visibleIconsCount = 0;

    $gridIcons.forEach(($icon) => {
      const title = ($icon.dataset.title || '').toLowerCase();
      const slug = ($icon.dataset.slug || '').toLowerCase();
      const isVisible =
        query.length === 0 || title.includes(query) || slug.includes(query);

      $icon.hidden = !isVisible;
      if (isVisible) {
        visibleIconsCount++;
      }
    });

    $iconsCount.innerText = formatIconsCount(visibleIconsCount);
    $emptySearch.hidden = visibleIconsCount > 0;
  };

  $iconSearchInput.addEventListener('input', filterIcons);
  filterIcons();
});
