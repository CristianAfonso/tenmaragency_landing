document.addEventListener('DOMContentLoaded', function() {
    let prevScrollPos = window.scrollY;
    const nav = document.querySelector('nav');
    const heightOffset = -nav.offsetHeight;

    const hamburgerMenu = document.getElementById('hamburger-button');
    const menu = document.getElementById('navbar-header');

    window.onscroll = function() {
      const currentScrollPos = window.scrollY;
      if (prevScrollPos < currentScrollPos) {
        nav.style.top = `${heightOffset}px`;
        hamburgerMenu.classList.remove('active');
        menu.classList.remove('visible');
      } 
      else {
        nav.style.top = "0";
      }
      prevScrollPos = currentScrollPos;
    };
    
    const sections = document.querySelectorAll('section');
    const hrs = document.querySelectorAll('hr');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
    hrs.forEach((hr) => {
      observer.observe(hr)
    })

    document.querySelectorAll('.accordion-header').forEach(button => {
      button.addEventListener('click', () => {
        const accordionItem = button.parentElement;
        const isActive = accordionItem.classList.contains('active');
    
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('active');
          item.querySelector('.accordion-content').style.maxHeight = 0;
        });
    
        if (!isActive) {
          accordionItem.classList.add('active');
          accordionItem.querySelector('.accordion-content').style.maxHeight = accordionItem.querySelector('.accordion-content').scrollHeight + 'px';
        }
      });
    });
    


    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active');
      menu.classList.toggle('visible');
    });

    const navLinks = document.getElementById('navbar-header').querySelectorAll('a');
    navLinks.forEach(enlace => {
        enlace.addEventListener('click', function(event) {
            event.preventDefault();
            hamburgerMenu.classList.remove('active');
            menu.classList.remove('visible');
            const targetId = enlace.getAttribute('href');
            if(targetId.includes('#')){
              const targetElement = document.querySelector(targetId);
              setTimeout(() => {
                  if (targetElement) {
                      targetElement.scrollIntoView({
                          behavior: 'smooth'
                      });
                  }
              }, 500);
            }else{
              window.location.href = targetId;
            }
        });
    });
    
  const formularios = document.querySelectorAll('form');
  formularios.forEach(formulario => {
      formulario.addEventListener('submit', (event) => {
          event.preventDefault(); 
  
          const formData = new FormData(formulario);
          const name = escapeHTML(formData.get('nombre'));
          const email = escapeHTML(formData.get('email'));
          const phone = escapeHTML(formData.get('telefono'));
          const message = escapeHTML(formData.get('message'));
          const lang = escapeHTML(formulario.classList[0])
          sendData(name, email, phone, message, lang)
      });
  });
});

function escapeHTML(input) {
  return input.replace(/[&<>"'\/]/g, function (char) {
      const entityMap = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': '&quot;',
          "'": '&#39;',
          "/": '&#x2F;'
      };
      return entityMap[char];
  });
}
function validateForm(name, email, phone) {
  let validated = true;
  var nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) {
      document.getElementById("name_validation").style.display = "inline-block";
      validated = false;
  }else{
      document.getElementById("name_validation").style.display = "none";
  }
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      document.getElementById("email_validation").style.display = "inline-block";
      validated = false;
  }else{
      document.getElementById("email_validation").style.display = "none";
  }
  var phoneRegex = /^\+?[0-9]{1,3}?[ -]?[0-9]{1,4}[ -]?[0-9]{1,4}[ -]?[0-9]{1,9}$/;
  if (!phoneRegex.test(phone)) {
      document.getElementById("phone_validation").style.display = "inline-block";
      validated = false;
  }else{
    document.getElementById("phone_validation").style.display = "none";
  }
  return validated;
}
function toggleLoadersAndButtons(){
  const loaders = document.querySelectorAll('.loader');
  const buttons = document.querySelectorAll('.submit-button');

  loaders.forEach((loader) => {
    loader.classList.toggle('hidden');
  })
  buttons.forEach((button) => {
    button.classList.toggle('hidden');
  })
}

function sendData(name, email, phone, message, lang) {
  const success_span = document.querySelectorAll('.success-submit-message');
  const error_span = document.querySelectorAll('.error-submit-message');
  if(!validateForm(name, email, phone)){
      console.log("error")
      return;
  }
  let data = new FormData();
  data.append("name", name);
  data.append("phone", phone);
  data.append("email", email);
  data.append("message", message);
  data.append("lang", lang);
  let xhr = new XMLHttpRequest();

  xhr.open("POST", "https://script.google.com/macros/s/AKfycbyelFMn-BUkxYe3qv2SV3228gqOQRwtbH0pqUu7u5DIIbJ-vlwy5_nYeIjceCXFhVJ2/exec");
  xhr.send(data);
  xhr.onload = function() {
    toggleLoadersAndButtons();
    if (xhr.status == 200) {
      error_span.forEach((error) => {
        error.classList.add('hidden');
      })
      success_span.forEach((success) => {
        success.classList.remove('hidden');
      })
    } else {
      success_span.forEach((success) => {
        success.classList.add('hidden');
      })
      error_span.forEach((error) => {
        error.classList.remove('hidden');
      })
    }
  }
  toggleLoadersAndButtons();
}