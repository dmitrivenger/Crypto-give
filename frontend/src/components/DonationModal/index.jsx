import { useState, useEffect } from 'react'
import { useAccount, useBalance, useReadContract, useSendTransaction, useWriteContract, useSwitchChain } from 'wagmi'
import { parseEther, parseUnits, formatUnits } from 'viem'
import { mainnet, polygon, bsc } from 'wagmi/chains'
import { useWallet } from '../../contexts/WalletContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { confirmDonation } from '../../services/api'
import { BLOCKCHAIN_LABELS, EVM_BLOCKCHAINS } from '../../utils/constants'
import { formatUSD } from '../../utils/formatters'
import { isValidAmount } from '../../utils/validators'
import LoadingSpinner from '../LoadingSpinner'

const CHAIN_IDS = { ethereum: mainnet.id, polygon: polygon.id, bsc: bsc.id }

const TOKENS_BY_BLOCKCHAIN = {
  ethereum: ['ETH', 'USDC', 'USDT'],
  polygon: ['POL', 'USDC', 'USDT'],
  bsc: ['BNB', 'USDT', 'USDC'],
}

const NATIVE_TOKEN = { ethereum: 'ETH', polygon: 'POL', bsc: 'BNB' }

const USDC_ADDRESSES = {
  ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  polygon: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  bsc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
}

const USDT_ADDRESSES = {
  ethereum: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  polygon: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  bsc: '0x55d398326f99059fF775485246999027B3197955',
}

const USDT_DECIMALS = { ethereum: 6, polygon: 6, bsc: 18 }

const ERC20_ABI = [
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { name: 'transfer', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
]

const STEPS = { FORM: 'form', SWITCHING: 'switching', SENDING: 'sending', SUCCESS: 'success', ERROR: 'error' }

export default function DonationModal({ organization, onClose }) {
  const { address } = useWallet()
  const { t } = useLanguage()
  const { chainId: currentChainId } = useAccount()
  const { switchChain } = useSwitchChain()
  const { sendTransactionAsync } = useSendTransaction()
  const { writeContractAsync } = useWriteContract()

  const availableBlockchains = (organization.blockchains || []).map(b => b.name)
  const [blockchain, setBlockchain] = useState(availableBlockchains[0] || 'ethereum')
  const [token, setToken] = useState('ETH')
  const [amount, setAmount] = useState('')
  const [usdValue, setUsdValue] = useState(null)
  const [step, setStep] = useState(STEPS.FORM)
  const [txHash, setTxHash] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const isEVM = EVM_BLOCKCHAINS.includes(blockchain)
  const targetChainId = CHAIN_IDS[blockchain]
  const onCorrectChain = currentChainId === targetChainId
  const recipientAddress = organization.blockchains?.find(b => b.name === blockchain)?.address
  const availableTokens = TOKENS_BY_BLOCKCHAIN[blockchain] || []

  const { data: nativeBalance } = useBalance({
    address, chainId: targetChainId,
    query: { enabled: !!address && isEVM },
  })

  const erc20Address = token === 'USDC' ? USDC_ADDRESSES[blockchain] : token === 'USDT' ? USDT_ADDRESSES[blockchain] : undefined
  const erc20Decimals = token === 'USDT' ? (USDT_DECIMALS[blockchain] ?? 6) : 6
  const { data: erc20Balance } = useReadContract({
    address: erc20Address, abi: ERC20_ABI, functionName: 'balanceOf', args: [address], chainId: targetChainId,
    query: { enabled: !!address && isEVM && !!erc20Address },
  })

  const nativeFormatted = nativeBalance ? parseFloat(formatUnits(nativeBalance.value, 18)).toFixed(6) : null
  const erc20Formatted = erc20Balance ? parseFloat(formatUnits(erc20Balance, erc20Decimals)).toFixed(2) : null
  const currentBalance = (token === 'USDC' || token === 'USDT') ? erc20Formatted : nativeFormatted

  useEffect(() => {
    const tokens = TOKENS_BY_BLOCKCHAIN[blockchain] || []
    if (!tokens.includes(token)) setToken(tokens[0] || 'ETH')
  }, [blockchain])

  useEffect(() => {
    if (!isValidAmount(amount)) { setUsdValue(null); return }
    const timer = setTimeout(async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const res = await fetch(`/v1/crypto-price/${token}/${today}`)
        const data = await res.json()
        if (data.data?.priceUsd) setUsdValue(parseFloat(amount) * data.data.priceUsd)
      } catch { setUsdValue(null) }
    }, 500)
    return () => clearTimeout(timer)
  }, [amount, token])

  async function handleDonate() {
    if (!isValidAmount(amount)) return
    if (!onCorrectChain) {
      setStep(STEPS.SWITCHING)
      try { await switchChain({ chainId: targetChainId }) }
      catch {
        setErrorMsg(`Please switch to ${BLOCKCHAIN_LABELS[blockchain]} in your wallet.`)
        setStep(STEPS.ERROR)
        return
      }
    }
    setStep(STEPS.SENDING)
    setErrorMsg('')
    try {
      let hash
      const nativeSym = NATIVE_TOKEN[blockchain]
      if (token === nativeSym) {
        hash = await sendTransactionAsync({ to: recipientAddress, value: parseEther(amount), chainId: targetChainId })
      } else if (token === 'USDC') {
        hash = await writeContractAsync({ address: USDC_ADDRESSES[blockchain], abi: ERC20_ABI, functionName: 'transfer', args: [recipientAddress, parseUnits(amount, 6)], chainId: targetChainId })
      } else if (token === 'USDT') {
        hash = await writeContractAsync({ address: USDT_ADDRESSES[blockchain], abi: ERC20_ABI, functionName: 'transfer', args: [recipientAddress, parseUnits(amount, erc20Decimals)], chainId: targetChainId })
      }
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

  const explorerBase = { ethereum: 'https://etherscan.io/tx', polygon: 'https://polygonscan.com/tx', bsc: 'https://bscscan.com/tx' }[blockchain]

  // Shared pill selector style
  const pillActive = 'bg-indigo-600 text-white shadow-sm'
  const pillIdle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-black/20 overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Top gradient strip */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-lg">🏛️</div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{organization.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('taxId')}: {organization.taxId}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* FORM */}
        {step === STEPS.FORM && (
          <div className="p-5 space-y-4">
            {/* Network */}
            <div>
              <p className="section-label mb-2">{t('network')}</p>
              <div className="flex gap-2 flex-wrap">
                {availableBlockchains.map(bc => (
                  <button key={bc} onClick={() => setBlockchain(bc)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all min-w-[80px] ${blockchain === bc ? pillActive : pillIdle}`}>
                    {BLOCKCHAIN_LABELS[bc] || bc}
                  </button>
                ))}
              </div>
              {isEVM && !onCorrectChain && (
                <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg px-3 py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3l9 16H3l9-16zm-1 7v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
                  {t('wrongNetwork')}
                </div>
              )}
            </div>

            {/* Token */}
            <div>
              <p className="section-label mb-2">{t('token')}</p>
              <div className="flex gap-2">
                {availableTokens.map(tk => (
                  <button key={tk} onClick={() => setToken(tk)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${token === tk ? pillActive : pillIdle}`}>
                    {tk}
                  </button>
                ))}
              </div>
            </div>

            {/* Balance */}
            {!!currentBalance && (
              <button onClick={() => setAmount(currentBalance)}
                className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-xl px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                <span className="text-xs text-slate-400 dark:text-slate-500">{t('yourBalance')}</span>
                <span className="text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500">
                  {currentBalance} {token}
                  <span className="text-xs text-slate-400 dark:text-slate-600 ml-1.5 font-normal">({t('tapToUseMax')})</span>
                </span>
              </button>
            )}

            {/* Amount */}
            <div>
              <p className="section-label mb-2">{t('amount')}</p>
              <div className="relative">
                <input type="number" step="any" min="0" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  className="input pr-20 text-2xl font-bold placeholder:font-normal placeholder:text-xl" autoFocus />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">{token}</span>
              </div>
              {usdValue !== null && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium">≈ {formatUSD(usdValue)}</p>
              )}
            </div>

            {/* Recipient */}
            {recipientAddress && (
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl p-3">
                <p className="section-label mb-1">{t('orgReceivesOn')} {BLOCKCHAIN_LABELS[blockchain]}</p>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all">{recipientAddress}</p>
              </div>
            )}

            <button onClick={handleDonate} disabled={!isValidAmount(amount)}
              className="btn-primary w-full py-3.5 text-base">
              {t('donate')} {amount ? `${amount} ${token}` : ''} →
            </button>
          </div>
        )}

        {/* SWITCHING */}
        {step === STEPS.SWITCHING && (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-slate-900 dark:text-white font-semibold mt-5 mb-1">{t('switchingNetwork')}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('approveSwitch')}</p>
          </div>
        )}

        {/* SENDING */}
        {step === STEPS.SENDING && (
          <div className="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-slate-900 dark:text-white font-semibold mt-5 mb-1">{t('confirmInWallet')}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t('checkWallet')}</p>
          </div>
        )}

        {/* SUCCESS */}
        {step === STEPS.SUCCESS && (
          <div className="p-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-3xl">✅</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('donationSent')}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 leading-relaxed">{t('donationRecorded')}</p>
            {txHash && (
              <a href={`${explorerBase}/${txHash}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm hover:underline font-mono mb-6">
                {txHash.slice(0, 16)}…{txHash.slice(-6)} ↗
              </a>
            )}
            <button onClick={onClose} className="btn-primary w-full">{t('done')}</button>
          </div>
        )}

        {/* ERROR */}
        {step === STEPS.ERROR && (
          <div className="p-8 text-center">
            <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-center mx-auto mb-5 text-3xl">❌</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('transactionFailed')}</h3>
            <p className="text-red-600 dark:text-red-400 text-sm mb-6 leading-relaxed">{errorMsg}</p>
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
