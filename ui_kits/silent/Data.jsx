/* Silent UI Kit — sample data (fake; mirrors RustCoin / payment-history shapes). */

const SP_ADDRESS = 'sp1qqgste7k9hx0qftg6qmwlkqtwuy6cycyavzmzj85c6qdfhjdpdjtdgqjuexzk6murw56suy3e0rd2cgqvycxttddwsvgxe2usfpxumr70xc9pkqwv';

const WALLETS = {
  savings: {
    name: 'savings',
    network: 'Signet',
    blindbit: 'https://blindbit.silentpayments.dev',
    electrum: 'signet.electrum.silent:50001',
    confirmed: '0.04827310 BTC', confirmedCount: '4 coins',
    unconfirmed: '0.00051200 BTC', unconfirmedCount: '1 coin',
    coins: [
      { type: 'Segwit',  height: '812043',      outpoint: '3a9f2c…1d4e:0', label: 'Cold storage', value: '0.02000000' },
      { type: 'Taproot', height: '811920',      outpoint: '7b1e84…9c0f:1', label: 'Exchange withdrawal', value: '0.01500000' },
      { type: 'Segwit',  height: '809514',      outpoint: 'c40d77…2a8b:0', label: '', value: '0.01000000' },
      { type: 'Taproot', height: '812501',      outpoint: 'e18a30…ff21:2', label: 'Payroll', value: '0.00327310' },
      { type: 'Segwit',  height: 'Unconfirmed', outpoint: '9d22b6…6e74:0', label: '', value: '0.00051200' },
    ],
    history: [
      { dir: 'Incoming', txid: '3a9f2c…a1d4e0', height: '812043', amount: '0.02000000' },
      { dir: 'Incoming', txid: '7b1e84…b9c0f1', height: '811920', amount: '0.01500000' },
      { dir: 'Outgoing', txid: 'f55c19…0e7733', height: '810882', amount: '0.00840000' },
      { dir: 'Incoming', txid: 'c40d77…c2a8b0', height: '809514', amount: '0.01000000' },
      { dir: 'Incoming', txid: 'e18a30…dff212', height: '812501', amount: '0.00327310' },
      { dir: 'Incoming', txid: '9d22b6…56e740', height: 'Unconfirmed', amount: '0.00051200' },
    ],
  },
  'cold-storage': {
    name: 'cold-storage',
    network: 'Bitcoin',
    blindbit: 'https://blindbit.example.com',
    electrum: 'electrum.example.com:50002',
    confirmed: '0.50000000 BTC', confirmedCount: '1 coin',
    unconfirmed: '0.00000000 BTC', unconfirmedCount: '0 coins',
    coins: [
      { type: 'Taproot', height: '801200', outpoint: 'aa11bb…cc22:0', label: 'Deep cold', value: '0.50000000' },
    ],
    history: [
      { dir: 'Incoming', txid: 'aa11bb…22cc00', height: '801200', amount: '0.50000000' },
    ],
  },
};

// Wallets shown in the Menu tab list (some openable)
const KNOWN_WALLETS = ['savings', 'cold-storage', 'testing'];

const NETWORKS = ['Regtest', 'Signet', 'Testnet', 'Bitcoin'];

const MNEMONIC_WORDS = 'vault echo silent ridge amber cosmic pledge orbit timber walnut velvet jungle harbor signal modest crater nimble fabric'.split(' ');

function fakeMnemonic() {
  const w = [...MNEMONIC_WORDS];
  for (let i = w.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [w[i], w[j]] = [w[j], w[i]]; }
  return w.slice(0, 12).join(' ');
}

Object.assign(window, { SP_ADDRESS, WALLETS, KNOWN_WALLETS, NETWORKS, fakeMnemonic });
