import heryaLogo from './herya-logo.png'

export default function HeryaLogo({ className = '' }) {
  return (
    <img
      src={heryaLogo}
      alt="herya"
      className={className}
    />
  )
}
