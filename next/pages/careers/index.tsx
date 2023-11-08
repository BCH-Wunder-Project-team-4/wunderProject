import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { useRef } from "react";

import { JobListItem } from "@/components/job/job-list-item";
import { HeadingPage } from "@/components/heading--page";
import { LayoutProps } from "@/components/layout";
import { Meta } from "@/components/meta";
import {
  createLanguageLinksForNextOnlyPage,
  LanguageLinks,
} from "@/lib/contexts/language-links-context";
import { getLatestJobsItems } from "@/lib/drupal/get-jobs";
import { getCommonPageProps } from "@/lib/get-common-page-props";
import { JobTeaser as JobTeaserType, validateAndCleanupJobTeaser } from "@/lib/zod/job-teaser";

interface AllJobsPageProps extends LayoutProps {
  jobTeasers: JobTeaserType[];
  languageLinks: LanguageLinks;
}

export default function AllJobsPage({
  jobTeasers = [],
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const focusRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Meta title={t("Careers")} metatags={[]} />
      <div ref={focusRef} tabIndex={-1} />
      <HeadingPage>{t("Join us!")}</HeadingPage>
      <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {jobTeasers?.map((job) => (
              <JobListItem job={job} />
          ))}
      </ul>    
    </>
  );
}

export const getStaticProps: GetStaticProps<AllJobsPageProps> = async (context) => {
  // Fetch the job teasers.
  const { jobs } = await getLatestJobsItems({ limit: 10, locale: context.locale });

  const pageRoot = "/careers";
  const languageLinks = createLanguageLinksForNextOnlyPage(pageRoot, context);

  return {
    props: {
      ...(await getCommonPageProps(context)),
      jobTeasers: jobs.map((teaser) => validateAndCleanupJobTeaser(teaser)),
      languageLinks,
    },
    revalidate: 60,
  };
}
