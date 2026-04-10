document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    
    const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgolojae";

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. Get Data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // 2. Simple Validation
        if (!name || !email || !message) {
            alert('Please fill in Name, Email, and Message.');
            return;
        }
        
        // Message Length Validation
        if (message.length > 1000) {
            alert('Your message is too long. Please keep it under 1000 characters.');
            return;
        }

        // Basic Email Format Validation (Checks for @ and .)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address format.');
            return;
        }

        // Collect Services
        const selectedServices = [];
        document.querySelectorAll('input[name="service"]:checked').forEach((checkbox) => {
            selectedServices.push(checkbox.value);
        });

        if (selectedServices.length === 0) {
            alert('Please select at least one service.');
            return;
        }

        // 3. Prepare Data for Sending
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("message", message);
        formData.append("services", selectedServices.join(", "));
        // This makes the subject line in your inbox look nice
        formData.append("_subject", "COMMISSION REQUEST from " + name);

        // 4. Send Email Silently (AJAX)
        try {
            // Show loading state
            submitBtn.innerHTML = '<span class="text-sm tracking-widest uppercase">Sending...</span>';
            submitBtn.disabled = true;

            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success!
                alert('Request sent successfully! I will contact you soon.');
                form.reset(); // Clear the form
            } else {
                // Error from service
                alert('There was a problem. Try again later please.');
            }
        } catch (error) {
            // Network error
            alert('Network error. Please check your connection.');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});