// ================= 全局粒子网络引擎 =================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let mouse = { x: null, y: null, radius: 200 };

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', initCanvas);
    initCanvas();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        draw() {
            const style = getComputedStyle(document.body);
            ctx.fillStyle = style.getPropertyValue('--particle-color').trim();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {
            if (this.x > width || this.x < 0) this.vx *= -1;
            if (this.y > height || this.y < 0) this.vy *= -1;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 3;
                const directionY = forceDirectionY * force * 3;
                this.x -= directionX;
                this.y -= directionY;
            }

            this.x += this.vx;
            this.y += this.vy;
            this.draw();
        }
    }

    function connect() {
        const style = getComputedStyle(document.body);
        const connectColor = style.getPropertyValue('--particle-connect').trim();
        
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) + 
                               ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                if (distance < (width/9) * (height/9)) {
                    ctx.strokeStyle = connectColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        let numberOfParticles = (width * height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(particle => {
            particle.update();
        });
        connect();
    }
    animate();
}

// ================= 滚动监听 (Scroll Observer) =================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// ================= 昼夜切换 =================
const toggleBtn = document.getElementById('themeToggle');
const body = document.body;

// 检查本地存储的主题
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ================= 二维码放大查看功能 =================
const modal = document.getElementById('qrcodeModal');
if (modal) {
    const modalImage = document.getElementById('modalImage');
    const modalLabel = document.getElementById('modalLabel');
    
    window.openModal = function(imageSrc, label) {
        modalImage.src = imageSrc;
        modalLabel.textContent = label;
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        document.body.style.overflow = 'hidden';
    }
    
    window.closeModal = function() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = 'auto';
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ================= 按钮流光效果 =================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
    });
});
