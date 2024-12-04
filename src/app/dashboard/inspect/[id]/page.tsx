import Breadcrumbs from '@/app/components/specific/invoices/breadcrumbs';
import { notFound } from 'next/navigation';
import { fetchFileByIDs } from '@/app/utils/data.mongo';
import { CardCase } from '@/app/components/specific/inspect/card-case';
import { Case } from '@/app/utils/definitions';

 
export default async function Page({params}: {params: {id: string}}) {
    const id = params.id
    const resp = await fetchFileByIDs([id]);
    if (!resp) {
        return notFound();
    }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Inspect', href: '/dashboard/inspect' },
          {
            label: 'View Case',
            href: `/dashboard/inspect/${id}`,
            active: true,
          },
        ]}
      />
     <CardCase 
      claim_id={resp[0].claim_id} 
      extent_of_injury={resp[0].extent_of_injury}
      method_of_injury={resp[0].method_of_injury}
      date_of_injury={resp[0].date_of_injury}
      questions={resp[0].questions}
      sections={resp[0].sections}
      text={resp[0].text}
      /> 
    </main>
  );
}