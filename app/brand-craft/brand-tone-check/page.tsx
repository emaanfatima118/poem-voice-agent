import BrandVoiceEnforcement from '@/brand-craft/BrandVoiceEnforcement'

// Force dynamic rendering to prevent SSR issues with html2pdf.js
export const dynamic = 'force-dynamic'

export default function BrandToneCheckPage() {
  return <BrandVoiceEnforcement />
}

