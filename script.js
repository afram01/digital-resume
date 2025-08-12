const DEFAULT_PORT = 8080;

document.addEventListener('DOMContentLoaded', function() {
    // ایجاد دکمه حالت تاریک
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.textContent = 'Toggle Dark Mode';
    darkModeToggle.addEventListener('click', toggleDarkMode);
    document.body.insertBefore(darkModeToggle, document.body.firstChild);

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // تلاش برای دریافت از سرور محلی، اگر شکست خورد از فایل JSON مستقیم استفاده کن
    fetch(`http://localhost:${DEFAULT_PORT}/resume.json`)
        .then(response => {
            if (!response.ok) throw new Error('Server response not OK');
            return response.json();
        })
        .catch(() => fetch('resume.json')) // اگر سرور پاسخ نداد، مستقیماً فایل را بخوان
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch resume.json');
            return response.json();
        })
        .then(data => {
            displayResume(data);
            animateSkills();
        })
        .catch(error => {
            console.error('Error:', error);
            // استفاده از داده‌های محلی به عنوان آخرین راهکار
            const localData = {
                "personal_info": {
                    "name": "Aida Ramezany",
                    "job_title": "Computer Engineering Student",
                    "about": "Passionate about software development and network security. Eager to learn new technologies and solve complex problems.",
                    "contact": {
                        "email": "ramezanyaida84@gmail.com",
                        "github": "github.com/afram01",
                        "linkedin": "linkedin.com/in/aida-ramezany"
                    },
                    "languages": [
                        {"language": "Persian", "level": "Native"},
                        {"language": "English", "level": "Intermediate"}
                    ]
                },
                "skills": [
                    {"name": "C++", "level": "Advanced", "percentage": 85},
                    {"name": "Python", "level": "low", "percentage": 10},
                    {"name": "Network Security", "level": "Learning", "percentage": 20}
                ],
                "education": [
                    {
                        "institution": "Abu Ali Sina University",
                        "field": "Computer Engineering (Software Orientation)",
                        "degree": "Bachelor",
                        "start_year": "2024",
                        "end_year": "2028 (Expected)",
                        "description": ""
                    }
                ],
                "experience": [
                    {
                        "company": "APA Specialized Center",
                        "position": "IT Intern",
                        "start_year": "2025",
                        "end_year": "Present",
                        "description":"Internship at the APA Specialized Center in the field of networking"
                    }
                ],
                "projects": [
                    {
                        "name": "Online Resume Project",
                        "technologies": ["HTML", "CSS", "JavaScript", "C++"],
                        "description": "A dynamic resume website that fetches data from JSON API",
                        "github_link": "github.com/afram01/digital-resume"
                    },
                    {
                        "name": "Horrified Game",
                        "technologies": ["raylib", "C++"],
                        "description": "This project is a horror game related to the advanced programming lesson project (in progress)",
                        "github_link": "github.com/afram01/Final-project"
                    },
                    {
                        "name": "Store system",
                        "technologies": ["C++"],
                        "description": "This group project is about a store's purchasing and sales system. This project is for an advanced programming course.",
                        "github_link": "github.com/afram01/HW3"
                    }
                ],
                "interests": [
                    "Programming and Networking Competitions",
                    "Network Security",
                    "Programming"
                ]
            };
            displayResume(localData);
            animateSkills();
        });
});

function displayResume(data) {
    // نمایش اطلاعات شخصی
    document.getElementById('name').textContent = data.personal_info.name;
    document.getElementById('job-title').textContent = data.personal_info.job_title;
    document.getElementById('about').textContent = data.personal_info.about;

    // نمایش اطلاعات تماس
    const contactList = document.getElementById('contact-info');
    contactList.innerHTML = ''; // Clear previous content
    
    // Email
    const emailLi = document.createElement('li');
    emailLi.innerHTML = `<strong>Email:</strong> <a href="mailto:${data.personal_info.contact.email}">${data.personal_info.contact.email}</a>`;
    contactList.appendChild(emailLi);
    
    // GitHub
    const githubLi = document.createElement('li');
    githubLi.innerHTML = `<strong>GitHub:</strong> <a href="https://${data.personal_info.contact.github}" target="_blank">${data.personal_info.contact.github}</a>`;
    contactList.appendChild(githubLi);
    
    // LinkedIn
    const linkedinLi = document.createElement('li');
    linkedinLi.innerHTML = `<strong>LinkedIn:</strong> <a href="https://${data.personal_info.contact.linkedin}" target="_blank">${data.personal_info.contact.linkedin}</a>`;
    contactList.appendChild(linkedinLi);

    // نمایش زبان‌ها
    if (data.personal_info.languages && data.personal_info.languages.length > 0) {
        const languagesSection = document.createElement('section');
        languagesSection.className = 'section'; // اضافه کردن کلاس section
        languagesSection.innerHTML = '<h2>Languages</h2><ul id="languages-list"></ul>';
        document.querySelector('.container').appendChild(languagesSection);
        
        const languagesList = document.getElementById('languages-list');
        data.personal_info.languages.forEach(lang => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${lang.language}:</strong> ${lang.level}`;
            languagesList.appendChild(li);
        });
    }

    // نمایش مهارت‌ها با نوار پیشرفت
    const skillsList = document.getElementById('skills');
    skillsList.innerHTML = '';

    data.skills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        skillItem.innerHTML = `
            <div class="skill-name">
                <span>${skill.name}</span>
                <span>${skill.percentage}%</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar" data-width="${skill.percentage}%" style="width: 0"></div>
            </div>
        `;
        skillsList.appendChild(skillItem);
    });

    // نمایش تحصیلات
    const educationDiv = document.getElementById('education');
    educationDiv.innerHTML = '';
    data.education.forEach(edu => {
        const div = document.createElement('div');
        div.className = 'education-item';
        div.innerHTML = `
            <h3>${edu.institution}</h3>
            <p><strong>Degree:</strong> ${edu.degree}</p>
            <p><strong>Field:</strong> ${edu.field}</p>
            <p><strong>Year:</strong> ${edu.start_year} - ${edu.end_year || 'Present'}</p>
            ${edu.description ? `<p>${edu.description}</p>` : ''}
        `;
        educationDiv.appendChild(div);
    });

    // نمایش تجربه کاری
    const experienceDiv = document.getElementById('experience');
    experienceDiv.innerHTML = '';
    data.experience.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'experience-item';
        
        let descriptionHTML = '';
        if (Array.isArray(exp.description)) {
            descriptionHTML = '<ul>';
            exp.description.forEach(item => {
                descriptionHTML += `<li>${item}</li>`;
            });
            descriptionHTML += '</ul>';
        } else {
            descriptionHTML = `<p>${exp.description}</p>`;
        }
        
        div.innerHTML = `
            <h3>${exp.company}</h3>
            <p><strong>Position:</strong> ${exp.position}</p>
            <p><strong>Year:</strong> ${exp.start_year} - ${exp.end_year || 'Present'}</p>
            ${descriptionHTML}
        `;
        experienceDiv.appendChild(div);
    });

    // نمایش پروژه‌ها
    if (data.projects && data.projects.length > 0) {
        const projectsSection = document.createElement('section');
        projectsSection.className = 'section';
        projectsSection.innerHTML = '<h2>Projects</h2><div id="projects-list"></div>';
        document.querySelector('.container').appendChild(projectsSection);
        
        const projectsList = document.getElementById('projects-list');
        data.projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            
            const technologies = project.technologies.join(', ');
            projectItem.innerHTML = `
                <h3>${project.name}</h3>
                <p><strong>Technologies:</strong> ${technologies}</p>
                <p>${project.description}</p>
                <p><strong>GitHub:</strong> <a href="https://${project.github_link}" target="_blank">${project.github_link}</a></p>
            `;
            projectsList.appendChild(projectItem);
        });
    }

    // نمایش علایق
    if (data.interests && data.interests.length > 0) {
        const interestsSection = document.createElement('section');
        interestsSection.className = 'section'; // اضافه کردن کلاس section
        interestsSection.innerHTML = '<h2>Interests</h2><ul id="interests-list"></ul>';
        document.querySelector('.container').appendChild(interestsSection);
        
        const interestsList = document.getElementById('interests-list');
        data.interests.forEach(interest => {
            const li = document.createElement('li');
            li.textContent = interest;
            interestsList.appendChild(li);
        });
    }
}

function animateSkills() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });
}
