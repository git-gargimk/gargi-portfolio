import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { additionalExperience } from './data/experience';
import { certifications } from './data/certifications';
import { profilePhoto } from './data/profile';
import { drawings } from './data/drawings';
import { DrawingCarousel } from './DrawingCarousel';
import './styles.css';
import './accessibility.css';

const LINKEDIN = 'https://www.linkedin.com/in/gargimk/';
const GITHUB = 'https://github.com/git-gargimk';
const INSTAGRAM = 'https://www.instagram.com/chhand.reghancha/';
const tabs = ['About', 'Experience', 'Projects', 'Contact'];
const universityProjects = [
  { id: 'planning', title: 'Planning Poker', category: 'Web development', type: 'Web', year: '2016', description: 'An interactive estimation app for teams, with real-time collaboration.', tags: ['AngularJS', 'Socket.IO', 'Express', 'MongoDB'], art: 'poker', repositoryUrl: 'https://github.com/gargimk/planningpoker' },
  { id: 'yelp', title: 'Reading between the reviews', category: 'Machine learning', type: 'ML', year: '2016', description: 'Opinion mining on Yelp reviews using support vector machines.', tags: ['Python', 'NLTK', 'scikit-learn', 'Weka'], art: 'sentiment', repositoryUrl: 'https://github.com/gargimk/CPSC531Project' },
  { id: 'comments', title: 'A place for conversation', category: 'Web development', type: 'Web', year: '2016', description: 'A React comment app with JSON persistence.', tags: ['React', 'Node.js', 'Express', 'CSS'], art: 'comments', repositoryUrl: 'https://github.com/gargimk/ReactJS/tree/master/CommentApp' },
  { id: 'houses', title: 'Making sense of house prices', category: 'Machine learning', type: 'ML', year: '2016', description: 'Advanced regression techniques for a Kaggle competition.', tags: ['Regression', 'Data analysis', 'Kaggle'], art: 'houses', repositoryUrl: 'https://github.com/gargimk/Housing-Prices-prediction' },
  { id: 'prof', title: 'RateThyProf', category: 'Web development', type: 'Web', year: '2016', description: 'A single-page professor and university rating app.', tags: ['AngularJS', 'Hapi.js', 'MongoDB'], art: 'prof', repositoryUrl: 'https://github.com/gargimk/cpsc-473/tree/master/gradProj' },
  { id: 'cloud', title: 'From code to cloud', category: 'Cloud computing', type: 'Cloud', year: '2016', description: 'Web application deployment on Amazon EC2.', tags: ['AWS', 'EC2', 'Distributed systems'], art: 'cloud' },
];
const sideProjects = [
  { id: 'portfolio', title: 'My personal portfolio', category: 'Web development', type: 'Web', year: '2026', description: 'A personal space for my engineering journey, creative interests, and drawings.', tags: ['React', 'JavaScript', 'CSS', 'Vite'], art: 'portfolio' },
];
const projects = [
  ...universityProjects.map(project => ({ ...project, group: 'university' })),
  ...sideProjects.map(project => ({ ...project, group: 'side' })),
];

function Arrow({ diagonal = false, ...props }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SectionIcon({ type }) {
  const shapes = {
    experience: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v3h4v-3" /></>,
    education: <><path d="m2 9 10-5 10 5-10 5L2 9ZM6 11v6c4 3 8 3 12 0v-6M22 9v7" /></>,
    certifications: <><circle cx="12" cy="8" r="5" /><path d="m8 12-1 9 5-3 5 3-1-9" /></>,
    projects: <><path d="M3 7V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /><path d="m10 11-2 3 2 3m4-6 2 3-2 3" /></>,
    drawing: <><path d="m16 3 5 5-12 12-6 1 1-6L16 3ZM13 6l5 5M4 15l5 5" /></>,
    contact: <><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /><path d="M7 8h10M7 12h6" /></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[type]}</svg>;
}

function LinkedInLink({ children = 'Let’s connect', className = '', showArrow = true }) {
  return <a className={className} href={LINKEDIN} target="_blank" rel="noreferrer">{children}{showArrow && <Arrow diagonal />}<span className="sr-only"> (opens in a new tab)</span></a>;
}

function GitHubIcon() {
  return <span className="github-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.45 3.1-1.15 3.1-1.15.61 1.55.23 2.69.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.03.76 2.08v3.11c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" /></svg></span>;
}

function GitHubLink({ children = 'View GitHub', className = '', showArrow = true }) {
  return <a className={className} href={GITHUB} target="_blank" rel="noreferrer">{children}{showArrow && <Arrow diagonal />}<span className="sr-only"> (opens in a new tab)</span></a>;
}

function InstagramIcon() {
  return <span className="instagram-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></span>;
}

function InstagramLink({ children = 'Instagram', className = '', showArrow = true }) {
  return <a className={className} href={INSTAGRAM} target="_blank" rel="noreferrer">{children}{showArrow && <Arrow diagonal />}<span className="sr-only"> (opens in a new tab)</span></a>;
}

function ProjectArt({ kind }) {
  const project = projects.find(item => item.art === kind);
  return <div className={`project-art ${kind}`} aria-hidden="true">
    <div className="preview-browser">
      <div className="preview-toolbar"><span className="preview-dots"><i /><i /><i /></span><span>{project.title}</span><span>↗</span></div>
      <div className="preview-body">
        <div className="preview-sidebar"><span>{'{ }'}</span><i /><i /><i /><i /></div>
        <div className="preview-workspace">
          <span className="preview-eyebrow">{project.category}</span>
          <strong className="preview-title">{kind === 'poker' ? 'Great teams. Shared estimates.' : kind === 'sentiment' ? 'Every review tells a story.' : kind === 'cloud' ? 'An idea, deployed.' : kind === 'comments' ? 'Start a conversation.' : kind === 'houses' ? 'Find the pattern.' : kind === 'portfolio' ? 'Hi, I’m Gargi.' : 'Share what you know.'}</strong>
          {kind === 'poker' ? <div className="preview-poker"><div className="preview-task">SPRINT PLANNING <span>Choose your estimate</span></div><div className="preview-estimates">{[1, 2, 3, 5, 8].map(value => <span key={value} className={value === 5 ? 'chosen' : ''}>{value}</span>)}</div><div className="preview-people"><i>A</i><i>M</i><i>J</i><span>Better together.</span></div></div>
          : kind === 'sentiment' ? <div className="preview-reviews"><div><span>“A wonderful experience.”</span><b>Positive</b></div><div><span>“Could have been better.”</span><b>Negative</b></div><div className="preview-model">Review → SVM classifier → Sentiment</div></div>
          : kind === 'cloud' ? <div className="preview-cloud"><span>Web application</span><i>↓</i><strong>Amazon EC2</strong><div><i />Application deployed</div></div>
          : kind === 'comments' ? <div className="preview-comments"><div><b>A</b><p>Every idea starts somewhere.</p></div><div><b>M</b><p>Let’s keep the conversation going.</p></div><span>Write a comment… <i>↵</i></span></div>
          : kind === 'houses' ? <div className="preview-houses"><div className="preview-chart">{[25, 43, 36, 57, 52, 75, 90].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><span>Data → Regression → Prediction</span></div>
          : kind === 'portfolio' ? <div className="preview-portfolio"><span className="preview-monogram">gk</span><p>Engineering meets creativity.</p><div><span>Experience</span><span>Projects</span><span>Outside of work</span></div></div>
          : <div className="preview-prof"><span className="preview-prof-avatar">R</span><div><strong>A space for student perspectives.</strong><span>★★★★★</span><small>Find. Review. Share.</small></div></div>}
        </div>
      </div>
    </div>
  </div>;
}

function UniversityProjectArt({ kind }) {
  const visuals = {
    poker: { label: 'Team estimation', shape: <><rect x="14" y="19" width="32" height="46" rx="5" transform="rotate(-12 30 42)" /><rect x="44" y="12" width="32" height="46" rx="5" /><rect x="74" y="19" width="32" height="46" rx="5" transform="rotate(12 90 42)" /><text x="60" y="41" textAnchor="middle" stroke="none" fill="currentColor" fontSize="20">3</text><path d="M26 35h8m-4-4v18M85 36h10l-8 13" /></> },
    sentiment: { label: 'Review sentiment', shape: <><path d="M12 14h44v30H32L20 54V44h-8V14ZM64 28h44v30H94l-12 10V58H64V28Z" /><path d="M25 32q9 10 18 0m34 17q9-10 18 0" /><circle cx="27" cy="25" r="1" /><circle cx="42" cy="25" r="1" /><circle cx="78" cy="40" r="1" /><circle cx="94" cy="40" r="1" /></> },
    cloud: { label: 'Cloud deployment', shape: <><path d="M30 44H22a12 12 0 0 1-1-24 21 21 0 0 1 40-2 14 14 0 0 1 9 26H58" /><rect x="78" y="33" width="28" height="18" rx="3" /><rect x="78" y="55" width="28" height="18" rx="3" /><path d="M40 66V34m-8 8 8-8 8 8M40 66h26m-7-7 7 7-7 7M85 42h2m-2 22h2" /></> },
    comments: { label: 'React comments', shape: <><path d="M12 12h64v35H38L23 59V47H12V12Z" /><path d="M48 51v12h34l15 9V63h10V31H83M25 24h38M25 34h25M62 55h31" /></> },
    houses: { label: 'Price prediction', shape: <><path d="m11 37 24-20 24 20M18 33v34h34V33M29 67V49h12v18M72 20v47h37M78 55l10-16 9 6 12-22m-11 0h11v11" /></> },
    prof: { label: 'Professor ratings', shape: <><path d="m10 26 31-14 31 14-31 14L10 26ZM21 32v17q20 12 40 0V32M72 26v24" /><path d="m91 36 5 10 11 2-8 8 2 12-10-6-10 6 2-12-8-8 11-2 5-10Z" /></> },
  };
  const visual = visuals[kind];
  return <div className="university-project-art" aria-hidden="true"><svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{visual.shape}</svg><span>{visual.label}</span></div>;
}

function ProjectCard({ project, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return <article className={`project-card project-${project.art}`}>
    {project.group === 'university' ? <UniversityProjectArt kind={project.art} /> : <ProjectArt kind={project.art} />}
    <div className="project-content">
      <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
      <div className="project-title"><Heading>{project.title}</Heading></div>
      <p>{project.description}</p>
      <ul className="project-stack" aria-label="Project technologies">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      {project.repositoryUrl && <a className="project-open" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" aria-label={`View project code on GitHub: ${project.title} (opens in a new tab)`}><span className="project-action-label">View project code on GitHub <Arrow diagonal /></span></a>}
    </div>
  </article>;
}

function About({ navigate }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const summaries = [
    {
      title: 'Professional Experience',
      icon: 'experience',
      label: 'SOFTWARE & SYSTEMS',
      description: 'From eCommerce at Accenture to cloud applications at Phyn and enterprise platforms at Microsoft, my work spans frontend development, backend services, cloud infrastructure, and AI-assisted engineering.',
      detail: 'Microsoft · Phyn · eGumball · Brainsharp · Accenture',
      action: 'View experience',
      tab: 'Experience',
      sectionId: 'professional-experience-heading',
    },
    {
      title: 'Education',
      icon: 'education',
      label: 'MY FOUNDATION',
      description: 'A master’s in Computer Science from California State University, Fullerton, and a bachelor’s in Electronics and Communication from Sinhgad Academy of Engineering, affiliated with Savitribai Phule Pune University.',
      detail: 'M.S. · 2015–2017 | B.E. · 2008–2012',
      action: 'View education',
      tab: 'Experience',
      sectionId: 'education-heading',
    },
    {
      title: 'Projects',
      icon: 'projects',
      label: 'LEARNING THROUGH BUILDING',
      description: 'University projects and personal experiments exploring real-time collaboration, web applications, machine learning, and cloud deployment. Each project puts an idea into practice across a different part of the stack.',
      detail: `${projects.length} projects across web development, machine learning, and cloud computing`,
      action: 'View projects',
      tab: 'Projects',
    },
    {
      title: 'Certifications',
      icon: 'certifications',
      label: 'CONTINUED LEARNING',
      description: 'Learning across machine learning, React and Redux, and Spring Boot through courses from DeepLearning.AI, Stanford University, and Udemy.',
      detail: `${certifications.length} certifications and course credentials`,
      action: 'View certifications',
      tab: 'Experience',
      sectionId: 'certifications-heading',
    },
  ];
  const experienceSummaries = summaries.filter(summary => summary.tab === 'Experience');
  const projectSummary = summaries.find(summary => summary.tab === 'Projects');
  return <>
    <section className="about-intro" aria-labelledby="about-heading">
      <figure className="about-profile">
        <div className="about-portrait">
          {profilePhoto && !photoFailed ? <img src={profilePhoto} alt="Portrait of Gargi Kulkarni" width="768" height="1024" decoding="async" onError={() => setPhotoFailed(true)} /> : <span className="about-initials" aria-hidden="true">gk</span>}
        </div>
        <figcaption><strong>Gargi Kulkarni</strong><span>Greater Seattle Area</span></figcaption>
        <p className="profile-descriptors">Curious <span aria-hidden="true">|</span> Creative <span aria-hidden="true">|</span> Collaborative</p>
      </figure>
      <div className="about-biography">
        <span className="eyebrow">A LITTLE ABOUT ME</span>
        <h1 id="about-heading">Hi, I’m Gargi.</h1>
        <p className="about-role">Software Engineer 2 at Microsoft</p>
        <p>I’m a software engineer based in the Greater Seattle Area. At Microsoft, I build customer-facing applications and AI-powered engineering tools, with a focus on making complex workflows clearer and easier to use.</p>
        <p>I hold an M.S. in Computer Science from California State University, Fullerton and a B.E. in Electronics and Communication from Sinhgad Academy of Engineering, affiliated with Savitribai Phule Pune University.</p>
        <p>I’m curious about how things work and enjoy finding ways to make them clearer. Alongside engineering, drawing and dance give me space for creative expression. This portfolio brings those different parts of my life together.</p>
      </div>
    </section>
    <div className="about-overview">
      <section className="about-tab-summary" aria-labelledby="about-experience-heading">
        <div className="section-heading"><div><span className="section-kicker">MY JOURNEY</span><h2 id="about-experience-heading">Experience</h2></div></div>
        <div className="about-experience-grid">
          {experienceSummaries.map(summary => <section className="about-summary" key={summary.title}>
            <span className="section-kicker">{summary.label}</span>
            <h3>{summary.title}</h3>
            <p>{summary.description}</p>
            <p className="about-summary-detail">{summary.detail}</p>
            <button className="text-link" onClick={() => navigate(summary.tab, summary.sectionId)}><SectionIcon type={summary.icon} />{summary.action}<Arrow /></button>
          </section>)}
        </div>
      </section>
      <section className="about-tab-summary" aria-labelledby="about-projects-heading">
        <div className="section-heading"><div><span className="section-kicker">LEARNING THROUGH BUILDING</span><h2 id="about-projects-heading">Projects</h2></div></div>
        <div className="about-summary about-project-summary">
          <p>{projectSummary.description}</p>
          <p className="about-summary-detail">{projectSummary.detail}</p>
          <button className="text-link" onClick={() => navigate('Projects')}><SectionIcon type="projects" />View projects<Arrow /></button>
        </div>
      </section>
      <section className="about-tab-summary about-personal-section" aria-labelledby="about-personal-heading">
        <div className="section-heading"><div><span className="section-kicker">A MORE PERSONAL SIDE</span><h2 id="about-personal-heading">Outside of work</h2></div></div>
        <div className="about-personal-grid">
          <div className="about-summary personal-interest">
            <h3><SectionIcon type="drawing" />Drawing</h3>
            <p>Drawing is a way for me to explore ideas and express my creative side. From intricate mandalas and floral patterns to pencil sketches of birds and animals, here’s a glimpse into my sketchbook.</p>
          </div>
          <DrawingCarousel items={drawings} />
        </div>
      </section>
      <section className="about-tab-summary" aria-labelledby="about-contact-heading">
        <div className="section-heading"><div><span className="section-kicker">LET’S STAY IN TOUCH</span><h2 id="about-contact-heading">Contact</h2></div></div>
        <div className="about-summary about-contact-summary">
          <p>Connect professionally on LinkedIn, explore my code on GitHub, or see my drawings on Instagram.</p>
          <button className="text-link" onClick={() => navigate('Contact')}>
            <SectionIcon type="contact" />
            Get in touch
            <Arrow />
          </button>
        </div>
      </section>
    </div>
  </>;
}

function Experience() {
  return <div className="inner-page"><div className="page-intro"><span className="eyebrow">THE JOURNEY SO FAR</span><h1>Experience that<br /><em>builds perspective.</em></h1><p>Software engineering, continuous learning, and the people along the way.</p></div>
    <div className="experience-layout"><section className="professional-experience" aria-labelledby="professional-experience-heading"><h2 className="experience-section-title" id="professional-experience-heading" tabIndex={-1}>Professional Experience</h2><article className="timeline-item"><div className="role-details"><span className="subtle-label">JAN 2020 – PRESENT</span><h3>Microsoft</h3><p className="role-title">Software Engineer 2</p><p>Greater Seattle Area</p>
      <ul className="experience-highlights">
        <li>Designed, developed, and delivered scalable, customer-facing enterprise applications using React, Redux, C#, .NET, Azure, Cosmos DB, Redis, and REST APIs, owning features throughout the software development lifecycle.</li>
        <li>Modernized legacy frontend experiences using React and optimized API interactions, data retrieval, and caching strategies, achieving an <strong>80% improvement in page-load performance.</strong></li>
        <li>Led frontend design and implementation of complex enterprise workflows, integrating backend APIs, validation, status tracking, error handling, and self-service capabilities, <strong>eliminating related support requests.</strong></li>
        <li>Developed security configuration experiences and compliance dashboards, enabling customers to manage security settings, monitor compliance, and identify configuration issues.</li>
        <li>Built intuitive customer-facing troubleshooting and remediation experiences, <strong>reducing related support tickets by 50%.</strong></li>
        <li>Developed AI/LLM-powered agents and reusable engineering skills to automate incident investigation, streamline troubleshooting, and <strong>improve engineering productivity by 50%.</strong></li>
        <li>Used LLM-based development tools, AI agents, and automated code review workflows to improve software development efficiency and engineering processes.</li>
        <li>Investigated and resolved production incidents, analyzed customer-reported issues, and implemented improvements to application reliability and user experience.</li>
        <li>Served as a Subject Matter Expert (SME), mentoring engineers, providing technical guidance, collaborating with cross-functional teams, and contributing to architectural discussions, technical planning, and engineering decisions.</li>
      </ul>
      </div></article>
    {additionalExperience.map(role => (
      <article className="timeline-item" key={role.id} aria-labelledby={`role-${role.id}`}>
        <div className="role-details">
          <span className="subtle-label">{role.dates}</span>
          <h3 id={`role-${role.id}`}>{role.company}</h3>
          <p className="role-title">{role.title}</p>
          <p>{role.location}</p>
          <ul className="experience-highlights">
            {role.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
          </ul>
        </div>
      </article>
    ))}
    </section>
    <div className="credentials-layout">
    <section className="education-panel" aria-labelledby="education-heading">
      <h2 className="experience-section-title" id="education-heading" tabIndex={-1}>Education</h2>
      <article className="education-entry">
        <h3>California State University, Fullerton</h3>
        <p className="degree-name">Master of Science (M.S.), Computer Science</p>
        <span className="subtle-label">2015–2017</span>
        <dl className="education-grades">
          <div><dt>Grade</dt><dd>A</dd></div>
        </dl>
        <span className="subtle-label">ACTIVITIES &amp; SOCIETIES</span>
        <ul className="education-activities">
          <li>VIP-Volunteer International Peer at International Programs &amp; Global Engagement</li>
        </ul>
      </article>
      <hr />
      <article className="education-entry">
        <h3>Savitribai Phule Pune University</h3>
        <p className="degree-name">Bachelor of Engineering (B.E.), Electrical, Electronics and Communications Engineering</p>
        <p>Sinhgad Academy of Engineering, affiliated to Savitribai Phule Pune University</p>
        <span className="subtle-label">2008–2012</span>
        <dl className="education-grades">
          <div><dt>Grade</dt><dd>70%</dd></div>
        </dl>
        <span className="subtle-label">ACTIVITIES &amp; SOCIETIES</span>
        <ul className="education-activities">
          <li>Member of the Campus Social Responsibility group</li>
          <li>Member of the college magazine “MOSIAC”</li>
          <li>Member of the IETE students forum</li>
        </ul>
        <p className="education-award"><strong>Student of the Year</strong> · Final year</p>
      </article>
    </section>
    <section className="certifications-section" aria-labelledby="certifications-heading">
        <h2 className="experience-section-title" id="certifications-heading" tabIndex={-1}>Certifications</h2>
        {certifications.map(certification => (
          <article className="certification-entry" key={certification.id}>
            <h3>{certification.title}</h3>
            <p>{certification.issuer}</p>
            <p className="certification-meta">Issued {certification.issued}{certification.expires && ` · Expired ${certification.expires}`}</p>
            {certification.credentialId && <p className="certification-meta">Credential ID: <span>{certification.credentialId}</span></p>}
            {certification.credentialUrl && <a className="text-link certification-link" href={certification.credentialUrl} target="_blank" rel="noreferrer">View credential<span className="sr-only"> for {certification.title} (opens in a new tab)</span><Arrow diagonal /></a>}
          </article>
        ))}
    </section>
    </div>
    </div>
    <section className="toolbox"><h2 className="section-kicker">TECHNOLOGIES &amp; TOOLS</h2><div>{['React', 'Redux', 'JavaScript', 'C#', '.NET', 'ASP.NET MVC', 'SQL Server', 'Azure', 'Cosmos DB', 'Redis', 'REST APIs', 'AI / LLM agents', 'Node.js', 'Python', 'AngularJS', 'MongoDB', 'AWS', 'AWS Lambda', 'SAP Hybris Commerce', 'Java', 'Spring', 'WCF', 'ExtJS', 'JUnit', 'Mockito', 'Jenkins', 'scikit-learn'].map(tag=><span key={tag}>{tag}</span>)}</div></section>
  </div>;
}

function Projects() {
  const [filter, setFilter] = useState('All');
  const filtered = projects.filter(project => filter === 'All' || project.type === filter);
  const groups = [
    { id: 'side', title: 'Curiosity to Code', label: 'PERSONAL PROJECTS', description: 'Personal projects and experiments that bring together my technical interests and creative side.' },
    { id: 'university', title: 'Classroom to Code', label: 'UNIVERSITY PROJECTS', description: 'Coursework and academic explorations in web development, machine learning, and cloud computing.' },
  ];
  return <div className="inner-page">
    <div className="page-intro"><span className="eyebrow">IDEAS, EXPLORED</span><h1>A collection of<br /><em>learning by building.</em></h1><p>From university foundations to personal experiments, a collection of things I’ve learned by making.</p></div>
    <div className="filter-bar">
      <div className="filters" role="group" aria-label="Filter projects">{['All', 'Web', 'ML', 'Cloud'].map(option => <button key={option} className={filter === option ? 'selected' : ''} aria-pressed={filter === option} aria-controls="project-results" onClick={() => setFilter(option)}>{option === 'All' ? 'All projects' : option === 'ML' ? 'Machine learning' : option === 'Web' ? 'Web development' : 'Cloud'}</button>)}</div>
      <span className="project-count" role="status" aria-atomic="true">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'}</span>
    </div>
    <div id="project-results" className="project-groups">
      {groups.map(group => {
        const entries = filtered.filter(project => project.group === group.id);
        return <section className="project-group" key={group.id} aria-labelledby={`${group.id}-projects-heading`}>
          <div className="section-heading"><div><span className="section-kicker">{group.label}</span><h2 id={`${group.id}-projects-heading`}>{group.title}</h2><p className="project-group-description">{group.description}</p></div></div>
          {entries.length ? <div className={`project-grid projects-full${group.id === 'university' ? ' project-grid-compact' : ''}`}>{entries.map(project => <ProjectCard key={project.id} project={project} />)}</div> : <p className="project-group-empty">No projects in this section match the selected filter.</p>}
        </section>;
      })}
    </div>
  </div>;
}

function Contact() {
  return <div className="inner-page contact-page">
    <span className="eyebrow">LET’S MAKE A CONNECTION</span>
    <h1>A conversation today.<br /><em>A possibility tomorrow.</em></h1>
    <p>Have an idea, an opportunity, or a shared interest in technology?<br />Connect, explore my code, or say hello.</p>
    <div className="contact-actions">
      <LinkedInLink className="button contact-social-link" showArrow={false}>
        <span className="contact-platform-icon"><span className="linkedin-icon" aria-hidden="true">in</span></span>
        <span className="contact-link-copy"><strong>Connect on LinkedIn</strong><small>linkedin.com/in/gargimk</small></span>
      </LinkedInLink>
      <GitHubLink className="button contact-social-link" showArrow={false}>
        <span className="contact-platform-icon"><GitHubIcon /></span>
        <span className="contact-link-copy"><strong>View code on GitHub</strong><small>github.com/git-gargimk</small></span>
      </GitHubLink>
      <InstagramLink className="button contact-social-link" showArrow={false}>
        <span className="contact-platform-icon"><InstagramIcon /></span>
        <span className="contact-link-copy"><strong>Find me on Instagram</strong><small>instagram.com/chhand.reghancha</small></span>
      </InstagramLink>
    </div>
    <div className="contact-note"><span className="tiny-dot" aria-hidden="true" /> BASED IN THE GREATER SEATTLE AREA</div>
  </div>;
}

function tabFromHash() { return tabs.find(tab=>tab.toLowerCase()===window.location.hash.slice(1)) || 'About'; }

export function App() {
  const [activeTab, setActiveTab] = useState(tabFromHash);
  const [showBackToTop, setShowBackToTop] = useState(() => window.scrollY > 400);
  const tabRefs = useRef([]);
  const panelRefs = useRef({});
  const mainRef = useRef(null);
  const focusPanel = useRef(false);
  const focusSection = useRef(null);
  useEffect(() => {
    const update = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    const sync = () => {
      focusPanel.current = true;
      focusSection.current = window.history.state?.sectionId || null;
      setActiveTab(tabFromHash());
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    document.title = `${activeTab} — Gargi Kulkarni`;
    if (focusPanel.current) {
      const section = focusSection.current && document.getElementById(focusSection.current);
      const target = section || panelRefs.current[activeTab];
      target?.focus({ preventScroll: true });
      if (section) section.scrollIntoView?.({ block: 'start', behavior: 'instant' });
      focusPanel.current = false;
      focusSection.current = null;
    }
  }, [activeTab]);
  function navigate(tab, { moveFocus = false, sectionId = null } = {}) {
    focusPanel.current = moveFocus;
    focusSection.current = sectionId;
    if (window.location.hash !== `#${tab.toLowerCase()}`) window.history.pushState({ sectionId }, '', `#${tab.toLowerCase()}`);
    if (activeTab === tab && moveFocus) {
      const section = sectionId && document.getElementById(sectionId);
      (section || panelRefs.current[tab])?.focus({ preventScroll: true });
      if (section) section.scrollIntoView?.({ block: 'start', behavior: 'instant' });
      focusPanel.current = false;
      focusSection.current = null;
    }
    setActiveTab(tab);
    if (!sectionId || activeTab !== tab) window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function handleTabKey(event, index) {
    let next;
    if (event.key==='ArrowRight') next=(index+1)%tabs.length;
    if (event.key==='ArrowLeft') next=(index+tabs.length-1)%tabs.length;
    if (event.key==='Home') next=0;
    if (event.key==='End') next=tabs.length-1;
    if (next!==undefined) {event.preventDefault();navigate(tabs[next]);tabRefs.current[next].focus();}
  }
  function backToTop() {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    tabRefs.current[tabs.indexOf(activeTab)]?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  }
  return <div className="site-shell">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); mainRef.current?.focus(); }}>Skip to main content</a>
    <header className="site-header"><a className="brand" href="#about" aria-label="Gargi Kulkarni home" onClick={event => { event.preventDefault(); navigate('About', { moveFocus: true }); }}><span className="brand-mark" aria-hidden="true">gk</span><span>Gargi Kulkarni</span></a><div className="tabs" role="tablist" aria-label="Portfolio sections">{tabs.map((tab,index)=><button key={tab} ref={el=>tabRefs.current[index]=el} role="tab" id={`tab-${tab.toLowerCase()}`} aria-controls={`panel-${tab.toLowerCase()}`} aria-selected={tab===activeTab} tabIndex={tab===activeTab?0:-1} className={tab===activeTab?'active':''} onClick={()=>navigate(tab)} onKeyDown={event=>handleTabKey(event,index)}>{tab}</button>)}</div><nav className="header-socials" aria-label="Social profiles"><LinkedInLink className="header-social"><span className="linkedin-icon" aria-hidden="true">in</span><span className="sr-only">LinkedIn profile</span></LinkedInLink><GitHubLink className="header-social"><GitHubIcon /><span className="sr-only">GitHub profile</span></GitHubLink><InstagramLink className="header-social" showArrow={false}><InstagramIcon /><span className="sr-only">Instagram profile</span></InstagramLink></nav></header>
    <main id="main-content" ref={mainRef} tabIndex={-1}>
      {tabs.map(tab => (
        <section key={tab} id={`panel-${tab.toLowerCase()}`} className="tab-panel" ref={element => panelRefs.current[tab] = element} role="tabpanel" aria-labelledby={`tab-${tab.toLowerCase()}`} tabIndex={0} hidden={activeTab !== tab}>
          {activeTab === tab && (tab === 'About' ? <About navigate={(destination, sectionId) => navigate(destination, { moveFocus: true, sectionId })}/> : tab === 'Experience' ? <Experience/> : tab === 'Projects' ? <Projects/> : <Contact/>)}
        </section>
      ))}
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} Gargi Kulkarni</span><span className="footer-note">A little curiosity goes a long way.</span><div className="footer-socials"><LinkedInLink className="footer-link" showArrow={false}>LinkedIn</LinkedInLink><GitHubLink className="footer-link" showArrow={false}>GitHub</GitHubLink><InstagramLink className="footer-link" showArrow={false} /></div></footer>
    {showBackToTop && <button className="back-to-top" type="button" aria-label="Back to top" title="Back to top" onClick={backToTop}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20V4m-6 6 6-6 6 6" /></svg><span className="back-to-top-label">Back to top</span></button>}
  </div>;
}

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);
