import BudgetForm from './BudgetForm';
import { Metadata } from 'next';
import Footer from "@/components/ui/footer";
import CTA from '@/components/cta';

export const metadata: Metadata = {
  title: 'Orçamento de Desenvolvimento de Software',
  description: 'Solicite orçamento para sistema sob medida, aplicativo, site, e-commerce, integração ou automação com IA. Diagnóstico gratuito.',
  alternates: {
    canonical: 'https://labs.peluga.com.br/budget',
  },
};

export default function Page() {
  return (
    <>
      <div className="pt-12">
        <BudgetForm />
      </div>
      <CTA />
      <Footer />
    </>
  );
}
