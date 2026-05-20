/**
 * Dynamic SEO Head Component for HUMAN 3.0
 * Manages meta tags, titles, and hreflang for multilingual support
 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import type { AppPhase } from '@/types';

interface SEOHeadProps {
  phase?: AppPhase;
}

const SITE_URL = 'https://human3point0.com';

const SEO_METAS = {
  zh: {
    title: 'Human 3.0 测评 - 发现你的进化阶段 | HUMAN 3.0 四维评估',
    description: '基于 Dan Koe 的 Human 3.0 框架，通过 AI 对话式评估发现你的生命阶段。从心智、身体、灵性、职业四个维度进行深度分析，提供个性化成长策略。',
    keywords: 'Human 3.0, Human 3.0 测评, Dan Koe, 个人发展, 人生评估, 人格测试, 自我发现, 职业指导, 人生目标, 心智成长, 身体健康, 灵性探索, 职业发展',
    ogTitle: 'Human 3.0 测评 - 发现你的进化阶段',
    ogDescription: '基于 Dan Koe 框架的四维评估，通过 AI 对话式评估发现你的生命阶段。',
  },
  en: {
    title: 'Human 3.0 Assessment - Discover Your Evolution Stage | Multidimensional Growth',
    description: 'Based on Dan Koe\'s Human 3.0 framework, discover your life stage through AI conversational assessment. Get deep analysis across Mind, Body, Spirit, and Vocation dimensions with personalized growth strategies.',
    keywords: 'Human 3.0, Human 3.0 assessment, Dan Koe, personal development, life assessment, personality test, self discovery, career guidance, life purpose, mental growth, physical health, spiritual exploration, career development',
    ogTitle: 'Human 3.0 Assessment - Discover Your Evolution Stage',
    ogDescription: 'Four-dimension assessment based on Dan Koe\'s framework through AI conversational assessment.',
  },
};

const PHASE_TITLES = {
  zh: {
    hero: 'Human 3.0 测评 - 发现你的进化阶段',
    assessment: 'Human 3.0 对话评估 - 四维成长分析',
    metatype: 'Human 3.0 原型可视化 - 你的发展图景',
    report: 'Human 3.0 评估报告 - 个性化成长策略',
  },
  en: {
    hero: 'Human 3.0 Assessment - Discover Your Evolution Stage',
    assessment: 'Human 3.0 Conversational Assessment - Four-Dimension Analysis',
    metatype: 'Human 3.0 Metatype Visualization - Your Development Map',
    report: 'Human 3.0 Assessment Report - Personalized Growth Strategy',
  },
};

export default function SEOHead({ phase = 'hero' }: SEOHeadProps) {
  // Handle loading phase by treating it as hero
  const effectivePhase: NonNullable<SEOHeadProps['phase']> = phase === 'loading' ? 'hero' : phase;
  const { language } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';

    // Get meta content based on language and phase
    const meta = SEO_METAS[language];
    const phaseTitle = effectivePhase ? PHASE_TITLES[language][effectivePhase] || meta.title : meta.title;

    // Update title
    document.title = phaseTitle;

    // Update meta tags
    updateMetaTag('description', meta.description);
    updateMetaTag('keywords', meta.keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', meta.ogTitle, 'property');
    updateMetaTag('og:description', meta.ogDescription, 'property');
    updateMetaTag('og:url', `${SITE_URL}/`, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:image', `${SITE_URL}/images/portal-rift.jpg`, 'property');
    updateMetaTag('og:locale', language === 'zh' ? 'zh_CN' : 'en_US', 'property');

    // Update Twitter Card tags
    updateMetaTag('twitter:title', meta.ogTitle);
    updateMetaTag('twitter:description', meta.ogDescription);
    updateMetaTag('twitter:image', `${SITE_URL}/images/portal-rift.jpg`);

    // Update canonical URL with language
    updateLinkTag('canonical', `${SITE_URL}/${language === 'en' ? '?lang=en' : ''}`);

    // Update hreflang tags
    updateHreflangTags();

    // Update structured data
    updateStructuredData(meta, language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, phase, i18n, effectivePhase]);

  return null; // This component doesn't render anything
}

function updateMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.href = href;
}

function updateHreflangTags() {
  // Remove existing hreflang tags
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

  // Add x-default
  addHreflang('x-default', `${SITE_URL}/`);

  // Add zh-CN
  addHreflang('zh-CN', `${SITE_URL}/`);

  // Add en
  addHreflang('en', `${SITE_URL}/?lang=en`);
}

function addHreflang(lang: string, href: string) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'alternate');
  link.setAttribute('hreflang', lang);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

function updateStructuredData(meta: typeof SEO_METAS.zh, language: 'zh' | 'en') {
  const schemaId = 'structured-data';
  let scriptElement = document.getElementById(schemaId) as HTMLScriptElement;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Human 3.0 Assessment',
        url: SITE_URL,
        description: meta.description,
        inLanguage: language === 'zh' ? 'zh-CN' : 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Human 3.0 Assessment',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: meta.description,
        featureList: [
          'AI-powered conversational assessment',
          'Four-dimension analysis (Mind, Body, Spirit, Vocation)',
          'Personalized metatype identification',
          'Transformation strategies',
          'Detailed growth recommendations',
        ],
        author: {
          '@type': 'Person',
          name: 'Human 3.0 Team',
          sameAs: [],
        },
      },
    ],
  };

  const schemaString = JSON.stringify(schema);

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = schemaId;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  scriptElement.textContent = schemaString;
}