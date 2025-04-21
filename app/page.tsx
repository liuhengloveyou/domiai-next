'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic2, Globe2, Sparkles, ArrowRight, Volume2, FileText, Star, Upload, Crown, Rocket, UserSquare2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { NavBar } from "@/components/nav-bar";
// import { RequireAuth } from "@/components/require-auth";

// 添加这一行来启用动态渲染
// export const dynamic = 'force-dynamic';

export default function LandingPage() {
  const { t } = useLanguage();
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [stars, setStars] = useState<Array<{ top: number; left: number; delay: number; opacity: number }>>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  const features = [
    {
      icon: <Mic2 className="h-6 w-6" />,
      title: t('feature1Title'),
      description: t('feature1Desc')
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: t('feature2Title'),
      description: t('feature2Desc')
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t('feature3Title'),
      description: t('feature3Desc')
    },
    {
      icon: <UserSquare2 className="h-6 w-6" />,
      title: t('feature4Title'),
      description: t('feature4Desc')
    }
  ];

  // const steps: { icon: React.ReactNode; title: string; description: string; }[] = [];

  const testimonials = [
    {
      avatar: "J",
      name: t('testimonial1Name'),
      role: t('testimonial1Role'),
      content: t('testimonial1Content'),
      rating: 5
    },
    {
      avatar: "M",
      name: t('testimonial2Name'),
      role: t('testimonial2Role'),
      content: t('testimonial2Content'),
      rating: 5
    },
    {
      avatar: "S",
      name: t('testimonial3Name'),
      role: t('testimonial3Role'),
      content: t('testimonial3Content'),
      rating: 5
    },
    {
      avatar: "R",
      name: t('testimonial4Name'),
      role: t('testimonial4Role'),
      content: t('testimonial4Content'),
      rating: 5
    },
    {
      avatar: "L",
      name: t('testimonial5Name'),
      role: t('testimonial5Role'),
      content: t('testimonial5Content'),
      rating: 5
    },
    {
      avatar: "Y",
      name: t('testimonial6Name'),
      role: t('testimonial6Role'),
      content: t('testimonial6Content'),
      rating: 5
    },
    {
      avatar: "K",
      name: t('testimonial7Name'),
      role: t('testimonial7Role'),
      content: t('testimonial7Content'),
      rating: 5
    },
    {
      avatar: "H",
      name: t('testimonial8Name'),
      role: t('testimonial8Role'),
      content: t('testimonial8Content'),
      rating: 5
    }
  ];

  useEffect(() => {
    setStars(Array.from({ length: 50 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    })));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonialIndex((current) => 
        current === testimonials.length - 3 ? 0 : current + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-24 text-center relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 overflow-hidden">
            {/* 主动态背景 */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.3),rgba(236,72,153,0.3)_50%)]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            />
            {/* 流动渐变效果 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30"
              animate={{
                x: ['-100%', '100%'],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* 光晕效果 */}
            <motion.div
              className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(56,189,248,0.3)_0deg,rgba(236,72,153,0.3)_120deg,rgba(168,85,247,0.3)_240deg)]"
              animate={{
                rotate: [0, 360],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* 星光效果 */}
            <div className="absolute inset-0">
              {stars.map((star, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 md:w-1 md:h-1 bg-white/80 rounded-full animate-twinkle"
                  style={{
                    top: `${star.top}%`,
                    left: `${star.left}%`,
                    animationDelay: `${star.delay}s`,
                    opacity: star.opacity,
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 backdrop-blur-[80px] bg-background/30" />
          </div>
        </div>
        <motion.h1
          className="relative inline-flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x px-2 md:px-4 text-center leading-tight">
            {t('landingTitle')}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 font-medium">
              {t('aiPowered')}
            </span>
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 text-green-500 dark:text-green-400 font-medium">
              {t('voiceCloning')}
            </span>
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-pink-500/20 text-pink-500 dark:text-pink-400 font-medium">
              {t('languagesSupported')}
            </span>
          </div>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl mt-4 md:mt-8 mb-6 md:mb-10 max-w-3xl mx-auto leading-relaxed bg-gradient-to-r from-blue-500/80 via-purple-500/80 to-pink-500/80 bg-clip-text text-transparent px-2 md:px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('landingSubtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="px-2 md:px-4 flex flex-col md:flex-row gap-4 justify-center"
        >
          <Link href="/app/" className="w-full md:w-auto">
            <Button 
              size="lg" 
              className="w-full md:w-auto h-10 md:h-12 text-sm md:text-base gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5"
            >
              <Rocket className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
              {t('startNow')}
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
          <Link href="/cloning/" className="w-full md:w-auto">
            <Button 
              size="lg" 
              className="w-full md:w-auto h-10 md:h-12 text-sm md:text-base gap-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              <Mic2 className="h-4 w-4 md:h-5 md:w-5 animate-pulse" />
              {t('voiceCloning')}
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
          <Link href="/pricing/" className="w-full md:w-auto">
            <Button 
              size="lg" 
              className="w-full md:w-auto h-10 md:h-12 text-sm md:text-base gap-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5"
            >
              <Crown className="h-4 w-4 md:h-5 md:w-5 animate-bounce" />
              {t('subscription')}
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Core Features Section */}
      <div id="features" className="bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-background py-8 md:py-16 scroll-mt-16">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {t('coreFeatures')}
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="p-4 md:p-6 lg:p-8 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/60 backdrop-blur border-primary/10">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 flex items-center justify-center mb-4 md:mb-6 transform transition-transform duration-300 hover:scale-110">
                      <div className="h-5 w-5 md:h-6 md:w-6">{feature.icon}</div>
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-4">{feature.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Cloning How It Works Section */}
      <div className="py-8 md:py-16 bg-gradient-to-b from-background via-green-500/5 to-background">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {t('voiceCloningHowItWorks')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                icon: <Upload className="h-6 w-6" />,
                title: t('voiceCloneStep1Title'),
                description: t('voiceCloneStep1Desc')
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: t('voiceCloneStep2Title'),
                description: t('voiceCloneStep2Desc')
              },
              {
                icon: <Volume2 className="h-6 w-6" />,
                title: t('voiceCloneStep3Title'),
                description: t('voiceCloneStep3Desc')
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="p-4 md:p-6 lg:p-8 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/60 backdrop-blur border-primary/10">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-green-500/30 via-teal-500/30 to-emerald-500/30 flex items-center justify-center mb-4 md:mb-6 transform transition-transform duration-300 hover:scale-110">
                        <div className="h-5 w-5 md:h-6 md:w-6">{step.icon}</div>
                      </div>
                      <div className="absolute -top-2 -right-2 h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-primary-foreground flex items-center justify-center font-bold text-sm md:text-base">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-4">{step.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-primary/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                icon: <FileText className="h-6 w-6" />,
                title: t('voiceCloneStep4Title'),
                description: t('voiceCloneStep4Desc')
              },
              {
                icon: <Sparkles className="h-6 w-6" />,
                title: t('voiceCloneStep5Title'),
                description: t('voiceCloneStep5Desc')
              },
              {
                icon: <Volume2 className="h-6 w-6" />,
                title: t('voiceCloneStep6Title'),
                description: t('voiceCloneStep6Desc')
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="p-4 md:p-6 lg:p-8 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/60 backdrop-blur border-primary/10">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-green-500/30 via-teal-500/30 to-emerald-500/30 flex items-center justify-center mb-4 md:mb-6 transform transition-transform duration-300 hover:scale-110">
                        <div className="h-5 w-5 md:h-6 md:w-6">{step.icon}</div>
                      </div>
                      <div className="absolute -top-2 -right-2 h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-primary-foreground flex items-center justify-center font-bold text-sm md:text-base">
                        {index + 4}
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-4">{step.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-primary/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-b from-background via-cyan-500/5 to-background py-8 md:py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {t('testimonials')}
          </motion.h2>
          <div className="relative">
            <div className="overflow-hidden mx-auto">
              <motion.div
                className="flex"
                initial={false}
                animate={{
                  x: `-${activeTestimonialIndex * (isMobile ? 100 : 33.33)}%`,
                  transition: {
                    duration: 0.5,
                    ease: "easeInOut"
                  }
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index} 
                    className="w-full flex-shrink-0 md:w-1/3 px-2 md:px-4"
                  >
                    <Card className="p-3 md:p-4 lg:p-6 h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/60 backdrop-blur border-primary/10">
                      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm md:text-base lg:text-lg">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-sm md:text-base lg:text-lg mb-0.5">
                            {testimonial.name}
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex mb-2 md:mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-primary text-primary mr-0.5" />
                        ))}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed italic line-clamp-4">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                    </Card>
                  </div>
                ))}
              </motion.div>
            </div>
            <button
              className="absolute top-1/2 left-0 transform -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-background/80 backdrop-blur border shadow-sm hover:bg-muted transition-all duration-300 z-10"
              onClick={() => setActiveTestimonialIndex((current) => 
                current === 0 ? testimonials.length - (isMobile ? 1 : 3) : current - 1
              )}
            >
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 rotate-180" />
            </button>
            <button
              className="absolute top-1/2 right-0 transform -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-background/80 backdrop-blur border shadow-sm hover:bg-muted transition-all duration-300 z-10"
              onClick={() => setActiveTestimonialIndex((current) => 
                current === testimonials.length - (isMobile ? 1 : 3) ? 0 : current + 1
              )}
            >
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
          <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-8">
            {[...Array(isMobile ? testimonials.length : testimonials.length - 2)].map((_, index) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors duration-300 ${
                  index === activeTestimonialIndex ? 'bg-primary scale-100' : 'bg-primary/20 scale-75'
                } hover:scale-100`}
                onClick={() => setActiveTestimonialIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 