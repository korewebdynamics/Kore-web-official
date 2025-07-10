document.addEventListener("DOMContentLoaded", () => {
    const statBoxes = document.querySelectorAll(".stat-box");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.2, 
        }
    );

    statBoxes.forEach((box) => {
        observer.observe(box);
    });
});