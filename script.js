document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            // Optional: Add a class for more complex hover effects in CSS
            // item.classList.add('hovered');
            console.log(`Hovering over: ${item.textContent}`);
        });

        item.addEventListener('mouseout', () => {
            // Optional: Remove the class
            // item.classList.remove('hovered');
            console.log(`Mouse out from: ${item.textContent}`);
        });
    });

    // You can add more interactive elements here, e.g., smooth scrolling,
    // a simple "typewriter" effect for the tagline, etc.
});
