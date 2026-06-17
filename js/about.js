const canvas = document.getElementById("spiderCanvas");
const ctx = canvas.getContext("2d");



canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const numBalls = 20;
const connectionsDistance = 250;

function getRandomRedColor() {
    const r = 200 + Math.random() * 55;
    const g = Math.random() * 50;
    const b = Math.random() * 50;
    return `rgb(${r}, ${g}, ${b})`;
}

for (let i = 0; i < numBalls; i++) {
    balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 50 + 20,
        speedX: (Math.random() - 0.5) * 3.5,
        speedY: (Math.random() - 0.5) * 3.5,
        color: getRandomRedColor(),
        pulse: Math.random() * 0.02 + 0.01
    });
}

function drawBall(ball) {
    ctx.fillStyle = ball.color;
    ctx.shadowColor = ball.color;
    ctx.shadowBlur = 15;
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}
function drawConnections() { 
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let dx = balls[i].x - balls[j].x;
            let dy = balls[i].y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionsDistance) {
                ctx.save(); // Salva o estado do contexto
                
                ctx.lineWidth = 4;
                ctx.strokeStyle = "rgba(255, 0, 0, 0.2)"; 
                
                ctx.shadowBlur = 100;
                ctx.shadowColor = "rgba(235, 23, 23, 0.8)";

                ctx.beginPath();
                ctx.moveTo(balls[i].x, balls[i].y);
                ctx.lineTo(balls[j].x, balls[j].y);
                ctx.stroke();

                ctx.restore(); 
            }
        }
    }
}



function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let ball of balls) {
        ball.x += ball.speedX;
        ball.y += ball.speedY;
        ball.radius += Math.sin(Date.now() * ball.pulse) * 0.5;

        if (ball.x + ball.radius < 0) ball.x = canvas.width + ball.radius;
        if (ball.x - ball.radius > canvas.width) ball.x = -ball.radius;
        if (ball.y + ball.radius < 0) ball.y = canvas.height + ball.radius;
        if (ball.y - ball.radius > canvas.height) ball.y = -ball.radius;

        drawBall(ball);
    }

    drawConnections();
    requestAnimationFrame(update);
}
update();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".hobby, .text-content").forEach(element => {
    observer.observe(element);
});

const style = document.createElement('style');
style.innerHTML = `
    .hobby, .text-content {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .hobby.visible, .text-content.visible {
        opacity: 1;
        transform: translateY(0);
    }
    .hobby img {
        transition: transform 0.3s ease;
    }
    .hobby img:hover {
        transform: scale(1.05);
        animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
        0% {
            transform: scale(1.05);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

const hobbyImages = document.querySelectorAll(".hobby img");
hobbyImages.forEach(img => {
    img.addEventListener("mouseenter", () => {
        img.style.transition = "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out"; 
        img.style.boxShadow = "0 0 15px rgba(255, 7, 58, 0.8), 0 0 30px rgba(255, 7, 58, 0.8)"; 
    });
    img.addEventListener("mouseleave", () => {
        img.style.transform = "scale(1)"; 
        img.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)"; 
    });
});



const skillDetails = {
    HTML5: {
        title: "HTML5",
        description: "HTML5 é a última versão da linguagem de marcação da web, com foco em tornar os sites mais interativos e responsivos.",
        progress: "45%"
    },
    CSS: {
        title: "CSS",
        description: "CSS é uma linguagem usada para descrever o estilo de um documento HTML, permitindo layouts responsivos e animações.",
        progress: "40%"
    },
    JS: {
        title: "JavaScript",
        description: "JavaScript é a linguagem de programação usada para criar interatividade em sites e aplicativos web.",
        progress: "55%"
    },
    BACKEND: {
        title: "Backend",
        description: "Backend envolve o desenvolvimento de servidores e bancos de dados, essenciais para a lógica de negócios e armazenamento de dados.",
        progress: "75%"
    },
    DATABASE: {
        title: "Banco de Dados",
        description: "Bancos de dados são utilizados para armazenar e gerenciar informações de maneira estruturada, utilizando SQL ou NoSQL.",
        progress: "50%"
    },
    REACT_NATIVE: {
        title: "React Native",
        description: "React Native é um framework para o desenvolvimento de aplicativos móveis nativos utilizando JavaScript e React.",
        progress: "30%"
    },
    GITHUB: {
        title: "GitHub",
        description: "GitHub é uma plataforma de hospedagem de código-fonte e versionamento, permitindo a colaboração em projetos de software.",
        progress: "50%"
    },
    FRAMEWORKS: {
        title: "Frameworks",
        description: "Frameworks são conjuntos de ferramentas que agilizam o desenvolvimento de aplicativos e sites, como Angular, React, etc.",
        progress: "25%"
    }
};

const skillIcons = document.querySelectorAll('.skill');
const skillTitle = document.getElementById('skill-title');
const skillDescription = document.getElementById('skill-description');
const skillBars = document.querySelectorAll('.skill-bar, .frame-bar');
const btnOverview = document.getElementById('btnOverview')
const frameworksSection = document.getElementById('frameworks-section');
const frameworksButton = document.getElementById('btnFrame');
const aboutMeSection = document.getElementById('skills');
let alreadyTriggered = false;

// Esconde todas as barras
const hideAllSkillBars = () => {
    skillBars.forEach(bar => {
        bar.style.display = "none";
    });
};

// Anima barra com base no valor
const animateSkillBar = (bar, progress) => {
    const fill = bar.querySelector(".progress-fill");
    if (!fill) return;

    fill.style.animation = "none";
    void fill.offsetWidth;
    fill.style.setProperty('--progress-width', progress);
    fill.style.animation = `fillBar 1.5s ease forwards`;
    fill.style.width = progress;
    fill.dataset.animated = "true";
};

// Botão "ALL" ou gatilho por scroll/reload
const ShowAllskills = () => {
    skillTitle.textContent = "Visão Geral";
    skillDescription.textContent = "Aqui você pode ver um resumo sobre todas as minhas habilidades";
    btnOverview.classList.remove('visible');
    frameworksSection.classList.remove('visible');

    skillBars.forEach(bar => {
        const label = bar.querySelector('label');
        const progressDiv = bar.querySelector('.progress-fill');
        const percentSpan = bar.querySelector('.progress-percent'); // <- novo
        bar.style.display = "block";
    
        const skillKey = Object.keys(skillDetails).find(key => skillDetails[key].title === label.textContent.trim());
    
        let progressValue;
        if (skillKey) {
            progressValue = skillDetails[skillKey].progress;
        } else if (percentSpan) {
            progressValue = percentSpan.textContent.trim();
        } else {
            progressValue = "50%"; 
        }
    
        if (progressDiv) {
            progressDiv.dataset.animated = "";
            animateSkillBar(bar, progressValue);
        }
    });
    
};

skillIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const skillName = icon.dataset.skill;
        if (!skillDetails[skillName]) return;

        const skillData = skillDetails[skillName];

        skillTitle.textContent = skillData.title;
        skillDescription.textContent = skillData.description;
        btnOverview.classList.add('visible');
        hideAllSkillBars();

        skillBars.forEach(bar => {
            const label = bar.querySelector('label');
            const percentSpan = bar.querySelector('.progress-percent'); 
            if (label.textContent.trim() === skillData.title) {
                bar.style.display = "block";
                const progressValue = skillData.progress || percentSpan?.textContent.trim() || "50%";
                
            }
        });
        

        if (skillName !== "FRAMEWORKS") {
            frameworksSection.classList.remove('visible');
        }
    });
});

// Hover de ícones
skillIcons.forEach(icon => {
    const originalImage = icon.querySelector('img').src;
    const hoverImage = icon.dataset.hoverImage;
    let hoverTimeout, leaveTimeout;

    icon.addEventListener('mouseenter', () => {
        clearTimeout(leaveTimeout);
        hoverTimeout = setTimeout(() => {
            icon.querySelector('img').src = hoverImage;
        }, 100);
    });

    icon.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        leaveTimeout = setTimeout(() => {
            icon.querySelector('img').src = originalImage;
            icon.style.backgroundColor = '';
        }, 100);
    });
});

// Botão "Frameworks"
frameworksButton.addEventListener('click', () => {
    hideAllSkillBars();
    frameworksSection.classList.add('visible');

   // Mostrar todas as barras dentro da seção de frameworks
const frameBars = frameworksSection.querySelectorAll('.frame-bar');
frameBars.forEach(bar => {
    bar.style.display = "block"; // <- ESSENCIAL para aparecer
    const label = bar.querySelector('label');
    const progressFill = bar.querySelector('.progress-fill');
    const spanPercent = bar.querySelector('.progress-percent');

    if (progressFill && spanPercent) {
        const percentValue = spanPercent.textContent.trim();
        progressFill.dataset.animated = ""; // reset
        animateSkillBar(bar, percentValue);
    }
});

});


// Observador de rolagem
const observerSkills = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !alreadyTriggered) {
            ShowAllskills();
            alreadyTriggered = true;
        }
    });
}, { threshold: 0.4 });

observerSkills.observe(aboutMeSection);

// Dispara animação se a seção já estiver visível no load
window.addEventListener('load', () => {
    setTimeout(() => {
        const rect = aboutMeSection.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom >= 0;

        if (inViewport && !alreadyTriggered) {
            ShowAllskills();
            alreadyTriggered = true;
        }
    }, 100);
});
