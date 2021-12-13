import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { pageNames } from './constants/routes';
import { otherPageNames } from './constants/other-routes';
import { TITLE } from './constants/title';
import classes from './main.scss';

const allPageNames = pageNames.concat(otherPageNames);

export default function BasicExample() {
  return (
    <Router>
      <div>
        <h1>{TITLE}</h1>
        <ul>
          {allPageNames.map((name) => (
            <li className={classes.link} key={name}>
              <Link to={name}>{name}</Link>
            </li>
          ))}
        </ul>
        <hr />
        <Switch>
          {allPageNames.map((name) => (
            <Route exact key={name} path={name}>
              <p>Page: {name}</p>
            </Route>
          ))}
        </Switch>
      </div>
    </Router>
  );
}
