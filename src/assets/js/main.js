// Mobile alphabet dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileDropdown = document.querySelector('.mobile-alphabet-dropdown');
    if (mobileDropdown) {
        mobileDropdown.addEventListener('change', function() {
            const selectedValue = this.value;
            if (selectedValue) {
                window.location.hash = selectedValue;
                const targetElement = document.querySelector(selectedValue);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
}); 