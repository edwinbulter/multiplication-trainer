import SwiftUI

struct AppColors {
    // MARK: - Light Theme
    // Primary Colors
    static let primary = Color(red: 0.231, green: 0.510, blue: 0.965) // #3B82F6
    static let primaryDark = Color(red: 0.145, green: 0.388, blue: 0.922) // #2563EB
    
    // Secondary Colors
    static let secondary = Color(red: 0.078, green: 0.722, blue: 0.647) // #14B8A6
    static let secondaryDark = Color(red: 0.051, green: 0.580, blue: 0.533) // #0D9488
    
    // Status Colors
    static let success = Color(red: 0.086, green: 0.639, blue: 0.290) // #16A34A
    static let error = Color(red: 0.863, green: 0.149, blue: 0.149) // #DC2626
    
    // Background Colors
    static let background = Color(red: 0.973, green: 0.980, blue: 0.988) // #F8FAFC
    static let surface = Color.white
    static let cardBackground = Color.white
    static let white = Color.white
    static let black = Color.black
    
    // Text Colors
    static let textPrimary = Color.black
    static let textSecondary = Color(red: 0.392, green: 0.282, blue: 0.545) // #64748B
    static let textDark = Color(red: 0.278, green: 0.333, blue: 0.412) // #475569
    static let textHint = Color(red: 0.580, green: 0.639, blue: 0.722) // #94A3B8
    static let textInput = Color(red: 0.118, green: 0.161, blue: 0.169) // #1E293B
    static let headerText = Color.black
    
    // Gray Colors
    static let lightGray = Color(red: 0.898, green: 0.906, blue: 0.922) // #E5E7EB
    static let keyGray = Color(red: 0.953, green: 0.957, blue: 0.965) // #F3F4F6
    static let keyDarkGray = Color(red: 0.820, green: 0.835, blue: 0.859) // #D1D5DB
    
    // MARK: - Dark Theme
    // Primary Colors
    static let darkPrimary = Color(red: 0.376, green: 0.647, blue: 0.980) // #60A5FA
    static let darkPrimaryDark = Color(red: 0.231, green: 0.510, blue: 0.965) // #3B82F6
    
    // Secondary Colors
    static let darkSecondary = Color(red: 0.176, green: 0.831, blue: 0.749) // #2DD4BF
    static let darkSecondaryDark = Color(red: 0.078, green: 0.722, blue: 0.647) // #14B8A6
    
    // Status Colors
    static let darkSuccess = Color(red: 0.133, green: 0.773, blue: 0.365) // #22C55E
    static let darkError = Color(red: 0.937, green: 0.267, blue: 0.267) // #EF4444
    
    // Background Colors
    static let darkBackground = Color(red: 0.059, green: 0.090, blue: 0.165) // #0F172A
    static let darkSurface = Color(red: 0.118, green: 0.161, blue: 0.231) // #1E293B
    static let darkCardBackground = Color(red: 0.200, green: 0.255, blue: 0.333) // #334155
    static let darkWhite = Color.white
    static let darkBlack = Color.black
    
    // Text Colors
    static let darkTextPrimary = Color(red: 0.945, green: 0.961, blue: 0.976) // #F1F5F9
    static let darkTextSecondary = Color(red: 0.796, green: 0.835, blue: 0.882) // #CBD5E1
    static let darkTextDark = Color(red: 0.580, green: 0.639, blue: 0.722) // #94A3B8
    static let darkTextHint = Color(red: 0.392, green: 0.455, blue: 0.545) // #64748B
    static let darkTextInput = Color(red: 0.945, green: 0.961, blue: 0.976) // #F1F5F9
    static let darkHeaderText = Color.white
    
    // Gray Colors
    static let darkLightGray = Color(red: 0.278, green: 0.333, blue: 0.412) // #475569
    static let darkKeyGray = Color(red: 0.200, green: 0.255, blue: 0.333) // #334155
    static let darkKeyDarkGray = Color(red: 0.278, green: 0.333, blue: 0.412) // #475569
    
    // MARK: - Dynamic Colors
    @MainActor
    static var dynamicPrimary: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkPrimary) : UIColor(primary)
        })
    }
    
    @MainActor
    static var dynamicSecondary: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkSecondary) : UIColor(secondary)
        })
    }
    
    @MainActor
    static var dynamicSuccess: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkSuccess) : UIColor(success)
        })
    }
    
    @MainActor
    static var dynamicError: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkError) : UIColor(error)
        })
    }
    
    @MainActor
    static var dynamicBackground: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkBackground) : UIColor(background)
        })
    }
    
    @MainActor
    static var dynamicSurface: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkSurface) : UIColor(surface)
        })
    }
    
    @MainActor
    static var dynamicCardBackground: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkCardBackground) : UIColor(cardBackground)
        })
    }
    
    @MainActor
    static var dynamicTextPrimary: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkTextPrimary) : UIColor(textPrimary)
        })
    }
    
    @MainActor
    static var dynamicTextSecondary: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkTextSecondary) : UIColor(textSecondary)
        })
    }
    
    @MainActor
    static var dynamicTextHint: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkTextHint) : UIColor(textHint)
        })
    }
    
    @MainActor
    static var dynamicKeyGray: Color {
        Color(UIColor {
            $0.userInterfaceStyle == .dark ? UIColor(darkKeyGray) : UIColor(keyGray)
        })
    }
}
