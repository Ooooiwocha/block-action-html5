import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={verification:{google:"ijIpKKvz-NWbNtq5-czNdDyvsPV4WMoOhgjkCbFgWyU"},manifest:"/manifest.webmanifest",title:'Block Action HTML5移植版',description:'Block ActionをHTML5へ移植した非公式版。独自ブロックでステージを作成・共有。クラシック版とは独立したステージ体系です。',metadataBase:new URL('https://block-action.ooooiwocha.chatgpt.site'),alternates:{canonical:'/'},robots:{index:true,follow:true},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>;}
