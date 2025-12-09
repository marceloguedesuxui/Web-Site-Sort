const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');


if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu');
    });
}


if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu');
    });
}


const navLink = document.querySelectorAll('.nav__link');

function linkAction(){
    const navMenu = document.getElementById('nav-menu');
    
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));



function scrollHeader(){
    const header = document.getElementById('header');
   
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);



const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1200, // Slightly longer duration for smoother effect
    delay: 200,
    easing: 'ease-in-out' // Add easing for more sophisticated motion
});

// Hero Section
sr.reveal(`.hero__title`, { origin: 'top', delay: 300 });
sr.reveal(`.hero__description`, { origin: 'top', delay: 500 });
sr.reveal(`.hero__content .button`, { origin: 'bottom', delay: 700 });

// General Section Titles (appear from top)
sr.reveal(`.section__title, .section__title-1, .sort-evolution .section__subtitle`, { origin: 'top', interval: 100 });

// Features Section
sr.reveal(`.features__grid .feature__card`, { interval: 150, origin: 'bottom' });

// Tools Section


// How It Works Section
sr.reveal(`.how-it-works__container .step`, { interval: 150, origin: 'bottom' });

// Testimonials Section
sr.reveal(`.testimonials__container .testimonial__card`, { interval: 150, origin: 'left' });

// Resources Section
sr.reveal(`.resources__container .resource__card`, { interval: 150, origin: 'bottom' });

// Sort Evolution Section (metric cards already have some animation, but this provides a fallback/overall reveal)
sr.reveal(`.sort-evolution .metric-card`, { interval: 100, origin: 'bottom' });

// Footer Section (reveal each section individually)
sr.reveal(`.footer__section`, { interval: 100, origin: 'bottom' });
sr.reveal(`.footer__bottom`, { origin: 'bottom', delay: 200 });



document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


const sections = document.querySelectorAll('section[id]');

function scrollActive(){
    const scrollY = window.pageYOffset;

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        let sectionId = current.getAttribute('id');

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scrollActive);


const evolutionSection = document.querySelector('.sort-evolution');

const evolutionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (evolutionSection) {
    evolutionObserver.observe(evolutionSection);
}

const metricCards = document.querySelectorAll('.metric-card');

metricCards.forEach(card => {
    const tooltip = card.querySelector('.metric-tooltip');
    const beforeValue = parseInt(card.dataset.before, 10);
    const afterValue = parseInt(card.dataset.after, 10);
    const improvement = afterValue - beforeValue;

    tooltip.textContent = `+${improvement}% depois de usar o APPP SORT`;

    card.addEventListener('mouseenter', () => {
        card.classList.add('is-hovered');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('is-hovered');
    });
});

// Adiciona um evento de clique ao botão de download
const downloadButton = document.querySelector('.nav__button');
if (downloadButton) {
    downloadButton.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Download starting...');
    });
}


// CAROUSEL FUNCTIONALITY FOR .tools__grid
document.addEventListener('DOMContentLoaded', () => {
    const toolsGrid = document.querySelector('.tools__grid');
    if (!toolsGrid) {
        console.warn('tools__grid element not found. Carousel functionality will not be applied.');
        return;
    }

    const toolLogos = Array.from(toolsGrid.children);
    if (toolLogos.length === 0) {
        console.warn('No tool__logo elements found inside tools__grid. Carousel functionality may not work as expected.');
        return;
    }

    // Clone items for infinite scroll effect
    // We clone enough items to fill the grid at least once to ensure a smooth loop
    const initialContentWidth = toolsGrid.scrollWidth;
    let clonesNeeded = 0;
    while (toolsGrid.scrollWidth < (initialContentWidth * 2)) {
        toolLogos.forEach(item => {
            const clone = item.cloneNode(true);
            toolsGrid.appendChild(clone);
        });
        clonesNeeded++;
        if (clonesNeeded > 10) { // Safety break to prevent infinite loops in case of layout issues
            console.warn('Too many clones added, breaking to prevent performance issues.');
            break;
        }
    }


    let isDragging = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let animationFrameId;
    let animationPaused = false;

    const startDrag = (e) => {
        isDragging = true;
        toolsGrid.classList.add('dragging');
        startX = (e.pageX || e.touches[0].pageX) - toolsGrid.offsetLeft;
        scrollLeft = toolsGrid.scrollLeft;
        toolsGrid.style.animationPlayState = 'paused'; // Pause CSS animation
        animationPaused = true;
        cancelAnimationFrame(animationFrameId); // Stop any ongoing inertia scroll
    };

    const drag = (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent text selection and other default behaviors
        
        const x = (e.pageX || e.touches[0].pageX) - toolsGrid.offsetLeft;
        const walk = (x - startX) * 2; // Multiplier for faster scroll
        const newScrollLeft = scrollLeft - walk;

        // Calculate velocity for inertia
        velocity = newScrollLeft - toolsGrid.scrollLeft;
        toolsGrid.scrollLeft = newScrollLeft;
    };

    const endDrag = () => {
        isDragging = false;
        toolsGrid.classList.remove('dragging');
        
        // Resume CSS animation after a short delay or if there's no significant velocity
        if (Math.abs(velocity) < 5) { // If velocity is low, resume CSS animation
            toolsGrid.style.animationPlayState = 'running';
            animationPaused = false;
        } else {
            // Implement inertia scroll
            animationFrameId = requestAnimationFrame(inertiaScroll);
        }
    };

    const inertiaScroll = () => {
        if (Math.abs(velocity) > 0.5) {
            toolsGrid.scrollLeft += velocity;
            velocity *= 0.95; // Decelerate
            requestAnimationFrame(inertiaScroll);
        } else {
            // Once inertia stops, resume CSS animation
            toolsGrid.style.animationPlayState = 'running';
            animationPaused = false;
        }
        checkScrollPosition();
    };


    toolsGrid.addEventListener('mousedown', startDrag);
    toolsGrid.addEventListener('mouseleave', () => {
        if (isDragging) endDrag(); // End drag if mouse leaves while dragging
    });
    toolsGrid.addEventListener('mouseup', endDrag);
    toolsGrid.addEventListener('mousemove', drag);

    toolsGrid.addEventListener('touchstart', startDrag);
    toolsGrid.addEventListener('touchend', endDrag);
    toolsGrid.addEventListener('touchmove', drag);

    // This function ensures continuous loop when dragged manually
    const checkScrollPosition = () => {
        if (toolsGrid.scrollLeft <= 0) {
            toolsGrid.scrollLeft = toolsGrid.scrollWidth / 2; // Jump to the middle of the clones
        } else if (toolsGrid.scrollLeft >= toolsGrid.scrollWidth) {
            toolsGrid.scrollLeft = toolsGrid.scrollWidth / 2; // Jump to the middle of the clones
        }
    };

    // Adjust animation when window resizes to ensure smooth loop (optional)
    window.addEventListener('resize', () => {
        // Recalculate clones if layout drastically changes, or just ensure animation state
        if (!animationPaused) {
            toolsGrid.style.animationPlayState = 'running';
        }
    });

    // Ensure the initial animation starts correctly
    toolsGrid.style.animationPlayState = 'running';
});