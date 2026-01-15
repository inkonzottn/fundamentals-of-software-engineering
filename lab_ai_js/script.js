(function() {
    // 1. Створюємо та налаштовуємо полотно
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.innerHTML = ''; // Очищуємо сторінку для фону
    document.body.appendChild(canvas);

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.backgroundColor = '#020205'; // Дуже темне синє небо
    canvas.style.zIndex = '9999';

    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // 2. Статичні зорі на фоні (для ефекту глибини)
    const backgroundStars = [];
    for (let i = 0; i < 200; i++) {
        backgroundStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5,
            opacity: Math.random()
        });
    }

    // 3. Клас для падаючих зірок
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height; // Поява зверху
            this.speed = Math.random() * 1.5 + 1; // Повільна швидкість
            this.length = Math.random() * 100 + 50; // Довгий хвіст
            this.angle = Math.PI / 4; // Падіння під кутом
            this.opacity = 0; // Починає з прозорості
        }

        update() {
            this.x += this.speed;
            this.y += this.speed;

            // Ефект появи та зникнення
            if (this.opacity < 1) this.opacity += 0.01;

            if (this.y > height || this.x > width) {
                this.reset();
            }
        }

        draw() {
            // Малюємо хвіст через градієнт
            const grad = ctx.createLinearGradient(
                this.x, this.y, 
                this.x - Math.cos(this.angle) * this.length, 
                this.y - Math.sin(this.angle) * this.length
            );
            
            // Голова зірки яскрава, хвіст зникає
            grad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            grad.addColorStop(0.1, `rgba(173, 216, 230, ${this.opacity * 0.6})`); // Блакитний відтінок
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * this.length, 
                this.y - Math.sin(this.angle) * this.length
            );
            ctx.stroke();

            // Додаємо маленьке сяйво "голові" зірки
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Ініціалізація зорепаду
    const shootingStars = Array.from({ length: 8 }, () => new ShootingStar());

    function animate() {
        // Замість повного очищення можна було б робити шлейф, 
        // але для зірок краще чистий фон + градієнтні хвости
        ctx.fillStyle = '#020205';
        ctx.fillRect(0, 0, width, height);

        // Малюємо нерухоме небо
        backgroundStars.forEach(s => {
            ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Малюємо падаючі зорі
        shootingStars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
    console.log("%c🌌 Нічне небо розгорнуто. Насолоджуйтесь спокоєм.", "color: #add8e6; font-size: 16px; font-weight: bold;");
})();