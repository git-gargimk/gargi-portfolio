import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const LINKEDIN = 'https://www.linkedin.com/in/gargimrunalkulkarni/';
const tabs = ['About', 'Experience', 'Projects', 'Contact'];
const projects = [
  { id: 'planning', title: 'Planning Poker', category: 'Web development', type: 'Web', year: '2016', description: 'An interactive estimation app for teams, with real-time collaboration.', tags: ['AngularJS', 'Socket.IO', 'Express', 'MongoDB'], details: 'A curriculum project connecting a web interface with live interactions and a server-backed database.', art: 'poker' },
  { id: 'yelp', title: 'Reading between the reviews', category: 'Machine learning', type: 'ML', year: '2016', description: 'Opinion mining on Yelp reviews using support vector machines.', tags: ['Python', 'NLTK', 'scikit-learn', 'Weka'], details: 'Classifies review sentiment and compares a Python implementation with Weka.', art: 'sentiment' },
  { id: 'cloud', title: 'From code to cloud', category: 'Cloud computing', type: 'Cloud', year: '2016', description: 'Web application deployment on Amazon EC2.', tags: ['AWS', 'EC2', 'Distributed systems'], details: 'Exploring cloud infrastructure through instance configuration and application deployment.', art: 'cloud' },
  { id: 'comments', title: 'A place for conversation', category: 'Web development', type: 'Web', year: '2016', description: 'A React comment app with JSON persistence.', tags: ['React', 'Node.js', 'Express', 'CSS'], details: 'A full stack application that lets users add and persist comments.', art: 'comments' },
  { id: 'houses', title: 'Making sense of house prices', category: 'Machine learning', type: 'ML', year: '2016', description: 'Advanced regression techniques for a Kaggle competition.', tags: ['Regression', 'Data analysis', 'Kaggle'], details: 'Iterating on predictive analysis for the House Prices competition.', art: 'houses' },
  { id: 'prof', title: 'RateThyProf', category: 'Web development', type: 'Web', year: '2016', description: 'A single-page professor and university rating app.', tags: ['AngularJS', 'Hapi.js', 'MongoDB'], details: 'Students can create accounts, find professors, and contribute ratings.', art: 'prof' },
];

function Arrow({ diagonal = false, ...props }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function LinkedInLink({ children = 'Let’s connect', className = '' }) {
  return <a className={className} href={LINKEDIN} target="_blank" rel="noreferrer">{children}<Arrow diagonal /></a>;
}

function HeroArt() {
  return <div className="hero-art" aria-label="An illustration connecting an interface, code, and ideas" role="img">
    <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
    <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">+</span>
    <div className="art-label label-top"><span className="tiny-dot" /> A little logic. A lot of possibility.</div>
    <div className="art-window">
      <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>an idea, brought to life</span><span>↗</span></div>
      <div className="window-content"><div className="art-avatar">g<span>.</span></div><div className="art-line long" /><div className="art-line short" /><div className="art-grid"><div><span /><span /><span /></div><div><span /><span /><span /></div></div><div className="art-button">hello, world <span>↗</span></div></div>
    </div>
    <div className="code-note"><div><span className="code-dot" /> behind the interface</div><code><span>const</span> possibility = {'{'}<br />&nbsp; curiosity: <b>true</b>,<br />&nbsp; ideas: <em>'endless'</em><br />{'}'};</code></div>
    <div className="art-label label-bottom"><span className="brackets">{'{ }'}</span> Thoughtfully built, end to end.</div>
  </div>;
}

function ProjectArt({ kind }) {
  return <div className={`project-art ${kind}`} aria-hidden="true">
    <span className="art-caption">{kind === 'poker' ? 'A SHARED POINT OF VIEW' : kind === 'sentiment' ? 'FINDING THE SIGNAL' : kind === 'cloud' ? 'CONNECTED BY DESIGN' : kind === 'comments' ? 'START A CONVERSATION' : kind === 'houses' ? 'PATTERNS INTO PREDICTIONS' : 'KNOWLEDGE, SHARED'}</span>
    {kind === 'poker' ? <div className="poker-cards"><span>3<small>✦</small></span><span>5<small>✦</small></span><span>8<small>✦</small></span></div>
    : kind === 'sentiment' ? <div className="sentiment-art"><div className="review-bubble">“A wonderful experience.”<span>● ● ● ● ●</span></div><div className="signal-line" /><div className="sentiment-result"><span>✳</span> positive <b>↗</b></div></div>
    : kind === 'cloud' ? <div className="cloud-art"><span className="cloud-symbol">☁</span><div className="cloud-connection" /><div className="server-stack"><i /><i /><i /></div><span className="cloud-node n-one" /><span className="cloud-node n-two" /></div>
    : kind === 'comments' ? <div className="comment-art"><span>Let’s build something.</span><span>One idea at a time. <b>↵</b></span></div>
    : kind === 'houses' ? <div className="chart-art">{[30,48,42,65,55,78,92].map((height,i)=><i key={i} style={{height: `${height}%`}} />)}<span>↗</span></div>
    : <div className="prof-art"><span>R<span>✦</span></span><div>★★★★★</div></div>}
    <span className="art-index">{kind === 'poker' ? '01' : kind === 'sentiment' ? '02' : kind === 'cloud' ? '03' : kind === 'comments' ? '04' : kind === 'houses' ? '05' : '06'} / EXPLORATIONS</span>
  </div>;
}

function ProjectCard({ project, onOpen }) {
  return <button className="project-card" onClick={() => onOpen(project)} aria-label={`Explore ${project.title}`}>
    <ProjectArt kind={project.art} />
    <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
    <div className="project-title"><h3>{project.title}</h3><Arrow diagonal /></div>
    <p>{project.description}</p>
  </button>;
}

function About({ navigate, onOpen }) {
  return <>
    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><span className="tiny-dot" /> FULL STACK DEVELOPER</div><h1>Hi, I’m Gargi.<br />Ideas into code.<br /><em>Code into impact.</em></h1><p>From the first interaction to the systems behind it.<br className="desktop-break" /> A full stack perspective on building software.</p><div className="hero-actions"><button className="button primary" onClick={() => navigate('Projects')}>Explore my work <Arrow /></button><LinkedInLink className="text-link" /></div><div className="hero-location"><svg width="15" height="17" viewBox="0 0 20 24" fill="none" aria-hidden="true"><path d="M18 9c0 6-8 13-8 13S2 15 2 9a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/></svg> Greater Seattle Area <span>·</span> Engineering at Microsoft</div></div>
      <HeroArt />
    </section>
    <section className="intro-strip"><span className="section-kicker">A LITTLE ABOUT ME</span><p>A developer with a full stack foundation and a growing interest in machine learning. My work connects web experiences, data, and cloud systems.</p><button className="round-link" aria-label="View my experience" onClick={() => navigate('Experience')}><Arrow /></button></section>
    <section className="selected-section"><div className="section-heading"><div><span className="section-kicker">A FEW THINGS I’VE BUILT</span><h2>From curiosity to creation<span>.</span></h2></div><button className="text-link" onClick={() => navigate('Projects')}>All projects <Arrow /></button></div><div className="project-grid">{projects.slice(0,3).map(project=><ProjectCard key={project.id} project={project} onOpen={onOpen} />)}</div></section>
    <section className="closing"><span className="asterisk">✳</span><h2>Good things start<br />with a conversation.</h2><LinkedInLink className="button primary" /></section>
  </>;
}

function Experience() {
  return <div className="inner-page"><div className="page-intro"><span className="eyebrow">THE JOURNEY SO FAR</span><h1>Experience that<br /><em>builds perspective.</em></h1><p>Software engineering, continuous learning, and the people along the way.</p></div>
    <section className="experience-layout"><div><span className="section-kicker">PROFESSIONAL EXPERIENCE</span><article className="timeline-item"><div className="company-mark microsoft"><i /><i /><i /><i /></div><div><span className="subtle-label">SOFTWARE ENGINEERING</span><h2>Microsoft</h2><p>Greater Seattle Area</p><LinkedInLink className="text-link">Experience on LinkedIn</LinkedInLink></div></article>
    <article className="timeline-item"><div className="company-mark volunteer">↗</div><div><span className="subtle-label">VOLUNTEERING · 2013–2015</span><h2>Accenture CSR</h2><p>Community visits supporting nonprofit organizations.</p></div></article></div>
    <aside className="education-panel"><span className="section-kicker">EDUCATION</span><span className="education-icon">↗</span><h3>Master’s in<br />Computer Science</h3><p>California State University,<br />Fullerton</p><span className="subtle-label">2015–2017</span><hr /><span className="section-kicker">CONTINUED LEARNING</span><p className="learning-name">Supervised Machine Learning</p><span className="subtle-label">DEEPLEARNING.AI / STANFORD · 2025</span><p className="learning-name">Advanced Learning Algorithms</p><span className="subtle-label">DEEPLEARNING.AI / STANFORD · 2026</span></aside></section>
    <section className="toolbox"><span className="section-kicker">TECHNOLOGIES ACROSS MY PROJECTS</span><div>{['React', 'JavaScript', 'Node.js', 'Python', 'AngularJS', 'MongoDB', 'AWS', 'scikit-learn'].map(tag=><span key={tag}>{tag}</span>)}</div></section>
  </div>;
}

function Projects({ onOpen }) {
  const [filter, setFilter] = useState('All');
  const filtered = projects.filter(project => filter === 'All' || project.type === filter);
  return <div className="inner-page"><div className="page-intro"><span className="eyebrow">IDEAS, EXPLORED</span><h1>A collection of<br /><em>learning by building.</em></h1><p>Selected academic projects across web development, machine learning, and the cloud.</p></div><div className="filter-bar"><div className="filters" aria-label="Filter projects">{['All', 'Web', 'ML', 'Cloud'].map(option=><button key={option} className={filter===option?'selected':''} aria-pressed={filter===option} onClick={()=>setFilter(option)}>{option === 'All' ? 'All projects' : option === 'ML' ? 'Machine learning' : option === 'Web' ? 'Web development' : 'Cloud'}</button>)}</div><span className="project-count" aria-live="polite">{String(filtered.length).padStart(2, '0')} projects</span></div><div className="project-grid projects-full">{filtered.map(project=><ProjectCard key={project.id} project={project} onOpen={onOpen}/>)}</div></div>;
}

function Contact() {
  const [copied, setCopied] = useState(false);
  async function copyProfile() {
    try { await navigator.clipboard.writeText(LINKEDIN); setCopied(true); } catch { setCopied(false); }
  }
  return <div className="inner-page contact-page"><span className="contact-star" aria-hidden="true">✳</span><span className="eyebrow">LET’S MAKE A CONNECTION</span><h1>A conversation today.<br /><em>A possibility tomorrow.</em></h1><p>Have an idea, an opportunity, or a shared interest in technology?<br />Find me on LinkedIn and let’s start there.</p><LinkedInLink className="button primary">Say hello on LinkedIn</LinkedInLink><div className="contact-profile"><span className="linkedin-icon">in</span><div><span>Gargi Kulkarni</span><small>linkedin.com/in/gargimrunalkulkarni</small></div><button className="copy-button" onClick={copyProfile} aria-label="Copy LinkedIn profile URL">{copied ? 'Copied ✓' : 'Copy link'}</button></div><span className="copy-status" role="status">{copied ? 'Profile link copied to clipboard.' : ''}</span><div className="contact-note"><span className="tiny-dot" /> BASED IN THE GREATER SEATTLE AREA</div></div>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.showModal(); }, []);
  return <dialog ref={ref} className="project-dialog" aria-label={project.title} onCancel={onClose} onClick={event => { if(event.target===event.currentTarget) onClose(); }}><button className="dialog-close" aria-label="Close project details" onClick={onClose}>×</button><ProjectArt kind={project.art} /><div className="dialog-body"><span className="section-kicker">{project.category} · {project.year}</span><h2>{project.title}</h2><p>{project.description} {project.details}</p><div className="project-tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div><LinkedInLink className="text-link">View LinkedIn projects</LinkedInLink></div></dialog>;
}

function tabFromHash() { return tabs.find(tab=>tab.toLowerCase()===window.location.hash.slice(1)) || 'About'; }

function App() {
  const [activeTab, setActiveTab] = useState(tabFromHash);
  const [openProject, setOpenProject] = useState(null);
  const tabRefs = useRef([]);
  useEffect(() => { const sync = () => setActiveTab(tabFromHash()); window.addEventListener('hashchange',sync); return ()=>window.removeEventListener('hashchange',sync); }, []);
  useEffect(() => { document.title = `${activeTab} — Gargi Kulkarni`; }, [activeTab]);
  function navigate(tab) { setActiveTab(tab); window.location.hash = tab.toLowerCase(); window.scrollTo({top: 0, behavior: 'instant'}); }
  function handleTabKey(event, index) {
    let next;
    if (event.key==='ArrowRight') next=(index+1)%tabs.length;
    if (event.key==='ArrowLeft') next=(index+tabs.length-1)%tabs.length;
    if (event.key==='Home') next=0;
    if (event.key==='End') next=tabs.length-1;
    if (next!==undefined) {event.preventDefault();navigate(tabs[next]);tabRefs.current[next].focus();}
  }
  return <div className="site-shell"><header className="site-header"><a className="brand" href="#about" aria-label="Gargi Kulkarni home" onClick={()=>navigate('About')}><span className="brand-mark">g<span>.</span></span><span>Gargi Kulkarni<span className="brand-description">A PERSONAL PORTFOLIO</span></span></a><nav className="tabs" role="tablist" aria-label="Portfolio sections">{tabs.map((tab,index)=><button key={tab} ref={el=>tabRefs.current[index]=el} role="tab" id={`tab-${tab.toLowerCase()}`} aria-controls={`panel-${tab.toLowerCase()}`} aria-selected={tab===activeTab} tabIndex={tab===activeTab?0:-1} className={tab===activeTab?'active':''} onClick={()=>navigate(tab)} onKeyDown={event=>handleTabKey(event,index)}>{tab}<span className="tab-dot" /></button>)}</nav><LinkedInLink className="header-social"><span className="linkedin-icon">in</span><span className="sr-only">LinkedIn profile</span></LinkedInLink></header>
    <main id={`panel-${activeTab.toLowerCase()}`} role="tabpanel" aria-labelledby={`tab-${activeTab.toLowerCase()}`} tabIndex={0} key={activeTab}>
      {activeTab==='About' ? <About navigate={navigate} onOpen={setOpenProject}/> : activeTab==='Experience' ? <Experience/> : activeTab==='Projects' ? <Projects onOpen={setOpenProject}/> : <Contact/>}
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} Gargi Kulkarni</span><span className="footer-note">A little curiosity goes a long way.</span><LinkedInLink className="footer-link">Find me on LinkedIn</LinkedInLink></footer>
    {openProject && <ProjectDialog project={openProject} onClose={()=>setOpenProject(null)}/>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
