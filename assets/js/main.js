/* ============================================================
   CASCARA LUXE — Main JavaScript
   Handles Loader, Navigation, Theme Toggles, and Animations
   ============================================================ */

// Set saved theme and RTL direction immediately on script execution to prevent layout flashes
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const savedDir = localStorage.getItem('dir') || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
})();


document.addEventListener('DOMContentLoaded', () => {
    
    // ─── 2. Header Scroll Effect ───
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header && window.scrollY > 50) {
            header.classList.add('scrolled');
        } else if (header) {
            header.classList.remove('scrolled');
        }
    });

    // ─── 3. Mobile Menu Toggle ───
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            
            // Prevent body scroll when menu is open
            if (mobileMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'visible';
            }
        });
    }

    // ─── 4. Theme Toggle (Light/Dark) ───
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const appliedTheme = document.documentElement.getAttribute('data-theme');
    
    themeToggles.forEach(toggle => {
        const icon = toggle.querySelector('i');
        if (appliedTheme === 'dark' && icon) {
            icon.classList.replace('ri-moon-line', 'ri-sun-line');
        }

        toggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (icon) {
                if (newTheme === 'dark') {
                    icon.classList.replace('ri-moon-line', 'ri-sun-line');
                } else {
                    icon.classList.replace('ri-sun-line', 'ri-moon-line');
                }
            }
        });
    });

    // ─── 5. RTL Toggle ───
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        });
    });

    // ─── 6. Scroll Reveal Animation ───
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < (window.innerHeight * 0.85);
            if (isVisible) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // ─── 7. Calculator Logic (Shop Page) ───
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const type = document.getElementById('calc-type').value;
            const qty = parseInt(document.getElementById('calc-qty').value) || 0;
            const freq = document.getElementById('calc-freq').value;
            const resultDisplay = document.getElementById('calc-price');
            const savingsDisplay = document.getElementById('calc-savings');
            
            let baseFee = 45; // Compounding lab fee
            let perUnitCost = 0.50; // Active ingredient cost per g/mL/unit
            
            if (type === 'dermatology') {
                baseFee = 45;
                perUnitCost = 0.50;
            } else if (type === 'hrt') {
                baseFee = 55;
                perUnitCost = 0.75;
            } else if (type === 'pain') {
                baseFee = 65;
                perUnitCost = 0.60;
            } else if (type === 'pediatric') {
                baseFee = 40;
                perUnitCost = 0.40;
            } else if (type === 'veterinary') {
                baseFee = 35;
                perUnitCost = 0.45;
            }

            let total = baseFee + (perUnitCost * qty);
            let discount = 0;

            if (freq === 'refill') discount = 0.10; // Auto-refill discount
            if (freq === 'bulk') discount = 0.20; // Clinic/Provider bulk discount

            const finalPrice = total * (1 - discount);
            const savings = total - finalPrice;

            resultDisplay.textContent = `$${finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
            if (savings > 0) {
                savingsDisplay.textContent = `You save $${savings.toFixed(2)} with this program!`;
                savingsDisplay.style.color = 'var(--gold)';
            } else {
                savingsDisplay.textContent = '';
            }
        });
    }

    // ─── 8. Password Toggle ───
    const passToggles = document.querySelectorAll('.password-toggle');
    passToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('ri-eye-line', 'ri-eye-off-line');
            } else {
                input.type = 'password';
                icon.classList.replace('ri-eye-off-line', 'ri-eye-line');
            }
        });
    });
    // ─── 9. Back to Top Button ───
    const backToTop = document.createElement('div');
    backToTop.id = 'backToTop';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="ri-arrow-up-line"></i>';
    backToTop.setAttribute('title', 'Back to Top');
    backToTop.setAttribute('aria-label', 'Back to Top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
