"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const HeroSection = () => {
  const imageRef = useRef(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true;
      
      setIsAppInstalled(isStandalone);
      
      if (isStandalone) {
        setInstallable(false);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsAppInstalled(true);
      setInstallable(false);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    checkInstalled();
    
    document.addEventListener('visibilitychange', checkInstalled);
    
    const intervalCheck = setInterval(checkInstalled, 2000);

    const imageElement = imageRef.current;
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement?.classList.add("scrolled");
      } else {
        imageElement?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('visibilitychange', checkInstalled);
      clearInterval(intervalCheck);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
        setDeferredPrompt(null);
        setInstallable(false);
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      } catch (error) {
        console.error('Error during installation:', error);
      }
    } else if (isAppInstalled) {
      try {
        window.location.href = window.location.origin;
      } catch (e) {
        console.error('Could not open app:', e);
      }
    } else {
      console.log('Cannot install: Install prompt not available');
    }
  };

  return (
    <section className="pt-20 lg:pt-30 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 -mt-24 gradient-title">
          Manage Your Finances <br /> with Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A smart, AI-powered financial management platform that provides
          real-time insights to help you monitor, evaluate, and improve your
          spending habits.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          {!isAppInstalled && installable && (
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8" 
              onClick={handleInstallClick}
              // disabled={!installable}
            >
              {installable ? "Get App" : "Open in App"}
            </Button>
          )}
          {/* {isAppInstalled && !window.matchMedia('(display-mode: standalone)').matches && (
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8" 
              onClick={() => window.location.href = window.location.origin}
            >
              Open in App
            </Button>
          )} */}
        </div>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/wealth-app-ui.svg"
              width={1200}
              height={400}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
    </section>
  );
};

export default HeroSection;