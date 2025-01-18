"use client"
import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import Logo from '/public/Logo.svg';
import menu from '/public/menu.svg';
import close from '/public/close.svg';
import DesktopCanvas from '@/components/DesktopCanvas';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemsRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const loaderRef = useRef(null);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
    if (itemsRef.current) {
      itemsRef.current.style.right = menuOpen ? '-100%' : '0';
      document.body.style.overflow = menuOpen ? 'auto' : 'hidden';
    }
  }, [menuOpen]);

  const scrollToSection = useCallback((ref) => {
    if (ref?.current) {
      setMenuOpen(false);
      itemsRef.current.style.right = '-100%';
      document.body.style.overflow = 'auto';
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (loaderRef.current && !loading) {
      loaderRef.current.style.top = '-100vh';
      document.body.style.overflow = 'auto';
    }
  }, [loading]);

  return (
    <>
      <Head>
        <title>Your Name - Portfolio</title>
        <meta name="description" content="Portfolio showcasing my web development projects." />
        <meta name="keywords" content="web development, React, JavaScript, portfolio, MERN stack, web developer" />
      </Head>
      <Loader loaderRef={loaderRef} />
      <div id="hero" className="overflow-x-hidden w-full h-screen text-white relative z-[10]">
        {/* Menu */}
        <div
          className="item-container absolute w-[70%] h-screen bg-[#0d102b] z-[20] right-[-100%] flex flex-col items-center justify-center gap-[1em] text-xl"
          ref={itemsRef}
        >
          <button onClick={() => scrollToSection(skillsRef)} className="cursor-pointer">
            Skills
          </button>
          <button onClick={() => scrollToSection(projectsRef)} className="cursor-pointer">
            Projects
          </button>
          <a href="https://www.upwork.com/freelancers/~0184cf5697571fafe6">Hire Me</a>
        </div>

        {/* Navbar */}
        <div className="w-full h-[50vh] nav">
          <nav className="w-full h-[70px] px-[14em] flex justify-between items-center">
            <Image src={Logo} alt="Portfolio logo" className="logo w-[15em]" />
            <div className="links-con flex items-center">
              <div className="links text mx-[2em] h-full gap-[2em] z-[21] w-[34%] flex justify-between items-center">
                <button onClick={() => scrollToSection(skillsRef)} className="Link relative font-medium tracking-widest hover:text-[#925eff]">
                  Skills
                </button>
                <button onClick={() => scrollToSection(projectsRef)} className="Link relative font-medium tracking-widest hover:text-[#925eff]">
                  Projects
                </button>
              </div>
              <a href="https://www.upwork.com/freelancers/~0184cf5697571fafe6">
                <button className="z-[21] btn font-medium ml-[2em] w-[8em] rounded-[6px] px-[20px] py-[8px] break-keep font-bold">
                  Hire Me
                </button>
              </a>
            </div>
            <Image
              src={menuOpen ? close : menu}
              onClick={toggleMenu}
              className="menu-icon hidden z-[26] cursor-pointer"
              alt="menu toggle"
            />
          </nav>

          {/* Hero Section */}
          <div className="text-stuff w-full h-full px-[18em] pt-[3em] flex">
            <div className="w-[50px] h-full flex flex-col items-center">
              <div className="ball rounded-full w-[20px] h-[20px] bg-[#925eff]"></div>
              <div className="stripe h-[60%] w-[4px]"></div>
            </div>
            <div className="text">
              <h1 className="heroH">
                Hi, I'm <span id="special">Falco</span>
              </h1>
              <p className="text-xl font-medium para">
                Fullstack Web Developer <br /> and Designer
              </p>
              <div className="contacts flex mt-[2em] gap-[1.2em]">
                <a href="https://github.com/ItzFalco07" className="social fa-brands fa-github fa-xl"></a>
                <a href="https://www.upwork.com/freelancers/~0184cf5697571fafe6" className="social fa-brands fa-upwork fa-xl"></a>
                <a href="https://t.me/+nygHO4lU-hIyNWRl" className="social fa-solid fa-paper-plane fa-lg"></a>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div id="hi" className="absolute overflow-hidden bottom-[-3em] w-full h-[60vh] z-[10]">
          <DesktopCanvas setLoading={setLoading} />
        </div>
      </div>
      <Skills skillsRef={skillsRef} />
      <Projects projectsRef={projectsRef} />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
