import React, { useState, useEffect, useMemo } from "react"
import { Streamlit, withStreamlitConnection } from "streamlit-component-lib"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"
import * as FaIcons from "react-icons/fa"
import * as MdIcons from "react-icons/md"

interface Page {
  name: string
  icon?: string
}

interface NavIconProps {
  page: Page
  isActive: boolean
  theme: ComponentProps["theme"]
  onClick: (pageName: string) => void
  fontSize: number
  iconSize: number
  iconColor: string
  activeIconColor: string
  hoverIconColor: string
  backgroundColor: string
  activeBackgroundColor: string
  hoverBackgroundColor: string
  borderRadius: string
  activeBorderRadius: string
  hoverBorderRadius: string
}

const iconComponents = {
  ...FaIcons,
  ...MdIcons,
}

const getIconComponent = (iconName: string) => {
  const IconComponent = iconComponents[iconName as keyof typeof iconComponents]
  return IconComponent ? <IconComponent /> : <FaIcons.FaHome />
}

const NavIcon: React.FC<NavIconProps> = React.memo(
  ({
    page,
    isActive,
    theme,
    onClick,
    fontSize,
    iconSize,
    iconColor,
    activeIconColor,
    hoverIconColor,
    backgroundColor,
    activeBackgroundColor,
    hoverBackgroundColor,
    borderRadius,
    activeBorderRadius,
    hoverBorderRadius,
  }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <div
        className={`nav-icon ${isActive ? "active" : ""}`}
        onClick={() => onClick(page.name)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          borderRadius: isActive
            ? activeBorderRadius
            : isHovered
            ? hoverBorderRadius
            : borderRadius,
          backgroundColor: isActive
            ? activeBackgroundColor
            : isHovered
            ? hoverBackgroundColor
            : backgroundColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.3s ease-out",
          fontSize: `${fontSize}px`,
          color: isActive
            ? activeIconColor
            : isHovered
            ? hoverIconColor
            : iconColor,
          transform: isHovered && !isActive ? "scale(1.1)" : "scale(1)",
          boxShadow: isHovered ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
        }}
      >
        {getIconComponent(page.icon || "")}
      </div>
    )
  }
)

const CustomNav: React.FC<ComponentProps> = ({ args, theme }) => {
  const [activePage, setActivePage] = useState<string | null>(null)

  const memoizedData = useMemo(() => {
    const fontSize = args.fontSize || 24
    const iconSize = args.iconSize || 48
    const iconColor = args.iconColor || theme?.textColor || "#ffffff"
    const activeIconColor = args.activeIconColor || "#ffffff"
    const hoverIconColor = args.hoverIconColor || theme?.textColor || "#ffffff"
    const backgroundColor =
      args.backgroundColor || theme?.backgroundColor || "#202225"
    const activeBackgroundColor =
      args.activeBackgroundColor || theme?.primaryColor || "#5865F2"
    const hoverBackgroundColor =
      args.hoverBackgroundColor || theme?.secondaryBackgroundColor || "#36393f"
    const borderRadius = args.borderRadius || "50%"
    const activeBorderRadius = args.activeBorderRadius || "10%"
    const hoverBorderRadius = args.hoverBorderRadius || "20%"
    const navWidth = args.navWidth || 80
    const navGap = args.navGap || 32
    const pages: Page[] = args.pages || [
      { name: "Home", icon: "FaHome" },
      { name: "Chat", icon: "FaComments" },
      { name: "Friends", icon: "FaUserFriends" },
      { name: "Settings", icon: "FaCog" },
    ]
    return {
      fontSize,
      iconSize,
      iconColor,
      activeIconColor,
      hoverIconColor,
      backgroundColor,
      activeBackgroundColor,
      hoverBackgroundColor,
      borderRadius,
      activeBorderRadius,
      hoverBorderRadius,
      navWidth,
      navGap,
      pages,
    }
  }, [args, theme])

  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [])

  const handlePageClick = (pageName: string) => {
    setActivePage(pageName)
    Streamlit.setComponentValue(pageName)
  }

  return (
    <nav
      style={{
        backgroundColor: memoizedData.backgroundColor,
        color: memoizedData.iconColor,
        fontFamily: theme?.font || "Arial, sans-serif",
        width: `${memoizedData.navWidth}px`,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "5rem 0",

        gap: `${memoizedData.navGap}px`,
      }}
    >
      {memoizedData.pages.map((page) => (
        <NavIcon
          key={page.name}
          page={page}
          isActive={activePage === page.name}
          theme={theme}
          onClick={handlePageClick}
          fontSize={memoizedData.fontSize}
          iconSize={memoizedData.iconSize}
          iconColor={memoizedData.iconColor}
          activeIconColor={memoizedData.activeIconColor}
          hoverIconColor={memoizedData.hoverIconColor}
          backgroundColor={memoizedData.backgroundColor}
          activeBackgroundColor={memoizedData.activeBackgroundColor}
          hoverBackgroundColor={memoizedData.hoverBackgroundColor}
          borderRadius={memoizedData.borderRadius}
          activeBorderRadius={memoizedData.activeBorderRadius}
          hoverBorderRadius={memoizedData.hoverBorderRadius}
        />
      ))}
    </nav>
  )
}

export default withStreamlitConnection(CustomNav)
