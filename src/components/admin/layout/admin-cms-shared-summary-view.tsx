import type { AdminCmsSharedSummaryContract, AdminCmsSummaryLineItem, AdminCmsSummaryRowSemanticKey } from '@/lib/server/admin-cms-persistence';

export type AdminCmsSharedSummaryStatusPresentation = {
  visible: boolean;
  label: string;
  toneClassName: string;
};

export type AdminCmsSharedSummaryCopyContract = {
  title: string;
  contextLabel: string;
  updatedAtLabel: string;
  activityLabel: string;
  changesLabel: string;
};

export type AdminCmsSummaryRowCopyContract = {
  helperPrefix?: string;
  helperLabel?: string;
};

export type AdminCmsSharedSummaryViewLens = {
  copy: AdminCmsSharedSummaryCopyContract;
  statusPresentation: AdminCmsSharedSummaryStatusPresentation;
};

export type AdminCmsSummaryRowViewSpec = {
  valueClassName?: string;
  copy: AdminCmsSummaryRowCopyContract;
};

function createStatusPresentation(
  context: 'read' | 'workflow',
  status: AdminCmsSharedSummaryContract['semantics']['statusTone'],
): AdminCmsSharedSummaryStatusPresentation {
  const toneClassName = `admin-status admin-status--${status}`;

  switch (context) {
    case 'workflow':
      return {
        visible: true,
        label: status,
        toneClassName,
      };
    case 'read':
      return {
        visible: false,
        label: status,
        toneClassName,
      };
    default:
      return {
        visible: false,
        label: status,
        toneClassName,
      };
  }
}

function createCopyContract(context: 'read' | 'workflow'): AdminCmsSharedSummaryCopyContract {
  switch (context) {
    case 'read':
      return {
        title: 'Server read summary',
        contextLabel: 'Read-side contract',
        updatedAtLabel: 'Updated at',
        activityLabel: 'Activity',
        changesLabel: 'Changes',
      };
    case 'workflow':
      return {
        title: 'Shared workflow summary',
        contextLabel: 'Latest workflow feedback',
        updatedAtLabel: 'Updated at',
        activityLabel: 'Activity',
        changesLabel: 'Changes',
      };
    default:
      return {
        title: 'Admin summary',
        contextLabel: 'Shared summary contract',
        updatedAtLabel: 'Updated at',
        activityLabel: 'Activity',
        changesLabel: 'Changes',
      };
  }
}

function createRowCopyContract(
  key: AdminCmsSummaryRowSemanticKey,
): AdminCmsSummaryRowCopyContract {
  switch (key) {
    case 'latest-record':
      return {
        helperPrefix: 'Revision',
        helperLabel: 'Record metadata',
      };
    case 'latest-status':
      return {
        helperPrefix: 'Publication',
        helperLabel: 'Status context',
      };
    case 'revalidation-targets':
      return {
        helperPrefix: 'History',
        helperLabel: 'Route activity',
      };
    case 'changed-fields':
      return {
        helperPrefix: 'Field set',
        helperLabel: 'Changed scope',
      };
    default:
      return {};
  }
}

export function createAdminCmsSummaryRowViewSpec(
  key: AdminCmsSummaryRowSemanticKey,
): AdminCmsSummaryRowViewSpec {
  switch (key) {
    case 'latest-record':
      return {
        valueClassName: 'admin-summary-row__value--mono',
        copy: createRowCopyContract(key),
      };
    case 'latest-status':
      return {
        valueClassName: 'admin-summary-row__value--status',
        copy: createRowCopyContract(key),
      };
    case 'revalidation-targets':
      return {
        valueClassName: 'admin-summary-row__value--routes',
        copy: createRowCopyContract(key),
      };
    case 'changed-fields':
      return {
        valueClassName: 'admin-summary-row__value--fields',
        copy: createRowCopyContract(key),
      };
    default:
      return {
        copy: createRowCopyContract(key),
      };
  }
}

export function createAdminCmsSharedSummaryViewLens(
  context: 'read' | 'workflow',
  summary: AdminCmsSharedSummaryContract,
): AdminCmsSharedSummaryViewLens {
  return {
    copy: createCopyContract(context),
    statusPresentation: createStatusPresentation(context, summary.semantics.statusTone),
  };
}

function AdminCmsSharedSummaryRow({ item }: { item: AdminCmsSummaryLineItem }) {
  const spec = createAdminCmsSummaryRowViewSpec(item.key);

  return (
    <li>
      <strong>{item.label}:</strong>{' '}
      <span className={spec.valueClassName}>{item.value}</span>
      <br />
      <small>
        {spec.copy.helperLabel ? `${spec.copy.helperLabel} · ` : ''}
        {spec.copy.helperPrefix ? `${spec.copy.helperPrefix}: ` : ''}
        {item.helper}
      </small>
    </li>
  );
}

export function AdminCmsSharedSummaryView({
  lens,
  summary,
}: {
  lens: AdminCmsSharedSummaryViewLens;
  summary: AdminCmsSharedSummaryContract;
}) {
  return (
    <div className="admin-workflow-persistence">
      <p className="admin-workflow-payload__title">{lens.copy.title}</p>
      <p>{lens.copy.contextLabel}</p>
      <p>{lens.copy.updatedAtLabel}: {summary.updatedAt}</p>
      <p>
        <strong>{summary.semantics.headline}</strong>
      </p>
      {lens.statusPresentation.visible ? (
        <p>
          <span className={lens.statusPresentation.toneClassName}>{lens.statusPresentation.label}</span>
        </p>
      ) : null}
      <p>{summary.semantics.supportingText}</p>
      <p>{lens.copy.activityLabel}: {summary.semantics.activityText}</p>
      <p>{lens.copy.changesLabel}: {summary.semantics.changeText}</p>
      <p className="admin-workflow-persistence__hint">
        Use this summary as the quickest readout for what changed last before opening deeper editor fields.
      </p>
      {!summary.items.length ? (
        <p className="admin-workflow-persistence__hint">No summary rows available yet for this module.</p>
      ) : null}
      <ul>
        {summary.items.map((item) => (
          <AdminCmsSharedSummaryRow key={item.key} item={item} />
        ))}
      </ul>
    </div>
  );
}
