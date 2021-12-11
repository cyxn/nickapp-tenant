import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { pageNames } from './constants/routes';
import { otherPageNames } from './constants/other-routes';
import { TITLE } from './constants/title';

const allPageNames = pageNames.concat(otherPageNames);

export default function BasicExample() {
  return (
    <Router>
      <div>
        <h2>Title: {TITLE}</h2>
        <ul>
          {allPageNames.map((name) => (
            <li key={name}>
              <Link to={name}>{name}</Link>
            </li>
          ))}
        </ul>
        <hr />
        <Switch>
          {allPageNames.map((name) => (
            <Route exact key={name} path={name}>
              Page: {name}
            </Route>
          ))}
        </Switch>
      </div>
    </Router>
  );
}
