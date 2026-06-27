const GA4_ID    = import.meta.env.VITE_GA4_ID
const PIXEL_ID  = import.meta.env.VITE_META_PIXEL_ID

function loadScript(src) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  document.head.appendChild(s)
}

export function initAnalytics() {
  if (GA4_ID) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`)
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', GA4_ID, { send_page_view: false })
  }

  if (PIXEL_ID) {
    // Meta Pixel base code
    ;(function (f, b, e, v, n, t, s) {
      if (f.fbq) return
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }
      if (!f._fbq) f._fbq = n
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = []
      t = b.createElement(e); t.async = true; t.src = v
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    window.fbq('init', PIXEL_ID)
  }
}

// Rastreia navegação entre telas
export function trackScreen(screenName) {
  if (GA4_ID && window.gtag) {
    window.gtag('event', 'page_view', { page_title: screenName, page_location: `/${screenName}` })
  }
  if (PIXEL_ID && window.fbq) {
    window.fbq('trackCustom', 'ScreenView', { screen: screenName })
  }
}

// Evento genérico
export function trackEvent(eventName, params = {}) {
  if (GA4_ID && window.gtag) {
    window.gtag('event', eventName, params)
  }
  if (PIXEL_ID && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}

// Eventos predefinidos do produto
export const Analytics = {
  lessonComplete:   (lessonId, perfect) => trackEvent('lesson_complete',   { lesson_id: lessonId, perfect }),
  lessonStart:      (lessonId)          => trackEvent('lesson_start',       { lesson_id: lessonId }),
  companyCreated:   (companyName)       => trackEvent('company_created',    { company_name: companyName }),
  firstSale:        ()                  => trackEvent('first_sale'),
  onboardingDone:   ()                  => trackEvent('onboarding_complete'),
  paywallView:      ()                  => trackEvent('paywall_view'),
  purchaseStarted:  (productId)         => trackEvent('begin_checkout',     { item_id: productId }),
  signUp:           (method)            => trackEvent('sign_up',            { method }),
  login:            (method)            => trackEvent('login',              { method }),
  streakReached:    (days)              => trackEvent('streak_milestone',   { days }),
}
