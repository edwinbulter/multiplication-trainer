import Foundation
import SwiftUI

// MARK: - Foundation Extensions
extension String {
    func toDouble() -> Double? {
        return NumberFormatter().number(from: self)?.doubleValue
    }
    
    func isValidNumber() -> Bool {
        return self.toDouble() != nil
    }
    
    func trimmed() -> String {
        return self.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}

extension Double {
    func formattedForDisplay() -> String {
        if self == Double(Int(self)) {
            return String(Int(self))
        } else {
            return String(format: "%.1f", self).replacingOccurrences(of: ".", with: ",")
        }
    }
}

extension TimeInterval {
    func formattedDuration() -> String {
        let seconds = Int(self)
        return "\(seconds) seconden"
    }
}

extension Date {
    func formattedForScoreboard() -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        formatter.locale = Locale(identifier: "nl_NL")
        return formatter.string(from: self)
    }
}

// MARK: - SwiftUI Extensions
extension Color {
    static let appBlue = Color(red: 0.0, green: 0.478, blue: 1.0)
    static let appGreen = Color(red: 0.0, green: 0.8, blue: 0.4)
    static let appTeal = Color(red: 0.082, green: 0.722, blue: 0.647)
    static let appRed = Color(red: 0.863, green: 0.149, blue: 0.149)
    static let textDark = Color(red: 0.278, green: 0.333, blue: 0.412)
    static let textHint = Color(red: 0.580, green: 0.639, blue: 0.722)
    static let textInput = Color(red: 0.118, green: 0.161, blue: 0.231)
}

extension View {
    func appCardStyle() -> some View {
        self
            .background(Color(.systemBackground))
            .cornerRadius(AppConstants.UI.cornerRadius)
            .shadow(radius: AppConstants.UI.shadowRadius)
    }
    
    func appButtonStyle(color: Color) -> some View {
        self
            .foregroundColor(.white)
            .font(.system(size: 16, weight: .semibold))
            .frame(maxWidth: .infinity)
            .padding()
            .background(color)
            .cornerRadius(AppConstants.UI.cornerRadius)
    }
    
    func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}
