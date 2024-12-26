import { TokenHandler } from './TokenHandler'

export default function Page({ 
  params 
}: { 
  params: { token: string } 
}) {
  return <TokenHandler token={params.token} />
}
