document.addEventListener('DOMContentLoaded', () => {
	// DOM elements
	const body = document.querySelector('body'),
	      icons = document.getElementsByClassName('simpleicons');

	// Buttons
	const backgroundModeButton = document.querySelector('button.background-mode'),
	      iconsColorButton = document.querySelector('button.icons-color');

	// Background dark/light mode toggler
	backgroundModeButton.addEventListener('click', () => {
		if (body.classList.contains('dark')) {
			backgroundModeButton.innerText = 'Dark background';
		} else {
			backgroundModeButton.innerText = 'Light background';
		}
		body.classList.toggle('dark');
	})

	// Icons black/colored toggle
	iconsColorButton.addEventListener('click', () => {
		if (icons[0].classList.contains('simpleicons--color')) {
			iconsColorButton.innerText = 'Colored icons';
		} else {
			iconsColorButton.innerText = 'Black icons';
		}

		for (let i=0; i<icons.length; i++) {
			icons[i].classList.toggle('simpleicons--color');
		}
	})
})