import * as reExported from './re-exported/index'
import { namedAll } from './re-exported/index'
import './side-effect'
import {  add, sub } from './calc'
import externalModule from 'externalModule'
import('./bar')

import * as arrorFn from './default-export/arror-fn'
import * as fn from './default-export/fn'
import * as klass from './default-export/klass'
import * as namedClass from './default-export/named-class'
import * as namedFn from './default-export/named-fn'

{
  const a = 1;
  const b = 2;
}