"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function BodyMap() {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState(1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();

  // Detect touch device and screen size properly
  useEffect(() => {
    const checkDeviceAndSize = () => {
      const currentWidth = window.innerWidth;
      setScreenWidth(currentWidth);
    };
    
    checkDeviceAndSize();
    window.addEventListener('resize', checkDeviceAndSize);
    return () => window.removeEventListener('resize', checkDeviceAndSize);
  }, []);

  // Check URL parameter for modal state
  useEffect(() => {
    const showBodymap = searchParams.get('showBodymap');
    if (showBodymap === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Persist modal state across navigation
  useEffect(() => {
    const savedModalState = sessionStorage.getItem('bodyMapModalOpen');
    if (savedModalState === 'true') {
      setIsModalOpen(true);
    }
  }, []);

  // Save modal state to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem('bodyMapModalOpen', isModalOpen.toString());
  }, [isModalOpen]);

  // Responsive link positioning - maintains symmetry across screen sizes
  const getLinkPositions = () => {
    const isSmallScreen = screenWidth < 768;
    const isMediumScreen = screenWidth >= 768 && screenWidth < 900;
    const isLargeMediumScreen = screenWidth >= 900 && screenWidth < 1000;
    const isLargeScreen = screenWidth >= 1000;
    
    // Neck center point (around the middle of the neck in the SVG)
    const neckCenterX = 510;
    const neckCenterY = 300;
    
    // Responsive radius based on screen size - original sizes for modal
    let baseRadius = 160;
    if (isSmallScreen) {
      baseRadius = 140;
    } else if (isMediumScreen) {
      baseRadius = 200;
    } else if (isLargeMediumScreen) {
      baseRadius = 180;
    } else if (isLargeScreen) {
      baseRadius = 160;
    }
    
    // Neck radius - smaller since neck is narrower than head
    let neckRadius = 80;
    if (isSmallScreen) {
      neckRadius = 70;
    } else if (isMediumScreen) {
      neckRadius = 90;
    } else if (isLargeMediumScreen) {
      neckRadius = 85;
    } else if (isLargeScreen) {
      neckRadius = 80;
    }
    
    return [
      { 
        label: "Insomnia", 
        href: "/symptoms/insomnia", 
        angle: 180, 
        radius: baseRadius - 10,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Depression", 
        href: "/symptoms/depression", 
        angle: 210, 
        radius: baseRadius - 5,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Anxiety", 
        href: "/symptoms/anxiety", 
        angle: 330, 
        radius: baseRadius - 5,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Brain Fog", 
        href: "/symptoms/brain-fog", 
        angle: 0, 
        radius: baseRadius,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Migraine", 
        href: "/symptoms/migraine", 
        angle: 270, 
        radius: (baseRadius + 20) * 0.65,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Tension Headaches", 
        href: "/symptoms/muscle-tension", 
        angle: 25, 
        radius: baseRadius + 40,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Emotional Burnout", 
        href: "/symptoms/burnout", 
        angle: 155,
        radius: baseRadius + 40,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Thyroid Issues", 
        href: "/symptoms/thyroid-issues", 
        angle: 180,
        radius: neckRadius + 60,
        centerX: neckCenterX,
        centerY: neckCenterY,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Neck Tension", 
        href: "/symptoms/neck-tension", 
        angle: 0,
        radius: neckRadius + 60,
        centerX: neckCenterX,
        centerY: neckCenterY,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Blood Pressure Balance", 
        href: "/symptoms/blood-pressure", 
        angle: 345,
        radius: 180,
        centerX: 580,
        centerY: 450,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Heart Muscle Support", 
        href: "/symptoms/heart-support", 
        angle: 5,
        radius: 175,
        centerX: 580,
        centerY: 450,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Liver Function Support / Toxicity", 
        href: "/symptoms/liver-detox", 
        angle: 180,
        radius: 120,
        centerX: 350,
        centerY: 550,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Hormonal Imbalances", 
        href: "/symptoms/hormonal-imbalances", 
        angle: 150,
        radius: 120,
        centerX: 350,
        centerY: 550,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Overload", 
        href: "/symptoms/adrenal-overload", 
        angle: 0,
        radius: 200,
        centerX: 650,
        centerY: 600,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Exhaustion", 
        href: "/symptoms/adrenal-exhaustion", 
        angle: 17.5,
        radius: 200,
        centerX: 650,
        centerY: 600,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Circadian Support", 
        href: "/symptoms/circadian-support", 
        angle: 342.5,
        radius: 200,
        centerX: 650,
        centerY: 600,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Vagus Nerve Support", 
        href: "/symptoms/vagus-nerve", 
        angle: 180,
        radius: 170,
        centerX: 530,
        centerY: 715,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Dysbiosis", 
        href: "/symptoms/dysbiosis", 
        angle: 160,
        radius: 170,
        centerX: 530,
        centerY: 715,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "Leaky Gut / Leaky Brain", 
        href: "/symptoms/leaky-gut", 
        angle: 0,
        radius: 170,
        centerX: 530,
        centerY: 715,
        mobileOffset: { x: 0, y: 0 }
      },
      { 
        label: "IBS", 
        href: "/symptoms/ibs", 
        angle: 20,
        radius: 170,
        centerX: 530,
        centerY: 715,
        mobileOffset: { x: 0, y: 0 }
      },
    ];
  };

  // Show links if hovering head, neck, heart, liver, adrenals, or digestive (desktop) OR if on touch device (mobile)
  const isMobile = screenWidth < 768;
  const shouldShowLinks = (hoveredArea === "head" || hoveredArea === "neck" || hoveredArea === "heart" || hoveredArea === "liver" || hoveredArea === "adrenals" || hoveredArea === "digestive") && !isMobile;

  // Organized navigation structure for affiliate marketing
  const navigationCategories = {
    symptoms: {
      title: "Symptoms & Conditions",
      icon: "🩺",
      items: [
        { label: "Insomnia", href: "/symptoms/insomnia" },
        { label: "Depression", href: "/symptoms/depression" },
        { label: "Anxiety", href: "/symptoms/anxiety" },
        { label: "Brain Fog", href: "/symptoms/brain-fog" },
        { label: "Migraine", href: "/symptoms/migraine" },
        { label: "Tension Headaches", href: "/symptoms/muscle-tension" },
        { label: "Emotional Burnout", href: "/symptoms/burnout" },
        { label: "Thyroid Issues", href: "/symptoms/thyroid-issues" },
        { label: "Neck Tension", href: "/symptoms/neck-tension" },
        { label: "Blood Pressure Balance", href: "/symptoms/blood-pressure" },
        { label: "Heart Muscle Support", href: "/symptoms/heart-support" },
        { label: "Liver Function Support / Toxicity", href: "/symptoms/liver-detox" },
        { label: "Hormonal Imbalances", href: "/symptoms/hormonal-imbalances" },
        { label: "Overload", href: "/symptoms/adrenal-overload" },
        { label: "Exhaustion", href: "/symptoms/adrenal-exhaustion" },
        { label: "Circadian Support", href: "/symptoms/circadian-support" },
        { label: "Vagus Nerve Support", href: "/symptoms/vagus-nerve" },
        { label: "Dysbiosis", href: "/symptoms/dysbiosis" },
        { label: "Leaky Gut / Leaky Brain", href: "/symptoms/leaky-gut" },
        { label: "IBS", href: "/symptoms/ibs" },
        { label: "Stress", href: "/symptoms/stress" },
        { label: "Fatigue", href: "/symptoms/fatigue" },
        { label: "Mood Swings", href: "/symptoms/mood-swings" },
      ]
    },
    supplements: {
      title: "Supplements",
      icon: "💊",
      items: [
        { label: "Omega-3", href: "/supplements/omega-3" },
        { label: "Vitamin D", href: "/supplements/vitamin-d" },
        { label: "Magnesium", href: "/supplements/magnesium" },
        { label: "B-Complex", href: "/supplements/b-complex" },
        { label: "L-Theanine", href: "/supplements/l-theanine" },
      ]
    },
    herbs: {
      title: "Herbal Medicines",
      icon: "🌿",
      items: [
        { label: "Lemon Balm", href: "/herbs/lemon-balm" },
        { label: "Chamomile", href: "/herbs/chamomile" },
        { label: "Lavender", href: "/herbs/lavender" },
        { label: "Valerian", href: "/herbs/valerian" },
        { label: "Ashwagandha", href: "/herbs/ashwagandha" },
        { label: "St. John's Wort", href: "/herbs/st-johns-wort" },
        { label: "Ginseng", href: "/herbs/ginseng" },
        { label: "Holy Basil", href: "/herbs/holy-basil" },
      ]
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    setActiveCategory(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    sessionStorage.removeItem('bodyMapModalOpen');
  };

  return (
    <>
      {/* Clean Interactive Body Map */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Interactive Body Map</h3>
            <p className="text-gray-600">Click to explore symptoms and conditions by body area</p>
          </div>
          
          {/* Interactive SVG */}
          <div className="relative">
            <svg
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto min-h-[300px] sm:min-h-[400px] md:min-h-[500px]"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Anatomical body map */}
              <image
                href="/images/NerveVine body nav image2.svg"
                width="1024"
                height="1024"
                preserveAspectRatio="xMidYMid meet"
              />
              
              {/* Interactive clickable areas */}
              {shouldShowLinks && (
                <div>
                  {getLinkPositions().map((link, index) => {
                    // Use custom center points for neck links, default to head center for others
                    const centerX = link.centerX || 510;
                    const centerY = link.centerY || 150;
                    
                    // Only show head links when hovering head, neck links when hovering neck, heart links when hovering heart, liver links when hovering liver, adrenal links when hovering adrenals, digestive links when hovering digestive
                    const isNeckLink = link.centerY === 300 && link.centerX === 510;
                    const isHeartLink = link.centerY === 450 && link.centerX === 580;
                    const isLiverLink = link.centerY === 550 && link.centerX === 350;
                    const isAdrenalLink = link.href.includes('adrenal') || link.href.includes('circadian');
                    const isDigestiveLink = link.centerY === 715 && link.centerX === 530;
                    const shouldShowThisLink = (hoveredArea === "head" && !isNeckLink && !isHeartLink && !isLiverLink && !isAdrenalLink && !isDigestiveLink) || 
                                           (hoveredArea === "neck" && isNeckLink) || 
                                           (hoveredArea === "heart" && isHeartLink) || 
                                           (hoveredArea === "liver" && isLiverLink) ||
                                           (hoveredArea === "adrenals" && isAdrenalLink) ||
                                           (hoveredArea === "digestive" && isDigestiveLink);
                    
                    if (!shouldShowThisLink) return null;
                    
                    const x = centerX + Math.cos((link.angle * Math.PI) / 180) * link.radius - 20;
                    const y = centerY + Math.sin((link.angle * Math.PI) / 180) * link.radius;
                    
                    // Convert SVG coordinates to percentage for absolute positioning
                    const xPercent = (x / 1024) * 100;
                    const yPercent = (y / 1024) * 100;
                    
                    return (
                      <div
                        key={index}
                        className="absolute pointer-events-auto"
                        style={{
                          left: `${xPercent}%`,
                          top: `${yPercent}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1000
                        }}
                        onMouseEnter={() => setHoveredArea(hoveredArea)}
                        onMouseLeave={() => setHoveredArea(null)}
                      >
                        <Link href={link.href}>
                          <div className="bg-white/98 border-2 border-lime-600 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                            <div className="text-green-800 font-semibold text-sm sm:text-base whitespace-nowrap">
                              {link.label}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </svg>
            
            {/* Call to Action Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={openModal}
                className="bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                🩺 Explore by Anatomy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal with Full Interactive Body Map */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-blue-800">Interactive Body Map</h2>
              <button
                onClick={closeModal}
                className="font-sans text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-inner border border-blue-200 relative">
                {/* Mobile Navigation Button */}
                {isMobile && (
                  <div className="absolute top-4 right-4 z-50">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(!mobileMenuOpen);
                        setActiveCategory(null);
                      }}
                      className="bg-blue-800 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                      aria-label="Toggle condition menu"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Mobile Menu Overlay */}
                {isMobile && mobileMenuOpen && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-40 rounded-xl">
                    <div className="flex flex-col h-full p-6">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-blue-800 font-bold text-xl">NerveVine Health</h2>
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setActiveCategory(null);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Category Navigation */}
                      <div className="flex-1 overflow-y-auto">
                        {Object.entries(navigationCategories).map(([key, category]) => (
                          <div key={key} className="mb-4">
                            <button
                              onClick={() => handleCategoryClick(key)}
                              className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="text-xl mr-3">{category.icon}</span>
                                <span className="text-blue-800 font-semibold">{category.title}</span>
                              </div>
                              <span className={`text-blue-600 transition-transform ${activeCategory === key ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </button>
                            
                            {/* Category Items */}
                            {activeCategory === key && (
                              <div className="mt-2 ml-4 space-y-2">
                                {category.items.map((item, index) => (
                                  <Link 
                                    key={index} 
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    className="block"
                                  >
                                    <div className="bg-white/80 border border-blue-200 rounded-lg px-4 py-3 hover:bg-blue-50 transition-colors cursor-pointer">
                                      <div className="text-blue-800 font-medium text-sm">
                                        {item.label}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-blue-600 text-xs text-center">
                          Find the right natural solutions for your health
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <svg
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Anatomical body map */}
                  <image
                    href="/images/NerveVine body nav image2.svg"
                    width="1024"
                    height="1024"
                    preserveAspectRatio="xMidYMid meet"
                  />

                  {/* Clickable areas - made larger for better interaction */}
                  <g>
                    {/* Head - larger hover area with bridge to links */}
                    <circle
                      cx="510"
                      cy="150"
                      r="80"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("head")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("head")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />
                    
                    {/* Expanded bridge area - covers the space between head and all head links including lower ones */}
                    <path
                      d="M 200 30 Q 510 10 820 30 Q 820 300 510 320 Q 200 300 200 30"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("head")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("head")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />
                    
                    {/* Neck - separate hover area for neck links */}
                    <circle
                      cx="510"
                      cy="300"
                      r="80"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("neck")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("neck")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />
                    
                    {/* Neck bridge area - covers the space between neck and neck links */}
                    <path
                      d="M 300 250 Q 510 230 720 250 Q 720 350 510 370 Q 300 350 300 250"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("neck")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("neck")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />

                    {/* Heart - separate hover area for heart links */}
                    <circle
                      cx="580"
                      cy="450"
                      r="60"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("heart")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("heart")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />
                    
                    {/* Heart bridge area - covers the space between heart and heart links */}
                    <path
                      d="M 400 350 Q 580 330 760 350 Q 760 550 580 570 Q 400 550 400 350"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("heart")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("heart")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />

                    {/* Liver - separate hover area for liver links */}
                    <circle
                      cx="350"
                      cy="550"
                      r="70"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("liver")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("liver")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />
                    
                    {/* Liver bridge area - covers the space between liver and liver links */}
                    <path
                      d="M 150 450 Q 350 430 550 450 Q 550 630 350 650 Q 150 630 150 450"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("liver")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("liver")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />

                    {/* Adrenals - narrow band spanning across the body */}
                    <rect
                      x="150"
                      y="630"
                      width="720"
                      height="50"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("adrenals")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("adrenals")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />
                    
                    {/* Adrenal bridge area - covers the space between adrenals and adrenal links (excluding liver zone) */}
                    <path
                      d="M 550 550 Q 700 530 1000 550 Q 1000 600 700 620 Q 550 600 550 550"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("adrenals")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("adrenals")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />

                    {/* Gut hover area - spans across gut region without interfering with adrenal area */}
                    <rect
                      x="330"
                      y="700"
                      width="300"
                      height="120"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("digestive")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("digestive")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />

                    {/* Legs */}
                    <circle
                      cx="510"
                      cy="850"
                      r="50"
                      fill="transparent"
                      stroke="none"
                      onMouseEnter={() => setHoveredArea("legs")}
                      onMouseLeave={() => setHoveredArea(null)}
                      onTouchStart={() => setHoveredArea("legs")}
                      onTouchEnd={() => setHoveredArea(null)}
                      style={{ cursor: "pointer" }}
                    />
                  </g>
                </svg>

                {/* Desktop/Tablet: SVG coordinate positioning */}
                {shouldShowLinks && !isMobile && (
                  <div className="absolute inset-0 pointer-events-none">
                    {getLinkPositions().map((link, index) => {
                      // Use custom center points for neck links, default to head center for others
                      const centerX = link.centerX || 510;
                      const centerY = link.centerY || 150;
                      
                      // Only show head links when hovering head, neck links when hovering neck, heart links when hovering heart, liver links when hovering liver, adrenal links when hovering adrenals, digestive links when hovering digestive
                      const isNeckLink = link.centerY === 300 && link.centerX === 510;
                      const isHeartLink = link.centerY === 450 && link.centerX === 580;
                      const isLiverLink = link.centerY === 550 && link.centerX === 350;
                      const isAdrenalLink = link.href.includes('adrenal') || link.href.includes('circadian');
                      const isDigestiveLink = link.centerY === 715 && link.centerX === 530;
                      const shouldShowThisLink = (hoveredArea === "head" && !isNeckLink && !isHeartLink && !isLiverLink && !isAdrenalLink && !isDigestiveLink) || 
                                             (hoveredArea === "neck" && isNeckLink) || 
                                             (hoveredArea === "heart" && isHeartLink) || 
                                             (hoveredArea === "liver" && isLiverLink) ||
                                             (hoveredArea === "adrenals" && isAdrenalLink) ||
                                             (hoveredArea === "digestive" && isDigestiveLink);
                      
                      if (!shouldShowThisLink) return null;
                      
                      const x = centerX + Math.cos((link.angle * Math.PI) / 180) * link.radius - 20;
                      const y = centerY + Math.sin((link.angle * Math.PI) / 180) * link.radius;
                      
                      // Convert SVG coordinates to percentage for absolute positioning
                      const xPercent = (x / 1024) * 100;
                      const yPercent = (y / 1024) * 100;
                      
                      return (
                        <div
                          key={index}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `${xPercent}%`,
                            top: `${yPercent}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1000
                          }}
                          onMouseEnter={() => setHoveredArea(hoveredArea)}
                          onMouseLeave={() => setHoveredArea(null)}
                        >
                          <Link href={link.href}>
                            <div className="bg-white/98 border-2 border-blue-800 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                              <div className="text-blue-800 font-semibold text-xs sm:text-sm md:text-sm whitespace-nowrap">
                                {link.label}
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 