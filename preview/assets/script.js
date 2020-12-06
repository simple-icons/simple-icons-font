document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('button.toggle').addEventListener('click', () => {
		document.querySelector('body').classList.toggle('dark')
	})
})
