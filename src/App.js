import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRates, toggleCurrency } from './slices/currencySlice';
import { pushConversion } from './slices/historySlice';

const AVAILABLE = ['USD', 'EUR', 'GBP', 'PLN', 'JPY'];

function App() {
  const dispatch = useDispatch();
  const currencyState = useSelector(s => s.currency) || {};
  const { rates = {}, lastUpdated = null, status = 'idle', error = null, selected = ['USD'] } = currencyState;
  const history = useSelector(s => (s.history && s.history.items) || []);
  const [amount, setAmount] = useState('');
  const [results, setResults] = useState({});
  const intervalRef = useRef(null);

  useEffect(() => {
    dispatch(fetchRates());
    intervalRef.current = setInterval(() => dispatch(fetchRates()), 60000);
    return () => clearInterval(intervalRef.current);
  }, [dispatch]);

  useEffect(() => {
    if (!amount) return setResults({});
    const num = parseFloat(amount.replace(',', '.')) || 0;
    const out = {};
    selected.forEach(code => {
      const rate = rates ? rates[code] : undefined;
      if (rate) out[code] = +(num * rate).toFixed(4);
    });
    setResults(out);
  }, [amount, rates, selected]);

  function handleConvertOnce() {
    Object.entries(results).forEach(([code, val]) => {
      dispatch(pushConversion({ amount: +amount, currency: code, result: val, time: new Date().toISOString() }));
    });
  }

  function handleRetry() {
    dispatch(fetchRates());
  }

  return (
    <div className="App" style={{ padding: 16 }}>
      <h2>Currency converter (UAH base)</h2>
      <div>
        <label>Amount in UAH:</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" />
        <button onClick={handleConvertOnce}>Convert</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div>Choose currencies:</div>
        {AVAILABLE.map(code => (
          <label key={code} style={{ marginRight: 8 }}>
            <input type="checkbox" checked={selected.includes(code)} onChange={() => dispatch(toggleCurrency(code))} /> {code}
          </label>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <div><strong>Rates status:</strong> {status}</div>
        {error && (
          <div>
            <div style={{ color: 'red' }}>Error: {error}</div>
            <button onClick={handleRetry}>Try again</button>
          </div>
        )}
        <div>Last updated: {lastUpdated}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Results</h3>
        {Object.keys(results).length === 0 && <div>No results</div>}
        <ul>
          {Object.entries(results).map(([c, v]) => (
            <li key={c}>{c}: {v}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>History (last 5)</h3>
        <ul>
          {history.map((h, idx) => (
            <li key={idx}>{h.time} — {h.amount} UAH → {h.currency}: {h.result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
