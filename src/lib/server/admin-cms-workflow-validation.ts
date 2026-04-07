import type { PublishStatus } from '@/lib/server/db/schema-types';
import type { AdminCmsModuleKey, AdminCmsWorkflowAction } from '@/components/admin/dashboard/admin-cms-modules';
import { HOME_PAGE_LOCALES, isHomePageLocale } from '@/types/home';

export type AdminCmsWorkflowPayload = {
  moduleKey: AdminCmsModuleKey;
  action: AdminCmsWorkflowAction;
  nextStatus: PublishStatus;
  selection: string;
  note: string;
};

export type AdminCmsModuleSpecificPayload =
  | {
      moduleKey: 'homepage';
      locale: (typeof HOME_PAGE_LOCALES)[number];
      sectionKey: 'hero' | 'featuredTickets' | 'topPicks' | 'editorial' | 'travelGuides';
      sectionLabel: string;
    }
  | {
      moduleKey: 'navigation';
      placement: 'header' | 'footer' | 'locale-switcher' | 'utility';
      href: string;
      hrefUniqueWithinPlacement: boolean;
    }
  | {
      moduleKey: 'promos';
      placementKey: 'homepage-hero' | 'homepage-strip' | 'editorial-rail' | 'nav-highlight';
      ctaTarget: string;
      scheduleWindow: 'immediate' | 'scheduled-window';
    };

export type AdminCmsWorkflowValidationIssue = {
  field:
    | 'moduleKey'
    | 'action'
    | 'nextStatus'
    | 'selection'
    | 'note'
    | 'moduleSpecific'
    | 'locale'
    | 'sectionKey'
    | 'placement'
    | 'href'
    | 'ctaTarget'
    | 'scheduleWindow';
  message: string;
};

export type AdminCmsWorkflowValidatedPayload = AdminCmsWorkflowPayload & {
  moduleSpecific: AdminCmsModuleSpecificPayload;
};

export type AdminCmsWorkflowValidationResult =
  | {
      success: true;
      data: AdminCmsWorkflowValidatedPayload;
    }
  | {
      success: false;
      issues: AdminCmsWorkflowValidationIssue[];
    };

const validModuleKeys = ['homepage', 'navigation', 'promos'] as const satisfies readonly AdminCmsModuleKey[];
const validActions = ['save_draft', 'schedule', 'publish', 'archive'] as const satisfies readonly AdminCmsWorkflowAction[];
const validStatuses = ['draft', 'scheduled', 'published', 'archived'] as const satisfies readonly PublishStatus[];

const allowedTransitions: Record<AdminCmsWorkflowAction, PublishStatus[]> = {
  save_draft: ['draft'],
  schedule: ['scheduled'],
  publish: ['published'],
  archive: ['archived'],
};

const homepageSectionMap = {
  'hero-en': { locale: 'en', sectionKey: 'hero', sectionLabel: 'Hero banner' },
  'featured-tickets-en': {
    locale: 'en',
    sectionKey: 'featuredTickets',
    sectionLabel: 'Featured tickets',
  },
  'travel-guides-ar': {
    locale: 'ar',
    sectionKey: 'travelGuides',
    sectionLabel: 'Travel guides',
  },
} as const;

const navigationSelectionMap = {
  'primary-nav': { placement: 'header', href: '/journeys', hrefUniqueWithinPlacement: true },
  'footer-nav': { placement: 'footer', href: '/support', hrefUniqueWithinPlacement: true },
  'locale-shortcuts': {
    placement: 'locale-switcher',
    href: '/ar',
    hrefUniqueWithinPlacement: true,
  },
} as const;

const promoSelectionMap = {
  'spring-hero': {
    placementKey: 'homepage-hero',
    ctaTarget: '/campaigns/spring-escape',
    scheduleWindow: 'immediate',
  },
  'ramadan-strip-ar': {
    placementKey: 'homepage-strip',
    ctaTarget: '/campaigns/ramadan',
    scheduleWindow: 'scheduled-window',
  },
  'partner-campaign-card': {
    placementKey: 'editorial-rail',
    ctaTarget: '/campaigns/partner',
    scheduleWindow: 'immediate',
  },
} as const;

function includesValue<T extends string>(values: readonly T[], input: string): input is T {
  return values.includes(input as T);
}

function coerceString(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function inferNextStatus(action: AdminCmsWorkflowAction): PublishStatus {
  return allowedTransitions[action][0] ?? 'draft';
}

function validateNote(action: AdminCmsWorkflowAction, note: string) {
  if (!note) {
    return 'Please provide a short operator note for this workflow action.';
  }

  if (note.length < 8) {
    return 'Operator note must be at least 8 characters long.';
  }

  if (note.length > 280) {
    return 'Operator note must stay under 280 characters.';
  }

  if (action === 'schedule' && !/(schedule|time|window|release|launch|publish|tomorrow|today|eta)/i.test(note)) {
    return 'Scheduled actions should include timing or release context in the note.';
  }

  if (action === 'archive' && !/(archive|retire|end|expire|cleanup|sunset)/i.test(note)) {
    return 'Archive actions should explain retirement or expiry context.';
  }

  return null;
}

function validateHomepageSelection(
  selection: string,
  issues: AdminCmsWorkflowValidationIssue[],
): AdminCmsModuleSpecificPayload | null {
  const mapped = homepageSectionMap[selection as keyof typeof homepageSectionMap];

  if (!mapped) {
    issues.push({ field: 'selection', message: 'Unknown homepage section selection.' });
    return null;
  }

  if (!isHomePageLocale(mapped.locale)) {
    issues.push({ field: 'locale', message: 'Homepage locale is outside supported homepage locales.' });
    return null;
  }

  return {
    moduleKey: 'homepage',
    locale: mapped.locale,
    sectionKey: mapped.sectionKey,
    sectionLabel: mapped.sectionLabel,
  };
}

function validateNavigationSelection(
  selection: string,
  _action: AdminCmsWorkflowAction,
  issues: AdminCmsWorkflowValidationIssue[],
): AdminCmsModuleSpecificPayload | null {
  const mapped = navigationSelectionMap[selection as keyof typeof navigationSelectionMap];

  if (!mapped) {
    issues.push({ field: 'selection', message: 'Unknown navigation assignment selection.' });
    return null;
  }

  if (!mapped.href.startsWith('/')) {
    issues.push({ field: 'href', message: 'Navigation href must be an internal path.' });
  }

  if (!mapped.hrefUniqueWithinPlacement) {
    issues.push({ field: 'href', message: 'Navigation href must be unique within the selected placement.' });
  }

  return {
    moduleKey: 'navigation',
    placement: mapped.placement,
    href: mapped.href,
    hrefUniqueWithinPlacement: mapped.hrefUniqueWithinPlacement,
  };
}

function validatePromoSelection(
  selection: string,
  action: AdminCmsWorkflowAction,
  nextStatus: PublishStatus,
  issues: AdminCmsWorkflowValidationIssue[],
): AdminCmsModuleSpecificPayload | null {
  const mapped = promoSelectionMap[selection as keyof typeof promoSelectionMap];

  if (!mapped) {
    issues.push({ field: 'selection', message: 'Unknown promo placement selection.' });
    return null;
  }

  if (!mapped.ctaTarget.startsWith('/')) {
    issues.push({ field: 'ctaTarget', message: 'Promo CTA target must stay within internal routing.' });
  }

  if (action === 'schedule' && mapped.scheduleWindow !== 'scheduled-window') {
    issues.push({
      field: 'scheduleWindow',
      message: 'Scheduled promo actions require a scheduled window capable placement.',
    });
  }

  if (nextStatus === 'published' && mapped.scheduleWindow === 'scheduled-window' && action !== 'publish') {
    issues.push({
      field: 'scheduleWindow',
      message: 'Scheduled-window promo cannot resolve to published state without explicit publish action.',
    });
  }

  return {
    moduleKey: 'promos',
    placementKey: mapped.placementKey,
    ctaTarget: mapped.ctaTarget,
    scheduleWindow: mapped.scheduleWindow,
  };
}

function validateModuleSpecificSelection(
  moduleKey: AdminCmsModuleKey,
  selection: string,
  action: AdminCmsWorkflowAction,
  nextStatus: PublishStatus,
  issues: AdminCmsWorkflowValidationIssue[],
): AdminCmsModuleSpecificPayload | null {
  switch (moduleKey) {
    case 'homepage':
      return validateHomepageSelection(selection, issues);
    case 'navigation':
      return validateNavigationSelection(selection, action, issues);
    case 'promos':
      return validatePromoSelection(selection, action, nextStatus, issues);
    default:
      issues.push({ field: 'moduleKey', message: 'Unsupported module for workflow validation.' });
      return null;
  }
}

export function validateAdminCmsWorkflowFormData(formData: FormData): AdminCmsWorkflowValidationResult {
  const moduleKeyValue = coerceString(formData.get('moduleKey'));
  const actionValue = coerceString(formData.get('action'));
  const nextStatusValue = coerceString(formData.get('nextStatus'));
  const selection = coerceString(formData.get('selection'));
  const note = coerceString(formData.get('note'));

  const issues: AdminCmsWorkflowValidationIssue[] = [];

  if (!includesValue(validModuleKeys, moduleKeyValue)) {
    issues.push({ field: 'moduleKey', message: 'Unknown admin CMS module.' });
  }

  if (!includesValue(validActions, actionValue)) {
    issues.push({ field: 'action', message: 'Unknown workflow action.' });
  }

  const action = includesValue(validActions, actionValue) ? actionValue : 'save_draft';
  const inferredStatus = inferNextStatus(action);
  const nextStatus = includesValue(validStatuses, nextStatusValue) ? nextStatusValue : inferredStatus;

  if (nextStatusValue && !includesValue(validStatuses, nextStatusValue)) {
    issues.push({ field: 'nextStatus', message: 'Unknown publish status requested.' });
  }

  if (!allowedTransitions[action].includes(nextStatus)) {
    issues.push({ field: 'nextStatus', message: `Action ${action} cannot transition to ${nextStatus}.` });
  }

  if (!selection) {
    issues.push({ field: 'selection', message: 'Please choose a placeholder entity before continuing.' });
  }

  const noteIssue = validateNote(action, note);
  if (noteIssue) {
    issues.push({ field: 'note', message: noteIssue });
  }

  const moduleKey = includesValue(validModuleKeys, moduleKeyValue) ? moduleKeyValue : 'homepage';
  const moduleSpecific = selection
    ? validateModuleSpecificSelection(moduleKey, selection, action, nextStatus, issues)
    : null;

  if (!moduleSpecific) {
    issues.push({ field: 'moduleSpecific', message: 'Unable to derive module specific workflow contract.' });
  }

  if (issues.length > 0 || !moduleSpecific) {
    return {
      success: false,
      issues,
    };
  }

  return {
    success: true,
    data: {
      moduleKey,
      action,
      nextStatus,
      selection,
      note,
      moduleSpecific,
    },
  };
}

export function formatAdminCmsWorkflowIssues(issues: AdminCmsWorkflowValidationIssue[]) {
  return issues.map((issue) => issue.message).join(' ');
}
