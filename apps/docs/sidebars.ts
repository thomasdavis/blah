import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.
 */
const sidebars: SidebarsConfig = {
  // Custom sidebar for BLAH documentation
  tutorialSidebar: [
    'intro',
    'contributing',
    'faq',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'CLI Documentation',
      items: [
        'cli/overview',
        'cli/mcp-command',
        'cli/validate-command',
        'cli/init-command',
        'cli/flows-command',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'concepts/mcp',
        'concepts/manifests',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/hosting',
        'guides/creating-tools',
        'guides/creating-workflows',
        'guides/flow-editor',
        'guides/api-integration',
        'guides/troubleshooting',
        'guides/security',
        'guides/advanced-usage',
      ],
    },
  ],
};

export default sidebars;
