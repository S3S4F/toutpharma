import { useEffect, useRef } from 'react';

/**
 * Révélation au scroll : le contenu apparaît (fondu + remontée) quand il entre
 * dans le viewport. `delay` (ms) permet les cascades ; `as` change la balise.
 * `prefers-reduced-motion` est géré en CSS (.reveal devient statique).
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...props }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${className}`}
            style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
            {...props}
        >
            {children}
        </Tag>
    );
}
