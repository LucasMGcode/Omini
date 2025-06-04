import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
export function useIsDesktop() {
  const isMobile = useIsMobile()
  return !isMobile
}
export function useIsTablet() {
  const isMobile = useIsMobile()
  return !isMobile && window.innerWidth < 1024
}
export function useIsLargeScreen() {            
  const isMobile = useIsMobile()
  return !isMobile && window.innerWidth >= 1024
}
export function useIsSmallScreen() {
  const isMobile = useIsMobile()
  return isMobile || window.innerWidth < 1024
}
export function useIsExtraSmallScreen() {
  const isMobile = useIsMobile()
  return isMobile || window.innerWidth < 640
}
export function useIsMediumScreen() {           
  const isMobile = useIsMobile()
  return !isMobile && window.innerWidth >= 640 && window.innerWidth < 1024
}
export function useIsLargeMobile() {        
  const isMobile = useIsMobile()
  return isMobile && window.innerWidth >= 640 && window.innerWidth < MOBILE_BREAKPOINT
}
export function useIsSmallMobile() {
  const isMobile = useIsMobile()
  return isMobile && window.innerWidth < 640
}   