// RevenueCat wrapper — cosmetics + optional Founder subscription
// Para ativar: npm install @revenuecat/purchases-capacitor
// Depois substitua os stubs pelas chamadas reais do SDK

const RC_KEY = import.meta.env.VITE_REVENUECAT_KEY || ''

// Cosméticos (one-time purchases)
export const COSMETICS = {
  skin_golden: {
    id:    'zapfy_skin_golden',
    price: 'R$7,90',
    priceValue: 7.9,
    skin:  'golden',
    name:  'Zappy Dourado',
  },
  skin_astro: {
    id:    'zapfy_skin_astronaut',
    price: 'R$7,90',
    priceValue: 7.9,
    skin:  'astronaut',
    name:  'Zappy Astronauta',
  },
  skin_ninja: {
    id:    'zapfy_skin_ninja',
    price: 'R$7,90',
    priceValue: 7.9,
    skin:  'ninja',
    name:  'Zappy Ninja',
  },
  badge_pack: {
    id:    'zapfy_badge_pack',
    price: 'R$4,90',
    priceValue: 4.9,
    name:  'Pack de Badges',
  },
  founding_pack: {
    id:    'zapfy_founding_pack',
    price: 'R$19,90',
    priceValue: 19.9,
    name:  'Founding Pack',
  },
}

// Assinatura opcional Founder
export const PRODUCTS = {
  founder: {
    id:         'zapfy_founder_monthly',
    price:      'R$19,90/mês',
    priceValue: 19.9,
  },
}

export async function initializePurchases() {
  if (!RC_KEY) return
}

export async function purchaseCosmetic(productId) {
  if (!RC_KEY) return { success: false, reason: 'not_configured' }
  return { success: false, reason: 'not_configured' }
}

export async function purchasePremium(productId = PRODUCTS.founder.id) {
  if (!RC_KEY) return { success: false, reason: 'not_configured' }
  return { success: false, reason: 'not_configured' }
}

export async function restorePurchases() {
  if (!RC_KEY) return { success: false }
  return { success: false }
}

export async function checkPremiumStatus() {
  if (!RC_KEY) return false
  return false
}
