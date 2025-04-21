/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { NavBar } from "@/components/nav-bar";
import { useRouter } from "next/navigation";
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AuthDialog } from "@/components/auth-dialog";
import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";

// 初始化 Stripe 的 Promise，添加重试机制
let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.error('Stripe publishable key is not configured');
      throw new Error('支付系统配置错误');
    }

    if (!publishableKey.startsWith('pk_')) {
      console.error('Invalid Stripe publishable key');
      throw new Error('支付系统配置错误');
    }

    stripePromise = loadStripe(publishableKey)
      .catch(error => {
        console.error('Stripe 加载失败:', error);
        stripePromise = null; // 重置 Promise 以便下次重试
        throw error;
      });
  }
  return stripePromise;
};

const plans = [
  {
    type: "trial",
    features: [
      "freeChars|amount=10000",
      "trialPeriod|days=7",
      "languageSupport",
      "basicSpeedControl",
      "basicVoiceSelection",
      "textInputOnly",
      "standardSupport"
    ]
  },
  {
    type: "yearly",
    features: [
      "yearlyQuota|amount=1500000",
      "languageSupport",
      "fullSpeedControl",
      "allVoices",
      "wordByWordReading",
      "fileUpload",
      "audioVisualization",
      "advancedAudioEdit",
      "support247",
      "earlyAccess"
    ]
  },
  {
    type: "monthly",
    features: [
      "monthlyQuota|amount=100000",
      "languageSupport",
      "fullSpeedControl",
      "allVoices",
      "wordByWordReading",
      "fileUpload",
      "audioVisualization",
      "prioritySupport"
    ]
  }
];

const payAsYouGo = [
  {
    type: "tenThousandChars",
    price: "$6",
    popular: false
  },
  {
    type: "millionChars",
    price: "$55",
    popular: true
  },
  {
    type: "threeMillionChars",
    price: "$150",
    popular: false
  }
];

export default function PricingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { data: session } = useSession();
  // const searchParams = useSearchParams();
  // const type = searchParams.get('type');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // 检查 Stripe 配置
  useEffect(() => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey || !publishableKey.startsWith('pk_')) {
      console.error('Stripe publishable key is not properly configured');
      // toast({
      //   title: t('error'),
      //   description: t('paymentSystemError'),
      //   variant: "destructive",
      // });
    }
  }, []);

  const getClonePackages = () => [
    {
      id: 'clone1',
      name: t('clonePackageBasic'),
      originalPrice: '$5',
      price: '$3',
      saveAmount: '$2',
      clones: 1,
      description: t('clonePackageBasicDesc'),
      features: [
        t('cloneFeature1Times', { count: 1 }),
        t('cloneFeatureValidForever'),
        t('cloneFeatureMultiLanguage'),
        t('cloneFeatureCustomization'),
        t('cloneFeatureStandardSupport')
      ]
    },
    {
      id: 'clone50',
      name: t('clonePackagePro'),
      originalPrice: '$299',
      price: '$150',
      saveAmount: '$149',
      clones: 50,
      description: t('clonePackageProDesc'),
      features: [
        t('cloneFeature1Times', { count: 50 }),
        t('cloneFeatureValidForever'),
        t('cloneFeatureMultiLanguage'),
        t('cloneFeatureCustomization'),
        t('cloneFeaturePrioritySupport')
      ]
    },
    {
      id: 'clone10',
      name: t('clonePackageAdvanced'),
      originalPrice: '$59',
      price: '$30',
      saveAmount: '$29',
      clones: 10,
      description: t('clonePackageAdvancedDesc'),
      features: [
        t('cloneFeature1Times', { count: 10 }),
        t('cloneFeatureValidForever'),
        t('cloneFeatureMultiLanguage'),
        t('cloneFeatureCustomization'),
        t('cloneFeaturePrioritySupport')
      ]
    }
  ];

  const handlePlanClick = async (type: string) => {
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    if (type === 'trial') {
      router.push('/app');
      return;
    }

    try {
      // 最多重试3次
      let retries = 3;
      let stripe = null;
      
      while (retries > 0 && !stripe) {
        try {
          stripe = await getStripe();
        } catch (error) {
          console.error(`Stripe 加载失败，剩余重试次数: ${retries - 1}`, error);
          retries--;
          if (retries === 0) {
            throw new Error(t('stripeLoadError'));
          }
          // 等待1秒后重试
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!stripe) {
        throw new Error(t('stripeLoadError'));
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: type,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t('checkoutError'));
      }

      const { sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error(t('invalidSessionId'));
      }

      // 添加超时处理
      const redirectPromise = stripe.redirectToCheckout({ sessionId });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(t('checkoutTimeout'))), 10000)
      );

      const result = await Promise.race([redirectPromise, timeoutPromise]);

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('支付错误:', error);
      // toast({
      //   title: t('error'),
      //   description: error instanceof Error ? error.message : t('unknownError'),
      //   variant: "destructive",
      // });
    }
  };

  const handleClonePackagePurchase = async (packageId: string) => {
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

    try {
      // 最多重试3次
      let retries = 3;
      let stripe = null;
      
      while (retries > 0 && !stripe) {
        try {
          stripe = await getStripe();
        } catch (error) {
          console.error(`Stripe 加载失败，剩余重试次数: ${retries - 1}`, error);
          retries--;
          if (retries === 0) {
            throw new Error(t('stripeLoadError'));
          }
          // 等待1秒后重试
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (!stripe) throw new Error(t('stripeLoadError'));

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: packageId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t('checkoutError'));
      }

      const { sessionId } = await response.json();
      
      // 添加超时处理
      const redirectPromise = stripe.redirectToCheckout({ sessionId });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(t('checkoutTimeout'))), 10000)
      );

      const result = await Promise.race([redirectPromise, timeoutPromise]);

      if (result.error) {
        throw new Error(result.error.message || t('checkoutError'));
      }
    } catch (error) {
      console.error('克隆包购买错误:', error);
      // toast({
      //   title: t('error'),
      //   description: error instanceof Error ? error.message : t('unknownError'),
      //   variant: "destructive",
      // });
    }
  };

  const getPlanName = (type: string) => {
    switch (type) {
      case 'trial': return t('trialPlan');
      case 'yearly': return t('yearlyPlan');
      case 'monthly': return t('monthlyPlan');
      default: return '';
    }
  };

  const getPlanDesc = (type: string) => {
    switch (type) {
      case 'trial': return t('trialDesc');
      case 'yearly': return t('yearlyDesc');
      case 'monthly': return t('monthlyDesc');
      default: return '';
    }
  };

  const getPlanPrice = (type: string) => {
    switch (type) {
      case 'monthly':
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground line-through">$9.99</span>
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">$4.99</span>
            <span className="text-muted-foreground">{t('perMonth')}</span>
            <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">{t('save')} $5</Badge>
          </div>
        );
      case 'yearly':
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground line-through">$99.9</span>
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">$49.9</span>
            <span className="text-muted-foreground">{t('perYear')}</span>
            <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">{t('save')} $50</Badge>
          </div>
        );
      case 'trial':
        return (
          <div>
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{t('free')}</span>
          </div>
        );
      default:
        return '';
    }
  };

  // const getPlanPeriod = (type: string) => {
  //   switch (type) {
  //     case 'yearly': return t('perYear');
  //     case 'monthly': return t('perMonth');
  //     default: return '';
  //   }
  // };

  const getButtonText = (type: string) => {
    switch (type) {
      case 'trial': return t('startTrial');
      case 'yearly': return t('chooseYearly');
      case 'monthly': return t('chooseMonthly');
      default: return '';
    }
  };

  const translateFeature = (feature: string) => {
    const [key, params] = feature.split('|');
    if (params) {
      const paramObj = Object.fromEntries(
        params.split(',').map(p => {
          const [k, v] = p.split('=');
          if (k === 'amount') {
            return [k, v];
          }
          return [k, v];
        })
      );
      return t(key, paramObj as any);
    }
    return t(key);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">{t('pricingTitle')}</h1>
          <p className="text-xl text-muted-foreground">{t('pricingSubtitle')}</p>
        </div>

        {/* 会员方案 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card key={plan.type} className={`p-6 relative ${plan.type === 'yearly' ? 'border-primary shadow-lg' : ''}`}>
              {plan.type === 'yearly' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
                    {t('mostPopular')}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg" />
              <div className="relative">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">{getPlanName(plan.type)}</h3>
                  <p className="text-muted-foreground">{getPlanDesc(plan.type)}</p>
                </div>
                <div className="mb-6">
                  {getPlanPrice(plan.type)}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{translateFeature(feature)}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white" 
                  variant={plan.type === 'yearly' ? "default" : "outline"}
                  onClick={() => handlePlanClick(plan.type)}
                >
                  {getButtonText(plan.type)}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* 克隆次数购买部分 */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t('clonePackagesTitle')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('clonePackagesSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {getClonePackages().map((pkg) => (
              <Card key={pkg.id} className={`p-6 relative ${pkg.id === 'clone50' ? 'border-primary shadow-lg' : ''}`}>
                {pkg.id === 'clone50' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
                      {t('mostPopular')}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg" />
                <div className="relative">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">{pkg.name}</h3>
                    <p className="text-muted-foreground">{pkg.description}</p>
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground line-through">{pkg.originalPrice}</span>
                      <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{pkg.price}</span>
                      <Badge className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">{t('save')} {pkg.saveAmount}</Badge>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white" 
                    onClick={() => handleClonePackagePurchase(pkg.id)}
                  >
                    {t('buyNow')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 按量付费方案 */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">{t('payAsYouGo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {payAsYouGo.map((plan) => (
              <Card key={plan.type} className={`p-6 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm">
                      {t('bestValue')}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg" />
                <div className="relative text-center">
                  <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">{t(plan.type)}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{plan.price}</span>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanClick(plan.type)}
                  >
                    {t('buyNow')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ部分 */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">{t('faq')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">{t('faqTrialFeatures')}</h3>
              <p className="text-muted-foreground">{t('faqTrialFeaturesAnswer')}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t('faqHowToTry')}</h3>
              <p className="text-muted-foreground">{t('faqHowToTryAnswer')}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t('faqQuotaCalc')}</h3>
              <p className="text-muted-foreground">{t('faqQuotaCalcAnswer')}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t('faqPayment')}</h3>
              <p className="text-muted-foreground">{t('faqPaymentAnswer')}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t('faqQuotaType')}</h3>
              <p className="text-muted-foreground">{t('faqQuotaTypeAnswer')}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{t('faqCloneVoice')}</h3>
              <p className="text-muted-foreground">{t('faqCloneVoiceAnswer')}</p>
            </div>
          </div>
        </div>
      </main>
      <AuthDialog 
        isOpen={showAuthDialog} 
        onClose={() => setShowAuthDialog(false)} 
      />
    </div>
  );
} 