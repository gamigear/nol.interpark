import type { ReactNode } from 'react';

type StoryBodyScaffoldProps = {
  intro: string;
  children?: ReactNode;
};

export function StoryBodyScaffold({ intro, children }: StoryBodyScaffoldProps) {
  const normalizedIntro = intro.trim();

  return (
    <article className="story-body">
      {normalizedIntro ? <p className="story-body__lead">{normalizedIntro}</p> : null}
      <div className="story-body__grid">
        <div className="story-body__content">
          <aside className="story-body__placeholder-note">
            <strong>Editorial placeholder:</strong> This article body will be replaced by CMS-rendered rich text when the content layer is connected.
          </aside>
        </div>
        <aside className="story-body__aside">{children}</aside>
      </div>
    </article>
  );
}
