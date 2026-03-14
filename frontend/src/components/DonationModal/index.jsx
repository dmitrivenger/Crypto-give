import { useState, useEffect } from 'react'
import { useAccount, useBalance, useReadContract, useSendTransaction, useWriteContract, useSwitchChain } from 'wagmi'
import { parseEther, parseUnits, formatUnits } from 'viem'
import { mainnet, polygon, bsc } from 'wagmi/chains'
import { QRCodeSVG } from 'qrcode.react'
import { useWallet } from '../../contexts/WalletContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { confirmDonation } from '../../services/api'
import {
  BLOCKCHAIN_LABELS, BLOCKCHAIN_COLORS, BLOCKCHAIN_SYMBOLS,
  EVM_BLOCKCHAINS, MANUAL_BLOCKCHAINS, BLOCKCHAIN_EXPLORERS,
  TOKENS_BY_BLOCKCHAIN,
} from '../../utils/constants'
import { formatUSD } from '../../utils/formatters'
import { isValidAmount } from '../../utils/validators'
import LoadingSpinner from '../LoadingSpinner'

const CHAIN_IDS = { ethereum: mainnet.id, polygon: polygon.id, bsc: bsc.id }
const NATIVE_TOKEN = { ethereum: 'ETH', polygon: 'POL', bsc: 'BNB' }

const USDC_ADDRESSES = {
  ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  polygon:  '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  bsc:      '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
}
const USDT_ADDRESSES = {
  ethereum: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  polygon:  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  bsc:      '0x55d398326f99059fF775485246999027B3197955',
}
const USDT_DECIMALS = { ethereum: 6, polygon: 6, bsc: 18 }

const ERC20_ABI = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'transfer', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
]

// Chai numerology presets (18 = chai = life)
const CHAI_PRESETS_USD = [18, 36, 54, 180]

const STEPS = { FORM: 'form', SWITCHING: 'switching', SENDING: 'sending', QR: 'qr', HASH: 'hash', SUCCESS: 'success', ERROR: 'error' }

function ArrowLeft() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
}

export default function DonationModal({ organization, onClose }) {
  const { address } = useWallet()
  const { t } = useLanguage()
  const { chainId: currentChainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const { sendTransactionAsync } = useSendTransaction()
  const { writeContractAsync } = useWriteContract()

  const availableBlockchains = (organization.blockchains || []).map(b => b.name)
  const [blockchain, setBlockchain] = useState(availableBlockchains[0] || 'ethereum')
  const [token, setToken] = useState('')
  const [amount, setAmount] = useState('')
  const [usdValue, setUsdValue] = useState(null)
  const [step, setStep] = useState(STEPS.FORM)
  const [txHash, setTxHash] = useState(null)
  const [manualTxHash, setManualTxHash] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [submittingHash, setSubmittingHash] = useState(false)

  const isEVM    = EVM_BLOCKCHAINS.includes(blockchain)
  const isManual = MANUAL_BLOCKCHAINS.includes(blockchain)
  const targetChainId   = CHAIN_IDS[blockchain]
  const onCorrectChain  = currentChainId === targetChainId
  const recipientAddress = organization.blockchains?.find(b => b.name === blockchain)?.address
  const availableTokens = TOKENS_BY_BLOCKCHAIN[blockchain] || []

  useEffect(() => {
    const tokens = TOKENS_BY_BLOCKCHAIN[blockchain] || []
    setToken(tokens[0] || '')
  }, [blockchain])

  const { data: nativeBalance } = useBalance({ address, chainId: targetChainId, query: { enabled: !!address && isEVM } })
  const erc20Address = token === 'USDC' ? USDC_ADDRESSES[blockchain] : token === 'USDT' ? USDT_ADDRESSES[blockchain] : undefined
  const erc20Decimals = token === 'USDT' ? (USDT_DECIMALS[blockchain] ?? 6) : 6
  const { data: erc20Balance } = useReadContract({
    address: erc20Address, abi: ERC20_ABI, functionName: 'balanceOf', args: [address], chainId: targetChainId,
    query: { enabled: !!address && isEVM && !!erc20Address },
  })
  const nativeFormatted = nativeBalance ? parseFloat(formatUnits(nativeBalance.value, 18)).toFixed(6) : null
  const erc20Formatted  = erc20Balance  ? parseFloat(formatUnits(erc20Balance, erc20Decimals)).toFixed(2) : null
  const currentBalance  = (token === 'USDC' || token === 'USDT') ? erc20Formatted : nativeFormatted

  useEffect(() => {
    if (!isValidAmount(amount) || !token) { setUsdValue(null); return }
    const timer = setTimeout(async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const res  = await fetch(`/v1/crypto-price/${token}/${today}`)
        const data = await res.json()
        if (data.data?.priceUsd) setUsdValue(parseFloat(amount) * data.data.priceUsd)
      } catch { setUsdValue(null) }
    }, 500)
    return () => clearTimeout(timer)
  }, [amount, token])

  async function handleEVMDonate() {
    if (!isValidAmount(amount)) return
    if (!onCorrectChain) {
      setStep(STEPS.SWITCHING)
      try { await switchChain({ chainId: targetChainId }) }
      catch { setErrorMsg(`Please switch to ${BLOCKCHAIN_LABELS[blockchain]} in your wallet.`); setStep(STEPS.ERROR); return }
    }
    setStep(STEPS.SENDING)
    setErrorMsg('')
    try {
      let hash
      const nativeSym = NATIVE_TOKEN[blockchain]
      if (token === nativeSym)    hash = await sendTransactionAsync({ to: recipientAddress, value: parseEther(amount), chainId: targetChainId })
      else if (token === 'USDC')  hash = await writeContractAsync({ address: USDC_ADDRESSES[blockchain], abi: ERC20_ABI, functionName: 'transfer', args: [recipientAddress, parseUnits(amount, 6)], chainId: targetChainId })
      else if (token === 'USDT')  hash = await writeContractAsync({ address: USDT_ADDRESSES[blockchain], abi: ERC20_ABI, functionName: 'transfer', args: [recipientAddress, parseUnits(amount, erc20Decimals)], chainId: targetChainId })
      setTxHash(hash)
      try { await confirmDonation(address, hash, organization.id, blockchain, token, amount) } catch { /* non-fatal */ }
      setStep(STEPS.SUCCESS)
    } catch (err) {
      if (err.code === 4001 || err.message?.includes('rejected')) setErrorMsg('Transaction rejected.')
      else if (err.message?.includes('insufficient')) setErrorMsg('Insufficient funds.')
      else setErrorMsg(err.shortMessage || err.message || 'Transaction failed.')
      setStep(STEPS.ERROR)
    }
  }

  async function handleConfirmManual() {
    if (!manualTxHash.trim()) return
    setSubmittingHash(true)
    try { await confirmDonation(address, manualTxHash.trim(), organization.id, blockchain, token, amount) } catch { /* non-fatal */ }
    setTxHash(manualTxHash.trim())
    setSubmittingHash(false)
    setStep(STEPS.SUCCESS)
  }

  function copyAddress() {
    if (!recipientAddress) return
    navigator.clipboard.writeText(recipientAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const qrValue = blockchain === 'bitcoin'
    ? `bitcoin:${recipientAddress}?amount=${amount}&label=${encodeURIComponent(organization.name)}`
    : recipientAddress || ''

  const explorerBase = BLOCKCHAIN_EXPLORERS[blockchain]

  // Network card styles
  const chainColors = {
    ethereum: { active: '#6366f1', dim: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.40)' },
    polygon:  { active: '#8b5cf6', dim: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.40)' },
    bsc:      { active: '#eab308', dim: 'rgba(234,179,8,0.15)',  border: 'rgba(234,179,8,0.40)' },
    bitcoin:  { active: '#f97316', dim: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.40)' },
    tron:     { active: '#ef4444', dim: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.40)' },
  }

  const modalStyle = {
    background: '#161B27',
    border: '1px solid rgba(255,255,255,0.09)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.80)',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div className="w-full max-w-md rounded-2xl overflow-hidden animate-scale-in" style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* Gold top bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #A87A2D, #E2B96F, #F5D78E, #E2B96F, #A87A2D)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(42,53,96,0.80)', border: '1px solid rgba(201,168,76,0.20)' }}
            >🏛️</div>
            <div>
              <p className="font-semibold text-sm text-white">{organization.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.30)' }}>{t('taxId')}: {organization.taxId}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* ── FORM ── */}
        {step === STEPS.FORM && (
          <div className="p-5 space-y-4">

            {/* Network */}
            <div>
              <p className="section-label mb-2.5">{t('network')}</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {availableBlockchains.map(bc => {
                  const c = chainColors[bc] || { active: '#C9A84C', dim: 'rgba(201,168,76,0.10)', border: 'rgba(201,168,76,0.35)' }
                  const isActive = blockchain === bc
                  const isM = MANUAL_BLOCKCHAINS.includes(bc)
                  return (
                    <button
                      key={bc}
                      onClick={() => setBlockchain(bc)}
                      className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-[11px] font-medium transition-all duration-150"
                      style={{
                        background:   isActive ? c.dim : 'rgba(255,255,255,0.03)',
                        border:       isActive ? `1px solid ${c.border}` : '1px solid rgba(255,255,255,0.07)',
                        color:        isActive ? c.active : 'rgba(255,255,255,0.50)',
                      }}
                    >
                      <span className="text-base leading-none">{BLOCKCHAIN_SYMBOLS[bc]}</span>
                      <span className="font-semibold">{BLOCKCHAIN_LABELS[bc]?.split(' ')[0]}</span>
                      <span
                        className="text-[9px] font-bold px-1 py-0.5 rounded"
                        style={{
                          background: isActive ? `${c.active}25` : 'rgba(255,255,255,0.06)',
                          color:      isActive ? c.active : 'rgba(255,255,255,0.30)',
                        }}
                      >
                        {isM ? t('manualBadge') : t('autoBadge')}
                      </span>
                    </button>
                  )
                })}
              </div>

              {isEVM && !onCorrectChain && (
                <div className="flex items-center gap-2 mt-2 text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(120,53,15,0.30)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                  <span>⚠</span> {t('wrongNetwork')}
                </div>
              )}
              {isManual && (
                <div className="flex items-center gap-2 mt-2 text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>ℹ</span> {t('manualInfo')}
                </div>
              )}
            </div>

            {/* Token (EVM multi-token) */}
            {isEVM && availableTokens.length > 1 && (
              <div>
                <p className="section-label mb-2">{t('token')}</p>
                <div className="flex gap-2">
                  {availableTokens.map(tk => (
                    <button
                      key={tk}
                      onClick={() => setToken(tk)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-150"
                      style={{
                        background: token === tk ? 'linear-gradient(135deg, #C9A84C, #E2B96F)' : 'rgba(255,255,255,0.04)',
                        color:      token === tk ? '#0D1117' : 'rgba(255,255,255,0.55)',
                        border:     token === tk ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >{tk}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Chai presets (USD) */}
            <div>
              <p className="section-label mb-2">חַי Chai presets (USD)</p>
              <div className="flex gap-2">
                {CHAI_PRESETS_USD.map(preset => (
                  <button
                    key={preset}
                    onClick={() => {/* just show as hints; amount is in crypto */}}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                    style={{
                      background: 'rgba(42,53,96,0.60)',
                      color: '#E2B96F',
                      border: '1px solid rgba(201,168,76,0.20)',
                    }}
                  >${preset}</button>
                ))}
              </div>
            </div>

            {/* Balance */}
            {isEVM && !!currentBalance && (
              <button
                onClick={() => setAmount(currentBalance)}
                className="w-full flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('yourBalance')}</span>
                <span className="text-sm font-mono font-semibold" style={{ color: '#E2B96F' }}>
                  {currentBalance} {token}
                  <span className="text-xs ml-1.5 font-normal" style={{ color: 'rgba(255,255,255,0.25)' }}>({t('tapToUseMax')})</span>
                </span>
              </button>
            )}

            {/* Amount */}
            <div>
              <p className="section-label mb-2">{t('amount')}</p>
              <div className="relative">
                <input
                  type="number" step="any" min="0" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  className="input pr-20 text-2xl font-bold placeholder:font-normal placeholder:text-xl"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>{token}</span>
              </div>
              {usdValue !== null && (
                <p className="text-sm mt-1.5 font-medium" style={{ color: '#4ade80' }}>≈ {formatUSD(usdValue)}</p>
              )}
            </div>

            {/* Recipient */}
            {recipientAddress && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="section-label mb-1">{t('orgReceivesOn')} {BLOCKCHAIN_LABELS[blockchain]}</p>
                <p className="text-xs font-mono break-all" style={{ color: 'rgba(255,255,255,0.45)' }}>{recipientAddress}</p>
              </div>
            )}

            <button
              onClick={isEVM ? handleEVMDonate : () => setStep(STEPS.QR)}
              disabled={!isValidAmount(amount)}
              className="btn-primary btn-gold-shimmer w-full py-3.5 text-base font-semibold"
            >
              {isManual ? `${t('showQRCode')} →` : `${t('donate')} ${amount ? `${amount} ${token}` : ''} →`}
            </button>
          </div>
        )}

        {/* ── SWITCHING ── */}
        {step === STEPS.SWITCHING && (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="font-semibold text-white mt-5 mb-1">{t('switchingNetwork')}</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('approveSwitch')}</p>
          </div>
        )}

        {/* ── SENDING ── */}
        {step === STEPS.SENDING && (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="font-semibold text-white mt-5 mb-1">{t('confirmInWallet')}</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('checkWallet')}</p>
          </div>
        )}

        {/* ── QR ── */}
        {step === STEPS.QR && (
          <div className="p-5">
            <button onClick={() => setStep(STEPS.FORM)} className="flex items-center gap-1.5 text-sm mb-4 transition-colors" style={{ color: 'rgba(255,255,255,0.40)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E2B96F'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.40)'}
            >
              <ArrowLeft /> {t('back')}
            </button>

            <div className="rounded-2xl p-5 text-center mb-4" style={{ background: 'rgba(42,53,96,0.40)', border: '1px solid rgba(201,168,76,0.20)' }}>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('sendExactly')}</p>
              <p className="text-2xl font-bold font-serif mb-0.5" style={{ color: '#E2B96F' }}>{amount} {token}</p>
              {usdValue !== null && <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>≈ {formatUSD(usdValue)}</p>}

              {recipientAddress && (
                <div className="flex justify-center mb-4">
                  <div className="rounded-2xl p-3" style={{ background: 'white' }}>
                    <QRCodeSVG value={qrValue} size={172} level="M" />
                  </div>
                </div>
              )}

              <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.40)' }}>{t('sendToAddress')}</p>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-mono break-all flex-1 leading-relaxed text-left" style={{ color: 'rgba(255,255,255,0.65)' }}>{recipientAddress}</p>
                <button
                  onClick={copyAddress}
                  className="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-lg transition-colors"
                  style={{ background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(201,168,76,0.15)', color: copied ? '#4ade80' : '#E2B96F' }}
                >
                  {copied ? '✓' : t('copy')}
                </button>
              </div>
            </div>

            <button onClick={() => setStep(STEPS.HASH)} className="btn-primary btn-gold-shimmer w-full py-3.5 text-base font-semibold">
              {t('iSentIt')} →
            </button>
          </div>
        )}

        {/* ── HASH ── */}
        {step === STEPS.HASH && (
          <div className="p-5">
            <button onClick={() => setStep(STEPS.QR)} className="flex items-center gap-1.5 text-sm mb-4 transition-colors" style={{ color: 'rgba(255,255,255,0.40)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E2B96F'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.40)'}
            >
              <ArrowLeft /> {t('back')}
            </button>
            <p className="font-semibold font-serif text-white mb-1">{t('enterTxHash')}</p>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('txHashHint')}</p>
            <textarea
              rows={3}
              placeholder={blockchain === 'bitcoin' ? 'e.g. a1b2c3d4...' : 'e.g. 4f8a1e...'}
              value={manualTxHash}
              onChange={e => setManualTxHash(e.target.value)}
              className="input resize-none font-mono text-sm mb-4"
              autoFocus
            />
            <button
              onClick={handleConfirmManual}
              disabled={!manualTxHash.trim() || submittingHash}
              className="btn-primary btn-gold-shimmer w-full py-3.5 text-base font-semibold"
            >
              {submittingHash ? t('confirming') : t('confirmDonation')}
            </button>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === STEPS.SUCCESS && (
          <div className="p-8 text-center">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"
              style={{ background: 'rgba(22,101,52,0.35)', border: '1px solid rgba(74,222,128,0.25)' }}
            >✅</div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">{t('donationSent')}</h3>
            <p className="text-sm mb-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.50)' }}>{t('donationRecorded')}</p>
            <p className="text-sm mb-5" style={{ color: '#E2B96F', fontStyle: 'italic' }}>
              "מַה טֹּבוּ אֹהָלֶיךָ" — May your giving be blessed ✡
            </p>
            {txHash && explorerBase && (
              <a href={`${explorerBase}/${txHash}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs hover:underline font-mono mb-6"
                style={{ color: '#E2B96F' }}
              >
                {txHash.slice(0, 16)}…{txHash.slice(-6)} ↗
              </a>
            )}
            <button onClick={onClose} className="btn-primary btn-gold-shimmer w-full">{t('done')}</button>
          </div>
        )}

        {/* ── ERROR ── */}
        {step === STEPS.ERROR && (
          <div className="p-8 text-center">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl"
              style={{ background: 'rgba(127,29,29,0.40)', border: '1px solid rgba(239,68,68,0.25)' }}
            >❌</div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">{t('transactionFailed')}</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: '#fca5a5' }}>{errorMsg}</p>
            <div className="flex gap-3">
              <button onClick={() => setStep(STEPS.FORM)} className="btn-secondary flex-1">{t('tryAgain')}</button>
              <button onClick={onClose} className="btn-primary flex-1">{t('close')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
