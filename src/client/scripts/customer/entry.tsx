import React from 'react';
import ReactDom from 'react-dom';
import Router from './router';

const app = (
    <React.Suspense fallback={<h2>loading...</h2>}>
      <Router />
    </React.Suspense>
);

ReactDom.render(app, document.getElementById('index'));
