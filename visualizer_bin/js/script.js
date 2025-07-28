document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const courseContent = document.getElementById('course-content');
    const welcomeScreen = document.querySelector('.welcome-screen');
    const homeLink = document.getElementById('home-link');
    const courseSearch = document.getElementById('course-search');
    const aboutUsLink = document.getElementById('about-us-link');

    const courseTitles = [
        "Gestión de Proyectos de Investigación con IA",
        "Asistentes Digitales para Ingeniería",
        "No-Code con IA para Ingenieros",
        "Flujos de Trabajo con IA",
        "Marca Digital Personal para Ingenieros con IA",
        "Curaduría de Documentación Técnica con IA",
        "Optimización de Procesos de Fabricación con IA",
        "Simulaciones y Modelado Electrónico con IA",
        "Comunicación Técnica Multiidioma con IA",
        "Cumplimiento Normativo y Estándares con IA"
    ];

    // --- Funciones Auxiliares ---
    function setActiveLink(link) {
        document.querySelectorAll('#course-list a').forEach(a => a.classList.remove('active'));
        if (link) {
            link.classList.add('active');
        }
    }

    function showLoading() {
        courseContent.innerHTML = `<div class="welcome-screen"><p class="loading-text">Cargando...</div>`;
    }

    function showError(error) {
        console.error('Error:', error);
        courseContent.innerHTML = '<p>Error al cargar el contenido. Por favor, intente de nuevo.</p>';
    }

    function showWelcomeScreen() {
        courseContent.innerHTML = `
            <div class="welcome-screen">
                <img src="visualizer_bin/images/logo.svg" alt="Logo" class="welcome-logo" id="welcome-logo">
                <h1>Visualizador Interactivo de Propuestas de Cursos</h1>
                <p>Seleccione un curso del menú de la izquierda para ver los detalles.</p>
                <p class="loading-text">Cargando lista de cursos...</p>
                <div class="main-search-container">
                    <input type="text" id="main-course-search" placeholder="Buscar cursos, temas, herramientas...">
                    <button id="main-search-button"><i class="fas fa-search"></i></button>
                </div>
            </div>
        `;
        setActiveLink(null); // Deactivate all links

        // Re-attach event listener for the main search bar on welcome screen
        const mainCourseSearch = document.getElementById('main-course-search');
        if (mainCourseSearch) {
            mainCourseSearch.addEventListener('keyup', (e) => {
                // This main search bar should ideally filter the sidebar list
                // For now, we'll just log its value or trigger a sidebar search
                courseSearch.value = e.target.value; // Sync with sidebar search
                renderCourseList(e.target.value);
            });
        }
    }

    // --- Cargar lista de cursos ---
    function renderCourseList(filter = '') {
        // Remove existing dynamic course items (those after the search container)
        let currentChild = courseList.querySelector('.search-container');
        if (currentChild) {
            currentChild = currentChild.nextElementSibling;
            while (currentChild) {
                const nextChild = currentChild.nextElementSibling;
                currentChild.remove();
                currentChild = nextChild;
            }
        }

        const filteredCourses = courseTitles.filter(title => title.toLowerCase().includes(filter.toLowerCase()));

        filteredCourses.forEach((title, index) => {
            const originalIndex = courseTitles.indexOf(title);
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.dataset.course = `curso_${originalIndex + 1}`;
            link.textContent = `${originalIndex + 1}. ${title}`;
            listItem.appendChild(link);
            courseList.appendChild(listItem);
        });
    }

    // --- Funciones de Carga ---
    async function loadCourse(courseFile) {
        showLoading();
        try {
            const response = await fetch(`visualizer_bin/data/${courseFile}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            renderCourse(data);
        } catch (error) {
            showError(error);
        }
    }

    async function loadAboutUs() {
        showLoading();
        try {
            const response = await fetch(`visualizer_bin/informacion_general.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            renderAboutUs(data);
        } catch (error) {
            showError(error);
        }
    }

    // --- Funciones de Renderizado ---
    function renderCourse(data) {
        let html = `
            <img src="${data.image_url}" alt="${data.title}" class="course-header-image">
            <div class="course-header"><h1>${data.title}</h1></div>
            <div class="course-info-banner">
                <div class="info-item"><i class="fas fa-clock"></i> ${data.info.duration}</div>
                <div class="info-item"><i class="fas fa-chalkboard-teacher"></i> ${data.info.modality}</div>
                <div class="info-item"><i class="fas fa-graduation-cap"></i> ${data.info.level}</div>
            </div>

            <div class="card">
                <h2><i class="fas fa-bullseye"></i> Concepto y Propuesta de Valor</h2>
                <p><strong>Problema que resolvemos:</strong> ${data.value_proposition.problem}</p>
                <p><strong>Nuestra solución:</strong> ${data.value_proposition.solution}</p>
                <hr>
                <h4>Producto Final: ${data.value_proposition.final_product.title}</h4>
                <ul>
                    ${data.value_proposition.final_product.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
                </ul>
                
            </div>

            ${data.video && data.video.has_video ? `
            <div class="card">
                <h2><i class="fas fa-video"></i> Video Descriptivo</h2>
                <div class="video-container">
                    <iframe src="${data.video.youtube_url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
            ` : ''}

            <div class="card">
                <h2><i class="fas fa-sitemap"></i> Malla Curricular (Resumen)</h2>
                <table class="malla-curricular-table">
                    <thead>
                        <tr>
                            <th>Sesión</th>
                            <th>Día</th>
                            <th>Tema Principal</th>
                            <th>Herramientas Clave</th>
                            <th>Entregable Práctico</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.malla_curricular.map(item => `
                            <tr>
                                <td>${item.sesion}</td>
                                <td>${item.dia}</td>
                                <td>${item.tema_principal}</td>
                                <td>${item.herramientas.join(', ')}</td>
                                <td>${item.entregable_practico}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="card">
                <h2><i class="fas fa-calendar-alt"></i> Programa Detallado (Objetivos y Entregables)</h2>
                <div class="accordion">
                    ${data.detailed_program.map(week => `
                        <div class="accordion-item">
                            <div class="accordion-header">
                                <h4>Semana ${week.week}: ${week.title}</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="accordion-content">
                                ${week.sessions.map(session => `
                                    <div class="session-detail">
                                        <h5>Sesión ${session.session_id}: ${session.title}</h5>
                                        <p><strong><i class="fas fa-flag-checkered"></i> Objetivos de aprendizaje:</strong></p>
                                        <ul>${session.objectives.map(o => `<li>${o}</li>`).join('')}</ul>
                                        <p><strong><i class="fas fa-file-alt"></i> Entregables:</strong></p>
                                        <ul>${session.deliverables.map(d => `<li>${d}</li>`).join('')}</ul>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <h2><i class="fas fa-cogs"></i> Metodología y Evaluación</h2>
                <h4>Metodología: "${data.methodology.name}"</h4>
                ${data.methodology.phases.map(p => `<p><strong>${p.name}:</strong> ${p.objective}</p>`).join('')}
                <hr>
                <h4>Evaluación</h4>
                <p><strong>Continua (${data.evaluation.continuous.percentage}):</strong> ${data.evaluation.continuous.criteria.map(c => `${c.name} (${c.value})`).join(', ')}</p>
                <p><strong>Final (${data.evaluation.final.percentage}):</strong> ${data.evaluation.final.criteria.map(c => `${c.name} (${c.value})`).join(', ')}</p>
            </div>

            <div class="card">
                <h2><i class="fas fa-user-check"></i> Perfil del Participante y Recursos</h2>
                <h4>Requisitos</h4>
                <ul>${data.participant_profile.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
                <h4>Perfil Recomendado</h4>
                <ul>${data.participant_profile.recommended.map(r => `<li>${r}</li>`).join('')}</ul>
                <h4>¿Para quién NO es este curso?</h4>
                <ul>${data.participant_profile.not_for.map(n => `<li>${n}</li>`).join('')}</ul>
                <hr>
                <h4>Recursos y Herramientas</h4>
                <ul>${data.resources.platforms.map(p => `<li><i class="fas fa-laptop-code"></i> ${p}</li>`).join('')}</ul>
            </div>

            <div class="call-to-action-container">
                <a href="mailto:info@example.com?subject=Consulta sobre el curso: ${encodeURIComponent(data.title)}" class="btn-primary"><i class="fas fa-envelope"></i> Solicitar Información</a>
            </div>

            ${data.image_gallery && data.image_gallery.length > 0 ? `
            <div class="card">
                <h2><i class="fas fa-images"></i> Galería de Imágenes</h2>
                <div class="image-gallery-thumbnails">
                    ${data.image_gallery.map((img, index) => `<img src="${img}" alt="Imagen ${index + 1}" data-index="${index}">`).join('')}
                </div>
            </div>
            ` : ''}
        `;
        courseContent.innerHTML = html;

        // Activar el acordeón
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('i.fa-chevron-down, i.fa-chevron-up');
                
                content.classList.toggle('active');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        });

        // Activar Lightbox
        const galleryThumbnails = document.querySelectorAll('.image-gallery-thumbnails img');
        if (galleryThumbnails.length > 0) {
            const lightbox = document.createElement('div');
            lightbox.classList.add('lightbox');
            lightbox.innerHTML = `
                <button class="lightbox-close-button"><i class="fas fa-times"></i></button>
                <button class="lightbox-nav-button prev"><i class="fas fa-chevron-left"></i></button>
                <img src="" class="lightbox-content">
                <button class="lightbox-nav-button next"><i class="fas fa-chevron-right"></i></button>
            `;
            document.body.appendChild(lightbox);

            const lightboxImg = lightbox.querySelector('.lightbox-content');
            const prevBtn = lightbox.querySelector('.lightbox-nav-button.prev');
            const nextBtn = lightbox.querySelector('.lightbox-nav-button.next');
            const closeBtn = lightbox.querySelector('.lightbox-close-button');
            let currentIndex = 0;

            galleryThumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    currentIndex = index;
                    lightboxImg.src = thumb.src;
                    lightbox.classList.add('active');
                });
            });

            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + data.image_gallery.length) % data.image_gallery.length;
                lightboxImg.src = data.image_gallery[currentIndex];
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % data.image_gallery.length;
                lightboxImg.src = data.image_gallery[currentIndex];
            });

            // Keyboard navigation for lightbox
            document.addEventListener('keydown', (e) => {
                if (lightbox.classList.contains('active')) {
                    if (e.key === 'ArrowLeft') {
                        prevBtn.click();
                    } else if (e.key === 'ArrowRight') {
                        nextBtn.click();
                    } else if (e.key === 'Escape') {
                        closeBtn.click();
                    }
                }
            });
        }

        // Scroll navigation buttons
        const scrollNavButtons = document.createElement('div');
        scrollNavButtons.classList.add('scroll-nav-buttons');
        scrollNavButtons.innerHTML = `
            <button class="scroll-nav-button scroll-up"><i class="fas fa-chevron-up"></i></button>
            <button class="scroll-nav-button scroll-down"><i class="fas fa-chevron-down"></i></button>
        `;
        document.body.appendChild(scrollNavButtons);

        const sections = document.querySelectorAll('.card');
        let currentSectionIndex = 0;

        function scrollToSection(index) {
            if (index >= 0 && index < sections.length) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
                currentSectionIndex = index;
            }
        }

        document.querySelector('.scroll-up').addEventListener('click', () => {
            scrollToSection(currentSectionIndex - 1);
        });

        document.querySelector('.scroll-down').addEventListener('click', () => {
            scrollToSection(currentSectionIndex + 1);
        });

        // Keyboard navigation for sections
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) { // Only if lightbox is not active
                if (e.key === 'ArrowUp') {
                    scrollToSection(currentSectionIndex - 1);
                } else if (e.key === 'ArrowDown') {
                    scrollToSection(currentSectionIndex + 1);
                }
            }
        });
    }

    function renderAboutUs(data) {
        let html = `
            <div class="about-us-logo-container">
                <img src="visualizer_bin/images/logo.svg" alt="Logo" class="about-us-logo" id="about-us-logo">
            </div>
            <div class="card">
                <h2><i class="fas fa-users"></i> Sobre Nosotros</h2>
                <p>${data.quienes_somos.descripcion}</p>
            </div>
            <div class="card">
                <h2><i class="fas fa-chalkboard-teacher"></i> Ponentes</h2>
                ${data.ponentes.map(p => `
                    <div class="ponente-profile">
                        <img src="${p.foto_url}" alt="${p.nombre}">
                        <div>
                            <h3>${p.nombre}</h3>
                            <p>${p.bio}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="card">
                <h2><i class="fas fa-envelope"></i> Contacto</h2>
                <p><strong>Email:</strong> <a href="mailto:${data.contacto.email}">${data.contacto.email}</a></p>
                <p><strong>Teléfono:</strong> ${data.contacto.telefono}</p>
                <p><strong>Redes Sociales:</strong></p>
                <ul>
                    ${data.contacto.redes_sociales.map(rs => `<li><a href="${rs.url}" target="_blank"><i class="fab fa-linkedin"></i> ${rs.nombre}</a></li>`).join('')}
                </ul>
            </div>
        `;
        courseContent.innerHTML = html;
    }

    // Initial render
    renderCourseList();
    showWelcomeScreen();

    // Event Listeners
    courseSearch.addEventListener('keyup', (e) => {
        renderCourseList(e.target.value);
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showWelcomeScreen();
    });

    courseList.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            setActiveLink(e.target);
            if (e.target.id === 'about-us-link') {
                loadAboutUs();
            } else if (e.target.dataset.course) {
                const courseFile = e.target.dataset.course;
                loadCourse(courseFile);
            }
        }
    });

    // Logo fallback logic
    const mainLogo = document.getElementById('main-logo');
    const welcomeLogo = document.getElementById('welcome-logo');
    const aboutUsLogo = document.getElementById('about-us-logo');

    function checkLogo(imgElement) {
        if (!imgElement) return; // Ensure element exists
        const originalSrc = imgElement.src;
        imgElement.onerror = () => {
            // If SVG fails, try PNG
            imgElement.src = originalSrc.replace('.svg', '.png');
            imgElement.onerror = null; // Prevent infinite loop if PNG also fails
        };
    }

    checkLogo(mainLogo);
    checkLogo(welcomeLogo);
    checkLogo(aboutUsLogo);
});