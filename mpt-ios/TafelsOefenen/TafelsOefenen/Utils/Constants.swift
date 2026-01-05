import Foundation
import SwiftUI

// MARK: - App Constants
struct AppConstants {
    static let appName = "Tafels Oefenen"
    static let predefinedTables = [
        "0,125", "0,2", "0,25", "0,5", "1", "2", "2,5", "3", 
        "4", "5", "6", "7", "8", "9", "10", "12", "15", "25"
    ]
    
    // MARK: - UI Constants
    struct UI {
        static let cornerRadius: CGFloat = 8
        static let shadowRadius: CGFloat = 4
        static let padding: CGFloat = 16
        static let smallPadding: CGFloat = 8
    }
    
    // MARK: - Animation Constants
    struct Animation {
        static let duration: Double = 0.3
        static let springDuration: Double = 0.5
    }
    
    // MARK: - Storage Keys
    struct StorageKeys {
        static let scores = "tafels_scores"
        static let user = "tafels_user"
        static let settings = "tafels_settings"
    }
}
