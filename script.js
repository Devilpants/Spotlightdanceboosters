// script.js
document.addEventListener("DOMContentLoaded", function () {
  //add event listener for DOMContentLoaded, load details from files
  fetch('data/hero.txt')
    .then(response => response.text())
    .then(data => updateHeroContent(data));
  fetch('data/about.txt')
    .then(response => response.text())
    .then(data => updateAboutContent(data));
  fetch('data/events.txt')
    .then(response => response.text())
    .then(data => updateEventsContent(data));
});

function updateHeroContent(content) {
    console.log('Updating hero content with:', content);
    // Update hero section with content from hero.txt
    const container = document.getElementById('hero-container');
    container.innerHTML = '';
    const heros = parseHeroContent(content);
    heros.forEach(hero => {
        const heroDiv = document.createElement('div');
        heroDiv.className = `level ${hero.level.toLowerCase()}`;
        heroDiv.innerHTML = `
            <h3>${hero.name}</h3>
            <p>${hero.message}</p>
        `;
        container.appendChild(heroDiv);
    });
}

function parseHeroContent(content) {
    const heros = [];
    const lines = content.split('\n').filter(line => line.trim());
    let currentHero = {};
    
    lines.forEach(line => {
        if (line.startsWith('NAME:')) {
            if (currentHero.name) heros.push(currentHero);
            currentHero = { name: line.replace('NAME:', '').trim() };
        } else if (line.startsWith('LEVEL:')) {
            currentHero.level = line.replace('LEVEL:', '').trim(); 
        } else if (line.startsWith('MESSAGE:')) {
            currentHero.message = line.replace('MESSAGE:', '').trim();
        } else if (currentHero.message && line.trim()) {
            currentHero.message += ' ' + line.trim();
        }
    });
    
    if (currentHero.name) heros.push(currentHero);
    if (heros.length === 0) {
        // If no heros found, hide the hero section
        const heroSection = document.getElementById('heros');
        if (heroSection) {
            heroSection.style.display = 'none';
        }
    }
    return heros;
}

function updateAboutContent(content) {
    console.log('Updating about content with:', content);
    // Update about section with content from about.txt
    const lines = content.split('\n').filter(line => line.trim());
    let currentSection = '';
    let currentText = '';
    
    lines.forEach(line => {
        if (line.startsWith('MISSION:')) {
            if (currentSection && currentText) updateAboutSection(currentSection, currentText);
            currentSection = 'mission';
            currentText = line.replace('MISSION:', '').trim();
        } else if (line.startsWith('ACTIVITIES:')) {
            if (currentSection && currentText) updateAboutSection(currentSection, currentText);
            currentSection = 'activities';
            currentText = line.replace('ACTIVITIES:', '').trim();
        } else if (line.startsWith('INVOLVEMENT:')) {
            if (currentSection && currentText) updateAboutSection(currentSection, currentText);
            currentSection = 'involvement';
            currentText = line.replace('INVOLVEMENT:', '').trim();
        } else if (currentSection) {
            currentText += ' ' + line.trim();
        }
    });
    
    if (currentSection && currentText) updateAboutSection(currentSection, currentText);
}

function updateAboutSection(section, text) {
    const elementId = section + '-text';
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

function updateEventsContent(content) {
    const container = document.getElementById('events-container');
    const events = parseEvents(content);
    if (events.length === 0) {
        // If no events found, add a message
        container.innerHTML = '<p>Check back later for upcoming events!</p>';
        return;
    }
    container.innerHTML = '';
    events.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event-item';
        eventDiv.innerHTML = `
            <div class="event-date">${event.date}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-description">${event.description}</div>
        `;
        container.appendChild(eventDiv);
    });
}

function parseEvents(content) {
    const events = [];
    const lines = content.split('\n').filter(line => line.trim());
    let currentEvent = {};
    
    lines.forEach(line => {
        if (line.startsWith('DATE:')) {
            if (currentEvent.date) events.push(currentEvent);
            currentEvent = { date: line.replace('DATE:', '').trim() };
        } else if (line.startsWith('TITLE:')) {
            currentEvent.title = line.replace('TITLE:', '').trim();
        } else if (line.startsWith('DESCRIPTION:')) {
            currentEvent.description = line.replace('DESCRIPTION:', '').trim();
        } else if (currentEvent.description && line.trim()) {
            currentEvent.description += ' ' + line.trim();
        }
    });
    
    if (currentEvent.date) events.push(currentEvent);
    return events;
}

function updateContactContent(content) {
    document.getElementById('contact-info').innerHTML = content.replace(/\n/g, '<br>');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});