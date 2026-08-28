import { PrivacyPolicyDocument } from '@/components/policy-document';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'What information the Red Panda app collects, why, who it is shared with, how long it is kept, and how to remove it. Available in English and Bahasa Indonesia.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <PrivacyPolicyDocument />
    </article>
  );
}
