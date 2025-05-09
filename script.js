
document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('nav a[href^="#"], .cta-button[href^="#"]').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });


                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            } else {
                console.warn(`Target element not found: ${targetId}`);

                window.location.href = this.href;
            }
        });
    });


    document.querySelectorAll('.faq-question')?.forEach(question => {
        question.addEventListener('click', function () {
            const item = this.parentNode;
            const isOpening = !item.classList.contains('active');

            if (isOpening) {
                document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                    if (activeItem !== item) {
                        activeItem.classList.remove('active');
                    }
                });
            }

            item.classList.toggle('active');

            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.setAttribute('aria-hidden', !isOpening);
                this.setAttribute('aria-expanded', isOpening);
            }
        });
    });


    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            if (!validateContactForm()) {
                event.preventDefault();
            }
        });
    }
});


function validateContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return true;

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const errorContainer = document.getElementById('form-errors') || createErrorContainer();


    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';


    const errors = [];

    if (!nameField?.value.trim()) {
        errors.push('Please enter your name');
        nameField?.classList.add('error');
    } else {
        nameField?.classList.remove('error');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailField?.value.trim()) {
        errors.push('Please enter your email');
        emailField?.classList.add('error');
    } else if (!emailPattern.test(emailField.value)) {
        errors.push('Please enter a valid email address');
        emailField?.classList.add('error');
    } else {
        emailField?.classList.remove('error');
    }

    if (!messageField?.value.trim()) {
        errors.push('Please enter your message');
        messageField?.classList.add('error');
    } else {
        messageField?.classList.remove('error');
    }


    if (errors.length > 0) {
        errorContainer.innerHTML = errors.map(error =>
            `<div class="error-item"><i class="fas fa-exclamation-circle"></i> ${error}</div>`
        ).join('');
        errorContainer.style.display = 'block';

        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return false;
    }

    return true;
}


function createErrorContainer() {
    const container = document.createElement('div');
    container.id = 'form-errors';
    container.style.cssText = `
        display: none;
        background: #ffeeee;
        border-left: 4px solid #e74c3c;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
    `;

    const form = document.getElementById('contact-form');
    form?.insertBefore(container, form.firstChild);

    return container;
}


function initMobileMenu() {
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.setAttribute('aria-label', 'Toggle navigation');

    const header = document.querySelector('header');
    const nav = document.querySelector('nav ul');

    if (header && nav) {
        header.appendChild(menuButton);

        menuButton.addEventListener('click', function () {
            nav.classList.toggle('active');
            this.setAttribute('aria-expanded', nav.classList.contains('active'));
        });
    }
}


if (window.innerWidth < 768) {
    initMobileMenu();
}

window.addEventListener('resize', function () {
    if (window.innerWidth < 768 && !document.querySelector('.mobile-menu-button')) {
        initMobileMenu();
    }
});