interface ConfettiPiece extends HTMLImageElement {
    animationDuration: string;
}

class ConfettiManager {
    private logoClickCount: number = 0;
    private readonly CLICK_THRESHOLD: number = 5;
    private readonly CONFETTI_COUNT: number = 30;
    private readonly BASE_SCALE_MIN: number = 20; // Увеличено в 5 раз (было 1)
    private readonly BASE_SCALE_MAX: number = 40; // Увеличено в 5 раз (было 5)
    private readonly ANIMATION_DURATION_MIN: number = 1;
    private readonly ANIMATION_DURATION_MAX: number = 2;
    private readonly STAGGER_DELAY: number = 50;

    constructor() {
        this.initializeLogo();
    }

    private initializeLogo(): void {
        const logo = document.getElementById('error-logo') as HTMLImageElement;
        if (logo) {
            logo.addEventListener('click', () => this.handleLogoClick());
        }
    }

    private handleLogoClick(): void {
        this.logoClickCount++;
        
        if (this.logoClickCount === this.CLICK_THRESHOLD) {
            this.createConfetti();
            this.logoClickCount = 0; // Reset counter
        }
    }

    private createConfetti(): void {
        const confettiContainer = document.getElementById('confetti-container');
        if (!confettiContainer) {
            console.error('Confetti container not found');
            return;
        }

        for (let i = 0; i < this.CONFETTI_COUNT; i++) {
            setTimeout(() => {
                this.createConfettiPiece(confettiContainer);
            }, i * this.STAGGER_DELAY);
        }
    }

    private createConfettiPiece(container: HTMLElement): void {
        const confetti = document.createElement('img') as ConfettiPiece;
        confetti.src = '/static/assets/img/image.png';
        confetti.className = 'confetti-piece';
        
        // Random starting position at top of screen
        const startX = Math.random() * window.innerWidth;
        confetti.style.left = `${startX}px`;
        confetti.style.top = '-50px';
        
        // Random rotation and scale (увеличено в 5 раз)
        const rotation = Math.random() * 360;
        const scale = this.BASE_SCALE_MIN + Math.random() * (this.BASE_SCALE_MAX - this.BASE_SCALE_MIN);
        confetti.style.transform = `rotate(${rotation}deg) scale(${scale})`;
        
        // Random animation duration
        const duration = this.ANIMATION_DURATION_MIN + Math.random() * (this.ANIMATION_DURATION_MAX - this.ANIMATION_DURATION_MIN);
        confetti.style.animationDuration = `${duration}s`;
        
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, duration * 1000 + 500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ConfettiManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ConfettiManager();
    });
} else {
    new ConfettiManager();
}
