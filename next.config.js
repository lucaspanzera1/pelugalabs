/** @type {import('next').NextConfig} */

// Soluções removidas no reposicionamento para infraestrutura de redes.
// Redirect 301 preserva o que já estava indexado no Google.
const legacySolucoes = [
  { slug: 'backup-e-recuperacao-de-desastres', to: '/solucoes/gestao-de-servidores' },
  { slug: 'active-directory', to: '/solucoes/firewall-e-seguranca-de-rede' },
  { slug: 'google-workspace', to: '/solucoes/infraestrutura-de-redes' },
  { slug: 'gestao-de-ativos-de-ti', to: '/solucoes/monitoramento-de-rede' },
  { slug: 'desenvolvimento-de-sistemas', to: '/solucoes/infraestrutura-de-redes' },
  { slug: 'desenvolvimento-web', to: '/solucoes/infraestrutura-de-redes' },
  { slug: 'ecommerce', to: '/solucoes/infraestrutura-de-redes' },
];

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/solucoes',
        destination: '/#features',
        permanent: true,
      },
      {
        source: '/metodologia',
        destination: '/#services',
        permanent: true,
      },
      {
        // Páginas de metodologia removidas; preserva o que já foi rastreado.
        source: '/metodologia/:slug',
        destination: '/#services',
        permanent: true,
      },
      {
        source: '/contato',
        destination: '/budget',
        permanent: true,
      },
      ...legacySolucoes.map(({ slug, to }) => ({
        source: `/solucoes/${slug}`,
        destination: to,
        permanent: true,
      })),
    ];
  },
};

module.exports = nextConfig;
