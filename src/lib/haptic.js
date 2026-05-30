export function hapticLight()   { try { navigator.vibrate?.(40)          } catch (_) {} }
export function hapticError()   { try { navigator.vibrate?.([80, 30, 80]) } catch (_) {} }
export function hapticSuccess() { try { navigator.vibrate?.(60)           } catch (_) {} }
