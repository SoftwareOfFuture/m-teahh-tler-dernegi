import { PageHero } from '../../components/PageHero';
import { PageLayoutWithFooter } from '../../components/PageLayout';

export default function CorporatePage() {
  return (
    <PageLayoutWithFooter>
      <PageHero
        title="Kurumsal"
        subtitle="Derneğimizin vizyonu, misyonu ve kurumsal yapısına dair genel bilgiler."
      />

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Hakkımızda</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Antalya Müteahhitler Derneği; üyeler arasında dayanışmayı güçlendirmek, sektörel bilgi paylaşımını artırmak ve
            mesleki standartların gelişimine katkı sağlamak amacıyla çalışmalar yürütür.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Bu sayfa, ana sayfadaki tasarım dili ile hazırlanmış bir kurumsal içerik şablonudur. İçerikler sonradan
            gerçek verilerle güncellenebilir.
          </p>
        </div>

        <div className="rounded-3xl bg-soft-gray p-6">
          <h3 className="text-sm font-bold text-slate-900">Hızlı Bilgiler</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Kuruluş: 20XX</li>
            <li>• Merkez: Antalya</li>
            <li>• Çalışma Alanı: İnşaat ve müteahhitlik</li>
            <li>• Üyelik: Başvuru + Onay</li>
          </ul>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900">Misyon</h3>
          <p className="mt-2 text-sm text-slate-600">Üyelerimizin mesleki gelişimini desteklemek ve sektörde ortak aklı büyütmek.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <h3 className="text-sm font-bold text-slate-900">Vizyon</h3>
          <p className="mt-2 text-sm text-slate-600">Sürdürülebilir ve kaliteli yapı üretiminde öncü bir kurumsal yapı olmak.</p>
        </div>
      </section>
    </PageLayoutWithFooter>
  );
}

