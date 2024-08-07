import { Switch } from "@/components/ui/switch"
import { useThemeMode } from "antd-style"
import { Tooltip } from "../ui/tooltip"
import { useTheme } from "next-themes"

export interface ThemeSwitcherProps {
  withoutStopPropagation?: boolean
}

export const ThemeSwitcher = ({ withoutStopPropagation, ...props }: ThemeSwitcherProps) => {
  const { setTheme } = useTheme()

  return (
    <Tooltip placement="right" title="Theme mode">
      <Switch
        {...props}
        onChange={(isChecked) => {
          const mode = isChecked ? "dark" : "light"
          setTheme(mode)
        }}
        onClick={(event) => {
          if (!withoutStopPropagation) {
            event.stopPropagation()
          }
        }}
      />
    </Tooltip>
  )
}
