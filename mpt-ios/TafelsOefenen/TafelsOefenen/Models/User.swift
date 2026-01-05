import Foundation

struct User: Codable, Identifiable {
    let id = UUID()
    let username: String
    let lastLogin: Date
    
    init(username: String) {
        self.username = username
        self.lastLogin = Date()
    }
}
