document.addEventListener('DOMContentLoaded', () => {
  const $body = document.querySelector('body');
  const $icons = document.getElementsByTagName('i');
  const $backgroundModeButton = document.querySelector('.background-mode');
  const $iconsColorButton = document.querySelector('.icons-color');
  const $iconsStyleButton = document.querySelector('.icons-style');

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

  // Icons style toggle
  $iconsStyleButton.addEventListener('click', () => {
    const isFit = $icons[0].classList.contains('si-fit');
    if (isFit) {
      $iconsStyleButton.innerText = 'Fit';
    } else {
      $iconsStyleButton.innerText = 'Regular';
    }

    for (let i = 0; i < $icons.length; i++) {
      if ($icons[i].classList.contains('style-immutable')) {
        continue;
      }
      if (isFit) {
        $icons[i].classList.remove('si-fit');
        $icons[i].classList.add('si');
      } else {
        $icons[i].classList.remove('si');
        $icons[i].classList.add('si-fit');
      }
    }
  });
});
