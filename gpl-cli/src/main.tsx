import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createGraphiQLFetcher} from "@graphiql/toolkit";
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';

const fetcher = createGraphiQLFetcher({
  url:'/server'
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GraphiQL fetcher={fetcher}/>
  </React.StrictMode>,
)
