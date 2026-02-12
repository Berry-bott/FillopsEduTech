import { useEffect } from "react"

const Botpress = () => {
  useEffect(() => {
    // inject main script
    const inject = document.createElement("script")
    inject.async = true
    document.body.appendChild(inject)

    // inject your bot config script
    const config = document.createElement("script")
    config.src = "https://files.bpcontent.cloud/2026/01/10/16/20260110165057-S4B9YF14.js"
    config.defer = true
    document.body.appendChild(config)

    return () => {
      inject.remove()
      config.remove()

      // remove widget if still on page
      document.querySelector("#bp-web-widget")?.remove()
    }
  }, [])

  return null
}

export default Botpress
