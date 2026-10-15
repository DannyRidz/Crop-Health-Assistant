import type { ReportData } from "@/lib/report";
import styles from "./screening.module.css";

export function ReportPreview({ report }: { report: ReportData }) {
  return <article id="report-preview" className={styles.reportPreview}>
    <h2>{report.title}</h2>
    {report.sections.map((section, index) => <section key={index}>
      <h3>{section.title}</h3>
      {section.lines.map((line, lineIndex) => <p key={lineIndex} style={{ whiteSpace: "pre-wrap" }} lang={lineIndex >= (section.generatedFrom ?? 0) ? section.language : undefined}>{line}</p>)}
      {section.includePhotos && <div className={styles.photoGrid}>{report.photos.map((photo, photoIndex) => <figure key={photo.id}>
        {/* Temporary local blobs must retain real leaf edges in the preview. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={`${report.photoLabel} ${photoIndex + 1}`} width={photo.width} height={photo.height} />
        <figcaption>{report.photoCaptions?.[photoIndex] ?? `${report.photoLabel} ${photoIndex + 1}`}</figcaption>
      </figure>)}</div>}
    </section>)}
  </article>;
}
