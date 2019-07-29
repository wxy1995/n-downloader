import test from 'ava';
import download from '.';
import { isStream, isPromise } from './utils';

const url = 'http://pic37.nipic.com/20140113/8800276_184927469000_2.png';

test('download() returns stream', t => {
  t.true(isStream(download(url)));
});

test('download() returns promise', t => {
  t.true(isPromise(download(url)));
});
