import Link from 'next/link';
import type { ReactNode } from 'react';
import type {
  AdminCmsAction,
  AdminCmsListItem,
  AdminCmsModuleViewModel,
  AdminCmsStatus,
} from '../dashboard/admin-cms-modules';
import type { AdminCmsModuleSummary } from '@/lib/server/admin-cms-read-models';
import { AdminCmsWorkflowClient } from './admin-cms-workflow-client';
import { AdminCmsSharedSummaryView, createAdminCmsSharedSummaryViewLens } from './admin-cms-shared-summary-view';

function AdminCmsActionButton({ action }: { action: AdminCmsAction }) {
  const className = `admin-button${action.tone === 'secondary' ? ' admin-button--secondary' : ''}${action.tone === 'ghost' ? ' admin-button--ghost' : ''}`;

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return <span className={className}>{action.label}</span>;
}

function AdminCmsStatusBadge({ status }: { status: AdminCmsStatus }) {
  return <span className={`admin-status admin-status--${status.tone}`}>{status.label}</span>;
}

function AdminCmsListRow({ item }: { item: AdminCmsListItem }) {
  return (
    <article className="admin-module-list__item">
      <div className="admin-module-list__main">
        <div className="admin-module-list__heading">
          <h4>{item.title}</h4>
          <AdminCmsStatusBadge status={item.status} />
        </div>
        <p>{item.description}</p>
      </div>
      <dl className="admin-module-list__meta">
        {item.locale ? (
          <div>
            <dt>Locale</dt>
            <dd>{item.locale}</dd>
          </div>
        ) : null}
        {item.owner ? (
          <div>
            <dt>Owner</dt>
            <dd>{item.owner}</dd>
          </div>
        ) : null}
        <div>
          <dt>Updated</dt>
          <dd>{item.updatedAt}</dd>
        </div>
      </dl>
    </article>
  );
}

function AdminCmsSection({ title, description, eyebrow, children }: { title: string; description: string; eyebrow?: string; children: ReactNode }) {
  return (
    <section className="admin-module-card">
      <div className="admin-module-card__header">
        <div>
          <p className="admin-module-card__eyebrow">{eyebrow ?? 'Module section'}</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="admin-module-card__body">{children}</div>
    </section>
  );
}

function AdminCmsReadSummary({ summary }: { summary: AdminCmsModuleSummary }) {
  const readLens = createAdminCmsSharedSummaryViewLens('read', summary.sharedSummary);
  return <AdminCmsSharedSummaryView lens={readLens} summary={summary.sharedSummary} />;
}

export function AdminCmsScaffold({ module, summary }: { module: AdminCmsModuleViewModel; summary: AdminCmsModuleSummary }) {
  return (
    <div className="admin-module-stack">
      <section className="admin-module-hero">
        <div>
          <p className="admin-module-hero__eyebrow">{module.eyebrow}</p>
          <h3>{module.title}</h3>
          <p>{module.description}</p>
        </div>
        <div className="admin-module-actions">
          <AdminCmsActionButton action={module.primaryAction} />
          {module.secondaryAction ? <AdminCmsActionButton action={module.secondaryAction} /> : null}
        </div>
      </section>

      <section className="admin-module-stats" aria-label={`${module.title} summary stats`}>
        {module.summaryStats.map((stat) => (
          <article key={stat.label} className="admin-module-stat">
            <p className="admin-module-stat__label">{stat.label}</p>
            <strong>{stat.value}</strong>
            <p>{stat.helper}</p>
          </article>
        ))}
      </section>

      <div className="admin-module-grid">
        <AdminCmsSection title={module.listTitle} description={module.listDescription} eyebrow="Content inventory">
          <div className="admin-module-list">
            {module.listItems.map((item) => (
              <AdminCmsListRow key={item.title} item={item} />
            ))}
          </div>
        </AdminCmsSection>

        <AdminCmsSection title="Server summary source" description="Read-side summary contract from server layer with status presentation lens for shared rule clarity." eyebrow="Data source">
          <AdminCmsReadSummary summary={summary} />
        </AdminCmsSection>
      </div>

      <div className="admin-module-grid">
        <AdminCmsSection title={module.editorTitle} description={module.editorDescription} eyebrow="Editor fields">
          <p className="admin-module-fields__hint">
            Read these fields as the current editing contract. Save flows may still be partial, but the values below are the baseline handoff between server read-models and future editor forms.
          </p>
          <dl className="admin-module-fields">
            {module.fields.map((field) => (
              <div key={field.label} className="admin-module-fields__item">
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
                {field.helper ? <p>{field.helper}</p> : null}
              </div>
            ))}
          </dl>
        </AdminCmsSection>

        <AdminCmsSection title="Workflow actions" description="Workflow-side shared summary contract with status presentation lens." eyebrow="Actions">
          <AdminCmsWorkflowClient module={module} />
        </AdminCmsSection>
      </div>

      <div className="admin-module-grid">
        <AdminCmsSection title={module.workflowTitle} description={module.workflowDescription} eyebrow="Publish checklist">
          <ul className="admin-module-checklist">
            {module.workflowStatuses.map((step) => (
              <li key={step.label}>
                <strong>{step.label}</strong>
                <p>{step.detail}</p>
              </li>
            ))}
          </ul>
        </AdminCmsSection>

        <AdminCmsSection title="Recent activity" description="Activity feed for operator awareness at route level." eyebrow="Activity log">
          <p className="admin-module-activity__hint">
            Use this feed as a quick confidence check before opening deeper workflow or editor panels.
          </p>
          <ul className="admin-module-activity">
            {module.recentActivity.map((activity) => (
              <li key={activity.title}>
                <strong>{activity.title}</strong>
                <p>{activity.detail}</p>
              </li>
            ))}
          </ul>
        </AdminCmsSection>
      </div>
    </div>
  );
}
