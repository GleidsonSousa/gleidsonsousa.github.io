/* =========================================================
ELEMENTOS
========================================================= */

const textElement = document.querySelector(".typing-text");

const overlay = document.getElementById("intro-overlay");
const closeBtn = document.getElementById("close-btn");
const openWarningBtn = document.getElementById("open-warning");

const canvas = document.getElementById("inkCanvas");
const ctx = canvas.getContext("2d");

/* =========================================================
TEXTO DIGITANDO
========================================================= */

const text = "BackEnd Developer";

let index = 0;
let isDeleting = false;

function typeEffect() {


if (isDeleting) {

    textElement.textContent = text.substring(0, index--);

} else {

    textElement.textContent = text.substring(0, index++);

}

if (index === text.length + 1) {

    isDeleting = true;

    setTimeout(typeEffect, 1500);

} else if (index === 0) {

    isDeleting = false;

    textElement.innerHTML = "&nbsp;";

    setTimeout(typeEffect, 500);

} else {

    setTimeout(typeEffect, 60);

}


}

typeEffect();

/* =========================================================
OVERLAY / AVISO
========================================================= */

if (overlay && closeBtn && openWarningBtn) {

const alreadyRead = localStorage.getItem("portfolioWarningRead");

let timer = null;

/* MOSTRAR */

function showOverlay(firstVisit = false) {

    overlay.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    /* PRIMEIRA VISITA */

    if (firstVisit) {

        startCloseCountdown();

    } 
    
    /* REABERTURA */

    else {

        if (timer) {

            clearInterval(timer);

        }

        closeBtn.disabled = false;

        closeBtn.classList.add("enabled");

        closeBtn.textContent = "Fechar";

    }

}

/* ESCONDER */

function hideOverlay() {

    overlay.classList.add("hidden");

    document.body.style.overflow = "auto";

}

/* CONTADOR */

function startCloseCountdown() {

    let timeLeft = 5;

    closeBtn.disabled = true;

    closeBtn.classList.remove("enabled");

    closeBtn.textContent = `Fechar (${timeLeft})`;

    if (timer) {

        clearInterval(timer);

    }

    timer = setInterval(() => {

        timeLeft--;

        closeBtn.textContent = `Fechar (${timeLeft})`;

        if (timeLeft <= 0) {

            clearInterval(timer);

            closeBtn.disabled = false;

            closeBtn.classList.add("enabled");

            closeBtn.textContent = "Fechar";

        }

    }, 1000);

}

/* PRIMEIRA VISITA */

if (!alreadyRead) {

    showOverlay(true);

} else {

    hideOverlay();

}

/* FECHAR */

closeBtn.addEventListener("click", () => {

    localStorage.setItem("portfolioWarningRead", "true");

    hideOverlay();

});

/* REABRIR */

openWarningBtn.addEventListener("click", () => {

    showOverlay(false);

});

}


/* =========================================================
CANVAS PARTICLES
========================================================= */

let particles = [];

function resizeCanvas() {


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

/* =========================================================
CLASSE PARTICLE
========================================================= */

class Particle {


constructor(x, y) {

    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.radius = Math.random() * 3 + 1;

    this.baseColor =
        Math.random() < 0.5
            ? "rgba(61, 59, 59, 0.1)"
            : Math.random() < 0.8
            ? "rgba(255, 0, 0, 0.34)"
            : "rgba(252, 4, 4, 0.3)";

}

update(mouse) {

    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {

        const force = (100 - distance) * 0.01;

        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;

    }

    this.vx *= 0.95;
    this.vy *= 0.95;

    this.x += this.vx;
    this.y += this.vy;

    /* LOOP DA TELA */

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;

    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

}

draw() {

    ctx.beginPath();

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.fillStyle = this.baseColor;

    ctx.fill();

}


}

/* =========================================================
INICIALIZA PARTICULAS
========================================================= */

function initParticles() {


for (let i = 0; i < 1500; i++) {

    particles.push(

        new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        )

    );

}


}

initParticles();

/* =========================================================
MOUSE
========================================================= */

const mouse = {


x: 0,
y: 0


};

document.addEventListener("mousemove", (e) => {


mouse.x = e.clientX;
mouse.y = e.clientY;


});

/* =========================================================
ANIMAÇÃO
========================================================= */

function animate() {

ctx.fillStyle = "rgba(0, 0, 0, 0.05)";

ctx.fillRect(0, 0, canvas.width, canvas.height);

particles.forEach((particle) => {

    particle.update(mouse);

    particle.draw();

});

requestAnimationFrame(animate);

}

animate();

/* =========================================================
RESIZE EXTRA
========================================================= */

window.addEventListener("resize", () => {


if (typeof morpher !== "undefined") {

    morpher.handleResize();

}


});
