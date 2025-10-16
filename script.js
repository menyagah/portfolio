document.addEventListener('DOMContentLoaded', () => {
	// ===========================
	// 🌙 Theme Toggle
	// ===========================
	const themeToggle = document.getElementById('theme-toggle')
	const saved = localStorage.getItem('theme')
	const isLight = saved === 'light'

	// Initial state
	document.documentElement.classList.toggle('light-mode', isLight)
	themeToggle.textContent = isLight ? '☀️' : '🌙'

	themeToggle.addEventListener('click', () => {
		const nowLight = document.documentElement.classList.toggle('light-mode')
		themeToggle.textContent = nowLight ? '☀️' : '🌙'

		// Animate sunrise / sunset effect
		themeToggle.classList.add('toggle-anim')
		setTimeout(() => themeToggle.classList.remove('toggle-anim'), 600)

		localStorage.setItem('theme', nowLight ? 'light' : 'dark')
	})

	// ===========================
	// 🍔 Mobile Drawer
	// ===========================
	const burger = document.getElementById('burger')
	const drawer = document.getElementById('drawer')
	const overlay = document.getElementById('drawer-overlay')
	const closeBtn = document.getElementById('drawer-close')

	function openDrawer() {
		drawer.classList.add('open')
		overlay.classList.add('show')
		burger.setAttribute('aria-expanded', 'true')
	}

	function closeDrawer() {
		drawer.classList.remove('open')
		overlay.classList.remove('show')
		burger.setAttribute('aria-expanded', 'false')
	}

	if (burger && drawer && overlay) {
		burger.addEventListener('click', openDrawer)
		overlay.addEventListener('click', closeDrawer)
		if (closeBtn) closeBtn.addEventListener('click', closeDrawer)
		document
			.querySelectorAll('.drawer-link')
			.forEach((l) => l.addEventListener('click', closeDrawer))
	}

	// ===========================
	// 💬 Modal System (Unified)
	// ===========================
	const modalRoot = document.getElementById('modal')
	const modalContent = document.getElementById('modal-content')
	const modalCloseBtn = modalRoot?.querySelector('.modal-close')
	const modalBackdrop = modalRoot?.querySelector('.modal-backdrop')

	function openModal(title, contentHTML) {
		if (!modalRoot || !modalContent) return
		modalContent.innerHTML = `
      <h3 id="modal-title">${title || 'Info'}</h3>
      <div class="modal-body">${
				contentHTML || '<p>Content unavailable.</p>'
			}</div>
    `
		modalRoot.classList.add('open')
		document.body.classList.add('modal-open')
	}

	function closeModal() {
		if (!modalRoot || !modalContent) return
		modalRoot.classList.remove('open')
		document.body.classList.remove('modal-open')
		modalContent.innerHTML = ''
	}

	modalCloseBtn?.addEventListener('click', closeModal)
	modalBackdrop?.addEventListener('click', closeModal)
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modalRoot?.classList.contains('open'))
			closeModal()
	})

	// ===========================
	// 📊 Quick Stats Modal
	// ===========================
	document.querySelectorAll('.stat').forEach((stat) => {
		stat.addEventListener('click', () => {
			const title = stat.querySelector('span')
				? stat.querySelector('span').textContent.trim()
				: (stat.textContent || 'Quick Stat').trim()

			const content =
				stat.dataset.line ||
				stat.getAttribute('data-line') ||
				'No details available for this stat.'

			openModal(
				title,
				`<p style="font-size:20px; line-height:1.6; text-align:center;">${content}</p>`
			)
		})
	})

	// ===========================
	// 💬 Recommendation Modal (Full Text)
	// ===========================
	document.querySelectorAll('.testimonial').forEach((t) => {
		t.addEventListener('click', () => {
			const textEl = t.querySelector('p')
			const authorEl = t.querySelector('.small')
			const text = textEl ? textEl.innerHTML : t.innerText
			const author = authorEl ? authorEl.innerHTML : ''
			openModal(
				'Recommendation',
				`<p>${text}</p><p class="small">${author}</p>`
			)
		})
	})

	// ===========================
	// 👍 Form Submit (with Modal)
	// ===========================
	const form = document.querySelector('.contact-form')
	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault()
			const data = new FormData(form)
			try {
				const res = await fetch(form.action, {
					method: 'POST',
					body: data,
					headers: { Accept: 'application/json' }
				})
				if (res.ok) {
					form.reset()
					openModal('Success 🎉', '<p>👍 Message sent successfully!</p>')
				} else {
					openModal('Error 😞', '<p>Something went wrong. Try again later.</p>')
				}
			} catch {
				openModal(
					'Network Error ⚠️',
					'<p>Unable to send message. Check your connection.</p>'
				)
			}
		})
	}

	// ===========================
	// 🌊 Smooth Scroll
	// ===========================
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault()
			document.querySelector(this.getAttribute('href')).scrollIntoView({
				behavior: 'smooth'
			})
		})
	})

	// ===========================
	// 💫 Testimonials Slider (auto + optional arrows)
	// ===========================
	const testimonials = document.querySelectorAll('.testimonial')
	let current = 0
	function show(idx) {
		testimonials.forEach((t, i) => t.classList.toggle('active', i === idx))
	}
	function next() {
		current = (current + 1) % testimonials.length
		show(current)
	}
	function prev() {
		current = (current - 1 + testimonials.length) % testimonials.length
		show(current)
	}

	let timer = setInterval(next, 8000)
	function bump() {
		clearInterval(timer)
		timer = setInterval(next, 8000)
	}

	document.getElementById('nextTestimonial')?.addEventListener('click', () => {
		next()
		bump()
	})
	document.getElementById('prevTestimonial')?.addEventListener('click', () => {
		prev()
		bump()
	})
})
