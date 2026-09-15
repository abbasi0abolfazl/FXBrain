import test from 'node:test';
import assert from 'node:assert/strict';
import { MARKET_STALE_AFTER_SECONDS, normalizeTwelveDataQuote } from '../worker.js';

const fetchedAt = '2026-09-15T06:00:00.000Z';

test('normalizes a fresh quote using last_quote_at', () => {
  const quote = normalizeTwelveDataQuote({ symbol: 'EUR/USD', close: '1.15277', previous_close: '1.15511', last_quote_at: '2026-09-15T05:59:18.000Z' }, fetchedAt);
  assert.equal(quote.timestamp, '2026-09-15T05:59:18.000Z');
  assert.equal(quote.ageSeconds, 42);
  assert.equal(quote.stale, false);
});

test('marks an old quote stale', () => {
  const quote = normalizeTwelveDataQuote({ close: '1.15', last_quote_at: '2026-09-15T05:55:00.000Z' }, fetchedAt);
  assert.equal(quote.ageSeconds, 300);
  assert.equal(quote.stale, true);
  assert.equal(MARKET_STALE_AFTER_SECONDS, 180);
});

test('falls back to timestamp when last_quote_at is missing', () => {
  const quote = normalizeTwelveDataQuote({ close: '1.15', timestamp: '2026-09-15T05:59:00.000Z' }, fetchedAt);
  assert.equal(quote.ageSeconds, 60);
});

test('does not fabricate freshness without a provider timestamp', () => {
  const quote = normalizeTwelveDataQuote({ close: '1.15' }, fetchedAt);
  assert.equal(quote.timestamp, null);
  assert.equal(quote.ageSeconds, null);
  assert.equal(quote.stale, true);
});

test('rejects malformed provider responses', () => {
  assert.throws(() => normalizeTwelveDataQuote({ status: 'error', message: 'quota exceeded' }, fetchedAt), /quota exceeded/);
});
