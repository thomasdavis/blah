import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'BLAH Documentation',
  tagline: 'Barely Logical Agent Host - Open-source ecosystem for AI agent tools',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://blah.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'thomasdavis', // GitHub org/user name
  projectName: 'blah', // GitHub repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Language settings
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Edit this page links
          editUrl:
            'https://github.com/thomasdavis/blah/tree/main/apps/docs/',
          routeBasePath: '/', // Serve the docs at the site's root
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/thomasdavis/blah/tree/main/apps/docs/',
          // Enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Project's social card
    image: 'img/blah-social-card.jpg',
    navbar: {
      title: 'BLAH',
      logo: {
        alt: 'BLAH Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/thomasdavis/blah',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/intro',
            },
            {
              label: 'Getting Started',
              to: '/getting-started/quick-start',
            },
            {
              label: 'CLI Documentation',
              to: '/cli/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/blah',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/blah_ai',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/thomasdavis/blah/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/thomasdavis/blah',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} BLAH Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
    // Algolia DocSearch configuration (optional)
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_API_KEY',
    //   indexName: 'YOUR_INDEX_NAME',
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
