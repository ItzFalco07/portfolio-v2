import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import validator from 'validator';
import dynamic from 'next/dynamic';

const EarthCanvas = dynamic(() => import('./EarthCanvas'), { ssr: false });

const StarBackground = () => {
  const generateStars = useMemo(() => {
    return Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  const [stars, setStars] = useState(generateStars);

  useEffect(() => {
    const handleResize = () => setStars(generateStars);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [generateStars]);

  useEffect(() => {
    const animateStars = () => {
      setStars((prevStars) =>
        prevStars.map((star) => ({
          ...star,
          y: (star.y + star.speed) % window.innerHeight,
        }))
      );
      requestAnimationFrame(animateStars);
    };

    const animationId = requestAnimationFrame(animateStars);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="absolute w-full h-full inset-0 pointer-events-none">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: Math.random() * 0.5 + 0.5,
          }}
        />
      ))}
    </div>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [loadingButton, setLoadingButton] = useState(false);
  const [cooldown, setCooldown] = useState({ isRunning: false, seconds: 0 });

  const formRef = useRef();
  const formContainerRef = useRef(null);
  const earthContainerRef = useRef(null);

  const formInView = useInView(formContainerRef, { once: true });
  const earthInView = useInView(earthContainerRef, { once: true });
  const formControls = useAnimation();
  const earthControls = useAnimation();

  const SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY;

  useEffect(() => {
    if (formInView) formControls.start({ x: 0, opacity: 1, transition: { duration: 1 } });
    if (earthInView) earthControls.start({ x: 0, opacity: 1, transition: { duration: 1 } });
  }, [formInView, earthInView, formControls, earthControls]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const sendEmail = useCallback(
    (e) => {
      e.preventDefault();
      if (cooldown.isRunning) {
        toast(`Please wait ${60 - cooldown.seconds} seconds`);
        return;
      }

      const { name, email, message } = formState;
      if (!name || !email || !message) {
        toast.error('Please fill in all fields');
        return;
      }

      if (!validator.isEmail(email)) {
        toast.error('Invalid email address');
        return;
      }

      setLoadingButton(true);
      emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
        .then(() => {
          toast.success('Email Sent!');
          setCooldown({ isRunning: true, seconds: 0 });
          setLoadingButton(false);
        })
        .catch(() => {
          toast.error('Failed to send email');
          setLoadingButton(false);
        });
    },
    [formState, cooldown.isRunning, cooldown.seconds, SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY]
  );

  useEffect(() => {
    if (cooldown.isRunning) {
      const interval = setInterval(() => {
        setCooldown((prev) => ({
          ...prev,
          seconds: prev.seconds + 1,
          isRunning: prev.seconds < 59,
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown.isRunning]);

  return (
    <div id="contact" className="w-full relative min-h-screen text-white bg-[#050816] flex overflow-hidden">
      <StarBackground />
      <motion.div
        ref={formContainerRef}
        initial={{ x: -200, opacity: 0 }}
        animate={formControls}
        className="form bg-[#090325] py-[3em] my-auto px-[3em] w-[fit-content]"
      >
        <h3 className="text-zinc-400">GET IN TOUCH</h3>
        <h1 className="font-black text-6xl">Contact.</h1>
        <form ref={formRef} onSubmit={sendEmail} className="gap-[2em] mt-[2em]">
          {['name', 'email', 'message'].map((field) => (
            <div key={field} className="mt-[2em]">
              <label htmlFor={field} className="w-full text-[1.1em] capitalize">
                {`Enter ${field}:`}
              </label>
              {field === 'message' ? (
                <textarea
                  id={field}
                  name={field}
                  onChange={handleInputChange}
                  value={formState[field]}
                  placeholder={`What's your ${field}?`}
                  className="h-[10em] w-full bg-[#151030] text-zinc-100 py-2 rounded-[6px] px-[1em] mt-2"
                />
              ) : (
                <input
                  id={field}
                  name={field}
                  onChange={handleInputChange}
                  value={formState[field]}
                  placeholder={`What's your ${field}?`}
                  className="w-full bg-[#151030] text-zinc-100 py-2 rounded-[6px] px-[1em] mt-2"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className={`${
              loadingButton ? 'bg-zinc-500' : 'bg-[#925eff] hover:bg-[#543497]'
            } w-full px-[1em] py-[0.7em] font-semibold rounded-[10px] mt-[2em]`}
          >
            {loadingButton ? <i className="fa fa-spinner fa-spin" /> : 'Send'}
          </button>
        </form>
      </motion.div>
      <motion.div
        ref={earthContainerRef}
        initial={{ x: 200, opacity: 0 }}
        animate={earthControls}
        className="earth w-[50%] mx-auto h-[100vh]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default Contact;
