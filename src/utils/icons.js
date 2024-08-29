import { SvgXml } from "react-native-svg";

export function IconShare(props) {
    const xml = ` 
  <svg width="23" height="25" stroke="currentColor" color="#898989" viewBox="0 0 23 25" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <rect width="19.75" height="19.75" rx="2.9625"
              transform="matrix(1 0 0 -1 1.35492 23.688)"
              strokeWidth="1.975" strokeLinejoin="round"/>
        <path
            d="M3.32953 3.93799H19.1295V3.93799C19.1295 2.30184 17.8032 0.975488 16.167 0.975488H6.29203C4.65589 0.975488 3.32953 2.30184 3.32953 3.93799V3.93799Z"
            strokeWidth="1.48125" strokeLinejoin="round"/>
        <path
            d="M7.27991 13.813H11.2299M15.1799 13.813H11.2299M11.2299 13.813V9.86304M11.2299 13.813V17.763"
            strokeWidth="1.99528" strokeLinecap="round"
            strokeLinejoin="round"/>
    </svg>`
    return <SvgXml {...props} xml={xml} />
}
