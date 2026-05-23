import * as React from 'react';

const LazyArticleComposer = React.lazy(async () => {
  const module = await import('./article-composer');
  return { default: module.ArticleComposer };
});

export default LazyArticleComposer;