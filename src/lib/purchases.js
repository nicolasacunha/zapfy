// RevenueCat wrapper
// Para ativar: npm install @revenuecat/purchases-capacitor
// Depois substitua os stubs pelas chamadas reais do SDK

const RC_KEY = import.meta.env.VITE_REVENUECAT_KEY || ''

export const PRODUCTS = {
  monthly: {
    id:         'zapfy_premium_monthly',
    price:      'R$14,90/mês',
    priceValue: 14.9,
  },
  annual: {
    id:         'zapfy_premium_annual',
    price:      'R$99,90/ano',
    priceValue: 99.9,
    savings:    'Economize 44%',
  },
}

export async function initializePurchases() {
  if (!RC_KEY) return
  // const { Purchases } = await import('@revenuecat/purchases-capacitor')
  // await Purchases.configure({ apiKey: RC_KEY })
}

export async function purchasePremium(productId = PRODUCTS.annual.id) {
  if (!RC_KEY) {
    return { success: false, reason: 'not_configured' }
  }
  // const { Purchases } = await import('@revenuecat/purchases-capacitor')
  // const offerings = await Purchases.getOfferings()
  // const pkg = offerings.current?.availablePackages.find(p => p.storeProduct.productIdentifier === productId)
  // if (!pkg) return { success: false, reason: 'product_not_found' }
  // const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg })
  // return { success: customerInfo.activeSubscriptions.includes(productId), customerInfo }
  return { success: false, reason: 'not_configured' }
}

export async function restorePurchases() {
  if (!RC_KEY) return { success: false }
  // const { Purchases } = await import('@revenuecat/purchases-capacitor')
  // const { customerInfo } = await Purchases.restorePurchases()
  // const isActive = customerInfo.activeSubscriptions.length > 0
  // return { success: isActive, customerInfo }
  return { success: false }
}

export async function checkPremiumStatus() {
  if (!RC_KEY) return false
  // const { Purchases } = await import('@revenuecat/purchases-capacitor')
  // const { customerInfo } = await Purchases.getCustomerInfo()
  // return customerInfo.activeSubscriptions.length > 0
  return false
}
