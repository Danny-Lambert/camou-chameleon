document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    if(form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            const data = new FormData(event.target);
            
            // Standard fetch call for Formspree
            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "Thanks! We'll be in touch soon.";
                    status.style.color = "#e2b808";
                    form.reset();
                } else {
                    status.innerHTML = "Oops! There was a problem submitting your form.";
                }
            }).catch(error => {
                status.innerHTML = "Oops! There was a problem submitting your form.";
            });
        });
    }
});